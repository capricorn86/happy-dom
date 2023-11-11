import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IWindow from '../../window/IWindow.js';
import IBrowserPage from './IBrowserPage.js';
import IResponse from '../../fetch/types/IResponse.js';
import IGoToOptions from './IGoToOptions.js';
import { Script } from 'vm';

/**
 * Browser frame.
 */
export default interface IBrowserFrame {
	readonly childFrames: IBrowserFrame[];
	readonly window: IWindow;
	content: string;
	url: string;
	readonly parentFrame: IBrowserFrame | null;
	readonly _asyncTaskManager: AsyncTaskManager;
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
	abort(): void;

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
}
