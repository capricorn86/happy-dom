import IHeadersInit from '../../fetch/types/IHeadersInit.js';
import BrowserWindow from '../../window/BrowserWindow.js';

/**
 * Reload options.
 */
export default interface IReloadOptions {
	/**
	 * Set to true to bypass the cache.
	 */
	hard?: boolean;

	/**
	 * Timeout in ms. Default is 30000ms.
	 */
	timeout?: number;

	/**
	 * Callback is called before content is loaded into the document.
	 */
	beforeContentCallback?: (window: BrowserWindow) => void;

	/**
	 * Request headers.
	 */
	headers?: IHeadersInit | null;
}
