import WheelEvent from '../../../src/event/events/WheelEvent.js';
import { describe, it, expect } from 'vitest';

describe('WheelEvent', () => {
	describe('constructor()', () => {
		it('Creates a wheel event with default values', () => {
			const event = new WheelEvent('wheel');
			expect(event.deltaX).toBe(0);
			expect(event.deltaY).toBe(0);
			expect(event.deltaZ).toBe(0);
			expect(event.deltaMode).toBe(0);
			expect(event.momentum).toBe(false);
		});

		it('Creates a wheel event with custom values', () => {
			const event = new WheelEvent('wheel', {
				deltaX: 10,
				deltaY: 20,
				deltaZ: 30,
				deltaMode: WheelEvent.DOM_DELTA_LINE,
				momentum: true
			});
			expect(event.deltaX).toBe(10);
			expect(event.deltaY).toBe(20);
			expect(event.deltaZ).toBe(30);
			expect(event.deltaMode).toBe(WheelEvent.DOM_DELTA_LINE);
			expect(event.momentum).toBe(true);
		});

		it('Inherits MouseEvent properties', () => {
			const event = new WheelEvent('wheel', {
				deltaX: 5,
				clientX: 100,
				clientY: 200,
				button: 1,
				altKey: true
			});
			expect(event.deltaX).toBe(5);
			expect(event.clientX).toBe(100);
			expect(event.clientY).toBe(200);
			expect(event.button).toBe(1);
			expect(event.altKey).toBe(true);
		});
	});
});
