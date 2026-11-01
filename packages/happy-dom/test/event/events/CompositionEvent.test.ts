import CompositionEvent from '../../../src/event/events/CompositionEvent.js';
import UIEvent from '../../../src/event/UIEvent.js';
import Window from '../../../src/window/Window.js';
import { describe, it, expect } from 'vitest';

describe('CompositionEvent', () => {
	describe('constructor()', () => {
		it('Sets "data" from eventInit.', () => {
			const event = new CompositionEvent('compositionend', { data: 'text' });
			expect(event.type).toBe('compositionend');
			expect(event.data).toBe('text');
		});

		it('Defaults "data" to an empty string.', () => {
			expect(new CompositionEvent('compositionstart').data).toBe('');
			expect(new CompositionEvent('compositionstart', {}).data).toBe('');
			expect(new CompositionEvent('compositionstart', null).data).toBe('');
		});

		it('Extends UIEvent and passes the rest of eventInit to it.', () => {
			const window = new Window();
			const event = new CompositionEvent('compositionupdate', {
				bubbles: true,
				cancelable: true,
				composed: true,
				detail: 1,
				view: window
			});
			expect(event instanceof UIEvent).toBe(true);
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(true);
			expect(event.composed).toBe(true);
			expect(event.detail).toBe(1);
			expect(event.view).toBe(window);
		});
	});

	it('Is exposed on Window and reaches a listener with its "data".', () => {
		const window = new Window();
		const input = window.document.createElement('input');
		let received: string | null = null;

		input.addEventListener('compositionend', (event) => {
			received = (<CompositionEvent>event).data;
		});
		input.dispatchEvent(new window.CompositionEvent('compositionend', { data: 'text' }));

		expect(received).toBe('text');
		expect(window.CompositionEvent).toBe(CompositionEvent);
	});

	it('Is created by document.createEvent().', () => {
		const window = new Window();

		expect(window.document.createEvent('CompositionEvent') instanceof CompositionEvent).toBe(true);
	});
});
