import IBrowserWindow from './IBrowserWindow.js';
import Location from '../url/Location.js';
import IEventTarget from '../event/IEventTarget.js';

/**
 * Browser window with limited access due to CORS restrictions in iframes.
 */
export default interface ICrossOriginBrowserWindow extends IEventTarget {
	readonly self: ICrossOriginBrowserWindow;
	readonly window: ICrossOriginBrowserWindow;
	readonly parent: IBrowserWindow | ICrossOriginBrowserWindow;
	readonly top: IBrowserWindow | ICrossOriginBrowserWindow;
	readonly location: Location;
	readonly opener: IBrowserWindow | ICrossOriginBrowserWindow | null;
	readonly closed: boolean;

	/**
	 * Shifts focus away from the window.
	 */
	blur(): void;

	/**
	 * Gives focus to the window.
	 */
	focus(): void;

	/**
	 * Closes the window.
	 */
	close(): void;

	/**
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param [targetOrigin=*] Target origin.
	 * @param transfer Transfer. Not implemented.
	 */
	postMessage(message: unknown, targetOrigin?: string, transfer?: unknown[]): void;
}
