import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';
import type HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import type HTMLFormElement from '../../src/nodes/html-form-element/HTMLFormElement.js';
import type ElementInternals from '../../src/element-internals/ElementInternals.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('ElementInternals', () => {
	let window: Window;
	let document: Document;
	let element: HTMLElement;
	let internals: ElementInternals;

	beforeEach(() => {
		window = new Window();
		document = window.document;

		/* eslint-disable jsdoc/require-jsdoc */
		class FormAssociatedElement extends window.HTMLElement {
			public static formAssociated = true;
		}
		/* eslint-enable jsdoc/require-jsdoc */

		window.customElements.define('form-associated-element', FormAssociatedElement);

		element = <HTMLElement>document.createElement('form-associated-element');
		internals = element.attachInternals();
	});

	describe('get form()', () => {
		it('Returns null when not associated with a form.', () => {
			expect(internals.form).toBe(null);
		});

		it('Returns the nearest ancestor form.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			form.appendChild(element);
			document.body.appendChild(form);

			expect(internals.form).toBe(form);
		});

		it('Returns the form referenced by the "form" attribute.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			form.id = 'testForm';
			element.setAttribute('form', 'testForm');
			document.body.appendChild(form);
			document.body.appendChild(element);

			expect(internals.form).toBe(form);
		});
	});

	describe('get labels()', () => {
		it('Returns labels associated by the "for" attribute.', () => {
			const label = document.createElement('label');
			element.id = 'testElement';
			label.setAttribute('for', 'testElement');
			document.body.appendChild(label);
			document.body.appendChild(element);

			expect(Array.from(internals.labels)).toEqual([label]);
		});
	});

	describe('get willValidate()', () => {
		it('Returns "true" when the element is not disabled.', () => {
			expect(internals.willValidate).toBe(true);
		});

		it('Returns "false" when the element has a "disabled" attribute.', () => {
			element.setAttribute('disabled', '');

			expect(internals.willValidate).toBe(false);
		});
	});

	describe('setValidity()/checkValidity()/reportValidity()/get validity()/get validationMessage()', () => {
		it('Is valid by default.', () => {
			expect(internals.checkValidity()).toBe(true);
			expect(internals.reportValidity()).toBe(true);
			expect(internals.validity.valid).toBe(true);
			expect(internals.validationMessage).toBe('');
		});

		it('Exposes every constraint flag, defaulting unset ones to "false".', () => {
			expect(internals.validity.valueMissing).toBe(false);
			expect(internals.validity.customError).toBe(false);
			expect(internals.validity.typeMismatch).toBe(false);

			internals.setValidity({ customError: true }, 'Something went wrong');

			expect(internals.validity.customError).toBe(true);
			expect(internals.validity.valueMissing).toBe(false);
		});

		it('Becomes invalid after setValidity() is called with a truthy flag.', () => {
			internals.setValidity({ customError: true }, 'Something went wrong');

			expect(internals.checkValidity()).toBe(false);
			expect(internals.reportValidity()).toBe(false);
			expect(internals.validity.valid).toBe(false);
			expect(internals.validity.customError).toBe(true);
			expect(internals.validationMessage).toBe('Something went wrong');
		});

		it('Becomes valid again after setValidity() is called with an empty flags object.', () => {
			internals.setValidity({ customError: true }, 'Something went wrong');
			internals.setValidity({});

			expect(internals.checkValidity()).toBe(true);
			expect(internals.validationMessage).toBe('');
		});
	});
});
