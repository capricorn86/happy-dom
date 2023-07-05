import Event from './Event.js';

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
