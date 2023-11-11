import IBrowserPageViewport from './IBrowserPageViewport.js';
import VirtualConsolePrinter from '../../console/VirtualConsolePrinter.js';
import IBrowserFrame from './IBrowserFrame.js';
import IBrowserContext from './IBrowserContext.js';
import { Script } from 'vm';
import IGoToOptions from './IGoToOptions.js';
import IResponse from '../../fetch/types/IResponse.js';

/**
 * Browser page.
 */
export default interface IBrowserPage {
	readonly virtualConsolePrinter: VirtualConsolePrinter;
	readonly mainFrame: IBrowserFrame;
	readonly context: IBrowserContext;
	readonly console: Console;
	readonly frames: IBrowserFrame[];
	content: string;
	url: string;

	/**
	 * Aborts all ongoing operations and destroys the page.
	 */
	close(): void;

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
	 */
	evaluate(script: string | Script): any;

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
	 * @param [options] Options.
	 */
	goto(url: string, options?: IGoToOptions): Promise<IResponse | null>;
}
