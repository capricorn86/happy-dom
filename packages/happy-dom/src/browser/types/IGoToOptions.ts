import type { TRequestReferrerPolicy } from '../../fetch/types/TRequestReferrerPolicy.js';
import type IReloadOptions from './IReloadOptions.js';

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
	referrerPolicy?: TRequestReferrerPolicy;
}
