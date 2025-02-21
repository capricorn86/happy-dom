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
	// Injected by WindowContextClassExtender
	protected declare static [PropertySymbol.window]: BrowserWindow;
	protected declare [PropertySymbol.window]: BrowserWindow;

	// Internal properties
	public [PropertySymbol.aborted]: boolean = false;
	public [PropertySymbol.reason]: any = undefined;

	// Events
	public onabort: ((this: AbortSignal, event: Event) => void) | null = null;

	/**
	 * Constructor.
	 */
	constructor() {
		super();

		if (!this[PropertySymbol.window]) {
			throw new TypeError(`Failed to construct 'AbortSignal': Illegal constructor`);
		}
	}

	/**
	 * Return a default description for the AbortSignal class.
	 */
	public get [Symbol.toStringTag](): string {
		return 'AbortSignal';
	}

	/**
	 * Returns true if the signal has been aborted.
	 *
	 * @returns True if the signal has been aborted.
	 */
	public get aborted(): boolean {
		return this[PropertySymbol.aborted];
	}

	/**
	 * Setter for aborted. Value will be ignored as the property is read-only.
	 *
	 * @param _value Aborted.
	 */
	public set aborted(_value: boolean) {
		// Do nothing
	}

	/**
	 * Returns the reason the signal was aborted.
	 *
	 * @returns Reason.
	 */
	public get reason(): any {
		return this[PropertySymbol.reason];
	}

	/**
	 * Setter for reason. Value will be ignored as the property is read-only.
	 *
	 * @param _value Reason.
	 */
	public set reason(_value: any) {
		// Do nothing
	}

	/**
	 * Aborts the signal.
	 *
	 * @param [reason] Reason.
	 */
	public [PropertySymbol.abort](reason?: any): void {
		if (this.aborted) {
			return;
		}
		this[PropertySymbol.reason] =
			reason !== undefined
				? reason
				: new this[PropertySymbol.window].DOMException(
						'signal is aborted without reason',
						DOMExceptionNameEnum.abortError
					);
		this[PropertySymbol.aborted] = true;
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
	public static abort(reason?: any): AbortSignal {
		const signal = new this();
		signal[PropertySymbol.reason] =
			reason !== undefined
				? reason
				: new this[PropertySymbol.window].DOMException(
						'signal is aborted without reason',
						DOMExceptionNameEnum.abortError
					);
		signal[PropertySymbol.aborted] = true;
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
		const signal = new this();
		window.setTimeout(() => {
			signal[PropertySymbol.abort](
				new window.DOMException('signal timed out', DOMExceptionNameEnum.timeoutError)
			);
		}, time);
		return signal;
	}

	/**
	 * Takes an iterable of abort signals and returns an AbortSignal that is
	 * aborted when any of the input iterable abort signals are aborted.
	 *
	 * The abort reason will be set to the reason of the first signal that is
	 * aborted. If any of the given abort signals are already aborted then so will
	 * be the returned AbortSignal.
	 *
	 * @param [signals] Iterable of abort signals.
	 * @returns AbortSignal instance.
	 */
	public static any(signals: AbortSignal[]): AbortSignal {
		for (const signal of signals) {
			if (signal[PropertySymbol.aborted]) {
				return this.abort(signal[PropertySymbol.reason]);
			}
		}

		const anySignal = new this();
		const handlers = new Map<AbortSignal, () => void>();

		const stopListening = (): void => {
			for (const signal of signals) {
				signal.removeEventListener('abort', handlers.get(signal));
			}
		};

		for (const signal of signals) {
			const handler = (): void => {
				stopListening();
				anySignal[PropertySymbol.abort](signal[PropertySymbol.reason]);
			};
			handlers.set(signal, handler);
			signal.addEventListener('abort', handler);
		}

		return anySignal;
	}
}
