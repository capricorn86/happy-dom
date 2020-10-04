import EventTarget from '../../src/event/EventTarget';
import Event from '../../src/event/Event';
import CustomEvent from '../../src/event/CustomEvent';

const EVENT_TYPE = 'click';
class TestEventTarget extends EventTarget {}

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
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
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
			expect(recievedEvent).toBe(dispatchedEvent);
			expect(recievedEvent.detail).toBe(DETAIL);
			expect(recievedEvent.target).toBe(eventTarget);
			expect(recievedEvent.currentTarget).toBe(eventTarget);
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
});
