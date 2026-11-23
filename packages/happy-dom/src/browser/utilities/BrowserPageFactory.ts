import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type IBrowserPage from '../types/IBrowserPage.js';
import type IBrowserContext from '../types/IBrowserContext.js';

/**
 * Browser page factory.
 */
export default class BrowserPageFactory {
	/**
	 * Creates a new blank page.
	 *
	 * @param openerFrame Opener frame.
	 * @param [options] Options.
	 * @param [options.popup] True if the page is a popup.
	 * @param [options.noreferrer] True if the page should not refer to the opener.
	 * @returns Frame.
	 */
	public static createBlankPage(
		openerFrame: IBrowserFrame,
		options?: { popup?: boolean; noreferrer?: boolean }
	): IBrowserPage {
		const page = new (<new (context: IBrowserContext) => IBrowserPage>openerFrame.page.constructor)(
			openerFrame.page.context
		);
		const frame = page.mainFrame;
		frame[PropertySymbol.access].opener = {
			frame: openerFrame,
			window: null,
			noreferrer: options?.noreferrer ?? false
		};
		frame.page[PropertySymbol.popup] = options?.popup ?? false;
		openerFrame[PropertySymbol.access].pages.push({
			frame: frame,
			window: null,
			noreferrer: options?.noreferrer ?? false
		});
		openerFrame.page.context.pages.push(page);
		openerFrame[PropertySymbol.access].update();
		return page;
	}
}
