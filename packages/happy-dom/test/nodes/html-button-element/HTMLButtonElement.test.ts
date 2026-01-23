import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLButtonElement from '../../../src/nodes/html-button-element/HTMLButtonElement.js';
import Event from '../../../src/event/Event.js';
import SubmitEvent from '../../../src/event/events/SubmitEvent';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement.js';
import ValidityState from '../../../src/validity-state/ValidityState.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';
import MouseEvent from '../../../src/event/events/MouseEvent.js';
import PointerEvent from '../../../src/event/events/PointerEvent.js';

describe('HTMLButtonElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLButtonElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLButtonElement>document.createElement('button');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLButtonElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLButtonElement]');
		});
	});

	describe('get value()', () => {
		it(`Returns the attribute "value".`, () => {
			element.setAttribute('value', 'VALUE');
			expect(element.value).toBe('VALUE');
		});
	});

	describe('set value()', () => {
		it(`Sets the attribute "value".`, () => {
			element.value = 'VALUE';
			expect(element.getAttribute('value')).toBe('VALUE');
		});
	});

	describe('get name()', () => {
		it(`Returns the attribute "name".`, () => {
			element.setAttribute('name', 'VALUE');
			expect(element.name).toBe('VALUE');
		});
	});

	describe('set name()', () => {
		it(`Sets the attribute "name".`, () => {
			element.name = 'VALUE';
			expect(element.getAttribute('name')).toBe('VALUE');
		});

		it(`Sets name as property in parent form elements.`, () => {
			const form = <HTMLFormElement>document.createElement('form');
			form.appendChild(element);
			element.name = 'button1';
			expect(form.elements['button1']).toBe(element);
		});

		it(`Sets name as property in parent element children.`, () => {
			const div = <HTMLElement>document.createElement('div');
			div.appendChild(element);
			element.name = 'button1';
			expect(div.children['button1']).toBe(element);
		});
	});

	describe(`get disabled()`, () => {
		it('Returns attribute value.', () => {
			expect(element.disabled).toBe(false);
			element.setAttribute('disabled', '');
			expect(element.disabled).toBe(true);
		});
	});

	describe(`set disabled()`, () => {
		it('Sets attribute value to false.', () => {
			element.disabled = false;
			expect(element.getAttribute('disabled')).toBe(null);
		});

		it('Sets attribute value to true.', () => {
			element.disabled = true;
			expect(element.getAttribute('disabled')).toBe('');
		});
	});

	describe('get type()', () => {
		it(`Defaults to "submit".`, () => {
			expect(element.type).toBe('submit');
		});

		it(`Returns the attribute "type".`, () => {
			element.setAttribute('type', 'menu');
			expect(element.type).toBe('menu');
		});

		it(`Sanitizes the value before returning.`, () => {
			element.setAttribute('type', 'reset');
			expect(element.type).toBe('reset');

			element.setAttribute('type', 'button');
			expect(element.type).toBe('button');

			element.setAttribute('type', 'submit');
			expect(element.type).toBe('submit');

			element.setAttribute('type', 'menu');
			expect(element.type).toBe('menu');

			element.setAttribute('type', 'MeNu');
			expect(element.type).toBe('submit');

			element.setAttribute('type', 'foobar');
			expect(element.type).toBe('submit');
		});
	});

	describe('set type()', () => {
		it(`Sets the attribute "type".`, () => {
			element.type = 'SuBmIt';
			expect(element.getAttribute('type')).toBe('SuBmIt');

			element.type = 'reset';
			expect(element.getAttribute('type')).toBe('reset');

			element.type = 'button';
			expect(element.getAttribute('type')).toBe('button');

			element.type = 'menu';
			expect(element.getAttribute('type')).toBe('menu');

			(<null>(<unknown>element.type)) = null;
			expect(element.getAttribute('type')).toBe('null');
		});
	});

	describe('get formAction()', () => {
		it('Returns attribute value.', () => {
			expect(element.formAction).toBe('about:blank');

			element.setAttribute('formaction', '/test/');

			expect(element.formAction).toBe('');

			window.happyDOM.setURL('https://localhost/path/');

			expect(element.formAction).toBe('https://localhost/test/');

			element.setAttribute('formaction', 'https://example.com');

			expect(element.formAction).toBe('https://example.com/');
		});
	});

	describe('set formAction()', () => {
		it('Sets attribute value.', () => {
			element.formAction = '/test/';

			expect(element.getAttribute('formaction')).toBe('/test/');

			element.formAction = 'https://example.com';

			expect(element.getAttribute('formaction')).toBe('https://example.com');
		});
	});

	describe('get formEnctype()', () => {
		it('Returns attribute value.', () => {
			expect(element.formEnctype).toBe('');
			element.setAttribute('formenctype', 'value');
			expect(element.formEnctype).toBe('value');
		});
	});

	describe('set formEnctype()', () => {
		it('Sets attribute value.', () => {
			element.formEnctype = 'value';
			expect(element.getAttribute('formenctype')).toBe('value');
		});
	});

	describe('get formMethod()', () => {
		it('Returns attribute value.', () => {
			expect(element.formMethod).toBe('');
			element.setAttribute('formmethod', 'value');
			expect(element.formMethod).toBe('value');
		});
	});

	describe('set formMethod()', () => {
		it('Sets attribute value.', () => {
			element.formMethod = 'value';
			expect(element.getAttribute('formmethod')).toBe('value');
		});
	});

	describe('get formNoValidate()', () => {
		it('Returns "true" if defined.', () => {
			expect(element.formNoValidate).toBe(false);
			element.setAttribute('formnovalidate', '');
			expect(element.formNoValidate).toBe(true);
		});
	});

	describe('set formNoValidate()', () => {
		it('Sets attribute value.', () => {
			element.formNoValidate = true;
			expect(element.getAttribute('formnovalidate')).toBe('');
		});
	});

	describe('get formTarget()', () => {
		it('Returns attribute value.', () => {
			expect(element.formTarget).toBe('');
			element.setAttribute('formtarget', 'value');
			expect(element.formTarget).toBe('value');
		});
	});

	describe('set formTarget()', () => {
		it('Sets attribute value.', () => {
			element.formTarget = 'value';
			expect(element.getAttribute('formtarget')).toBe('value');
		});
	});

	describe('get form()', () => {
		it('Returns null if no parent form element exists.', () => {
			expect(element.form).toBe(null);
		});

		it('Returns parent form element.', () => {
			const form = document.createElement('form');
			const div = document.createElement('div');
			div.appendChild(element);
			form.appendChild(div);
			expect(element.form).toBe(form);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when connecting node to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(null);
			document.body.appendChild(element);
			expect(element.form).toBe(form);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});

		it('Returns form element by id if the form attribute is set when element is connected to DOM.', () => {
			const form = document.createElement('form');
			form.id = 'form';
			document.body.appendChild(form);
			document.body.appendChild(element);
			element.setAttribute('form', 'form');
			expect(element.form).toBe(form);
			expect(Array.from(form.elements).includes(element)).toBe(true);
		});
	});

	describe('get validity()', () => {
		it('Returns an instance of ValidityState.', () => {
			expect(element.validity).toBeInstanceOf(ValidityState);
		});
	});

	describe('get validationMessage()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
		});
	});

	describe(`get labels()`, () => {
		it('Returns associated labels', () => {
			const label1 = document.createElement('label');
			const label2 = document.createElement('label');
			const parentLabel = document.createElement('label');

			label1.setAttribute('for', 'select1');
			label2.setAttribute('for', 'select1');

			element.id = 'select1';

			parentLabel.appendChild(element);
			document.body.appendChild(label1);
			document.body.appendChild(label2);
			document.body.appendChild(parentLabel);

			const labels = element.labels;

			expect(labels.length).toBe(3);
			expect(labels[0] === label1).toBe(true);
			expect(labels[1] === label2).toBe(true);
			expect(labels[2] === parentLabel).toBe(true);
		});
	});

	describe('get popoverTargetElement()', () => {
		it('Returns null by default', () => {
			expect(element.popoverTargetElement).toBe(null);
		});

		it('Returns the defined element if it exists', () => {
			const target = document.createElement('div');
			element.popoverTargetElement = target;
			expect(element.popoverTargetElement).toBe(target);
		});
	});

	describe('set popoverTargetElement()', () => {
		it('Sets the target element', () => {
			const target = document.createElement('div');
			element.popoverTargetElement = target;
			expect(element.popoverTargetElement).toBe(target);
		});

		it('Throws an error if the target element is not an instance of HTMLElement', () => {
			expect(() => {
				element.popoverTargetElement = <HTMLElement>(<unknown>'test');
			}).toThrow(
				new TypeError(
					`Failed to set the 'popoverTargetElement' property on 'HTMLInputElement': Failed to convert value to 'Element'.`
				)
			);
		});
	});

	describe('get popoverTargetAction()', () => {
		it('Returns "toggle" by default', () => {
			expect(element.popoverTargetAction).toBe('toggle');
		});

		it('Returns the attribute "popovertargetaction" if it exists', () => {
			element.setAttribute('popovertargetaction', 'hide');
			expect(element.popoverTargetAction).toBe('hide');

			element.setAttribute('popovertargetaction', 'show');
			expect(element.popoverTargetAction).toBe('show');

			element.setAttribute('popovertargetaction', 'toggle');
			expect(element.popoverTargetAction).toBe('toggle');
		});

		it('Returns "toggle" if the defined action is not valid', () => {
			element.setAttribute('popovertargetaction', 'invalid');
			expect(element.popoverTargetAction).toBe('toggle');
		});
	});

	describe('set popoverTargetAction()', () => {
		it('Sets the attribute "popovertargetaction"', () => {
			element.popoverTargetAction = 'hide';
			expect(element.getAttribute('popovertargetaction')).toBe('hide');

			element.popoverTargetAction = 'show';
			expect(element.getAttribute('popovertargetaction')).toBe('show');

			element.popoverTargetAction = 'toggle';
			expect(element.getAttribute('popovertargetaction')).toBe('toggle');

			element.popoverTargetAction = 'invalid';
			expect(element.getAttribute('popovertargetaction')).toBe('invalid');
		});
	});

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('button');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('button');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('button');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('button');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
		});
	});

	describe('setCustomValidity()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
			element.setCustomValidity(<string>(<unknown>null));
			expect(element.validationMessage).toBe('null');
			element.setCustomValidity('');
			expect(element.validationMessage).toBe('');
		});
	});

	for (const method of ['checkValidity', 'reportValidity']) {
		describe(`${method}()`, () => {
			it('Returns "true" if the field is "disabled".', () => {
				element.setCustomValidity('error');
				element.disabled = true;
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field type is "reset".', () => {
				element.setCustomValidity('error');
				element.type = 'reset';
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field type is "button".', () => {
				element.setCustomValidity('error');
				element.type = 'button';
				expect(element[method]()).toBe(true);
			});

			it('Returns "false" if invalid.', () => {
				element.setCustomValidity('error');
				expect(element[method]()).toBe(false);
			});

			it('Triggers an "invalid" event when invalid.', () => {
				element.setCustomValidity('error');
				let dispatchedEvent: Event | null = null;
				element.addEventListener('invalid', (event: Event) => (dispatchedEvent = event));
				element[method]();
				expect((<Event>(<unknown>dispatchedEvent)).type).toBe('invalid');
			});
		});
	}

	describe('dispatchEvent()', () => {
		it('Submits form if type is "submit" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLButtonElement>document.createElement('button');

			let submitTriggeredCount = 0;

			// "submit" is the default type
			// button.type = 'submit';

			form.appendChild(button);

			document.body.appendChild(form);

			let submitter: HTMLElement | null = null;
			form.addEventListener('submit', (event) => {
				submitTriggeredCount++;
				submitter = (<SubmitEvent>event).submitter;
			});

			button.dispatchEvent(new MouseEvent('click'));

			expect(submitTriggeredCount).toBe(1);
			expect(submitter).toBe(button);
		});

		it('Submits form associated by ID if type is "submit" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLButtonElement>document.createElement('button');

			let submitTriggeredCount = 0;

			form.id = 'test-form';
			button.setAttribute('form', 'test-form');

			document.body.appendChild(form);
			document.body.appendChild(button);

			let submitter: HTMLElement | null = null;
			form.addEventListener('submit', (event) => {
				submitTriggeredCount++;
				submitter = (<SubmitEvent>event).submitter;
			});

			button.dispatchEvent(new PointerEvent('click'));

			expect(submitTriggeredCount).toBe(1);
			expect(submitter).toBe(button);
		});

		it('Resets form if type is "reset" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLButtonElement>document.createElement('button');

			let resetTriggeredCount = 0;

			button.type = 'reset';

			form.appendChild(button);

			document.body.appendChild(form);

			form.addEventListener('reset', () => resetTriggeredCount++);

			button.click();

			expect(resetTriggeredCount).toBe(1);
		});

		it('Resets form associated by ID if type is "reset" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLButtonElement>document.createElement('button');

			let resetTriggeredCount = 0;

			form.id = 'test-form';
			button.type = 'reset';
			button.setAttribute('form', 'test-form');

			document.body.appendChild(form);
			document.body.appendChild(button);

			form.addEventListener('reset', () => resetTriggeredCount++);

			button.click();

			expect(resetTriggeredCount).toBe(1);
		});
	});
});
