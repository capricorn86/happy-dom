import IWindow from './IWindow.js';
import WindowErrorUtility from './WindowErrorUtility.js';

/**
 * Listens for uncaught exceptions on the running Node process and dispatches error events.
 */
export default class UncaughtExceptionObserver {
	private static listenerCount = 0;
	private window: IWindow | null = null;
	private uncaughtExceptionListener: (
		error: Error,
		origin: 'uncaughtException' | 'unhandledRejection'
	) => void | null = null;
	private uncaughtRejectionListener: (error: Error) => void | null = null;

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 */
	constructor(window: IWindow) {
		this.window = window;
	}

	/**
	 * Observes the Node process for uncaught exceptions.
	 */
	public observe(): void {
		(<typeof UncaughtExceptionObserver>this.constructor).listenerCount++;

		this.uncaughtExceptionListener = (
			error: Error,
			origin: 'uncaughtException' | 'unhandledRejection'
		) => {
			if (origin === 'unhandledRejection') {
				return;
			}

			if (
				error instanceof this.window.Error &&
				error.stack?.includes('at main (eval') &&
				error.stack?.includes('/happy-dom/')
			) {
				WindowErrorUtility.dispatchError(this.window, error);
			} else if (
				process.listenerCount('uncaughtException') ===
				(<typeof UncaughtExceptionObserver>this.constructor).listenerCount
			) {
				// Exit if there are no other listeners handling the error.
				process.exit(1);
			}
		};

		// The "uncaughtException" event is not always triggered for unhandled rejections.
		// Therefore we want to use the "unhandledRejection" event as well.
		this.uncaughtRejectionListener = (error: Error) => {
			if (
				error instanceof this.window.Error &&
				error.stack?.includes('at main (eval') &&
				error.stack?.includes('/happy-dom/')
			) {
				WindowErrorUtility.dispatchError(this.window, error);
			} else if (
				process.listenerCount('unhandledRejection') ===
				(<typeof UncaughtExceptionObserver>this.constructor).listenerCount
			) {
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
		(<typeof UncaughtExceptionObserver>this.constructor).listenerCount--;

		process.off('uncaughtException', this.uncaughtExceptionListener);
		process.off('unhandledRejection', this.uncaughtRejectionListener);

		this.uncaughtExceptionListener = null;
		this.uncaughtRejectionListener = null;
		this.window = null;
	}
}
