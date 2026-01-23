import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import HTMLInputElement from '../../src/nodes/html-input-element/HTMLInputElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('ValidityState', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('get badInput()', () => {
		it('Returns "false" for a valid "number" input field.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '123';
			input.type = 'number';

			expect(input.validity.badInput).toBe(false);
		});

		it('Returns "false" for a valid "range" input field.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '123';
			input.type = 'range';

			expect(input.validity.badInput).toBe(false);
		});

		it('Returns "true" for a "number" input field with non digit characters in the value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'a123';
			input.type = 'number';

			expect(input.validity.badInput).toBe(true);
		});

		it('Returns "true" for a "range" input field with non digit characters in the value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'a123';
			input.type = 'range';

			expect(input.validity.badInput).toBe(true);
		});
	});

	describe('get customError()', () => {
		it('Returns "true" if the field has a custom error message.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			expect(input.validity.customError).toBe(false);

			input.setCustomValidity('test');

			expect(input.validity.customError).toBe(true);
		});
	});

	describe('get patternMismatch()', () => {
		it('Returns "true" if a defined pattern doesn\'nt match.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'a123';
			input.pattern = '[0-9]';

			expect(input.validity.patternMismatch).toBe(true);

			input.value = '123';

			expect(input.validity.patternMismatch).toBe(true);

			input.pattern = '[0-9]+';

			expect(input.validity.patternMismatch).toBe(false);
		});
	});

	describe('get rangeOverflow()', () => {
		it('Returns "true" if a "number" input field has a "max" set to a value lower than the value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '10';
			input.max = '9';
			input.type = 'number';

			expect(input.validity.rangeOverflow).toBe(true);

			input.value = '9';

			expect(input.validity.rangeOverflow).toBe(false);
		});

		it('Returns "true" if a "range" input field has a "max" set to a value greater than the value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '10';
			input.max = '9';
			input.type = 'range';

			expect(input.validity.rangeOverflow).toBe(true);

			input.value = '9';

			expect(input.validity.rangeOverflow).toBe(false);
		});
	});

	describe('get rangeUnderflow()', () => {
		it('Returns "true" if a "number" input field has a "min" set to a value lower than the value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '9';
			input.min = '10';
			input.type = 'number';

			expect(input.validity.rangeUnderflow).toBe(true);

			input.value = '10';

			expect(input.validity.rangeUnderflow).toBe(false);
		});

		it('Returns "true" if a "range" input field has a "min" set to a value lower than the value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '9';
			input.min = '10';
			input.type = 'range';

			expect(input.validity.rangeUnderflow).toBe(true);

			input.value = '10';

			expect(input.validity.rangeUnderflow).toBe(false);
		});
	});

	describe('get stepMismatch()', () => {
		it('Returns "true" if a "number" input field has "step" set to a non-steppable value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '9';
			input.step = '2';
			input.type = 'number';

			expect(input.validity.stepMismatch).toBe(true);

			input.value = '10';

			expect(input.validity.stepMismatch).toBe(false);
		});

		it('Returns "true" if a "range" input field has "step" set to a non-steppable value.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = '9';
			input.step = '2';
			input.type = 'range';

			expect(input.validity.stepMismatch).toBe(true);

			input.value = '10';

			expect(input.validity.stepMismatch).toBe(false);
		});
	});

	describe('get tooLong()', () => {
		it('Returns "true" for an input field that has "maxLength" set and the length of "value" is longer.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'abcdef';
			input.maxLength = 3;

			expect(input.validity.tooLong).toBe(true);

			input.value = 'abc';

			expect(input.validity.tooLong).toBe(false);
		});

		it('Returns "true" for an text area field that has "maxLength" set and the length of "value" is longer.', () => {
			const textarea = <HTMLInputElement>document.createElement('textarea');

			textarea.value = 'abcdef';
			textarea.maxLength = 3;

			expect(textarea.validity.tooLong).toBe(true);

			textarea.value = 'abc';

			expect(textarea.validity.tooLong).toBe(false);
		});
	});

	describe('get tooShort()', () => {
		it('Returns "true" for an input field that has "minLength" set and the length of "value" is shorter.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'abc';
			input.minLength = 6;

			expect(input.validity.tooShort).toBe(true);

			input.value = 'abcdef';

			expect(input.validity.tooShort).toBe(false);
		});

		it('Returns "true" for an text area field that has "minLength" set and the length of "value" is shorter.', () => {
			const textarea = <HTMLInputElement>document.createElement('textarea');

			textarea.value = 'abc';
			textarea.minLength = 6;

			expect(textarea.validity.tooShort).toBe(true);

			textarea.value = 'abcdef';

			expect(textarea.validity.tooShort).toBe(false);
		});
	});

	describe('get typeMismatch()', () => {
		it('Returns "true" for an "email" input field with a value that is not an email.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'name@domain.';
			input.type = 'email';

			expect(input.validity.typeMismatch).toBe(true);

			input.value = 'name@domain.com';

			expect(input.validity.typeMismatch).toBe(false);
		});

		it('Returns "true" for an "url" input field with a value that is not an URL.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.value = 'domain.com/path/';
			input.type = 'url';

			expect(input.validity.typeMismatch).toBe(true);

			input.value = 'https://domain.com/path/';

			expect(input.validity.typeMismatch).toBe(false);
		});
	});

	describe('get valueMissing()', () => {
		it('Returns "false" when required is set to "false".', () => {
			const input = <HTMLInputElement>document.createElement('input');

			expect(input.required).toBe(false);
			expect(input.validity.valueMissing).toBe(false);
		});

		it('Returns "true" when required is set to "true" for a "checkbox" input element where "checked" is set to "false".', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.type = 'checkbox';
			input.required = true;

			expect(input.checked).toBe(false);
			expect(input.validity.valueMissing).toBe(true);

			input.checked = true;

			expect(input.validity.valueMissing).toBe(false);
		});

		it('Returns "true" when required is set to "true" for a "radio" input element where "checked" is set to "false".', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.type = 'radio';
			input.required = true;

			expect(input.checked).toBe(false);
			expect(input.validity.valueMissing).toBe(true);

			input.checked = true;

			expect(input.validity.valueMissing).toBe(false);
		});

		it('Returns "true" when required is set to "true" for any element where "value" has not been set.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			input.required = true;

			expect(input.validity.valueMissing).toBe(true);

			input.value = 'value';

			expect(input.validity.valueMissing).toBe(false);
		});
	});

	describe('get valid()', () => {
		it('Returns "false" for an invalid field.', () => {
			const input = <HTMLInputElement>document.createElement('input');

			expect(input.validity.valid).toBe(true);

			input.required = true;

			expect(input.validity.valid).toBe(false);

			input.value = 'value';

			expect(input.validity.valid).toBe(true);

			input.type = 'email';

			expect(input.validity.valid).toBe(false);

			input.type = 'number';

			expect(input.validity.valid).toBe(false);

			input.type = 'url';

			expect(input.validity.valid).toBe(false);

			input.type = 'text';
			input.pattern = '[0-9]+';

			expect(input.validity.valid).toBe(false);

			input.value = '123';

			expect(input.validity.valid).toBe(true);

			input.type = 'number';

			expect(input.validity.valid).toBe(true);

			input.type = 'text';
			input.removeAttribute('pattern');
			input.minLength = 6;
			input.value = 'abc';

			expect(input.validity.valid).toBe(false);

			input.value = 'abcdef';

			expect(input.validity.valid).toBe(true);

			input.maxLength = 3;

			expect(input.validity.valid).toBe(false);

			input.maxLength = 6;

			expect(input.validity.valid).toBe(true);

			input.setCustomValidity('error');

			expect(input.validity.valid).toBe(false);

			input.setCustomValidity('');

			input.type = 'number';

			expect(input.validity.valid).toBe(false);
		});
	});
});
