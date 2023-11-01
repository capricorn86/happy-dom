import IRequestReferrerPolicy from '../../fetch/types/IRequestReferrerPolicy.js';

/**
 * Go to options.
 */
export default interface IGoToOptions {
	referrer?: string;
	referrerPolicy?: IRequestReferrerPolicy;
}
