import IBrowserPage from './types/IBrowserPage.js';
import IBrowserPageViewport from './types/IBrowserPageViewport.js';
import Event from '../event/Event.js';
import BrowserFrameUtility from './BrowserFrameUtility.js';
import IVirtualConsolePrinter from '../console/types/IVirtualConsolePrinter.js';
import IBrowserFrame from './types/IBrowserFrame.js';
import IBrowserContext from './types/IBrowserContext.js';

/**
 * Browser page utility.
 */
export default class BrowserPageUtility {
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

		if (viewport.deviceScaleFactor !== undefined) {
			(<number>page.mainFrame.window.devicePixelRatio) = viewport.deviceScaleFactor;
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

		BrowserFrameUtility.closeFrame(page.mainFrame);

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
}
