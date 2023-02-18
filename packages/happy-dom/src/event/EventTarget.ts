import IEventListener from './IEventListener';
import Event from './Event';
import IEventTarget from './IEventTarget';

/**
 * Handles events.
 */
export default abstract class EventTarget implements IEventTarget {
	public readonly _listeners: {
		[k: string]: {
			fn: ((event: Event) => void) | IEventListener;
			options?: { once: boolean } | undefined;
		}[];
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
		options?: { once: boolean }
	): void {
		this._listeners[type] = this._listeners[type] || [];
		this._listeners[type].push({ fn: listener, options });
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
			const _listeners = this._listeners[type].map((l) => l.fn);
			const index = _listeners.indexOf(listener);
			if (index !== -1) {
				this._listeners[type].splice(index, 1);
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
			for (const listener of this._listeners[event.type]) {
				const _listener = listener.fn;
				const once = listener.options && listener.options.once && listener.options.once === true;
				if ((<IEventListener>_listener).handleEvent) {
					(<IEventListener>_listener).handleEvent(event);
					once && this.removeEventListener(event.type, _listener);
				} else {
					(<(event: Event) => void>_listener).call(this, event);
					once && this.removeEventListener(event.type, _listener);
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
