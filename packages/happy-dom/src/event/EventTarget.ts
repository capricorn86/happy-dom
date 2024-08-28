import * as PropertySymbol from '../PropertySymbol.js';
import Event from './Event.js';
import IEventListenerOptions from './IEventListenerOptions.js';
import EventPhaseEnum from './EventPhaseEnum.js';
import WindowErrorUtility from '../window/WindowErrorUtility.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';
import TEventListener from './TEventListener.js';
import TEventListenerObject from './TEventListenerObject.js';
import TEventListenerFunction from './TEventListenerFunction.js';
import BrowserWindow from '../window/BrowserWindow.js';

/**
 * Handles events.
 */
export default class EventTarget {
	// Injected by WindowClassExtender
	protected declare [PropertySymbol.window]: BrowserWindow;

	public readonly [PropertySymbol.listeners]: {
		capturing: Map<string, TEventListener[]>;
		bubbling: Map<string, TEventListener[]>;
	} = {
		capturing: new Map(),
		bubbling: new Map()
	};
	public readonly [PropertySymbol.listenerOptions]: {
		capturing: Map<string, IEventListenerOptions[]>;
		bubbling: Map<string, IEventListenerOptions[]>;
	} = {
		capturing: new Map(),
		bubbling: new Map()
	};

	/**
	 * Return a default description for the EventTarget class.
	 */
	public get [Symbol.toStringTag](): string {
		return 'EventTarget';
	}

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
		listener: TEventListener,
		options?: boolean | IEventListenerOptions
	): void {
		options = typeof options === 'boolean' ? { capture: options } : options || {};
		const eventPhase = options.capture ? 'capturing' : 'bubbling';

		let listeners: TEventListener[] = this[PropertySymbol.listeners][eventPhase].get(type);
		let listenerOptions: IEventListenerOptions[] =
			this[PropertySymbol.listenerOptions][eventPhase].get(type);

		if (!listeners) {
			listeners = [];
			listenerOptions = [];
			this[PropertySymbol.listeners][eventPhase].set(type, listeners);
			this[PropertySymbol.listenerOptions][eventPhase].set(type, listenerOptions);
		}

		if (listeners.includes(listener)) {
			return;
		}

		listeners.push(listener);
		listenerOptions.push(options);
	}

	/**
	 * Adds an event listener.
	 *
	 * @param type Event type.
	 * @param listener Listener.
	 */
	public removeEventListener(type: string, listener: TEventListener): void {
		const bubblingListeners = this[PropertySymbol.listeners].bubbling.get(type);
		if (bubblingListeners) {
			const index = bubblingListeners.indexOf(listener);
			if (index !== -1) {
				bubblingListeners.splice(index, 1);
				this[PropertySymbol.listenerOptions].bubbling.get(type).splice(index, 1);
				return;
			}
		}

		const capturingListeners = this[PropertySymbol.listeners].capturing.get(type);
		if (capturingListeners) {
			const index = capturingListeners.indexOf(listener);
			if (index !== -1) {
				capturingListeners.splice(index, 1);
				this[PropertySymbol.listenerOptions].capturing.get(type).splice(index, 1);
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
		if (!event[PropertySymbol.target]) {
			event[PropertySymbol.target] = this;

			this.#goThroughDispatchEventPhases(event);

			return !(event[PropertySymbol.cancelable] && event[PropertySymbol.defaultPrevented]);
		}

		this.#callDispatchEventListeners(event);

		return !(event[PropertySymbol.cancelable] && event[PropertySymbol.defaultPrevented]);
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
	public attachEvent(type: string, listener: TEventListener): void {
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
	public detachEvent(type: string, listener: TEventListener): void {
		this.removeEventListener(type.replace('on', ''), listener);
	}

	/**
	 * Goes through dispatch event phases.
	 *
	 * @param event Event.
	 */
	#goThroughDispatchEventPhases(event: Event): void {
		const composedPath = event.composedPath();

		// Capturing phase
		event[PropertySymbol.eventPhase] = EventPhaseEnum.capturing;

		for (let i = composedPath.length - 1; i >= 0; i--) {
			event[PropertySymbol.currentTarget] = composedPath[i];

			composedPath[i].dispatchEvent(event);

			if (
				event[PropertySymbol.propagationStopped] ||
				event[PropertySymbol.immediatePropagationStopped]
			) {
				event[PropertySymbol.eventPhase] = EventPhaseEnum.none;
				event[PropertySymbol.target] = null;
				event[PropertySymbol.currentTarget] = null;
				return;
			}
		}

		// At target phase
		event[PropertySymbol.eventPhase] = EventPhaseEnum.atTarget;
		event[PropertySymbol.currentTarget] = this;
		event[PropertySymbol.target].dispatchEvent(event);

		// Bubbling phase
		event[PropertySymbol.eventPhase] = EventPhaseEnum.bubbling;

		if (
			event[PropertySymbol.bubbles] &&
			!event[PropertySymbol.propagationStopped] &&
			!event[PropertySymbol.immediatePropagationStopped]
		) {
			for (let i = 1, max = composedPath.length; i < max; i++) {
				event[PropertySymbol.currentTarget] = composedPath[i];

				composedPath[i].dispatchEvent(event);

				if (
					event[PropertySymbol.propagationStopped] ||
					event[PropertySymbol.immediatePropagationStopped]
				) {
					event[PropertySymbol.eventPhase] = EventPhaseEnum.none;
					event[PropertySymbol.target] = null;
					event[PropertySymbol.currentTarget] = null;
					return;
				}
			}
		}

		// None phase (done)
		event[PropertySymbol.eventPhase] = EventPhaseEnum.none;
		event[PropertySymbol.target] = null;
		event[PropertySymbol.currentTarget] = null;
	}

	/**
	 * Handles dispatch event listeners.
	 *
	 * @param event Event.
	 */
	#callDispatchEventListeners(event: Event): void {
		const window = this[PropertySymbol.window];
		const browserSettings = window ? new WindowBrowserContext(window).getSettings() : null;
		const eventPhase = event.eventPhase === EventPhaseEnum.capturing ? 'capturing' : 'bubbling';

		if (event.eventPhase !== EventPhaseEnum.capturing) {
			const onEventName = 'on' + event.type.toLowerCase();

			if (typeof this[onEventName] === 'function') {
				// We can end up in a never ending loop if the listener for the error event on Window also throws an error.
				if (
					window &&
					(this !== <EventTarget>window || event.type !== 'error') &&
					!browserSettings?.disableErrorCapturing &&
					browserSettings?.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
				) {
					WindowErrorUtility.captureError(window, this[onEventName].bind(this, event));
				} else {
					this[onEventName].call(this, event);
				}
			}
		}

		// We need to clone the arrays because the listeners may remove themselves while we are iterating.
		const listeners = this[PropertySymbol.listeners][eventPhase].get(event.type)?.slice();

		if (!listeners) {
			return;
		}

		const listenerOptions = this[PropertySymbol.listenerOptions][eventPhase]
			.get(event.type)
			?.slice();

		for (let i = 0, max = listeners.length; i < max; i++) {
			const listener = listeners[i];
			const options = listenerOptions[i];

			if (options?.passive) {
				event[PropertySymbol.isInPassiveEventListener] = true;
			}

			// We can end up in a never ending loop if the listener for the error event on Window also throws an error.
			if (
				window &&
				(this !== <EventTarget>window || event.type !== 'error') &&
				!browserSettings?.disableErrorCapturing &&
				browserSettings?.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
			) {
				if ((<TEventListenerObject>listener).handleEvent) {
					WindowErrorUtility.captureError(
						window,
						(<TEventListenerObject>listener).handleEvent.bind(listener, event)
					);
				} else {
					WindowErrorUtility.captureError(
						window,
						(<TEventListenerFunction>listener).bind(this, event)
					);
				}
			} else {
				if ((<TEventListenerObject>listener).handleEvent) {
					(<TEventListenerObject>listener).handleEvent(event);
				} else {
					(<TEventListenerFunction>listener).call(this, event);
				}
			}

			event[PropertySymbol.isInPassiveEventListener] = false;

			if (options?.once) {
				// At this time, listeners and listenersOptions are cloned arrays. When the original value is deleted,
				// The value corresponding to the cloned array is not deleted. So we need to delete the value in the cloned array.
				listeners.splice(i, 1);
				listenerOptions.splice(i, 1);
				this.removeEventListener(event.type, listener);
				i--;
				max--;
			}

			if (event[PropertySymbol.immediatePropagationStopped]) {
				return;
			}
		}
	}
}
