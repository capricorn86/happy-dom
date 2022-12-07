import Event from './Event';

/**
 * Event listener.
 */
export default interface IEventListener {
	/**
	 * Handles event.
	 *
	 * @param event Event.
	 */
	handleEvent(event: Event): void;
}
