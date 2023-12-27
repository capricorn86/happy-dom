import Touch from '../../../src/event/Touch.js';
import ITouchEventInit from '../../../src/event/events/ITouchEventInit.js';
import TouchEvent from '../../../src/event/events/TouchEvent.js';
import { describe, it, expect } from 'vitest';
import { HTMLElement } from '../../../src/index.js';

describe('TouchEvent', () => {
	describe('constructor()', () => {
		it('Creates a TouchEvent', () => {
			const eventType = 'touchstart';
			const event = new TouchEvent(eventType);
			expect(event.type).toBe(eventType);
		});

		it('Initializes properties', () => {
			const touch = new Touch({
				identifier: 0,
				target: new HTMLElement()
			});

			const eventInit: ITouchEventInit = {
				altKey: true,
				changedTouches: [touch],
				ctrlKey: true,
				metaKey: true,
				shiftKey: true,
				targetTouches: [touch],
				touches: [touch]
			};

			const event = new TouchEvent('touchstart', eventInit);
			expect(event).toMatchObject(eventInit);
		});

		it('Properties have correct defaults', () => {
			const defaults: ITouchEventInit = {
				altKey: false,
				changedTouches: [],
				ctrlKey: false,
				metaKey: false,
				shiftKey: false,
				targetTouches: [],
				touches: []
			};

			const event = new TouchEvent('touchstart');
			expect(event).toMatchObject(defaults);
		});
	});
});
