import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import IDocument from '../../nodes/document/IDocument.js';
import IBrowserPage from './IBrowserPage.js';
import IResponse from '../../fetch/types/IResponse.js';
import IGoToOptions from './IGoToOptions.js';
import { Script } from 'vm';
import IReloadOptions from './IReloadOptions.js';
import BrowserFrameExceptionObserver from '../utilities/BrowserFrameExceptionObserver.js';

/**
 * Browser frame.
 */
export default interface IBrowserFrame {
	readonly childFrames: IBrowserFrame[];
	readonly window: IBrowserWindow;
	readonly document: IDocument;
	content: string;
	url: string;
	readonly parentFrame: IBrowserFrame | null;
	readonly opener: IBrowserFrame | null;
	[PropertySymbol.asyncTaskManager]: AsyncTaskManager;
	[PropertySymbol.exceptionObserver]: BrowserFrameExceptionObserver | null;
	readonly page: IBrowserPage;

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	whenComplete(): Promise<void>;

	/**
	 * Aborts all ongoing operations.
	 */
	abort(): Promise<void>;

	/**
	 * Evaluates code or a VM Script in the page's context.
	 *
	 * @param script Script.
	 * @returns Result.
	 */
	evaluate(script: string | Script): any;

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 */
	goto(url: string, options?: IGoToOptions): Promise<IResponse | null>;

	/**
	 * Reloads the current frame.
	 *
	 * @param [options] Options.
	 * @returns Response.
	 */
	reload(options: IReloadOptions): Promise<IResponse | null>;
}
