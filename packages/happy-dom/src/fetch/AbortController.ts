import AbortSignal from './AbortSignal.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * AbortController.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 */
export default class AbortController {
	public readonly signal: AbortSignal = new AbortSignal();

	/**
	 * Constructor.
	 */
	constructor() {
		this.signal = new AbortSignal();
	}

	/**
	 * Aborts the signal.
	 *
	 * @param [reason] Reason.
	 */
	public abort(reason?: string): void {
		this.signal[PropertySymbol.abort](reason);
	}
}
