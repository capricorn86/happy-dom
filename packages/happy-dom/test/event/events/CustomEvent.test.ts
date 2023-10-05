import CustomEvent from '../../../src/event/events/CustomEvent.js';
import { describe, it, expect } from 'vitest';

describe('CustomEvent', () => {
	describe('constructor()', () => {
		it('Creates a CustomEvent', () => {
			const eventType = 'click';
			const event = new CustomEvent(eventType);
			expect(event.type).toBe(eventType);
			expect(event.detail).toBeNull();
		});

		it('Creates a CustomEvent with detail', () => {
			const eventType = 'click';
			const eventDetail = { someInformation: true };
			const event = new CustomEvent(eventType, { detail: eventDetail });
			expect(event.type).toBe(eventType);
			expect(event.detail).toEqual(eventDetail);
		});

		it('Creates a CustomEvent with empty detail', () => {
			const eventType = 'click';
			let event = new CustomEvent(eventType, {});
			expect(event.type).toBe(eventType);
			expect(event.detail).toBeNull();

			event = new CustomEvent(eventType, { detail: undefined });
			expect(event.type).toBe(eventType);
			expect(event.detail).toBeNull();

			event = new CustomEvent(eventType, { detail: null });
			expect(event.type).toBe(eventType);
			expect(event.detail).toBeNull();
		});
	});
});
