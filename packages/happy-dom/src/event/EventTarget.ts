import IEventListener from './IEventListener';
import Event from './Event';
import IEventTarget from './IEventTarget';

/**
 * Handles events.
 */
export default abstract class EventTarget implements IEventTarget {
	public readonly _listeners: {
		[k: string]: (((event: Event) => void) | IEventListener)[];
	} = {};

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	public addEventListener(type: string, listener: ((event: Event) => void) | IEventListener): void {
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push(listener);
	}

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	public removeEventListener(
		type: string,
		listener: ((event: Event) => void) | IEventListener
	): void {
		if (this._listeners[type]) {
			const index = this._listeners[type].indexOf(listener);
			if (index !== -1) {
				this._listeners[type].splice(index);
			}
		}
	}

	/**
	 * Dispatches an event.
	 *
	 * @param event Event.
	 * @returns The return value is false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault().
	 */
	public dispatchEvent(event: Event): boolean {
		if (!event.target) {
			event.target = this;
		}

		event.currentTarget = this;

		if (this._listeners[event.type]) {
			for (const listener of this._listeners[event.type]) {
				if ((<IEventListener>listener).handleEvent) {
					(<IEventListener>listener).handleEvent(event);
				} else {
					(<(event: Event) => void>listener)(event);
				}
				if (event._immediatePropagationStopped) {
					return !(event.cancelable && event.defaultPrevented);
				}
			}
		}

		return !(event.cancelable && event.defaultPrevented);
	}
}
