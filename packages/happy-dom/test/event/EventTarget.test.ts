import Window from '../../src/window/Window.js';
import EventTarget from '../../src/event/EventTarget.js';
import Event from '../../src/event/Event.js';
import CustomEvent from '../../src/event/events/CustomEvent.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserErrorCaptureEnum from '../../src/browser/enums/BrowserErrorCaptureEnum.js';

const EVENT_TYPE = 'click';

describe('EventTarget', () => {
	let window: Window;
	let eventTarget: EventTarget;

	beforeEach(() => {
		window = new Window();
		eventTarget = new window.EventTarget();
	});

	describe('addEventListener()', () => {
		it('Adds an event listener and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: Event | null = null;
			let recievedTarget: EventTarget | null = null;
			let recievedCurrentTarget: EventTarget | null = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
				recievedTarget = event.target;
				recievedCurrentTarget = event.currentTarget;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedTarget).toBe(eventTarget);
			expect(recievedCurrentTarget).toBe(eventTarget);
		});

		it('Adds an event listener and set options once', () => {
			let count = 0;
			const listener = (): void => {
				count++;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener, { once: true });
			eventTarget.dispatchEvent(dispatchedEvent);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(count).toBe(1);
		});

		it('Adds an event listener and set options once and bind the same event multiple times', () => {
			let count = 0;
			const listener = (): void => {
				count++;
			};
			const listener1 = (): void => {
				count++;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener, { once: true });
			eventTarget.addEventListener(EVENT_TYPE, listener1, { once: true });
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(count).toBe(2);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(count).toBe(2);
			eventTarget.addEventListener(EVENT_TYPE, listener, { once: true });
			eventTarget.addEventListener(EVENT_TYPE, listener, { once: true });
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(count).toBe(3);
		});

		it('Adds a custom event listener and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: CustomEvent | null = null;
			let recievedTarget: EventTarget | null = null;
			let recievedCurrentTarget: EventTarget | null = null;
			const DETAIL = {};
			const listener = (event): void => {
				recievedEvent = <CustomEvent>event;
				recievedTarget = event.target;
				recievedCurrentTarget = event.currentTarget;
			};
			const dispatchedEvent = new CustomEvent(EVENT_TYPE, { detail: DETAIL });
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect((<CustomEvent>(<unknown>recievedEvent)).detail).toBe(DETAIL);
			expect(recievedTarget).toBe(eventTarget);
			expect(recievedCurrentTarget).toBe(eventTarget);
		});

		it('Adds an event listener using object with handleEvent as property and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: CustomEvent | null = null;
			let recievedTarget: EventTarget | null = null;
			let recievedCurrentTarget: EventTarget | null = null;
			const listener = {
				handleEvent: (event: CustomEvent): void => {
					recievedEvent = event;
					recievedTarget = event.target;
					recievedCurrentTarget = event.currentTarget;
				}
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedTarget).toBe(eventTarget);
			expect(recievedCurrentTarget).toBe(eventTarget);
		});

		it('Event listener is called in the scope of the EventTarget when calling dispatchEvent().', () => {
			let scope = null;
			const listener = function (): void {
				scope = this;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(scope).toBe(eventTarget);
		});

		it('Event listener with handleEvent is called in the scope of the listener when calling dispatchEvent() when browser settings error capture is set to "tryAndCatch".', () => {
			let scope = null;
			const listener = {
				handleEvent(): void {
					scope = this;
				}
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(scope).toBe(listener);
		});

		it('Event listener with handleEvent is called in the scope of the listener when calling dispatchEvent() when browser settings error capture is not set to "tryAndCatch".', () => {
			window.happyDOM.settings.errorCapture = BrowserErrorCaptureEnum.disabled;
			let scope = null;
			const listener = {
				handleEvent(): void {
					scope = this;
				}
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(scope).toBe(listener);
		});
	});

	describe('removeEventListener()', () => {
		it('Removes an event listener and does not call it when calling dispatchEvent().', () => {
			let recievedEvent: Event | null = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.removeEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(null);
		});
	});

	describe('dispatchEvent()', () => {
		it('Triggers listener properties with "on" as prefix on DOM elements.', () => {
			// on* handlers should work on DOM elements (which have propertyEventListeners)
			const element = window.document.createElement('div');
			let recievedEvent: Event | null = null;
			let recievedTarget: EventTarget | null = null;
			let recievedCurrentTarget: EventTarget | null = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
				recievedTarget = event.target;
				recievedCurrentTarget = event.currentTarget;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			element[`on${EVENT_TYPE}`] = listener;
			element.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedTarget).toBe(element);
			expect(recievedCurrentTarget).toBe(element);
			expect(dispatchedEvent.target).toBe(element);
			expect(dispatchedEvent.currentTarget).toBe(null);
			expect(dispatchedEvent.defaultPrevented).toBe(false);
			expect(dispatchedEvent[PropertySymbol.dispatching]).toBe(false);
		});

		it('Triggers all listeners, even though listeners are removed while dispatching.', () => {
			let recievedEvent1: Event | null = null;
			let recievedTarget1: EventTarget | null = null;
			let recievedCurrentTarget1: EventTarget | null = null;
			let recievedEvent2: Event | null = null;
			let recievedTarget2: EventTarget | null = null;
			let recievedCurrentTarget2: EventTarget | null = null;

			const listener1 = (event: Event): void => {
				recievedEvent1 = event;
				recievedTarget1 = event.target;
				recievedCurrentTarget1 = event.currentTarget;
				eventTarget.removeEventListener(EVENT_TYPE, listener1);
			};
			const listener2 = (event: Event): void => {
				recievedEvent2 = event;
				recievedTarget2 = event.target;
				recievedCurrentTarget2 = event.currentTarget;
				eventTarget.removeEventListener(EVENT_TYPE, listener2);
			};
			const dispatchedEvent = new Event(EVENT_TYPE);

			eventTarget.addEventListener(EVENT_TYPE, listener1);
			eventTarget.addEventListener(EVENT_TYPE, listener2);

			eventTarget.dispatchEvent(dispatchedEvent);

			expect(recievedEvent1).toBe(dispatchedEvent);
			expect(recievedEvent2).toBe(dispatchedEvent);

			expect(recievedTarget1).toBe(eventTarget);
			expect(recievedCurrentTarget1).toBe(eventTarget);
			expect(recievedTarget2).toBe(eventTarget);
			expect(recievedCurrentTarget2).toBe(eventTarget);

			expect(dispatchedEvent.target).toBe(eventTarget);
			expect(dispatchedEvent.currentTarget).toBe(null);
			expect(dispatchedEvent.defaultPrevented).toBe(false);
			expect(dispatchedEvent[PropertySymbol.dispatching]).toBe(false);
		});
	});

	describe('attachEvent()', () => {
		it('Adds an event listener in older browsers for backward compatibility.', () => {
			let recievedEvent: Event | null = null;
			let recievedTarget: EventTarget | null = null;
			let recievedCurrentTarget: EventTarget | null = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
				recievedTarget = event.target;
				recievedCurrentTarget = event.currentTarget;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.attachEvent(`on${EVENT_TYPE}`, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect((<Event>(<unknown>recievedEvent)).type).toBe(EVENT_TYPE);
			expect(recievedTarget).toBe(eventTarget);
			expect(recievedCurrentTarget).toBe(eventTarget);
		});
	});

	describe('detachEvent()', () => {
		it('Removes an event listener in older browsers for backward compatibility.', () => {
			let recievedEvent: Event | null = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event('click');
			eventTarget.attachEvent('onclick', listener);
			eventTarget.detachEvent('onclick', listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(null);
		});
	});

	describe('[Symbol.toStringTag]', () => {
		it('Returns EventTarget string.', () => {
			const description = 'EventTarget';

			expect(eventTarget[Symbol.toStringTag]).toBe(description);
		});
	});

	describe('[PropertySymbol.destroy]', () => {
		it('Destroys the event target', () => {
			let count = 0;
			const listener = (): void => {
				count++;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);

			eventTarget.addEventListener(EVENT_TYPE, listener);

			eventTarget.dispatchEvent(dispatchedEvent);

			expect(count).toBe(1);

			count = 0;

			eventTarget[PropertySymbol.destroy]();

			eventTarget.dispatchEvent(dispatchedEvent);

			expect(count).toBe(0);
		});
	});

	describe('dispatchEvent()', () => {
		it('Does not call arbitrary on* properties set on EventTarget (issue #1895).', () => {
			const calls: string[] = [];

			(<any>eventTarget).onopen = () => calls.push('onopen property');
			eventTarget.addEventListener('open', () => calls.push('open listener'));

			eventTarget.dispatchEvent(new Event('open'));

			expect(calls).toEqual(['open listener']);
		});

		it('Does not call on* properties that are not defined as event handlers.', () => {
			const calls: string[] = [];

			(<any>eventTarget).onclick = () => calls.push('onclick property');
			eventTarget.addEventListener('click', () => calls.push('click listener'));

			eventTarget.dispatchEvent(new Event('click'));

			// EventTarget base class should not call on* properties
			// Only DOM elements with defined on* IDL attributes should call them
			expect(calls).toEqual(['click listener']);
		});

		it('Calls on* handlers on subclasses that define them as class properties.', () => {
			// MediaQueryList defines onchange as a class property
			const mediaQueryList = window.matchMedia('(min-width: 100px)');
			let called = false;
			mediaQueryList.onchange = () => {
				called = true;
			};
			mediaQueryList.dispatchEvent(new Event('change'));
			expect(called).toBe(true);
		});

		it('Calls on* handlers on MediaStream.', () => {
			const mediaStream = new window.MediaStream();
			let addTrackCalled = false;
			let removeTrackCalled = false;

			mediaStream.onaddtrack = () => {
				addTrackCalled = true;
			};
			mediaStream.onremovetrack = () => {
				removeTrackCalled = true;
			};

			mediaStream.dispatchEvent(new Event('addtrack'));
			mediaStream.dispatchEvent(new Event('removetrack'));

			expect(addTrackCalled).toBe(true);
			expect(removeTrackCalled).toBe(true);
		});

		it('Calls onabort handler on AbortSignal.', () => {
			const controller = new window.AbortController();
			let called = false;

			controller.signal.onabort = () => {
				called = true;
			};
			controller.abort();

			expect(called).toBe(true);
		});
	});
});
