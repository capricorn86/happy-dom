import Event from '../Event.js';
import ICloseEventInit from './ICloseEventInit.js';

/**
 *
 */
export default class CloseEvent extends Event {
	public readonly code: number;
	public readonly reason: string;
	public readonly wasClean: boolean;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: ICloseEventInit | null = null) {
		super(type, eventInit);

		this.code = eventInit?.code ?? 0;
		this.reason = eventInit?.reason ?? '';
		this.wasClean = eventInit?.wasClean ?? false;
	}
}
