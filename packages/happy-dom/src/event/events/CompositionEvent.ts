import UIEvent from '../UIEvent.js';
import type ICompositionEventInit from './ICompositionEventInit.js';

/**
 * Composition event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
 */
export default class CompositionEvent extends UIEvent {
	public readonly data: string;

	/**
	 * Constructor.
	 *
	 * @param type Event type.
	 * @param [eventInit] Event init.
	 */
	constructor(type: string, eventInit: ICompositionEventInit | null = null) {
		super(type, eventInit);

		this.data = eventInit?.data ?? '';
	}
}
