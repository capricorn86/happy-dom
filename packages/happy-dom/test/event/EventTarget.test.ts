import EventTarget from '../../src/event/EventTarget';
import Event from '../../src/event/Event';
import CustomEvent from '../../src/event/events/CustomEvent';

const EVENT_TYPE = 'click';
/**
 *
 */
class TestEventTarget extends EventTarget {}

describe('EventTarget', () => {
	let eventTarget: EventTarget;

	beforeEach(() => {
		eventTarget = new TestEventTarget();
	});

	describe('addEventListener()', () => {
		it('Adds an event listener and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: Event = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
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
			let recievedEvent: CustomEvent = null;
			const DETAIL = {};
			const listener = (event: CustomEvent): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new CustomEvent(EVENT_TYPE, { detail: DETAIL });
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.detail).toBe(DETAIL);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
		});

		it('Adds an event listener using object with handleEvent as property and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: CustomEvent = null;
			const listener = {
				handleEvent: (event: CustomEvent): void => {
					recievedEvent = event;
				}
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
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
	});

	describe('removeEventListener()', () => {
		it('Removes an event listener and does not call it when calling dispatchEvent().', () => {
			let recievedEvent: Event = null;
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
		it('Triggers callback properties with "on" as prefix.', () => {
			let recievedEvent: Event = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget[`on${EVENT_TYPE}`] = listener;
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
		});
	});

	describe('attachEvent()', () => {
		it('Adds an event listener in older browsers for backward compatibility.', () => {
			let recievedEvent: Event = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.attachEvent(`on${EVENT_TYPE}`, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.type).toBe(EVENT_TYPE);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
		});
	});

	describe('detachEvent()', () => {
		it('Removes an event listener in older browsers for backward compatibility.', () => {
			let recievedEvent: Event = null;
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
});
