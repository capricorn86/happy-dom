import { describe, it, expect } from 'vitest';
import Window from '../../src/window/Window.js';

describe('Event bubbling with native Event constructor', () => {
	it('should bubble native Events to parent elements.', () => {
		const window = new Window();
		const document = window.document;

		const parent = document.createElement('div');
		const child = document.createElement('span');
		parent.appendChild(child);
		document.body.appendChild(parent);

		let bubbled = false;
		parent.addEventListener('click', () => {
			bubbled = true;
		});

		const event = new Event('click', { bubbles: true });
		child.dispatchEvent(event);
		expect(bubbled).toBe(true);
	});

	it('should not bubble native Events when bubbles is false.', () => {
		const window = new Window();
		const document = window.document;

		const parent = document.createElement('div');
		const child = document.createElement('span');
		parent.appendChild(child);
		document.body.appendChild(parent);

		const events: string[] = [];
		parent.addEventListener('custom', () => {
			events.push('parent');
		});
		child.addEventListener('custom', () => {
			events.push('child');
		});

		const event = new Event('custom', { bubbles: false });
		child.dispatchEvent(event);
		// Should only fire on child, not bubble to parent
		expect(events).toEqual(['child']);
	});

	it('should call listeners on the target element for native Events.', () => {
		const window = new Window();
		const document = window.document;

		const child = document.createElement('span');
		document.body.appendChild(child);

		let called = false;
		child.addEventListener('click', () => {
			called = true;
		});

		const event = new Event('click', { bubbles: true });
		child.dispatchEvent(event);
		expect(called).toBe(true);
	});
});
