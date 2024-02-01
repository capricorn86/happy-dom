import IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IGoToOptions from '../types/IGoToOptions.js';
import IResponse from '../../fetch/types/IResponse.js';
import DocumentReadyStateManager from '../../nodes/document/DocumentReadyStateManager.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import AbortController from '../../fetch/AbortController.js';
import BrowserFrameFactory from './BrowserFrameFactory.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import BrowserFrameValidator from './BrowserFrameValidator.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import BrowserErrorCaptureEnum from '../enums/BrowserErrorCaptureEnum.js';

/**
 * Browser frame navigation utility.
 */
export default class BrowserFrameNavigator {
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
		windowClass: new (
			browserFrame: IBrowserFrame,
			options?: { url?: string; width?: number; height?: number }
		) => IBrowserWindow,
		frame: IBrowserFrame,
		url: string,
		options?: IGoToOptions
	): Promise<IResponse | null> {
		const targetURL = BrowserFrameURL.getRelativeURL(frame, url);

		if (!frame.window) {
			throw new Error('The frame has been destroyed, the "window" property is not set.');
		}

		if (targetURL.protocol === 'javascript:') {
			if (frame && !frame.page.context.browser.settings.disableJavaScriptEvaluation) {
				const readyStateManager = (<
					{ [PropertySymbol.readyStateManager]: DocumentReadyStateManager }
				>(<unknown>frame.window))[PropertySymbol.readyStateManager];

				readyStateManager.startTask();

				// The browser will wait for the next tick before executing the script.
				await new Promise((resolve) => frame.page.mainFrame.window.setTimeout(resolve));

				const code =
					'//# sourceURL=' + frame.url + '\n' + targetURL.href.replace('javascript:', '');

				if (
					frame.page.context.browser.settings.disableErrorCapturing ||
					frame.page.context.browser.settings.errorCapture !== BrowserErrorCaptureEnum.tryAndCatch
				) {
					frame.window.eval(code);
				} else {
					WindowErrorUtility.captureError(frame.window, () => frame.window.eval(code));
				}

				readyStateManager.endTask();
			}

			return null;
		}

		if (!BrowserFrameValidator.validateCrossOriginPolicy(frame, targetURL)) {
			return null;
		}

		if (!BrowserFrameValidator.validateFrameNavigation(frame)) {
			if (!frame.page.context.browser.settings.navigation.disableFallbackToSetURL) {
				frame.window.location[PropertySymbol.setURL](frame, targetURL.href);
			}

			return null;
		}

		const width = frame.window.innerWidth;
		const height = frame.window.innerHeight;
		const devicePixelRatio = frame.window.devicePixelRatio;

		for (const childFrame of frame.childFrames) {
			BrowserFrameFactory.destroyFrame(childFrame);
		}

		(<IBrowserFrame[]>frame.childFrames) = [];
		frame.window[PropertySymbol.destroy]();
		frame[PropertySymbol.asyncTaskManager].destroy();
		frame[PropertySymbol.asyncTaskManager] = new AsyncTaskManager();

		(<IBrowserWindow>frame.window) = new windowClass(frame, { url: targetURL.href, width, height });
		(<number>frame.window.devicePixelRatio) = devicePixelRatio;

		if (options?.referrer) {
			frame.window.document[PropertySymbol.referrer] = options.referrer;
		}

		if (targetURL.protocol === 'about:') {
			return null;
		}

		const readyStateManager = (<{ [PropertySymbol.readyStateManager]: DocumentReadyStateManager }>(
			(<unknown>frame.window)
		))[PropertySymbol.readyStateManager];

		readyStateManager.startTask();

		const abortController = new AbortController();
		let response: IResponse;
		let responseText: string;

		const timeout = frame.window.setTimeout(
			() => abortController.abort('Request timed out.'),
			options?.timeout ?? 30000
		);
		const finalize = (): void => {
			frame.window.clearTimeout(timeout);
			readyStateManager.endTask();
			const listeners = frame[PropertySymbol.listeners].navigation;
			frame[PropertySymbol.listeners].navigation = [];
			for (const listener of listeners) {
				listener();
			}
		};

		try {
			response = await frame.window.fetch(targetURL.href, {
				referrer: options?.referrer,
				referrerPolicy: options?.referrerPolicy,
				signal: abortController.signal,
				headers: options?.hard ? { 'Cache-Control': 'no-cache' } : undefined
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
			finalize();
			throw error;
		}

		if (!response.ok) {
			frame.page.console.error(`GET ${targetURL.href} ${response.status} (${response.statusText})`);
		}

		// Fixes issue where evaluating the response can throw an error.
		// By using requestAnimationFrame() the error will not reject the promise.
		// The error will be caught by process error level listener or a try and catch in the requestAnimationFrame().
		frame.window.requestAnimationFrame(() => (frame.content = responseText));

		await new Promise((resolve) =>
			frame.window.requestAnimationFrame(() => {
				finalize();
				resolve(null);
			})
		);

		return response;
	}
}
