import Event from '../../../src/event/Event.js';
import ToggleEvent from '../../../src/event/events/ToggleEvent.js';
import Window from '../../../src/window/Window.js';
import { describe, it, expect } from 'vitest';

describe('ToggleEvent', () => {
	describe('constructor', () => {
		it('Creates a toggle event with default values.', () => {
			const event = new ToggleEvent('toggle');
			expect(event).toBeInstanceOf(Event);
			expect(event.type).toBe('toggle');
			expect(event.oldState).toBe('');
			expect(event.newState).toBe('');
			expect(event.source).toBe(null);
		});

		it('Creates a toggle event with custom values.', () => {
			const window = new Window();
			const document = window.document;
			const source = document.createElement('button');
			const event = new ToggleEvent('beforetoggle', {
				bubbles: false,
				cancelable: true,
				oldState: 'closed',
				newState: 'open',
				source
			});
			expect(event).toBeInstanceOf(Event);
			expect(event.type).toBe('beforetoggle');
			expect(event.cancelable).toBe(true);
			expect(event.oldState).toBe('closed');
			expect(event.newState).toBe('open');
			expect(event.source).toBe(source);
		});
	});
});
