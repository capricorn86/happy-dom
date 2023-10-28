import IWindow from '../../window/IWindow.js';
import DetachedBrowserPage from './DetachedBrowserPage.js';
import AsyncTaskManager from '../../async-task-manager/AsyncTaskManager.js';
import IBrowserFrame from '../types/IBrowserFrame.js';
import IBrowserPageViewport from '../types/IBrowserPageViewport.js';
import Event from '../../event/Event.js';
import Location from '../../location/Location.js';
import WindowBrowserSettingsReader from '../../window/WindowBrowserSettingsReader.js';
import DocumentReadyStateManager from '../../nodes/document/DocumentReadyStateManager.js';
import WindowErrorUtility from '../../window/WindowErrorUtility.js';
import IResponse from '../../fetch/types/IResponse.js';

/**
 * Browser frame.
 */
export default class DetachedBrowserFrame implements IBrowserFrame {
	public readonly childFrames: DetachedBrowserFrame[] = [];
	public readonly parentFrame: DetachedBrowserFrame | null = null;
	public readonly page: DetachedBrowserPage;
	public readonly window: IWindow;
	public _asyncTaskManager = new AsyncTaskManager();
	#windowClass: new () => IWindow;

	/**
	 * Constructor.
	 *
	 * @param windowClass Window class.
	 * @param window Window.
	 * @param page Page.
	 */
	constructor(windowClass: new () => IWindow, window: IWindow, page: DetachedBrowserPage) {
		this.#windowClass = windowClass;
		this.window = window;
		this.page = page;
	}

	/**
	 * Returns the content.
	 *
	 * @returns Content.
	 */
	public get content(): string {
		return this.window.document.documentElement.outerHTML;
	}

	/**
	 * Sets the content.
	 *
	 * @param content Content.
	 */
	public set content(content) {
		this.window.document['_isFirstWrite'] = true;
		this.window.document['_isFirstWriteAfterOpen'] = true;
		this.window.document.write(content);
	}

	/**
	 * Returns the URL.
	 *
	 * @returns URL.
	 */
	public get url(): string {
		return this.window.location.href;
	}

	/**
	 * Sets the content.
	 *
	 * @param url URL.
	 */
	public set url(url) {
		(<Location>this.window.location) = new Location(url);
	}

	/**
	 * Returns a promise that is resolved when all async tasks are complete.
	 *
	 * @returns Promise.
	 */
	public async whenComplete(): Promise<void> {
		await this._asyncTaskManager.whenComplete();
	}

	/**
	 * Aborts all ongoing operations.
	 */
	public abort(): void {
		for (const frame of this.childFrames) {
			frame.abort();
		}
		this._asyncTaskManager.abortAll();
	}

	/**
	 * Aborts all ongoing operations and destroys the frame.
	 */
	public destroy(): void {
		if (this.parentFrame) {
			const index = this.parentFrame.childFrames.indexOf(this);
			if (index !== -1) {
				this.parentFrame.childFrames.splice(index, 1);
			}
		}
		for (const frame of this.childFrames) {
			frame.destroy();
		}
		(<boolean>this.window.closed) = true;
		WindowBrowserSettingsReader.removeSettings(this.window);
		this._asyncTaskManager.destroy();
		(<DetachedBrowserPage>this.page) = null;
		(<IWindow>this.window) = null;
	}

	/**
	 * Sets the viewport.
	 *
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: IBrowserPageViewport): void {
		if (
			(viewport.width !== undefined && this.window.innerWidth !== viewport.width) ||
			(viewport.height !== undefined && this.window.innerHeight !== viewport.height)
		) {
			if (viewport.width !== undefined && this.window.innerWidth !== viewport.width) {
				(<number>this.window.innerWidth) = viewport.width;
				(<number>this.window.outerWidth) = viewport.width;
			}

			if (viewport.height !== undefined && this.window.innerHeight !== viewport.height) {
				(<number>this.window.innerHeight) = viewport.height;
				(<number>this.window.outerHeight) = viewport.height;
			}

			this.window.dispatchEvent(new Event('resize'));
		}
	}

	/**
	 * Creates a new frame.
	 *
	 * @returns Frame.
	 */
	public newFrame(): IBrowserFrame {
		const frame = new DetachedBrowserFrame(this.#windowClass, new this.#windowClass(), this.page);
		(<DetachedBrowserFrame>frame.parentFrame) = this;
		this.childFrames.push(frame);
		return frame;
	}

	/**
	 * Go to a page.
	 *
	 * @param url URL.
	 */
	public async goto(url: string): Promise<IResponse | null> {
		await Promise.all(this.childFrames.map((frame) => frame.destroy()));

		this._asyncTaskManager.abortAll();

		const readyStateManager = new DocumentReadyStateManager(this.window);
		(<{ _readyStateManager: DocumentReadyStateManager }>(<unknown>this.window))._readyStateManager =
			readyStateManager;

		readyStateManager.startTask();

		this.url = url;

		let response: IResponse;
		let responseText: string;

		try {
			response = await this.window.fetch(url);
			responseText = await response.text();
		} catch (error) {
			this.content = '';
			readyStateManager.endTask();
			WindowErrorUtility.dispatchError(this.window, error);
			return response || null;
		}

		this.window.document.write(responseText);
		readyStateManager.endTask();

		return response;
	}
}
