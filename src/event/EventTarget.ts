import Event from './Event';

/**
 * Handles events.
 */
export default abstract class EventTarget {
	private readonly _listeners: { [k: string]: ((event: Event) => void)[] } = {};

	/**
	 * Adds an event listener.
	 *
	 * @param {string} type Event type.
	 * @param {function} listener Listener.
	 */
	public addEventListener(type: string, listener: (event: Event) => void): void {
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push(listener);
	}

	/**
	 * Adds an event listener.
	 *
	 * @param {string} type Event type.
	 * @param {function} listener Listener.
	 */
	public removeEventListener(type: string, listener: (event: Event) => void): void {
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
	 * @param {Event} event Event.
	 * @return {boolean} The return value is false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault()
	 */
	public dispatchEvent(event: Event): boolean {
		let returnValue = true;

		if (this._listeners[event.type]) {
			for (const listener of this._listeners[event.type]) {
				listener(event);
				if (event.cancelable && event.defaultPrevented) {
					returnValue = false;
				}
				if (event._immediatePropagationStopped) {
					return returnValue;
				}
			}
		}

		return returnValue;
	}
}
