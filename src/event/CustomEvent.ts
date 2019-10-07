import Event from './Event';
import ICustomEventInit from './ICustomEventInit';

export default class CustomEvent extends Event {
	public detail: object = null;

	/**
	 * Constructor.
	 *
	 * @param {string} type Event type.
	 * @param {ICustomEventInit} customEventInit Custom event init.
	 */
	constructor(type: string, customEventInit: ICustomEventInit = null) {
		super(type, customEventInit);
		if (customEventInit && customEventInit.detail) {
			this.detail = customEventInit.detail;
		}
	}
}
