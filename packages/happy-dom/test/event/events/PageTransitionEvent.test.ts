import Event from '../../../src/event/Event.js';
import PageTransitionEvent from '../../../src/event/events/PageTransitionEvent.js';
import Window from '../../../src/window/Window.js';
import { describe, it, expect } from 'vitest';

describe('PageTransitionEvent', () => {
	describe('constructor', () => {
		it('Creates a page transition event with persisted set to true.', () => {
			const event = new PageTransitionEvent('pageshow', { persisted: true });
			expect(event).toBeInstanceOf(Event);
			expect(event.type).toBe('pageshow');
			expect(event.persisted).toBe(true);
		});

		it('Defaults persisted to false.', () => {
			const event = new PageTransitionEvent('pagehide');
			expect(event.persisted).toBe(false);
		});

		it('Defaults persisted to false when eventInit is null.', () => {
			const event = new PageTransitionEvent('pageshow', null);
			expect(event.persisted).toBe(false);
		});
	});

	it('Preserves persisted property through dispatchEvent.', () => {
		const window = new Window();

		let receivedEvent: PageTransitionEvent | null = null;
		window.addEventListener('pageshow', (e) => {
			receivedEvent = <PageTransitionEvent>e;
		});

		window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));

		expect(receivedEvent).not.toBeNull();
		expect(receivedEvent!.type).toBe('pageshow');
		expect(receivedEvent!.persisted).toBe(true);
	});
});
