import EventTarget from '../../event/EventTarget.js';
import IWindow from '../../window/IWindow.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Location from '../../location/Location.js';

/**
 * Browser window with limited access due to CORS restrictions in iframes.
 */
export default class IFrameCrossOriginWindow extends EventTarget {
	public readonly self = this;
	public readonly window = this;
	public readonly parent: IWindow;
	public readonly top: IWindow;
	public readonly location: Location;

	private _targetWindow: IWindow;

	/**
	 * Constructor.
	 *
	 * @param parent Parent window.
	 * @param target Target window.
	 */
	constructor(parent: IWindow, target: IWindow) {
		super();

		this.parent = parent;
		this.top = parent;
		this.location = <Location>new Proxy(
			{},
			{
				get: () => {
					throw new DOMException(
						`Blocked a frame with origin "${this.parent.location.origin}" from accessing a cross-origin frame.`,
						DOMExceptionNameEnum.securityError
					);
				},
				set: () => {
					throw new DOMException(
						`Blocked a frame with origin "${this.parent.location.origin}" from accessing a cross-origin frame.`,
						DOMExceptionNameEnum.securityError
					);
				}
			}
		);
		this._targetWindow = target;
	}

	/**
	 * Safely enables cross-origin communication between Window objects; e.g., between a page and a pop-up that it spawned, or between a page and an iframe embedded within it.
	 *
	 * @param message Message.
	 * @param [targetOrigin=*] Target origin.
	 * @param transfer Transfer. Not implemented.
	 */
	public postMessage(message: unknown, targetOrigin = '*', transfer?: unknown[]): void {
		this._targetWindow.postMessage(message, targetOrigin, transfer);
	}
}
