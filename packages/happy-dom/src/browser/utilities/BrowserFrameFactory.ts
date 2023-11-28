import BrowserPage from '../BrowserPage.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import Window from '../../window/Window.js';
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
	public static destroyFrame(frame: IBrowserFrame): void {
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
			this.destroyFrame(childFrame);
		}

		(<boolean>frame.window.closed) = true;
		frame.__asyncTaskManager__.destroy();
		WindowBrowserSettingsReader.removeSettings(frame.window);
		(<BrowserPage | null>frame.page) = null;
		(<Window | null>frame.window) = null;
		(<IBrowserFrame | null>frame.opener) = null;
	}
}
