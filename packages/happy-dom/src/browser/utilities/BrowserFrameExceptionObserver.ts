import IBrowserFrame from '../types/IBrowserFrame.js';

/**
 * Listens for uncaught exceptions coming from Happy DOM on the running Node process and dispatches error events on the Window instance.
 */
export default class BrowserFrameExceptionObserver {
	private static listenerCount = 0;
	private browserFrame: IBrowserFrame | null = null;
	private uncaughtExceptionListener: (
		error: Error,
		origin: 'uncaughtException' | 'unhandledRejection'
	) => void | null = null;
	private uncaughtRejectionListener: (error: Error) => void | null = null;

	/**
	 * Observes the Node process for uncaught exceptions.
	 *
	 * @param browserFrame Browser frame.
	 */
	public observe(browserFrame: IBrowserFrame): void {
		if (this.browserFrame) {
			throw new Error('Already observing.');
		}

		this.browserFrame = browserFrame;

		(<typeof BrowserFrameExceptionObserver>this.constructor).listenerCount++;

		this.uncaughtExceptionListener = (
			error: unknown,
			origin: 'uncaughtException' | 'unhandledRejection'
		) => {
			if (origin === 'unhandledRejection') {
				return;
			}

			if (!this.browserFrame.window) {
				throw new Error(
					'Browser frame was not closed correctly. Window is undefined on browser frame, but exception observer is still watching.'
				);
			}

			if (
				error instanceof this.browserFrame.window.Error ||
				error instanceof this.browserFrame.window.DOMException
			) {
				this.browserFrame.window.console.error(error);
				this.browserFrame.window.dispatchEvent(
					new this.browserFrame.window.ErrorEvent('error', { error, message: error.message })
				);
			} else if (
				process.listenerCount('uncaughtException') ===
				(<typeof BrowserFrameExceptionObserver>this.constructor).listenerCount
			) {
				// eslint-disable-next-line no-console
				console.error(error);
				// Exit if there are no other listeners handling the error.
				process.exit(1);
			}
		};

		// The "uncaughtException" event is not always triggered for unhandled rejections.
		// Therefore we want to use the "unhandledRejection" event as well.
		this.uncaughtRejectionListener = (error: unknown) => {
			if (!this.browserFrame.window) {
				throw new Error(
					'Browser frame was not closed correctly. Window is undefined on browser frame, but exception observer is still watching.'
				);
			}

			if (
				error instanceof this.browserFrame.window.Error ||
				error instanceof this.browserFrame.window.DOMException
			) {
				this.browserFrame.window.console.error(error);
				this.browserFrame.window.dispatchEvent(
					new this.browserFrame.window.ErrorEvent('error', { error, message: error.message })
				);
			} else if (
				process.listenerCount('unhandledRejection') ===
				(<typeof BrowserFrameExceptionObserver>this.constructor).listenerCount
			) {
				// eslint-disable-next-line no-console
				console.error(error);
				// Exit if there are no other listeners handling the error.
				process.exit(1);
			}
		};

		process.on('uncaughtException', this.uncaughtExceptionListener);
		process.on('unhandledRejection', this.uncaughtRejectionListener);
	}

	/**
	 * Disconnects observer.
	 */
	public disconnect(): void {
		if (!this.browserFrame) {
			return;
		}

		(<typeof BrowserFrameExceptionObserver>this.constructor).listenerCount--;

		process.off('uncaughtException', this.uncaughtExceptionListener);
		process.off('unhandledRejection', this.uncaughtRejectionListener);

		this.uncaughtExceptionListener = null;
		this.uncaughtRejectionListener = null;
		this.browserFrame = null;
	}
}
