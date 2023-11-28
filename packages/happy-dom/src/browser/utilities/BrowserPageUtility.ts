import IBrowserFrame from '../types/IBrowserFrame.js';
import IBrowserPage from '../types/IBrowserPage.js';
import IBrowserPageViewport from '../types/IBrowserPageViewport.js';
import Event from '../../event/Event.js';
import IVirtualConsolePrinter from '../../console/types/IVirtualConsolePrinter.js';
import IBrowserContext from '../types/IBrowserContext.js';
import BrowserFrameFactory from './BrowserFrameFactory.js';

/**
 * Browser page utility.
 */
export default class BrowserPageUtility {
	/**
	 * Returns frames for a page.
	 *
	 * @param page Page.
	 * @returns Frames.
	 */
	public static getFrames(page: IBrowserPage): IBrowserFrame[] {
		return this.findFrames(page.mainFrame);
	}

	/**
	 * Sets the viewport.
	 *
	 * @param page Page.
	 * @param viewport Viewport.
	 */
	public static setViewport(page: IBrowserPage, viewport: IBrowserPageViewport): void {
		if (
			(viewport.width !== undefined && page.mainFrame.window.innerWidth !== viewport.width) ||
			(viewport.height !== undefined && page.mainFrame.window.innerHeight !== viewport.height)
		) {
			if (viewport.width !== undefined && page.mainFrame.window.innerWidth !== viewport.width) {
				(<number>page.mainFrame.window.innerWidth) = viewport.width;
				(<number>page.mainFrame.window.outerWidth) = viewport.width;
			}

			if (viewport.height !== undefined && page.mainFrame.window.innerHeight !== viewport.height) {
				(<number>page.mainFrame.window.innerHeight) = viewport.height;
				(<number>page.mainFrame.window.outerHeight) = viewport.height;
			}

			page.mainFrame.window.dispatchEvent(new Event('resize'));
		}

		if (viewport.devicePixelRatio !== undefined) {
			(<number>page.mainFrame.window.devicePixelRatio) = viewport.devicePixelRatio;
		}
	}

	/**
	 * Aborts all ongoing operations and destroys the page.
	 *
	 * @param page Page.
	 */
	public static closePage(page: IBrowserPage): void {
		if (!page.mainFrame) {
			return;
		}

		BrowserFrameFactory.destroyFrame(page.mainFrame);

		const index = page.context.pages.indexOf(page);
		if (index !== -1) {
			page.context.pages.splice(index, 1);
		}

		const context = page.context;

		(<IVirtualConsolePrinter | null>page.virtualConsolePrinter) = null;
		(<IBrowserFrame | null>page.mainFrame) = null;
		(<IBrowserContext | null>page.context) = null;

		if (context.pages[0] === page) {
			context.close();
		}
	}

	/**
	 * Returns all frames.
	 *
	 * @param parentFrame Parent frame.
	 * @returns Frames, including the parent.
	 */
	private static findFrames(parentFrame: IBrowserFrame): IBrowserFrame[] {
		let frames = [parentFrame];
		for (const frame of parentFrame.childFrames) {
			frames = frames.concat(this.findFrames(frame));
		}
		return frames;
	}
}
