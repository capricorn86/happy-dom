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

	/**
	 * Indicates whether the document should inherit the origin of the parent or opener frame.
	 *
	 * The origin is captured when the navigation starts and is stored in the history entry.
	 */
	inheritOrigin?: boolean;
}
