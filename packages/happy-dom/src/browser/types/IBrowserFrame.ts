import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IWindow from '../../window/IWindow.js';
import IBrowserPage from './IBrowserPage.js';
import IResponse from '../../fetch/types/IResponse.js';
import IGoToOptions from './IGoToOptions.js';

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
	readonly page: IBrowserPage | null;

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
	 * Go to a page.
	 *
	 * @param url URL.
	 * @param [options] Options.
	 */
	goto(url: string, options?: IGoToOptions): Promise<IResponse | null>;
}
