import IWindow from '../window/IWindow.js';
import IBrowserPageViewport from './IBrowserPageViewport.js';

/**
 * Browser frame.
 */
export default interface IBrowserFrame {
	readonly childFrames: IBrowserFrame[];
	detached: boolean;
	readonly window: IWindow;
	readonly content: string;

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	whenComplete(): Promise<void>;

	/**
	 * Aborts all ongoing operations.
	 *
	 * @returns Promise.
	 */
	abort(): Promise<void>;

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 *
	 * @returns Promise.
	 */
	destroy(): Promise<void>;

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	setViewport(viewport: IBrowserPageViewport): void;

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	goto(url: string): Promise<void>;
}
