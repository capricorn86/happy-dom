import EventTarget from '../../lib/event/EventTarget';
import Event from '../../lib/event/Event';
import CustomEvent from '../../lib/event/CustomEvent';

const EVENT_TYPE = 'click';
class TestEventTarget extends EventTarget { }

describe('EventTarget', () => {
	let eventTarget: EventTarget;

	beforeEach(() => {
		eventTarget = new TestEventTarget();
	});

	describe('addEventListener()', () => {
		test('Adds an event listener and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: Event = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);

			for (const prop in dispatchedEvent) {
				expect(recievedEvent[prop]).toEqual(recievedEvent[prop])
			}
		});

		test('Triggers a custom event and triggers it when calling dispatchEvent().', () => {
			let recievedEvent: CustomEvent = null;
			const DETAIL = {};
			const listener = (event: CustomEvent): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new CustomEvent(EVENT_TYPE, { detail: DETAIL });
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);

			for (const prop in dispatchedEvent) {
				expect(recievedEvent[prop]).toEqual(recievedEvent[prop])
			}
			expect(recievedEvent.type).toEqual(EVENT_TYPE)
			expect(recievedEvent.detail).toBe(DETAIL);
		});
	});

	describe('removeEventListener()', () => {
		test('Removes an event listener and does not call it when calling dispatchEvent().', () => {
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
		test('Sets target to the EventTarget that was asked to dispatch the event.', () => {
			let recievedEvent: Event = null;
			const listener = (event: Event): void => {
				recievedEvent = event;
			};
			const dispatchedEvent = new Event(EVENT_TYPE);
			eventTarget.addEventListener(EVENT_TYPE, listener);
			eventTarget.dispatchEvent(dispatchedEvent);
			expect(recievedEvent.target).toBe(eventTarget)
			for (const prop in dispatchedEvent) {
				expect(recievedEvent[prop]).toEqual(recievedEvent[prop])
			}

			// leaves src event untouched
			expect(dispatchedEvent.target).toBe(null)
		});
	});
});
