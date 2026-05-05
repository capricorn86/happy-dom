import type AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import type * as PropertySymbol from '../../PropertySymbol.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import type Document from '../../nodes/document/Document.js';
import type IBrowserPage from './IBrowserPage.js';
import type Response from '../../fetch/Response.js';
import type IGoToOptions from './IGoToOptions.js';
import type { Script } from 'vm';
import type IReloadOptions from './IReloadOptions.js';
import type CrossOriginBrowserWindow from '../../window/CrossOriginBrowserWindow.js';
import type HistoryItemList from '../../history/HistoryItemList.js';

/**
 * Browser frame.
 */
export default interface IBrowserFrame {
	readonly childFrames: IBrowserFrame[];
	readonly parentFrame: IBrowserFrame | null;
	readonly page: IBrowserPage;
	readonly window: BrowserWindow;
	readonly document: Document;
	readonly closed: boolean;
	content: string;
	url: string;
	[PropertySymbol.history]: HistoryItemList;
	[PropertySymbol.asyncTaskManager]: AsyncTaskManager;
	[PropertySymbol.listeners]: { navigation: Array<() => void> };
	[PropertySymbol.openerFrame]: IBrowserFrame | null;
	[PropertySymbol.openerWindow]: BrowserWindow | CrossOriginBrowserWindow | null;
	[PropertySymbol.popup]: boolean;

	/**
	 * Returns a promise that is resolved when all resources has been loaded, fetch has completed, and all async tasks such as timers are complete.
	 */
	waitUntilComplete(): Promise<void>;

	/**
	 * Returns a promise that is resolved when the frame has navigated and the response HTML has been written to the document.
	 */
	waitForNavigation(): Promise<void>;

	/**
	 * Aborts all ongoing operations.
	 */
	abort(): Promise<void>;

	/**
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	evaluate(script: string | Script): any;

	/**
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	evaluate(script: string | Script): any;

	/**
	 * Evaluates a module in the frame's context.
	 *
	 * @param options Options.
	 * @param options.url URL.
	 * @param options.type Module type.
	 * @param options.code Code.
	 * @returns Module exports.
	 */
	evaluateModule(options: {
		url?: string;
		type?: 'esm' | 'css' | 'json';
		code?: string;
	}): Promise<Record<string, any>>;

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 */
	goto(url: string, options?: IGoToOptions): Promise<Response | null>;

	/**
	 * Navigates back in history.
	 *
	 * @param [options] Options.
	 */
	goBack(options?: IGoToOptions): Promise<Response | null>;

	/**
	 * Navigates forward in history.
	 *
	 * @param [options] Options.
	 */
	goForward(options?: IGoToOptions): Promise<Response | null>;

	/**
	 * Navigates a delta in history.
	 *
	 * @param steps Steps.
	 * @param [options] Options.
	 */
	goSteps(steps?: number, options?: IGoToOptions): Promise<Response | null>;

	/**
	 * Reloads the current frame.
	 *
	 * @param [options] Options.
	 */
	reload(options: IReloadOptions): Promise<Response | null>;
}
