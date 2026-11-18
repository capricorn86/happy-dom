import EventTarget from '../event/EventTarget.js';
import type BrowserWindow from './BrowserWindow.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import type DOMException from '../exception/DOMException.js';
import type Location from '../location/Location.js';
import * as PropertySymbol from '../PropertySymbol.js';
import type IBrowserFrameWindowAccess from '../browser/types/IBrowserFrameWindowAccess.js';
import type IBrowserFrame from '../browser/types/IBrowserFrame.js';

/**
 * Browser window with limited access due to CORS restrictions in iframes.
 */
export default class CrossOriginBrowserWindow
	extends EventTarget
	implements CrossOriginBrowserWindow
{
	public readonly window = this;
	public readonly location: Location;

	// Internal properties
	public [PropertySymbol.self]: CrossOriginBrowserWindow | null = this;
	public [PropertySymbol.parent]: BrowserWindow | CrossOriginBrowserWindow | null = null;

	// Private properties
	#targetFrame: IBrowserFrame;
	#sourceAccess: IBrowserFrameWindowAccess | null;

	/**
	 * Constructor.
	 *
	 * The window references in the options should be restricted based on the origin of the window that is given access to the target window, and not the origin of the target window.
	 *
	 * @param sourceAccess Source access.
	 * @param targetFrame Target frame.
	 */
	constructor(targetFrame: IBrowserFrame, sourceAccess?: IBrowserFrameWindowAccess) {
		super();

		this.#targetFrame = targetFrame;
		this.#sourceAccess = sourceAccess || null;

		this.location = <Location>new Proxy(
			{},
			{
				get: () => {
					throw this.#createBlockedOriginException();
				},
				set: () => {
					throw this.#createBlockedOriginException();
				}
			}
		);
	}

	/**
	 * Returns self.
	 *
	 * @returns Self.
	 */
	public get self(): CrossOriginBrowserWindow {
		return <CrossOriginBrowserWindow>this[PropertySymbol.self];
	}

	/**
	 * Returns self.
	 *
	 * @param self Self.
	 */
	public set self(self: CrossOriginBrowserWindow | null) {
		this[PropertySymbol.self] = self;
	}

	/**
	 * Returns top.
	 *
	 * @returns Top.
	 */
	public get top(): BrowserWindow | CrossOriginBrowserWindow {
		return <BrowserWindow>this.#targetFrame[PropertySymbol.access].top?.window;
	}

	/**
	 * Returns parent.
	 *
	 * @returns Parent.
	 */
	public get parent(): BrowserWindow | CrossOriginBrowserWindow {
		return <BrowserWindow>(
			(this[PropertySymbol.parent] || this.#targetFrame[PropertySymbol.access].parent?.window)
		);
	}

	/**
	 * Returns parent.
	 *
	 * @param parent Parent.
	 */
	public set parent(parent: BrowserWindow | null) {
		this[PropertySymbol.parent] = parent;
	}

	/**
	 * Returns the opener.
	 *
	 * @returns Opener.
	 */
	public get opener(): BrowserWindow | CrossOriginBrowserWindow | null {
		return this.#targetFrame[PropertySymbol.access].opener?.window || null;
	}

	/**
	 * Returns the closed state.
	 *
	 * @returns Closed state.
	 */
	public get closed(): boolean {
		return this.#targetFrame.window.closed;
	}

	/**
	 * Shifts focus away from the window.
	 */
	public blur(): void {
		this.#targetFrame.window.blur();
	}

	/**
	 * Gives focus to the window.
	 */
	public focus(): void {
		this.#targetFrame.window.focus();
	}

	/**
	 * Closes the window.
	 */
	public close(): void {
		this.#targetFrame.window.close();
	}

	/**
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param [targetOrigin=*] Target origin.
	 * @param [_transfer] Transfer. Not implemented.
	 */
	public postMessage(message: unknown, targetOrigin = '*', _transfer?: unknown[]): void {
		if (!this.#sourceAccess) {
			throw this.#createBlockedOriginException();
		}
		this.#targetFrame.window[PropertySymbol.postMessage](message, targetOrigin, this.#sourceAccess);
	}

	/**
	 * Creates a DOMException for blocked cross-origin access.
	 *
	 * @returns DOMException.
	 */
	#createBlockedOriginException(): DOMException {
		const frame = this.#targetFrame;
		const sourceFrame = frame.parentFrame || frame[PropertySymbol.access].opener?.frame;
		if (!sourceFrame) {
			return new this.#targetFrame.window.DOMException(
				`Blocked a frame from accessing a cross-origin frame.`,
				DOMExceptionNameEnum.securityError
			);
		}
		return new this.#targetFrame.window.DOMException(
			`Blocked a frame with origin "${sourceFrame.url}" from accessing a cross-origin frame.`,
			DOMExceptionNameEnum.securityError
		);
	}
}
