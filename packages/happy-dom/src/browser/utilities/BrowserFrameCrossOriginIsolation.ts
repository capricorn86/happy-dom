import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';

/**
 * Handles cross-origin isolation between a frame and its ancestors.
 *
 * Sets "parent" and "top" of the frame's window, and the "contentWindow" that the parent frame gets access to.
 * Windows with a different origin are only given the limited access of a cross-origin window.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy#cross-origin_script_api_access
 * @see https://html.spec.whatwg.org/multipage/browsers.html#cross-origin-objects
 */
export default class BrowserFrameCrossOriginIsolation {
	/**
	 * Updates the cross-origin isolation between a frame and its ancestors.
	 *
	 * @param frame Frame.
	 */
	public static isolate(frame: IBrowserFrame): void {
		frame.window[PropertySymbol.parent] = frame.window;
		frame.window[PropertySymbol.top] = frame.window;
		frame[PropertySymbol.contentWindow] = null;
		frame[PropertySymbol.openerWindow] = null;

		// Popup frame
		if (frame[PropertySymbol.openerFrame]) {
			if (BrowserFrameURL.isSameOrigin(frame[PropertySymbol.openerFrame], frame)) {
				frame[PropertySymbol.openerWindow] = frame[PropertySymbol.openerFrame].window;
			} else {
				frame[PropertySymbol.openerWindow] = new CrossOriginBrowserWindow(
					frame[PropertySymbol.openerFrame].window
				);
			}
			this.isolateChildFrames(frame);
			return;
		}

		// Child frame (e.g. iframe)

		if (!frame.parentFrame) {
			this.isolateChildFrames(frame);
			return;
		}

		const parentWindow = BrowserFrameURL.isSameOrigin(frame.parentFrame, frame)
			? frame.parentFrame.window
			: new CrossOriginBrowserWindow(frame.parentFrame.window);
		const topWindow =
			frame.page.mainFrame === frame.parentFrame
				? parentWindow
				: BrowserFrameURL.isSameOrigin(frame.page.mainFrame, frame)
					? frame.page.mainFrame.window
					: new CrossOriginBrowserWindow(frame.page.mainFrame.window);

		frame.window[PropertySymbol.parent] = <BrowserWindow>parentWindow;
		frame.window[PropertySymbol.top] = <BrowserWindow>topWindow;
		frame[PropertySymbol.contentWindow] = BrowserFrameURL.isSameOrigin(frame.parentFrame, frame)
			? frame.window
			: new CrossOriginBrowserWindow(frame.window);

		this.isolateChildFrames(frame);
	}

	/**
	 * Applies the cross-origin isolation to all child frames of the given frame.
	 *
	 * @param frame Frame.
	 */
	private static isolateChildFrames(frame: IBrowserFrame): void {
		for (const childFrame of frame.childFrames) {
			BrowserFrameCrossOriginIsolation.isolate(childFrame);
			BrowserFrameCrossOriginIsolation.isolateChildFrames(childFrame);
		}
	}
}
