import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserFrameURL from './BrowserFrameURL.js';
import type IBrowserPage from '../types/IBrowserPage.js';

/**
 * Browser frame factory.
 */
export default class BrowserFrameFactory {
	/**
	 * Creates a new frame.
	 *
	 * The initial "about:blank" document of the frame inherits the origin of the parent frame.
	 * The BrowserFrameNavigator restricts "parent" and "top" if the frame is navigated to a document with another origin.
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
		frame[PropertySymbol.inheritedOriginWindow] = BrowserFrameURL.getOriginWindow(parentFrame);
		frame.window[PropertySymbol.parent] = parentFrame.window;
		frame.window[PropertySymbol.top] = parentFrame.window.top;
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

			if (!frame.childFrames.length) {
				frame[PropertySymbol.asyncTaskManager]
					.destroy()
					.then(() => {
						if (exceptionObserver && frame.window) {
							exceptionObserver.disconnect(frame.window);
						}

						(<object>frame.window) = { closed: true };
						frame[PropertySymbol.openerFrame] = null;
						frame[PropertySymbol.openerWindow] = null;
						frame[PropertySymbol.inheritedOriginWindow] = null;
						frame[PropertySymbol.contentWindow] = null;

						// Clear navigation listeners
						if (frame[PropertySymbol.listeners]) {
							frame[PropertySymbol.listeners].navigation = [];
						}

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
							frame[PropertySymbol.openerFrame] = null;
							frame[PropertySymbol.openerWindow] = null;
							frame[PropertySymbol.inheritedOriginWindow] = null;
							frame[PropertySymbol.contentWindow] = null;

							// Clear navigation listeners
							if (frame[PropertySymbol.listeners]) {
								frame[PropertySymbol.listeners].navigation = [];
							}

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
