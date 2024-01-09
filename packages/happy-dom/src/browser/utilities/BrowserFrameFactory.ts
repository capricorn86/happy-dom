import IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';
import IBrowserPage from '../types/IBrowserPage.js';
/**
 * Browser frame factory.
 */
export default class BrowserFrameFactory {
	/**
	 * Creates a new frame.
	 *
	 * @param parentFrame Parent frame.
	 * @returns Frame.
	 */
	public static newChildFrame(parentFrame: IBrowserFrame): IBrowserFrame {
		const frame = new (<new (page: IBrowserPage) => IBrowserFrame>parentFrame.constructor)(
			parentFrame.page
		);
		(<IBrowserFrame>frame.parentFrame) = parentFrame;
		parentFrame.childFrames.push(frame);
		return frame;
	}

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 *
	 * @param frame Frame.
	 */
	public static destroyFrame(frame: IBrowserFrame): Promise<void> {
		// Using Promise instead of async/await to prevent microtask
		return new Promise((resolve, reject) => {
			if (!frame.window) {
				resolve();
				return;
			}

			if (frame.parentFrame) {
				const index = frame.parentFrame.childFrames.indexOf(frame);
				if (index !== -1) {
					frame.parentFrame.childFrames.splice(index, 1);
				}
			}

			(<boolean>frame.window.closed) = true;

			if (!frame.childFrames.length) {
				const window = <IBrowserWindow>frame.window;
				WindowBrowserSettingsReader.removeSettings(frame.window);
				(<IBrowserPage | null>frame.page) = null;
				(<IBrowserWindow | null>frame.window) = null;
				(<IBrowserFrame | null>frame.opener) = null;
				window.close();
				frame[PropertySymbol.exceptionObserver]?.disconnect();
				resolve();
				return;
			}

			Promise.all(frame.childFrames.slice().map((childFrame) => this.destroyFrame(childFrame)))
				.then(() => {
					return frame[PropertySymbol.asyncTaskManager].destroy().then(() => {
						const window = <IBrowserWindow>frame.window;
						WindowBrowserSettingsReader.removeSettings(frame.window);
						(<IBrowserPage | null>frame.page) = null;
						(<IBrowserWindow | null>frame.window) = null;
						(<IBrowserFrame | null>frame.opener) = null;
						window.close();
						frame[PropertySymbol.exceptionObserver]?.disconnect();
						resolve();
					});
				})
				.catch((error) => reject(error));
		});
	}
}
