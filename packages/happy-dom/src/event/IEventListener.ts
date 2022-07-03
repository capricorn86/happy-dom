import Event from './Event';

/**
 * Event listener.
 */
export default interface IEventListener {
	/**
	 * Handles event.
	 *
	 * @param event
	 */
	handleEvent(event: Event): void;
}
