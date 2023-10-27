import IWindow from './IWindow.js';
import Location from '../location/Location.js';
import IEventTarget from '../event/IEventTarget.js';

/**
 * Browser window with limited access due to CORS restrictions in iframes.
 */
export default interface ICrossOriginWindow extends IEventTarget {
	readonly self: ICrossOriginWindow;
	readonly window: ICrossOriginWindow;
	readonly parent: IWindow | ICrossOriginWindow;
	readonly top: IWindow | ICrossOriginWindow;
	readonly location: Location;

	/**
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param [targetOrigin=*] Target origin.
	 * @param transfer Transfer. Not implemented.
	 */
	postMessage(message: unknown, targetOrigin?: string, transfer?: unknown[]): void;
}
