import IDocument from '../nodes/document/IDocument.js';
import IWindow from '../window/IWindow.js';
import Event from '../event/Event.js';
import Window from '../window/Window.js';
import IBrowserContextOptions from './IBrowserContextOptions.js';
import IBrowserContextSettings from './IBrowserContextSettings.js';
import AsyncTaskManager from '../async-task-manager/AsyncTaskManager.js';
import VirtualConsolePrinter from '../console/VirtualConsolePrinter.js';

/**
 * Browser context.
 */
export default class BrowserContext {
	public window: IWindow;
	public document: IDocument;
	public settings: IBrowserContextSettings;
	public consolePrinter: VirtualConsolePrinter | null;
	private _asyncTaskManager = new AsyncTaskManager();

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 */
	constructor(options?: IBrowserContextOptions) {
		this.window = new Window(options);
		this.document = this.window.document;

		if (options?.html) {
			this.document.write(options.html);
		}

		if (options?.ownerBrowserContext) {
			(<IWindow>this.window.top) = options.ownerBrowserContext.window;
			(<IWindow>this.window.parent) = options.ownerBrowserContext.window;
			(<IWindow>this.window.opener) = options.ownerBrowserContext.window;
		}
	}

	/**
	 * Aborts asynchronous tasks and destroys the context.
	 *
	 * @returns Promise.
	 */
	public async destroy(): Promise<void> {
		await this.abortAsyncTasks();
		this.window = null;
		this.document = null;
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenAsyncTasksComplete(): Promise<void> {
		await this._asyncTaskManager.whenComplete();
	}

	/**
	 * Aborts all async tasks.
	 *
	 * @returns Promise.
	 */
	public async abortAsyncTasks(): Promise<void> {
		this._asyncTaskManager.cancelAll();
	}

	/**
	 * Sets the window size and triggers a resize event.
	 *
	 * @param options Options.
	 * @param options.width Width.
	 * @param options.height Height.
	 */
	public resizeWindow(options: { width?: number; height?: number }): void {
		if (
			(options.width !== undefined && this.window.innerWidth !== options.width) ||
			(options.height !== undefined && this.window.innerHeight !== options.height)
		) {
			if (options.width !== undefined && this.window.innerWidth !== options.width) {
				(<number>this.window.innerWidth) = options.width;
				(<number>this.window.outerWidth) = options.width;
			}

			if (options.height !== undefined && this.window.innerHeight !== options.height) {
				(<number>this.window.innerHeight) = options.height;
				(<number>this.window.outerHeight) = options.height;
			}

			this.window.dispatchEvent(new Event('resize'));
		}
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<void> {
		this.window.location.href = url;

		const response = await this.window.fetch(url);
		const responseText = await response.text();

		this.document.write(responseText);
	}
}
