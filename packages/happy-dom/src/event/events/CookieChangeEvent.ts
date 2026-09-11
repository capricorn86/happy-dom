import Event from '../Event.js';
import type ICookieChangeEventInit from './ICookieChangeEventInit.js';
import type ICookieStoreItem from '../../cookie-store/ICookieStoreItem.js';

/**
 * CookieChangeEvent.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CookieChangeEvent
 */
export default class CookieChangeEvent extends Event {
	public readonly changed: ICookieStoreItem[];
	public readonly deleted: ICookieStoreItem[];

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: ICookieChangeEventInit | null = null) {
		super(type, eventInit);
		this.changed = eventInit?.changed ?? [];
		this.deleted = eventInit?.deleted ?? [];
	}
}
