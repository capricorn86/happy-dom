import IEventListener from './IEventListener';
import Event from './Event';
import IEventTarget from './IEventTarget';
import IEventListenerOptions from './IEventListenerOptions';

/**
 * Handles events.
 */
export default abstract class EventTarget implements IEventTarget {
	public readonly _listeners: {
		[k: string]: (((event: Event) => void) | IEventListener)[];
	} = {};
	public readonly _listenerOptions: {
		[k: string]: (IEventListenerOptions | null)[];
	} = {};

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 * @param options An object that specifies characteristics about the event listener.(currently only once)
	 * @param options.once
	 */
	public addEventListener(
		type: string,
		listener: ((event: Event) => void) | IEventListener,
		options?: IEventListenerOptions
	): void {
		this._listeners[type] = this._listeners[type] || [];
		this._listenerOptions[type] = this._listenerOptions[type] || [];

		this._listeners[type].push(listener);
		this._listenerOptions[type].push(options || null);
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
				this._listeners[type].splice(index, 1);
				this._listenerOptions[type].splice(index, 1);
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
		if (!event._target) {
			event._target = this;
		}

		event._currentTarget = this;

		const onEventName = 'on' + event.type.toLowerCase();

		if (typeof this[onEventName] === 'function') {
			this[onEventName].call(this, event);
		}

		if (this._listeners[event.type]) {
			for (let i = 0, max = this._listeners[event.type].length; i < max; i++) {
				const listener = this._listeners[event.type][i];
				const options = this._listenerOptions[event.type][i];

				if ((<IEventListener>listener).handleEvent) {
					(<IEventListener>listener).handleEvent(event);
				} else {
					(<(event: Event) => void>listener).call(this, event);
				}

				if (options?.once) {
					this.removeEventListener(event.type, listener);
				}

				if (event._immediatePropagationStopped) {
					return !(event.cancelable && event.defaultPrevented);
				}
			}
		}

		return !(event.cancelable && event.defaultPrevented);
	}

	/**
	 * Adds an event listener.
	 *
	 * TODO:
	 * Was used by with IE8- and Opera. React believed Happy DOM was a legacy browser and used them, but that is no longer the case, so we should remove this method after that this is verified.
	 *
	 * @deprecated
	 * @param type Event type.
	 * @param listener Listener.
	 */
	public attachEvent(type: string, listener: ((event: Event) => void) | IEventListener): void {
		this.addEventListener(type.replace('on', ''), listener);
	}

	/**
	 * Removes an event listener.
	 *
	 * TODO:
	 * Was used by IE8- and Opera. React believed Happy DOM was a legacy browser and used them, but that is no longer the case, so we should remove this method after that this is verified.
	 *
	 * @deprecated
	 * @param type Event type.
	 * @param listener Listener.
	 */
	public detachEvent(type: string, listener: ((event: Event) => void) | IEventListener): void {
		this.removeEventListener(type.replace('on', ''), listener);
	}
}
