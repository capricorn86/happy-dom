import type { THeadersInit } from '../../fetch/types/THeadersInit.js';
import type BrowserWindow from '../../window/BrowserWindow.js';

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
	headers?: THeadersInit | null;
}
