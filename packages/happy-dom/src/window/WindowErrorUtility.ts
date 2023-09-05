import IWindow from './IWindow.js';
import ErrorEvent from '../event/events/ErrorEvent.js';
import { IElement } from '../index.js';

/**
 * Error utility.
 */
export default class WindowErrorUtility {
	/**
	 * Calls a function asynchronously wrapped in a try/catch block to capture errors and dispatch error events.
	 *
	 * It will also output the errors to the console.
	 *
	 * @param elementOrWindow Element or Window.
	 * @param callback Callback.
	 * @returns Promise.
	 */
	public static async captureErrorAsync<T>(
		elementOrWindow: IWindow | IElement,
		callback: () => Promise<T>
	): Promise<T | null> {
		try {
			return await callback();
		} catch (error) {
			this.dispatchError(elementOrWindow, error);
		}
		return null;
	}

	/**
	 * Calls a function synchronously wrapped in a try/catch block to capture errors and dispatch error events.
	 *
	 * It will also output the errors to the console.
	 *
	 * @param elementOrWindow Element or Window.
	 * @param callback Callback.
	 * @returns Result.
	 */
	public static captureErrorSync<T>(
		elementOrWindow: IWindow | IElement,
		callback: () => T
	): T | null {
		try {
			return callback();
		} catch (error) {
			this.dispatchError(elementOrWindow, error);
		}
		return null;
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
