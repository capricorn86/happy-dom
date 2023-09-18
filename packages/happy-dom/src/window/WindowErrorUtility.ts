import IWindow from './IWindow.js';
import ErrorEvent from '../event/events/ErrorEvent.js';
import { IElement } from '../index.js';

/**
 * Error utility.
 */
export default class WindowErrorUtility {
	/**
	 * Calls a function synchronously wrapped in a try/catch block to capture errors and dispatch error events.
	 * If the callback returns a Promise, it will catch errors from the promise.
	 *
	 * It will also output the errors to the console.
	 *
	 * @param elementOrWindow Element or Window.
	 * @param callback Callback.
	 * @param [cleanup] Cleanup callback on error.
	 * @returns Result.
	 */
	public static captureError<T>(
		elementOrWindow: IWindow | IElement,
		callback: () => T,
		cleanup?: () => void
	): T | null {
		let result = null;

		try {
			result = callback();
		} catch (error) {
			this.dispatchError(elementOrWindow, error);
			if (cleanup) {
				cleanup();
			}
		}

		if (result && result instanceof Promise) {
			result.catch((error) => {
				this.dispatchError(elementOrWindow, error);
				if (cleanup) {
					cleanup();
				}
			});
		}

		return result;
	}

	/**
	 * Dispatches an error event and outputs it to the console.
	 *
	 * @param elementOrWindow Element or Window.
	 * @param error Error.
	 */
	public static dispatchError(elementOrWindow: IWindow | IElement, error: Error): void {
		if ((<IWindow>elementOrWindow).console) {
			(<IWindow>elementOrWindow).console.error(error);
			elementOrWindow.dispatchEvent(new ErrorEvent('error', { message: error.message, error }));
		} else {
			(<IElement>elementOrWindow).ownerDocument.defaultView.console.error(error);
			(<IElement>elementOrWindow).dispatchEvent(
				new ErrorEvent('error', { message: error.message, error })
			);
			(<IElement>elementOrWindow).ownerDocument.defaultView.dispatchEvent(
				new ErrorEvent('error', { message: error.message, error })
			);
		}
	}
}
