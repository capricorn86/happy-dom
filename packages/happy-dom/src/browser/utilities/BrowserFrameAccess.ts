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
		if (this.top) {
			this.top.window = this.getWindow(this.frame, this.top.frame);
		}
		if (this.parent) {
			let parentAccess = this.parent.frame[PropertySymbol.access].children?.find(
				(child) => child.frame === this.frame
			);
			if (!parentAccess) {
				parentAccess = { frame: this.frame, window: null };
				this.parent.frame[PropertySymbol.access].children?.push(parentAccess);
			}
			parentAccess.window = this.getWindow(this.parent.frame, this.frame);
			this.parent.window = this.getWindow(this.frame, this.parent.frame);
		}
		if (this.opener) {
			let openerAccess = this.opener.frame[PropertySymbol.access].pages?.find(
				(child) => child.frame === this.frame
			);
			if (!openerAccess) {
				openerAccess = { frame: this.frame, window: null };
				this.opener.frame[PropertySymbol.access].pages?.push(openerAccess);
			}
			openerAccess.window = this.getWindow(this.opener.frame, this.frame);
			this.opener.window = this.getWindow(this.frame, this.opener.frame);
		}
		for (const child of this.children) {
			child.frame[PropertySymbol.access].update();
		}
		for (const page of this.pages) {
			page.frame[PropertySymbol.access].update();
		}
	}

	/**
	 * Returns the window object.
	 *
	 * @param sourceFrame Source frame.
	 * @param targetFrame Target frame.
	 * @returns Window object, either same-origin or cross-origin.
	 */
	private getWindow(
		sourceFrame: IBrowserFrame,
		targetFrame: IBrowserFrame
	): BrowserWindow | CrossOriginBrowserWindow {
		if (BrowserFrameURL.isSameOrigin(sourceFrame, targetFrame)) {
			return targetFrame.window;
		}
		return new CrossOriginBrowserWindow(targetFrame, {
			top: sourceAccess
		});
	}
}
