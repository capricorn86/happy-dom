import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import KeyboardEvent from '../../../src/event/events/KeyboardEvent.js';
import SubmitEvent from '../../../src/event/events/SubmitEvent.js';
import Event from '../../../src/event/Event.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';

/**
 * Test case for GitHub issue #1942:
 * Form not submitted when pressing Enter key inside <input> element
 *
 * In real browsers, pressing Enter inside a form input triggers form submission.
 * This behavior is currently not implemented in happy-dom.
 *
 * @see https://github.com/capricorn86/happy-dom/issues/1942
 */
describe('HTMLInputElement - Enter key form submission (Issue #1942)', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('Enter key in text input', () => {
		it('Should trigger form submit event when Enter is pressed in a text input inside a form', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault(); // Prevent actual navigation
			});
			form.addEventListener('submit', submitHandler);

			// Simulate pressing Enter key
			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			expect(submitHandler).toHaveBeenCalledTimes(1);
		});

		it('Should NOT trigger form submit when Enter is pressed in a textarea', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const textarea = document.createElement('textarea');
			textarea.name = 'testTextarea';
			form.appendChild(textarea);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			// Simulate pressing Enter key in textarea
			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			textarea.dispatchEvent(keydownEvent);

			// Enter in textarea should NOT submit the form (it adds a newline instead)
			expect(submitHandler).not.toHaveBeenCalled();
		});

		it('Should NOT trigger form submit when Enter is pressed in input type="button"', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'button';
			input.value = 'Click me';
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			// Button type inputs don't trigger form submission on Enter
			expect(submitHandler).not.toHaveBeenCalled();
		});

		it('Should trigger form submit when Enter is pressed in input type="search"', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'search';
			input.name = 'searchInput';
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			expect(submitHandler).toHaveBeenCalledTimes(1);
		});

		it('Should trigger form submit when Enter is pressed in input type="password"', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'password';
			input.name = 'passwordInput';
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			expect(submitHandler).toHaveBeenCalledTimes(1);
		});

		it('Should NOT trigger form submit when Enter is pressed but event.preventDefault() is called', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			// Add a keydown handler that prevents default
			input.addEventListener('keydown', (e: Event) => {
				if (e instanceof KeyboardEvent && e.key === 'Enter') {
					e.preventDefault();
				}
			});

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			// Form should NOT be submitted because keydown was prevented
			expect(submitHandler).not.toHaveBeenCalled();
		});

		it('Should NOT trigger form submit when input is not inside a form', () => {
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			document.body.appendChild(input);

			// No form, so no submit handler to call
			// This should not throw an error
			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			expect(() => input.dispatchEvent(keydownEvent)).not.toThrow();
		});

		it('Should NOT trigger form submit when input is disabled', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			input.disabled = true;
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			// Disabled inputs should not trigger form submission
			expect(submitHandler).not.toHaveBeenCalled();
		});

		it('Should respect form validation when Enter is pressed', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			input.required = true;
			input.value = ''; // Empty value, should fail validation
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			// Form should NOT be submitted because validation fails
			// (requestSubmit checks validity before dispatching submit event)
			expect(submitHandler).not.toHaveBeenCalled();
		});

		it('Should submit form when Enter is pressed and validation passes', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			input.required = true;
			input.value = 'valid value'; // Has value, should pass validation
			form.appendChild(input);
			document.body.appendChild(form);

			const submitHandler = vi.fn((e: Event) => {
				e.preventDefault();
			});
			form.addEventListener('submit', submitHandler);

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			expect(submitHandler).toHaveBeenCalledTimes(1);
		});

		it('Should use the correct submit button as submitter when form has a submit button', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const input = <HTMLInputElement>document.createElement('input');
			input.type = 'text';
			input.name = 'testInput';
			const submitButton = <HTMLInputElement>document.createElement('input');
			submitButton.type = 'submit';
			submitButton.name = 'submitBtn';
			submitButton.value = 'Submit';
			form.appendChild(input);
			form.appendChild(submitButton);
			document.body.appendChild(form);

			let submitter: HTMLInputElement | null = null;
			form.addEventListener('submit', (e: Event) => {
				e.preventDefault();
				submitter = <HTMLInputElement>(<SubmitEvent>e).submitter;
			});

			const keydownEvent = new KeyboardEvent('keydown', {
				key: 'Enter',
				code: 'Enter',
				keyCode: 13,
				bubbles: true,
				cancelable: true
			});

			input.dispatchEvent(keydownEvent);

			// The submitter should be the submit button (default submit button)
			expect(submitter).toBe(submitButton);
		});
	});
});
