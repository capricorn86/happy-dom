import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import type IBrowserFrameRelation from '../types/IBrowserFrameRelation.js';

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

		if (frame[PropertySymbol.opener]) {
			// Popup frame
			const relation = frame[PropertySymbol.relations].find(
				(r) => r.type === 'opener' && r.child.frame === frame
			);
			if (relation) {
				this.updateRelation(relation);
			}
		} else if (frame.parentFrame) {
			// Child frame (e.g. iframe)
			const relation = frame[PropertySymbol.relations].find(
				(r) => r.type === 'parent' && r.child.frame === frame
			);
			if (relation) {
				this.updateRelation(relation);
			}
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
	 * Updates the frame relations.
	 *
	 * @see https://html.spec.whatwg.org/multipage/nav-history-apis.html#dom-opener
	 * @param relation Frame relation containing the target and source frames.
	 */
	private static updateRelation(relation: IBrowserFrameRelation): void {
		if (BrowserFrameURL.isSameOrigin(relation.parent.frame, relation.child.frame)) {
			relation.parent.window = relation.parent.frame.window;
			relation.child.window = relation.child.frame.window;
			return;
		}

		relation.parent.window = new CrossOriginBrowserWindow(relation.parent.frame.window);
		relation.child.window = new CrossOriginBrowserWindow(relation.child.frame.window);
		relation.parent.window[PropertySymbol.source] = relation.parent.frame.window;
		relation.child.window[PropertySymbol.source] = relation.child.frame.window;

		switch (relation.type) {
			case 'opener':
				relation.child.window[PropertySymbol.opener] = relation.parent.frame.window;
				break;
			case 'parent':
				relation.child.window[PropertySymbol.parent] = relation.parent.frame.window;
				relation.child.window[PropertySymbol.top] = relation.parent.frame.window.top;
				break;
		}
	}
}
