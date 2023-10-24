import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IWindow from '../../window/IWindow.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';
import IBrowserPage from './IBrowserPage.js';

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
	 * Aborts all ongoing operations and destroys the frame.
	 */
	destroy(): void;

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	setViewport(viewport: IBrowserPageViewport): void;

	/**
	 * Creates a new frame.
	 *
	 * @returns Frame.
	 */
	newFrame(): IBrowserFrame;

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	goto(url: string): Promise<void>;
}
