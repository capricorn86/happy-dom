import Event from '../Event.js';
import IPopStateEventInit from './IPopStateEventInit.js';

/**
 *
 */
export default class PopStateEvent extends Event {
	public readonly state: object | null;
	public readonly hasUAVisualTransition: boolean;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IPopStateEventInit | null = null) {
		super(type);

		this.state = eventInit?.state ?? null;
		this.hasUAVisualTransition = eventInit?.hasUAVisualTransition ?? false;
	}
}
