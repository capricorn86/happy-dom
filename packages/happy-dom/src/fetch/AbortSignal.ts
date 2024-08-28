import EventTarget from '../event/EventTarget.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Event from '../event/Event.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import BrowserWindow from '../window/BrowserWindow.js';

/**
 * AbortSignal.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
 */
export default class AbortSignal extends EventTarget {
	// Injected by WindowClassExtender
	protected declare static [PropertySymbol.window]: BrowserWindow;
	protected declare [PropertySymbol.window]: BrowserWindow;

	// Public properties
	public readonly aborted: boolean = false;
	public readonly reason: Error | null = null;

	// Events
	public onabort: ((this: AbortSignal, event: Event) => void) | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		if (!this[PropertySymbol.window]) {
			throw new TypeError(
				`Failed to construct '${this.constructor.name}': '${this.constructor.name}' was constructed outside a Window context.`
			);
		}
	}

	/**
	 * Return a default description for the AbortSignal class.
	 */
	public get [Symbol.toStringTag](): string {
		return 'AbortSignal';
	}

	/**
	 * Aborts the signal.
	 *
	 * @param [reason] Reason.
	 */
	public [PropertySymbol.abort](reason?: Error): void {
		if (this.aborted) {
			return;
		}
		(<Error>this.reason) =
			reason ||
			new this[PropertySymbol.window].DOMException(
				'signal is aborted without reason',
				DOMExceptionNameEnum.abortError
			);
		(<boolean>this.aborted) = true;
		this.dispatchEvent(new Event('abort'));
	}

	/**
	 * Throws an "AbortError" if the signal has been aborted.
	 */
	public throwIfAborted(): void {
		if (this.aborted) {
			throw this.reason;
		}
	}

	/**
	 * Returns an AbortSignal instance that has been set as aborted.
	 *
	 * @param [reason] Reason.
	 * @returns AbortSignal instance.
	 */
	public static abort(reason?: Error): AbortSignal {
		const signal = new this[PropertySymbol.window].AbortSignal();
		(<Error>signal.reason) =
			reason ||
			new this[PropertySymbol.window].DOMException(
				'signal is aborted without reason',
				DOMExceptionNameEnum.abortError
			);
		(<boolean>signal.aborted) = true;
		return signal;
	}

	/**
	 * Returns an AbortSignal that will automatically abort after a specified
	 * time.
	 *
	 * @param [time] Time in milliseconds.
	 * @returns AbortSignal instance.
	 */
	public static timeout(time: number): AbortSignal {
		const window = this[PropertySymbol.window];
		const signal = new AbortSignal();
		window.setTimeout(() => {
			signal[PropertySymbol.abort](
				new window.DOMException('signal timed out', DOMExceptionNameEnum.timeoutError)
			);
		}, time);
		return signal;
	}
}
