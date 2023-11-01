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

		for (const childFrame of frame.childFrames) {
			this.closeFrame(childFrame);
		}

		(<boolean>frame.window.closed) = true;
		frame._asyncTaskManager.destroy();
		WindowBrowserSettingsReader.removeSettings(frame.window);
		(<BrowserPage>frame.page) = null;
		(<Window>frame.window) = null;
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
	 * Go to a page.
	 *
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
		if (url.startsWith('javascript:')) {
			frame.window.location.href = url;
			return null;
		}

		for (const childFrame of frame.childFrames) {
			BrowserFrameUtility.closeFrame(childFrame);
		}

		(<boolean>frame.window.closed) = true;
		frame._asyncTaskManager.destroy();
		WindowBrowserSettingsReader.removeSettings(frame.window);

		(<IWindow>frame.window) = new windowClass({
			browserFrame: frame,
			console: frame.page.console
		});

		if (options?.referrer) {
			(<string>frame.window.document.referrer) = options.referrer;
		}

		if (!url || url.startsWith('about:')) {
			return null;
		}

		frame.url = url;

		const readyStateManager = (<{ _readyStateManager: DocumentReadyStateManager }>(
			(<unknown>frame.window)
		))._readyStateManager;

		readyStateManager.startTask();

		let response: IResponse;
		let responseText: string;

		try {
			response = await frame.window.fetch(url, {
				referrer: options?.referrer,
				referrerPolicy: options?.referrerPolicy
			});
			responseText = await response.text();
		} catch (error) {
			readyStateManager.endTask();
			WindowErrorUtility.dispatchError(frame.window, error);
			return response || null;
		}

		frame.window.document.write(responseText);
		readyStateManager.endTask();

		return response;
	}
}
