import Event from '../Event.js';
import ICustomEventInit from './ICustomEventInit.js';

/**
 *
 */
export default class CustomEvent extends Event {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public detail: any;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: ICustomEventInit | null = null) {
		super(type, eventInit);

		this.detail = eventInit?.detail ?? null;
	}

	/**
	 * Init event.
	 *
	 * @deprecated
	 * @param type Type.
	 * @param [bubbles=false] "true" if it bubbles.
	 * @param [cancelable=false] "true" if it cancelable.
	 * @param [detail=null] Custom event detail.
	 */
	public initCustomEvent(
		type: string,
		bubbles = false,
		cancelable = false,
		detail: object = null
	): void {
		this.type = type;
		this.bubbles = bubbles;
		this.cancelable = cancelable;
		this.detail = detail;
	}
}
