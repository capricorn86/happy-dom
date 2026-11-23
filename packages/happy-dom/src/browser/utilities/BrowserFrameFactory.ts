import type IBrowserFrame from '../types/IBrowserFrame.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type IBrowserPage from '../types/IBrowserPage.js';
import BrowserFrameURL from './BrowserFrameURL.js';

/**
 * Browser frame factory.
 */
export default class BrowserFrameFactory {
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
		frame[PropertySymbol.access].parent = {
			frame: parentFrame,
			window: null
		};
		frame[PropertySymbol.access].top = {
			frame: parentFrame.page.mainFrame,
			window: null
		};
		parentFrame[PropertySymbol.access].children.push({
			frame,
			window: null
		});
		frame[PropertySymbol.history].currentItem.documentState.inheritedOrigin =
			BrowserFrameURL.getOrigin(parentFrame);
		parentFrame[PropertySymbol.access].update();
		return frame;
	}

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 *
	 * @param frame Frame.
	 */
	public static destroyFrame(frame: IBrowserFrame): Promise<void> {
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

			this.removeFromParent(frame);
			this.removeFromOpener(frame);

			if (!frame.childFrames.length) {
				frame[PropertySymbol.asyncTaskManager]
					.destroy()
					.then(() => {
						this.clearFrameReferences(frame);
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
							this.clearFrameReferences(frame);
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

	/**
	 * Removes the frame from its parent's list of child frames.
	 *
	 * @param frame Frame.
	 */
	private static removeFromParent(frame: IBrowserFrame): void {
		if (frame.parentFrame) {
			const index = frame.parentFrame.childFrames.indexOf(frame);
			if (index !== -1) {
				frame.parentFrame.childFrames.splice(index, 1);
			}
		}
	}

	/**
	 * Removes the frame from its opener's list of pages.
	 *
	 * @param frame
	 */
	private static removeFromOpener(frame: IBrowserFrame): void {
		if (frame[PropertySymbol.access].opener) {
			const opener = frame[PropertySymbol.access].opener;
			if (opener?.frame) {
				const index = opener.frame[PropertySymbol.access].pages.findIndex(
					(page) => page.frame === frame
				);
				if (index !== -1) {
					opener.frame[PropertySymbol.access].pages.splice(index, 1);
				}
			}
		}
	}

	/**
	 * Clears all references and listeners associated with the frame.
	 *
	 * @param frame Frame to clear references for.
	 */
	private static clearFrameReferences(frame: IBrowserFrame): void {
		const exceptionObserver = frame.page.context.browser[PropertySymbol.exceptionObserver];

		if (exceptionObserver && frame.window) {
			exceptionObserver.disconnect(frame.window);
		}

		(<object>frame.window) = { closed: true };

		// Clear navigation listeners
		if (frame[PropertySymbol.listeners]) {
			frame[PropertySymbol.listeners].navigation = [];
		}

		for (const page of frame[PropertySymbol.access].pages) {
			page.frame[PropertySymbol.access].opener = null;
		}

		frame.childFrames.length = 0;
		frame[PropertySymbol.access].pages.length = 0;
	}
}
