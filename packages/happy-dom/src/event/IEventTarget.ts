import IEventListener from './IEventListener.js';
import Event from './Event.js';
import IEventListenerOptions from './IEventListenerOptions.js';

/**
 * Handles events.
 */
export default interface IEventTarget {
	/**
	 * Return a default description for the EventTarget class.
	 */
	[Symbol.toStringTag]: string;

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	addEventListener(
		type: string,
		listener: ((event: Event) => void) | IEventListener,
		options?: boolean | IEventListenerOptions
	): void;

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	removeEventListener(type: string, listener: ((event: Event) => void) | IEventListener): void;

	/**
	 * Dispatches an event.
	 *
	 * @param event Event.
	 * @returns The return value is false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault().
	 */
	dispatchEvent(event: Event): boolean;

	/**
	 * Adds an event listener.
	 *
	 * This is only supported by IE8- and Opera, but for some reason React uses it and calls it, so therefore we will keep support for it until they stop using it.
	 *
	 * @deprecated
	 * @param type Event type.
	 * @param listener Listener.
	 */
	attachEvent(type: string, listener: ((event: Event) => void) | IEventListener): void;

	/**
	 * Removes an event listener.
	 *
	 * This is only supported by IE8- and Opera, but for some reason React uses it and calls it, so therefore we will keep support for it until they stop using it.
	 *
	 * @deprecated
	 * @param type Event type.
	 * @param listener Listener.
	 */
	detachEvent(type: string, listener: ((event: Event) => void) | IEventListener): void;
}
