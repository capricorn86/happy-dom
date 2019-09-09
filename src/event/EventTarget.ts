import Event from './Event';

/**
 * Handles events.
 */
export default class EventTarget {
	private readonly listeners: { [k: string]: ((event: Event) => void)[] } = {};

	/**
	 * Adds an event listener.
	 *
	 * @param {string} type Event type.
	 * @param {function} listener Listener.
	 */
	public addEventListener(type: string, listener: (event: Event) => void): void {
		this.listeners[type] = this.listeners[type] || [];
		this.listeners[type].push(listener);
	}

	/**
	 * Adds an event listener.
	 *
	 * @param {string} type Event type.
	 * @param {function} listener Listener.
	 */
	public removeEventListener(type: string, listener: (event: Event) => void): void {
		if (this.listeners[type]) {
			const index = this.listeners[type].indexOf(listener);
			if (index !== -1) {
				this.listeners[type].splice(index);
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
		let defaultPrevented = false;
		if (this.listeners[event.type]) {
			for (const listener of this.listeners[event.type]) {
				listener(event);
				if (event.cancelable && event.defaultPrevented) {
					defaultPrevented = true;
				}
				if (event.immediatePropagationStopped) {
					return !defaultPrevented;
				}
			}
		}
		return !defaultPrevented;
	}
}
