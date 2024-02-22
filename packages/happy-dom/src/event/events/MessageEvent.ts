import IBrowserWindow from '../../window/IBrowserWindow.js';
import Event from '../Event.js';
import IMessagePort from '../IMessagePort.js';
import IMessageEventInit from './IMessageEventInit.js';

/**
 * Message event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent
 */
export default class MessageEvent extends Event {
	public readonly data: unknown | null;
	public readonly origin: string;
	public readonly lastEventId: string;
	public readonly source: IBrowserWindow | null;
	public readonly ports: IMessagePort[];

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IMessageEventInit | null = null) {
		super(type, eventInit);

		this.data = eventInit?.data ?? null;
		this.origin = eventInit?.origin ?? '';
		this.lastEventId = eventInit?.lastEventId ?? '';
		this.source = eventInit?.source ?? null;
		this.ports = eventInit?.ports ?? [];
	}
}
