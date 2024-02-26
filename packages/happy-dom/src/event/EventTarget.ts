import IEventListener from './IEventListener.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Event from './Event.js';
import IEventTarget from './IEventTarget.js';
import IEventListenerOptions from './IEventListenerOptions.js';
import EventPhaseEnum from './EventPhaseEnum.js';
import INode from '../nodes/node/INode.js';
import IDocument from '../nodes/document/IDocument.js';
import IBrowserWindow from '../window/IBrowserWindow.js';
import WindowErrorUtility from '../window/WindowErrorUtility.js';
import WindowBrowserSettingsReader from '../window/WindowBrowserSettingsReader.js';
import BrowserErrorCaptureEnum from '../browser/enums/BrowserErrorCaptureEnum.js';

/**
 * Handles events.
 */
export default abstract class EventTarget implements IEventTarget {
	public readonly [PropertySymbol.listeners]: {
		[k: string]: (((event: Event) => void) | IEventListener)[];
	} = {};
	public readonly [PropertySymbol.listenerOptions]: {
		[k: string]: (IEventListenerOptions | null)[];
	} = {};

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
		listener: ((event: Event) => void) | IEventListener,
		options?: boolean | IEventListenerOptions
	): void {
		const listenerOptions = typeof options === 'boolean' ? { capture: options } : options || null;

		this[PropertySymbol.listeners][type] = this[PropertySymbol.listeners][type] || [];
		this[PropertySymbol.listenerOptions][type] = this[PropertySymbol.listenerOptions][type] || [];
		if (this[PropertySymbol.listeners][type].includes(listener)) {
			return;
		}
		this[PropertySymbol.listeners][type].push(listener);
		this[PropertySymbol.listenerOptions][type].push(listenerOptions);

		// Tracks the amount of capture event listeners to improve performance when they are not used.
		if (listenerOptions && listenerOptions.capture) {
			const window = this.#getWindow();
			if (window) {
				window[PropertySymbol.captureEventListenerCount][type] =
					window[PropertySymbol.captureEventListenerCount][type] ?? 0;
				window[PropertySymbol.captureEventListenerCount][type]++;
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
		if (this[PropertySymbol.listeners][type]) {
			const index = this[PropertySymbol.listeners][type].indexOf(listener);
			if (index !== -1) {
				// Tracks the amount of capture event listeners to improve performance when they are not used.
				if (
					this[PropertySymbol.listenerOptions][type][index] &&
					this[PropertySymbol.listenerOptions][type][index].capture
				) {
					const window = this.#getWindow();
					if (window && window[PropertySymbol.captureEventListenerCount][type]) {
						window[PropertySymbol.captureEventListenerCount][type]--;
					}
				}

				this[PropertySymbol.listeners][type].splice(index, 1);
				this[PropertySymbol.listenerOptions][type].splice(index, 1);
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
		const window = this.#getWindow();

		if (event.eventPhase === EventPhaseEnum.none) {
			event[PropertySymbol.target] = this;

			const composedPath = event.composedPath();

			// Capturing phase

			// We only need to iterate over the composed path if there are capture event listeners.
			if (window && window[PropertySymbol.captureEventListenerCount][event.type]) {
				event.eventPhase = EventPhaseEnum.capturing;

				for (let i = composedPath.length - 1; i >= 0; i--) {
					composedPath[i].dispatchEvent(event);
					if (
						event[PropertySymbol.propagationStopped] ||
						event[PropertySymbol.immediatePropagationStopped]
					) {
						break;
					}
				}
			}

			// At target phase
			event.eventPhase = EventPhaseEnum.atTarget;

			this.dispatchEvent(event);

			// Bubbling phase
			if (
				event.bubbles &&
				!event[PropertySymbol.propagationStopped] &&
				!event[PropertySymbol.immediatePropagationStopped]
			) {
				event.eventPhase = EventPhaseEnum.bubbling;

				for (let i = 1; i < composedPath.length; i++) {
					composedPath[i].dispatchEvent(event);
					if (
						event[PropertySymbol.propagationStopped] ||
						event[PropertySymbol.immediatePropagationStopped]
					) {
						break;
					}
				}
			}

			// None phase (completed)
			event.eventPhase = EventPhaseEnum.none;

			return !(event.cancelable && event.defaultPrevented);
		}

		event[PropertySymbol.currentTarget] = this;

		const browserSettings = window ? WindowBrowserSettingsReader.getSettings(window) : null;

		if (event.eventPhase !== EventPhaseEnum.capturing) {
			const onEventName = 'on' + event.type.toLowerCase();

			if (typeof this[onEventName] === 'function') {
				// We can end up in a never ending loop if the listener for the error event on Window also throws an error.
				if (
					window &&
					(this !== <IEventTarget>window || event.type !== 'error') &&
					!browserSettings?.disableErrorCapturing &&
					browserSettings?.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
				) {
					WindowErrorUtility.captureError(window, this[onEventName].bind(this, event));
				} else {
					this[onEventName].call(this, event);
				}
			}
		}

		if (this[PropertySymbol.listeners][event.type]) {
			// We need to clone the arrays because the listeners may remove themselves while we are iterating.
			const listeners = this[PropertySymbol.listeners][event.type].slice();
			const listenerOptions = this[PropertySymbol.listenerOptions][event.type].slice();

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
					event[PropertySymbol.isInPassiveEventListener] = true;
				}

				// We can end up in a never ending loop if the listener for the error event on Window also throws an error.
				if (
					window &&
					(this !== <IEventTarget>window || event.type !== 'error') &&
					!browserSettings?.disableErrorCapturing &&
					browserSettings?.errorCapture === BrowserErrorCaptureEnum.tryAndCatch
				) {
					if ((<IEventListener>listener).handleEvent) {
						WindowErrorUtility.captureError(
							window,
							(<IEventListener>listener).handleEvent.bind(listener, event)
						);
					} else {
						WindowErrorUtility.captureError(
							window,
							(<(event: Event) => void>listener).bind(this, event)
						);
					}
				} else {
					if ((<IEventListener>listener).handleEvent) {
						(<IEventListener>listener).handleEvent(event);
					} else {
						(<(event: Event) => void>listener).call(this, event);
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
	#getWindow(): IBrowserWindow | null {
		if ((<INode>(<unknown>this))[PropertySymbol.ownerDocument]) {
			return (<INode>(<unknown>this))[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow];
		}
		if ((<IDocument>(<unknown>this))[PropertySymbol.ownerWindow]) {
			return (<IDocument>(<unknown>this))[PropertySymbol.ownerWindow];
		}
		if ((<IBrowserWindow>(<unknown>this)).document) {
			return <IBrowserWindow>(<unknown>this);
		}
		return null;
	}
}
