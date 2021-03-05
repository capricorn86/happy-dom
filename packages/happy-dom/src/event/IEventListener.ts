import Event from './Event';

/**
 * Event listener.
 */
export default interface IEventListener {
	/**
	 * Handles event.
	 *
	 * @param type Event type.
	 */
	handleEvent(event: Event): void;
}
