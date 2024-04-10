import IRequestReferrerPolicy from '../../fetch/types/IRequestReferrerPolicy.js';
import IReloadOptions from './IReloadOptions.js';

/**
 * Go to options.
 */
export default interface IGoToOptions extends IReloadOptions {
	/**
	 * Referrer.
	 */
	referrer?: string;

	/**
	 * Referrer policy.
	 */
	referrerPolicy?: IRequestReferrerPolicy;
	/**
	 * If `srcdoc` is set, it can be used to replace the data obtained by fetch.
	 */
	substituteData?: string;
}
