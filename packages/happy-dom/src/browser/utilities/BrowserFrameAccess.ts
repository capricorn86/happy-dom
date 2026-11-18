import CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import type IBrowserFrame from '../types/IBrowserFrame.js';
import type IBrowserFrameWindowAccess from '../types/IBrowserFrameWindowAccess.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type BrowserWindow from '../../window/BrowserWindow.js';

/**
 * Browser frame window access between frames cross origin or same origin.
 */
export default class BrowserFrameAccess {
	private frame: IBrowserFrame;
	public parent: IBrowserFrameWindowAccess | null = null;
	public top: IBrowserFrameWindowAccess | null = null;
	public opener: IBrowserFrameWindowAccess | null = null;
	public children: IBrowserFrameWindowAccess[] = [];
	public pages: IBrowserFrameWindowAccess[] = [];
	public popups: IBrowserFrameWindowAccess[] = [];

	/**
	 * Constructor.
	 *
	 * @param frame Browser frame.
	 */
	constructor(frame: IBrowserFrame) {
		this.frame = frame;
	}

	/**
	 * Updates the cross-origin access between a frame and its related frames.
	 */
	public update(): void {
		if (this.parent) {
			const sourceAccess = this.parent.frame[PropertySymbol.access].children?.find(
				(child) => child.frame === this.frame
			);
			this.parent.window = this.getWindow(this.frame, this.parent.frame, sourceAccess);
		}
		if (this.top) {
			this.top.window = this.getWindow(this.frame, this.top.frame, {
				frame: this.frame,
				window: this.getWindow(this.top.frame, this.frame)
			});
		}
		if (this.opener) {
			const sourceAccess =
				this.opener.frame[PropertySymbol.access].pages?.find(
					(child) => child.frame === this.frame
				) ||
				this.opener.frame[PropertySymbol.access].popups?.find(
					(child) => child.frame === this.frame
				);
			this.opener.window = this.getWindow(this.frame, this.opener.frame, sourceAccess);
		}
		for (const child of this.children) {
			const sourceAccess =
				child.frame[PropertySymbol.access].parent?.frame === this.frame ? child : undefined;
			child.window = this.getWindow(this.frame, child.frame, sourceAccess);
			child.frame[PropertySymbol.access].update();
		}
		for (const page of this.pages) {
			const sourceAccess =
				page.frame[PropertySymbol.access].opener?.frame === this.frame ? page : undefined;
			page.window = this.getWindow(this.frame, page.frame, sourceAccess);
			page.frame[PropertySymbol.access].update();
		}
		for (const popup of this.popups) {
			const sourceAccess =
				popup.frame[PropertySymbol.access].opener?.frame === this.frame ? popup : undefined;
			popup.window = this.getWindow(this.frame, popup.frame, sourceAccess);
			popup.frame[PropertySymbol.access].update();
		}
	}

	/**
	 * Returns the window object.
	 *
	 * @param sourceFrame Source frame.
	 * @param targetFrame Target frame.
	 * @param [sourceAccess] Source access.
	 * @returns Window object, either same-origin or cross-origin.
	 */
	private getWindow(
		sourceFrame: IBrowserFrame,
		targetFrame: IBrowserFrame,
		sourceAccess?: IBrowserFrameWindowAccess
	): BrowserWindow | CrossOriginBrowserWindow {
		if (BrowserFrameURL.isSameOrigin(sourceFrame, targetFrame)) {
			return targetFrame.window;
		}
		return new CrossOriginBrowserWindow(targetFrame, sourceAccess);
	}
}
