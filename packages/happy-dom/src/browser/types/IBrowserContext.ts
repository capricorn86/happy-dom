import type ICookieContainer from '../../cookie/ICookieContainer.js';
import type IResponseCache from '../../fetch/cache/response/IResponseCache.js';
import type IBrowser from './IBrowser.js';
import type IBrowserPage from './IBrowserPage.js';
import type IPreflightResponseCache from '../../fetch/cache/preflight/IPreflightResponseCache.js';
import type * as PropertySymbol from '../../PropertySymbol.js';
import type IECMAScriptModuleCachedResult from '../../module/types/IECMAScriptModuleCachedResult.js';

/**
 * Browser context.
 */
export default interface IBrowserContext {
	readonly pages: IBrowserPage[];
	readonly browser: IBrowser;
	readonly cookieContainer: ICookieContainer;
	readonly responseCache: IResponseCache;
	readonly preflightResponseCache: IPreflightResponseCache;
	readonly closed: boolean;
	readonly [PropertySymbol.moduleCache]: Map<string, IECMAScriptModuleCachedResult>;

	/**
	 * Aborts all ongoing operations and destroys the context.
	 */
	close(): Promise<void>;

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 *
	 * @returns Promise.
	 */
	waitUntilComplete(): Promise<void>;

	/**
	 * Aborts all ongoing operations.
	 */
	abort(): Promise<void>;

	/**
	 * Creates a new page.
	 *
	 * @returns Page.
	 */
	newPage(): IBrowserPage;
}
