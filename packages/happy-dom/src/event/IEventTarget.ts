import Event from './Event';

/**
 * Handles events.
 */
export default interface IEventTarget {
	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	addEventListener(type: string, listener: (event: Event) => void): void;

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	removeEventListener(type: string, listener: (event: Event) => void): void;

	/**
	 * Dispatches an event.
	 *
	 * @param event Event.
	 * @return The return value is false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault()
	 */
	dispatchEvent(event: Event): boolean;
}
