import Event from '../../../src/event/Event.js';
import SubmitEvent from '../../../src/event/events/SubmitEvent.js';
import HTMLButtonElement from '../../../src/nodes/html-button-element/HTMLButtonElement.js';
import Window from '../../../src/window/Window.js';
import { describe, it, expect } from 'vitest';

describe('SubmitEvent', () => {
	describe('constructor', () => {
		it('Creates a submit event.', () => {
			const window = new Window();
			const document = window.document;
			const submitter = document.createElement('button');
			const event = new SubmitEvent('submit', { bubbles: true, submitter });
			expect(event).toBeInstanceOf(Event);
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(false);
			expect(event.submitter).toBe(submitter);
		});
	});
});
