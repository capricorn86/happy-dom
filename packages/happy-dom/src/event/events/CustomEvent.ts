import Event from '../Event';
import ICustomEventInit from './ICustomEventInit';

/**
 *
 */
export default class CustomEvent extends Event {
	public detail: object = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: ICustomEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.detail = eventInit.detail || null;
		}
	}
}
