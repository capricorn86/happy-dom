import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLButtonElement from '../../../src/nodes/html-button-element/HTMLButtonElement';
import Event from '../../../src/event/Event';
import IHTMLElement from '../../../src/nodes/html-element/IHTMLElement';
import IHTMLFormElement from '../../../src/nodes/html-form-element/IHTMLFormElement';
import ValidityState from '../../../src/validity-state/ValidityState';

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
			const form = <IHTMLFormElement>document.createElement('form');
			form.appendChild(element);
			element.name = 'button1';
			expect(form.elements['button1']).toBe(element);
		});

		it(`Sets name as property in parent element children.`, () => {
			const div = <IHTMLElement>document.createElement('div');
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
		it('Sets attribute value.', () => {
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

			element.setAttribute('type', 'MeNu');
			expect(element.type).toBe('menu');

			element.setAttribute('type', 'foobar');
			expect(element.type).toBe('submit');
		});
	});

	describe('set type()', () => {
		it(`Sets the attribute "type" after sanitizing.`, () => {
			element.type = 'SuBmIt';
			expect(element.getAttribute('type')).toBe('submit');

			element.type = 'reset';
			expect(element.getAttribute('type')).toBe('reset');

			element.type = 'button';
			expect(element.getAttribute('type')).toBe('button');

			element.type = 'menu';
			expect(element.getAttribute('type')).toBe('menu');

			element.type = null;
			expect(element.getAttribute('type')).toBe('submit');
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

	describe(`get form()`, () => {
		it('Returns parent form.', () => {
			const form = <IHTMLFormElement>document.createElement('form');
			form.appendChild(element);
			expect(element.form).toBe(form);
			form.removeChild(element);
			expect(element.form).toBe(null);
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

	describe('setCustomValidity()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
			element.setCustomValidity(null);
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
				expect(dispatchedEvent.type).toBe('invalid');
			});
		});
	}
});
