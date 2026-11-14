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
		// Reset window references
		frame.window[PropertySymbol.parent] = frame.window;
		frame.window[PropertySymbol.top] = frame.window;
		frame[PropertySymbol.contentWindow] = null;

		// Popup frame
		if (frame[PropertySymbol.opener]) {
			frame[PropertySymbol.opener].window = frame[PropertySymbol.opener].frame
				? this.getWindow(frame[PropertySymbol.opener].frame, frame)
				: null;
		}

		// Child frame (e.g. iframe)
		if (frame.parentFrame) {
			const parentWindow = this.getWindow(frame.parentFrame, frame);
			const topWindow =
				frame.page.mainFrame === frame.parentFrame
					? parentWindow
					: this.getWindow(frame.page.mainFrame, frame);

			frame.window[PropertySymbol.parent] = <BrowserWindow>parentWindow;
			frame.window[PropertySymbol.top] = <BrowserWindow>topWindow;

			// HTMLIFrameElement.contentWindow is accessed by the parent frame, and should have access to itself as parent and whatever top access it has.
			frame[PropertySymbol.contentWindow] = this.getWindow(frame, frame.parentFrame, {
				parent: frame.parentFrame.window,
				top: frame.parentFrame.window.top
			});
		}

		for (const childFrame of frame.childFrames) {
			BrowserFrameCrossOriginIsolation.isolate(childFrame);
		}

		// Pages opened by the frame get access to the opener of the frame through "opener.opener".
		for (const openedPage of frame[PropertySymbol.openedPages]) {
			this.isolate(openedPage.mainFrame);
		}
	}

	/**
	 * Returns the window of a frame as it should be accessed from another frame.
	 *
	 * Window references of a cross-origin window (e.g. "opener") are restricted based on the origin of the accessing frame, as the target frame may have access to windows that the accessing frame should not have access to.
	 *
	 * @see https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-opener
	 * @param targetFrame Frame to access.
	 * @param accessorFrame Frame that accesses the target frame.
	 * @param [options] Options.
	 * @param [options.parent] Parent window.
	 * @param [options.top] Top window.
	 * @returns Window, or a cross-origin window with limited access.
	 */
	private static getWindow(
		targetFrame: IBrowserFrame,
		accessorFrame: IBrowserFrame,
		options?: { parent: BrowserWindow; top: BrowserWindow }
	): BrowserWindow | CrossOriginBrowserWindow {
		if (BrowserFrameURL.isSameOrigin(targetFrame, accessorFrame)) {
			return targetFrame.window;
		}

		const openerFrame = targetFrame[PropertySymbol.opener]?.frame;

		return new CrossOriginBrowserWindow(targetFrame.window, {
			...options,
			opener: openerFrame ? this.getWindow(openerFrame, accessorFrame) : null
		});
	}
}
