import IEventListener from './IEventListener';
import Event from './Event';
import IEventTarget from './IEventTarget';
import IEventListenerOptions from './IEventListenerOptions';
import EventPhaseEnum from './EventPhaseEnum';
import INode from '../nodes/node/INode';
import IDocument from '../nodes/document/IDocument';
import IWindow from '../window/IWindow';

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
		options?: boolean | IEventListenerOptions
	): void {
		const listenerOptions = typeof options === 'boolean' ? { capture: options } : options || null;

		this._listeners[type] = this._listeners[type] || [];
		this._listenerOptions[type] = this._listenerOptions[type] || [];
		if (this._listeners[type].includes(listener)) {
			return;
		}
		this._listeners[type].push(listener);
		this._listenerOptions[type].push(listenerOptions);

		// Tracks the amount of capture event listeners to improve performance when they are not used.
		if (listenerOptions && listenerOptions.capture) {
			const window = this._getWindow();
			if (window) {
				window['_captureEventListenerCount'][type] =
					window['_captureEventListenerCount'][type] ?? 0;
				window['_captureEventListenerCount'][type]++;
			}
		}
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
				// Tracks the amount of capture event listeners to improve performance when they are not used.
				if (this._listenerOptions[type][index] && this._listenerOptions[type][index].capture) {
					const window = this._getWindow();
					if (window && window['_captureEventListenerCount'][type]) {
						window['_captureEventListenerCount'][type]--;
					}
				}

				this._listeners[type].splice(index, 1);
				this._listenerOptions[type].splice(index, 1);
			}
		}
	}

	/**
	 * Dispatches an event.
	 *
	 * @see https://www.w3.org/TR/DOM-Level-3-Events/#event-flow
	 * @see https://www.quirksmode.org/js/events_order.html#link4
	 * @param event Event.
	 * @returns The return value is false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault().
	 */
	public dispatchEvent(event: Event): boolean {
		if (event.eventPhase === EventPhaseEnum.none) {
			event._target = this;

			const composedPath = event.composedPath();
			const window = this._getWindow();

			// Capturing phase

			// We only need to iterate over the composed path if there are capture event listeners.
			if (window && window['_captureEventListenerCount'][event.type]) {
				event.eventPhase = EventPhaseEnum.capturing;

				for (let i = composedPath.length - 1; i >= 0; i--) {
					composedPath[i].dispatchEvent(event);
					if (event._propagationStopped || event._immediatePropagationStopped) {
						break;
					}
				}
			}

			// At target phase
			event.eventPhase = EventPhaseEnum.atTarget;

			this.dispatchEvent(event);

			// Bubbling phase
			if (event.bubbles && !event._propagationStopped && !event._immediatePropagationStopped) {
				event.eventPhase = EventPhaseEnum.bubbling;

				for (let i = 1; i < composedPath.length; i++) {
					composedPath[i].dispatchEvent(event);
					if (event._propagationStopped || event._immediatePropagationStopped) {
						break;
					}
				}
			}

			// None phase (completed)
			event.eventPhase = EventPhaseEnum.none;

			return !(event.cancelable && event.defaultPrevented);
		}

		event._currentTarget = this;

		if (event.eventPhase !== EventPhaseEnum.capturing) {
			const onEventName = 'on' + event.type.toLowerCase();

			if (typeof this[onEventName] === 'function') {
				this[onEventName].call(this, event);
			}
		}

		if (this._listeners[event.type]) {
			// We need to clone the arrays because the listeners may remove themselves while we are iterating.
			const listeners = this._listeners[event.type].slice();
			const listenerOptions = this._listenerOptions[event.type].slice();

			for (let i = 0, max = listeners.length; i < max; i++) {
				const listener = listeners[i];
				const options = listenerOptions[i];

				if (
					(options?.capture && event.eventPhase !== EventPhaseEnum.capturing) ||
					(!options?.capture && event.eventPhase === EventPhaseEnum.capturing)
				) {
					continue;
				}

				if (options?.passive) {
					event._isInPassiveEventListener = true;
				}

				if ((<IEventListener>listener).handleEvent) {
					(<IEventListener>listener).handleEvent(event);
				} else {
					(<(event: Event) => void>listener).call(this, event);
				}

				event._isInPassiveEventListener = false;

				if (options?.once) {
					// At this time, listeners and listenersOptions are cloned arrays. When the original value is deleted,
					// The value corresponding to the cloned array is not deleted. So we need to delete the value in the cloned array.
					listeners.splice(i, 1);
					listenerOptions.splice(i, 1);
					this.removeEventListener(event.type, listener);
					i--;
					max--;
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

	/**
	 * Finds and returns window if possible.
	 *
	 * @returns Window.
	 */
	public _getWindow(): IWindow | null {
		if ((<INode>(<unknown>this)).ownerDocument) {
			return (<INode>(<unknown>this)).ownerDocument.defaultView;
		}
		if ((<IDocument>(<unknown>this)).defaultView) {
			return (<IDocument>(<unknown>this)).defaultView;
		}
		if ((<IWindow>(<unknown>this)).document) {
			return <IWindow>(<unknown>this);
		}
		return null;
	}
}
