import Event from '../Event.js';
import type IPageTransitionEventInit from './IPageTransitionEventInit.js';

/**
 * Page transition event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/PageTransitionEvent
 */
export default class PageTransitionEvent extends Event {
	public readonly persisted: boolean;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: IPageTransitionEventInit | null = null) {
		super(type, eventInit);

		this.persisted = eventInit?.persisted ?? false;
	}
}
