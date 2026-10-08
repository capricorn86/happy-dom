import Event from '../Event.js';
import type IToggleEventInit from './IToggleEventInit.js';
import type Element from '../../nodes/element/Element.js';

/**
 * Toggle event.
 */
export default class ToggleEvent extends Event {
	public readonly oldState: string;
	public readonly newState: string;
	public readonly source: Element | null;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit?: IToggleEventInit) {
		super(type, eventInit);
		this.oldState = eventInit?.oldState ?? '';
		this.newState = eventInit?.newState ?? '';
		this.source = eventInit?.source ?? null;
	}
}
