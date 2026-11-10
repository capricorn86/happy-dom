import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type IBrowserPage from '../types/IBrowserPage.js';
import BrowserFrameCrossOriginIsolation from './BrowserFrameCrossOriginIsolation.js';

/**
 * Browser frame factory.
 */
export default class BrowserFrameFactory {
	public static frameID = 1;

	/**
	 * Returns a unique frame ID.
	 *
	 * @returns Unique frame ID.
	 */
	public static getUniqueFrameID(): number {
		return this.frameID++;
	}
	/**
	 * Creates a new frame.
	 *
	 * @param parentFrame Parent frame.
	 * @returns Frame.
	 */
	public static createChildFrame(parentFrame: IBrowserFrame): IBrowserFrame {
		const frame = new (<new (page: IBrowserPage) => IBrowserFrame>parentFrame.constructor)(
			parentFrame.page
		);
		(<IBrowserFrame>frame.parentFrame) = parentFrame;
		parentFrame.childFrames.push(frame);
		frame.window[PropertySymbol.parent] = parentFrame.window;
		frame.window[PropertySymbol.top] = parentFrame.window.top;
		frame[PropertySymbol.contentWindow] = frame.window;
		frame[PropertySymbol.history].currentItem.documentState.inheritOrigin = true;
		return frame;
	}

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 *
	 * @param frame Frame.
	 */
	public static destroyFrame(frame: IBrowserFrame): Promise<void> {
		const exceptionObserver = frame.page.context.browser[PropertySymbol.exceptionObserver];

		if (frame.closed) {
			return Promise.resolve();
		}

		(<boolean>frame.closed) = true;

		// Using Promise instead of async/await to prevent usage of a microtask
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

			if (frame[PropertySymbol.opener]?.frame) {
				const index = frame[PropertySymbol.opener].frame[PropertySymbol.openedPages].indexOf(
					frame.page
				);
				if (index !== -1) {
					frame[PropertySymbol.opener].frame[PropertySymbol.openedPages].splice(index, 1);
				}
			}

			if (!frame.childFrames.length) {
				frame[PropertySymbol.asyncTaskManager]
					.destroy()
					.then(() => {
						if (exceptionObserver && frame.window) {
							exceptionObserver.disconnect(frame.window);
						}

						(<object>frame.window) = { closed: true };
						frame[PropertySymbol.opener] = null;
						frame[PropertySymbol.contentWindow] = null;

						// Clear navigation listeners
						if (frame[PropertySymbol.listeners]) {
							frame[PropertySymbol.listeners].navigation = [];
						}

						for (const openedPage of frame[PropertySymbol.openedPages]) {
							openedPage.mainFrame[PropertySymbol.opener] = null;
							BrowserFrameCrossOriginIsolation.isolate(openedPage.mainFrame);
						}

						frame.childFrames.length = 0;
						frame[PropertySymbol.openedPages].length = 0;

						resolve();
					})
					.catch((error) => reject(error));
				if (frame.window) {
					frame.window[PropertySymbol.destroy]();
				}
				return;
			}

			Promise.all(frame.childFrames.slice().map((childFrame) => this.destroyFrame(childFrame)))
				.then(() => {
					frame[PropertySymbol.asyncTaskManager]
						.destroy()
						.then(() => {
							if (exceptionObserver && frame.window) {
								exceptionObserver.disconnect(frame.window);
							}

							(<object>frame.window) = { closed: true };
							frame[PropertySymbol.opener] = null;
							frame[PropertySymbol.contentWindow] = null;

							// Clear navigation listeners
							if (frame[PropertySymbol.listeners]) {
								frame[PropertySymbol.listeners].navigation = [];
							}

							for (const popup of frame[PropertySymbol.openedPages]) {
								popup.mainFrame[PropertySymbol.opener] = null;
								BrowserFrameCrossOriginIsolation.isolate(popup.mainFrame);
							}

							frame.childFrames.length = 0;
							frame[PropertySymbol.openedPages].length = 0;

							resolve();
						})
						.catch((error) => reject(error));
					if (frame.window) {
						frame.window[PropertySymbol.destroy]();
					}
				})
				.catch((error) => reject(error));
		});
	}
}
