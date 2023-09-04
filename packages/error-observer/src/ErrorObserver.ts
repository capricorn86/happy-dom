import { IWindow, ErrorEvent } from 'happy-dom';

/**
 * Error observer.
 */
export default class ErrorObserver {
	private static listenerCount = 0;
	private window: IWindow | null = null;
	private uncaughtExceptionListener: (error: Error) => void | null = null;
	private callback: (error: Error) => void | null;
	private disableEventDispatching: boolean;
	private disableConsoleOutput: boolean;

	/**
	 *
	 * @param options Options.
	 * @param options.callback Callback.
	 * @param options.disableEventDispatching Disables dispatching of error events.
	 * @param options.disableConsoleOutput Disables outputting errors to the console.
	 */
	constructor(options?: {
		callback?: (error: Error) => void;
		disableEventDispatching?: boolean;
		disableConsoleOutput?: boolean;
	}) {
		this.callback = options?.callback || null;
		this.disableEventDispatching = options?.disableEventDispatching || false;
		this.disableConsoleOutput = options?.disableConsoleOutput || false;
	}

	/**
	 * Observes a window.
	 *
	 * @param window
	 */
	public observe(window: IWindow): void {
		this.window = window;

		(<typeof ErrorObserver>this.constructor).listenerCount++;

		this.uncaughtExceptionListener = (error: Error) => {
			if (
				error instanceof this.window.Error &&
				error.stack?.includes('at main (evalmachine.<anonymous>:')
			) {
				if (!this.disableConsoleOutput) {
					this.window.console.error(error);
				}
				if (!this.disableEventDispatching) {
					this.window.dispatchEvent(new ErrorEvent('error', { error, message: error.message }));
				}
				if (this.callback) {
					this.callback(error);
				}
			} else if (
				process.listenerCount('uncaughtException') ===
				(<typeof ErrorObserver>this.constructor).listenerCount
			) {
				// Exit if there are no other listeners handling the error.
				process.exit(1);
			}
		};

		process.on('uncaughtException', this.uncaughtExceptionListener);
	}

	/**
	 * Disconnects observer.
	 */
	public disconnect(): void {
		process.off('uncaughtException', this.uncaughtExceptionListener);

		(<typeof ErrorObserver>this.constructor).listenerCount++;

		this.uncaughtExceptionListener = null;
		this.window = null;
	}
}
