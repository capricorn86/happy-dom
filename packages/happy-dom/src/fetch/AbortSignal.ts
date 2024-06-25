import EventTarget from '../event/EventTarget.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Event from '../event/Event.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import DOMException from '../exception/DOMException.js';

/**
 * AbortSignal.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
 */
export default class AbortSignal extends EventTarget {
	public readonly aborted: boolean = false;
	public readonly reason: Error | null = null;
	public onabort: ((this: AbortSignal, event: Event) => void) | null = null;

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
			new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError);
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
		const signal = new AbortSignal();
		(<Error>signal.reason) =
			reason ||
			new DOMException('signal is aborted without reason', DOMExceptionNameEnum.abortError);
		(<boolean>signal.aborted) = true;
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
			if (signal.aborted) {
				return AbortSignal.abort(signal.reason);
			}
		}

		const anySignal = new AbortSignal();
		const handlers = new Map<AbortSignal, () => void>();

		const stopListening = (): void => {
			for (const signal of signals) {
				signal.removeEventListener('abort', handlers.get(signal));
			}
		};

		for (const signal of signals) {
			const handler = (): void => {
				stopListening();
				anySignal[PropertySymbol.abort](signal.reason);
			};
			handlers.set(signal, handler);
			signal.addEventListener('abort', handler);
		}

		return anySignal;
	}
}
