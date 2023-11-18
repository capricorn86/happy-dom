import BrowserPage from './BrowserPage.js';
import IBrowserFrame from './types/IBrowserFrame.js';
import Window from '../window/Window.js';
import WindowBrowserSettingsReader from '../window/WindowBrowserSettingsReader.js';
import IBrowserPage from './types/IBrowserPage.js';
import IGoToOptions from './types/IGoToOptions.js';
import IResponse from '../fetch/types/IResponse.js';
import DocumentReadyStateManager from '../nodes/document/DocumentReadyStateManager.js';
import IWindow from '../window/IWindow.js';
import WindowErrorUtility from '../window/WindowErrorUtility.js';
import DetachedBrowserFrame from './detached-browser/DetachedBrowserFrame.js';
import { URL } from 'url';
import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import Location from '../location/Location.js';
import AbortController from '../fetch/AbortController.js';
import { Script } from 'vm';
import BrowserNavigationEnum from './types/BrowserNavigationEnum.js';

/**
 * Browser frame utility.
 */
export default class BrowserFrameUtility {
	/**
	 * Aborts all ongoing operations and destroys the frame.
	 */
	public static closeFrame(frame: IBrowserFrame): void {
		if (!frame.window) {
			return;
		}

		if (frame.parentFrame) {
			const index = frame.parentFrame.childFrames.indexOf(frame);
			if (index !== -1) {
				frame.parentFrame.childFrames.splice(index, 1);
			}
		}

		for (const childFrame of frame.childFrames.slice()) {
			this.closeFrame(childFrame);
		}

		(<boolean>frame.window.closed) = true;
		frame._asyncTaskManager.destroy();
		WindowBrowserSettingsReader.removeSettings(frame.window);
		(<BrowserPage | null>frame.page) = null;
		(<Window | null>frame.window) = null;
		(<IBrowserFrame | null>frame.opener) = null;
	}

	/**
	 * Creates a new frame.
	 *
	 * @param parentFrame Parent frame.
	 * @returns Frame.
	 */
	public static newFrame(parentFrame: IBrowserFrame): IBrowserFrame {
		const frame = new (<new (page: IBrowserPage) => IBrowserFrame>parentFrame.constructor)(
			parentFrame.page
		);
		(<IBrowserFrame>frame.parentFrame) = parentFrame;
		parentFrame.childFrames.push(frame);
		return frame;
	}

	/**
	 * Returns frames.
	 *
	 * @param parentFrame Parent frame.
	 * @returns Frames, including the parent.
	 */
	public static getFrames(parentFrame: IBrowserFrame): IBrowserFrame[] {
		let frames = [parentFrame];
		for (const frame of parentFrame.childFrames) {
			frames = frames.concat(this.getFrames(frame));
		}
		return frames;
	}

	/**
	 * Go to a page.
	 *
	 * @throws Error if the request can't be resolved (because of SSL error or similar). It will not throw if the response is not ok.
	 * @param windowClass Window class.
	 * @param frame Frame.
	 * @param url URL.
	 * @param [options] Options.
	 * @returns Response.
	 */
	public static async goto(
		windowClass: new (options: {
			browserFrame: IBrowserFrame;
			console: Console;
			url?: string;
		}) => IWindow,
		frame: IBrowserFrame,
		url: string,
		options?: IGoToOptions
	): Promise<IResponse | null> {
		const targetURL = this.getRelativeURL(frame, url);

		if (targetURL.protocol === 'javascript:') {
			if (frame && !frame.page.context.browser.settings.disableJavaScriptEvaluation) {
				const readyStateManager = (<{ _readyStateManager: DocumentReadyStateManager }>(
					(<unknown>frame.window)
				))._readyStateManager;

				readyStateManager.startTask();

				// The browser will wait for the next tick before executing the script.
				await new Promise((resolve) => frame.page.mainFrame.window.setTimeout(resolve));

				const code =
					'//# sourceURL=' + frame.url + '\n' + targetURL.href.replace('javascript:', '');

				if (frame.page.context.browser.settings.disableErrorCapturing) {
					frame.window.eval(code);
				} else {
					WindowErrorUtility.captureError(frame.window, () => frame.window.eval(code));
				}

				readyStateManager.endTask();
			}

			return null;
		}

		if (this.isDetachedMainFrame(frame) || !this.isBrowserNavigationAllowed(frame, targetURL)) {
			if (
				frame.page.context.browser.settings.browserNavigation.includes(
					BrowserNavigationEnum.setURLFallback
				)
			) {
				(<Location>frame.window.location) = new Location(frame, targetURL.href);
			}

			return null;
		}

		for (const childFrame of frame.childFrames) {
			BrowserFrameUtility.closeFrame(childFrame);
		}

		(<IBrowserFrame[]>frame.childFrames) = [];
		(<boolean>frame.window.closed) = true;
		frame._asyncTaskManager.destroy();
		WindowBrowserSettingsReader.removeSettings(frame.window);

		(<IWindow>frame.window) = new windowClass({
			browserFrame: frame,
			console: frame.page.console,
			url: targetURL.href
		});

		if (options?.referrer) {
			(<string>frame.window.document.referrer) = options.referrer;
		}

		if (targetURL.protocol === 'about:') {
			return null;
		}

		const readyStateManager = (<{ _readyStateManager: DocumentReadyStateManager }>(
			(<unknown>frame.window)
		))._readyStateManager;

		readyStateManager.startTask();

		let abortController = new AbortController();
		let response: IResponse;
		let responseText: string;

		const timeout = frame.window.setTimeout(
			() => abortController.abort('Request timed out.'),
			options?.timeout ?? 30000
		);

		try {
			response = await frame.window.fetch(targetURL.href, {
				referrer: options?.referrer,
				referrerPolicy: options?.referrerPolicy,
				signal: abortController.signal
			});

			// Handles the "X-Frame-Options" header for child frames.
			if (frame.parentFrame) {
				const originURL = frame.parentFrame.window.location;
				const xFrameOptions = response.headers.get('X-Frame-Options')?.toLowerCase();
				const isSameOrigin = originURL.origin === targetURL.origin || targetURL.origin === 'null';

				if (xFrameOptions === 'deny' || (xFrameOptions === 'sameorigin' && !isSameOrigin)) {
					throw new Error(
						`Refused to display '${url}' in a frame because it set 'X-Frame-Options' to '${xFrameOptions}'.`
					);
				}
			}

			responseText = await response.text();
		} catch (error) {
			frame.window.clearTimeout(timeout);
			readyStateManager.endTask();
			throw error;
		}

		frame.window.clearTimeout(timeout);
		frame.content = responseText;
		readyStateManager.endTask();

		if (!response.ok) {
			frame.page.console.error(`GET ${targetURL.href} ${response.status} (${response.statusText})`);
		}

		return response;
	}

	/**
	 * Returns true if the frame is a detached main frame.
	 *
	 * @param frame Frame.
	 * @returns True if the frame is a detached main frame.
	 */
	public static isBrowserNavigationAllowed(frame: IBrowserFrame, toURL: URL): boolean {
		const settings = frame.page.context.browser.settings;
		let fromURL = frame.page.mainFrame.window.location;
		if (frame.opener) {
			fromURL = frame.opener.window.location;
		}
		if (frame.parentFrame) {
			fromURL = frame.parentFrame.window.location;
		}

		if (settings.browserNavigation.includes(BrowserNavigationEnum.all)) {
			return true;
		}

		if (
			settings.browserNavigation.includes(BrowserNavigationEnum.sameOrigin) &&
			fromURL.protocol !== 'about:' &&
			toURL.protocol !== 'about:' &&
			toURL.protocol !== 'javascript:' &&
			fromURL.origin !== toURL.origin
		) {
			return false;
		}

		if (
			settings.browserNavigation.includes(BrowserNavigationEnum.mainFrame) &&
			frame.page.mainFrame !== frame
		) {
			return false;
		}

		if (
			settings.browserNavigation.includes(BrowserNavigationEnum.childFrame) &&
			frame.page.mainFrame === frame
		) {
			return false;
		}

		if (
			settings.browserNavigation.includes(BrowserNavigationEnum.allowChildPages) &&
			!!frame.opener
		) {
			return true;
		}

		return false;
	}

	/**
	 * Returns true if the frame is a detached main frame.
	 *
	 * @param frame Frame.
	 * @returns True if the frame is a detached main frame.
	 */
	public static isDetachedMainFrame(frame: IBrowserFrame): boolean {
		return (
			frame instanceof DetachedBrowserFrame &&
			frame.page.context === frame.page.context.browser.defaultContext &&
			frame.page.context.pages[0] === frame.page &&
			frame.page.mainFrame === frame
		);
	}

	/**
	 * Returns relative URL.
	 *
	 * @param frame Frame.
	 * @param url URL.
	 * @returns Relative URL.
	 */
	public static getRelativeURL(frame: IBrowserFrame, url: string): URL {
		url = url || 'about:blank';

		if (url.startsWith('about:') || url.startsWith('javascript:')) {
			return new URL(url);
		}

		try {
			return new URL(url, frame.window.location);
		} catch (e) {
			if (frame.window.location.hostname) {
				throw new DOMException(
					`Failed to construct URL from string "${url}".`,
					DOMExceptionNameEnum.uriMismatchError
				);
			} else {
				throw new DOMException(
					`Failed to construct URL from string "${url}" relative to URL "${frame.window.location.href}".`,
					DOMExceptionNameEnum.uriMismatchError
				);
			}
		}
	}

	/**
	 * Evaluates code or a VM Script in the frame's context.
	 *
	 * @param frame Frame.
	 * @param script Script.
	 * @returns Result.
	 */
	public static evaluate(frame: IBrowserFrame, script: string | Script): any {
		script = typeof script === 'string' ? new Script(script) : script;
		return script.runInContext(frame.window);
	}
}
