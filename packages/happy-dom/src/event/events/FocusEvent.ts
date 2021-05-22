import UIEvent from '../UIEvent';
import EventTarget from '../EventTarget';
import IFocusEventInit from './IFocusEventInit';

/**
 *
 */
export default class FocusEvent extends UIEvent {
	public readonly relatedTarget: EventTarget = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IFocusEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.relatedTarget = eventInit.relatedTarget || null;
		}
	}
}
