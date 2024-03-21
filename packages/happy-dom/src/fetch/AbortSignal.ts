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
}
