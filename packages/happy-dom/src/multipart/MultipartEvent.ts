import Event from '../event/Event';
import IMultipartEventInit from './IMultipartEventInit';

/**
 * Multipart event.
 */
export default class MultipartEvent extends Event {
	public readonly data: Uint8Array | null = null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IMultipartEventInit = null) {
		super(type, eventInit);

		if (eventInit) {
			this.data = eventInit.data || null;
		}
	}
}
