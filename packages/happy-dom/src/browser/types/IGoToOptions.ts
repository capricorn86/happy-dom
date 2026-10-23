import type { TRequestReferrerPolicy } from '../../fetch/types/TRequestReferrerPolicy.js';
import type IReloadOptions from './IReloadOptions.js';
import type IBrowserFrame from './IBrowserFrame.js';

/**
 * Go to options.
 */
export default interface IGoToOptions extends IReloadOptions {
	/**
	 * Frame that initiates the navigation. Defaults to the frame being navigated.
	 *
	 * "about:blank" and "about:srcdoc" documents inherit the origin of the initiator.
	 */
	initiatorFrame?: IBrowserFrame;

	/**
	 * Referrer.
	 */
	referrer?: string;

	/**
	 * Referrer policy.
	 */
	referrerPolicy?: TRequestReferrerPolicy;
}
