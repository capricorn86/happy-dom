import IWindow from '../../window/IWindow';
import Event from '../Event';
import IMessagePort from '../IMessagePort';
import IMessageEventInit from './IMessageEventInit';

/**
 * Message event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
 */
export default class MessageEvent extends Event {
	public data?: unknown | null = null;
	public origin?: string = '';
	public lastEventId?: string = '';
	public source?: IWindow | null = null;
	public ports?: IMessagePort[] = [];

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit?: IMessageEventInit) {
		super(type, eventInit);
		this.data = eventInit?.data !== undefined ? eventInit.data : null;
		this.origin = eventInit?.origin || '';
		this.lastEventId = eventInit?.lastEventId || '';
		this.source = eventInit?.source || null;
		this.ports = eventInit?.ports || [];
	}
}
