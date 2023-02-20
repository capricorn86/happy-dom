import EventTarget from '../event/EventTarget';
import Event from '../event/Event';

/**
 * AbortSignal.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
 */
export default class AbortSignal extends EventTarget {
	public readonly aborted: boolean = false;
	public readonly reason: string | null = null;
	public onabort: ((this: AbortSignal, event: Event) => void) | null = null;

	/**
	 * Aborts the signal.
	 *
	 * @param [reason] Reason.
	 */
	public _abort(reason?: string): void {
		if (this.aborted) {
			return;
		}
		if (reason) {
			(<string>this.reason) = reason;
		}
		(<boolean>this.aborted) = true;
		this.dispatchEvent(new Event('abort'));
	}

	/**
	 * Returns an AbortSignal instance that has been set as aborted.
	 *
	 * @param [reason] Reason.
	 * @returns AbortSignal instance.
	 */
	public static abort(reason?: string): AbortSignal {
		const signal = new AbortSignal();
		if (reason) {
			(<string>signal.reason) = reason;
		}
		(<boolean>signal.aborted) = true;
		return signal;
	}
}
