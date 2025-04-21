import IRequestReferrerPolicy from '../../fetch/types/IRequestReferrerPolicy.js';
import BrowserWindow from '../../window/BrowserWindow.js';
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
	 * Callback is called before content is loaded into the document.
	 */
	beforeContentCallback?: (window: BrowserWindow) => void;
}
