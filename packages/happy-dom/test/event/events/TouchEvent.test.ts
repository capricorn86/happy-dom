import Touch from '../../../src/event/Touch.js';
import ITouchEventInit from '../../../src/event/events/ITouchEventInit.js';
import TouchEvent from '../../../src/event/events/TouchEvent.js';
import Window from '../../../src/window/Window.js';
import { describe, it, expect } from 'vitest';

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
				target: new Window().document.createElement('div')
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
