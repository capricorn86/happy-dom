import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLInputElement from '../../../src/nodes/html-input-element/HTMLInputElement.js';
import DOMException from '../../../src/exception/DOMException.js';
import File from '../../../src/file/File.js';
import Event from '../../../src/event/Event.js';
import HTMLInputElementSelectionModeEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionModeEnum.js';
import HTMLInputElementSelectionDirectionEnum from '../../../src/nodes/html-input-element/HTMLInputElementSelectionDirectionEnum.js';
import ValidityState from '../../../src/validity-state/ValidityState.js';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import SubmitEvent from '../../../src/event/events/SubmitEvent.js';
import { beforeEach, describe, it, expect } from 'vitest';
import PointerEvent from '../../../src/event/events/PointerEvent.js';
import MouseEvent from '../../../src/event/events/MouseEvent.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';

describe('HTMLInputElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLInputElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLInputElement>document.createElement('input');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLInputElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLInputElement]');
		});
	});

	for (const event of ['input', 'invalid', 'selectionchange']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	describe('get value()', () => {
		for (const type of ['hidden', 'submit', 'image', 'reset', 'button']) {
			it(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.value).toBe('VALUE');
			});
		}

		for (const type of ['checkbox', 'radio']) {
			it(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.value).toBe('VALUE');
			});

			it(`Returns "on" if the attribute "value" has not been set and type is "${type}".`, () => {
				element.type = type;
				expect(element.value).toBe('on');
			});
		}

		for (const type of ['text', 'search', 'url', 'tel', 'password']) {
			it(`Returns the attribute "value" if type is "${type}".`, () => {
				element.type = type;
				element.setAttribute('value', 'VALUE');
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
				expect(element.value).toBe('VALUE');
			});
		}

		it('Returns "/fake/path/[filename]" if type is "file".', () => {
			const file = new File(['TEST'], 'filename.jpg');
			element.type = 'file';
			element.files.push(file);
			expect(element.value).toBe('/fake/path/filename.jpg');
		});
	});

	describe('set value()', () => {
		for (const type of ['hidden', 'submit', 'image', 'reset', 'button', 'checkbox', 'radio']) {
			it(`Sets the attribute "value" to the value if type is "${type}".`, () => {
				element.type = type;
				element.value = 'VALUE';
				expect(element.getAttribute('value')).toBe('VALUE');
				element.value = null;
				expect(element.getAttribute('value')).toBe('');
				element.value = <string>(<unknown>undefined);
				expect(element.getAttribute('value')).toBe('undefined');
			});
		}

		it('Throws an exception if a value other than empty string is provided and type is "file".', () => {
			element.type = 'file';
			expect(() => {
				element.value = 'TEST';
			}).toThrow(
				'Input elements of type "file" may only programmatically set the value to empty string.'
			);
		});

		it('Accepts an empty string if type is "file".', () => {
			const fileList = element.files;
			element.type = 'file';
			element.value = '';
			expect(element.files).not.toBe(fileList);
			expect(element.files.length).toBe(0);
		});

		it('Accepts null if type is "file".', () => {
			const fileList = element.files;
			element.type = 'file';
			element.value = null;
			expect(element.files).not.toBe(fileList);
			expect(element.files.length).toBe(0);
		});

		it('Trims the value if type is "email".', () => {
			element.type = 'email';
			element.value = '  \n\rtest@test.com  ';
			expect(element.value).toBe('test@test.com');
		});

		it('Trims each email address in the value if type is "email" and "multiple" is set to "true".', () => {
			element.type = 'email';
			element.setAttribute('multiple', 'multiple');
			element.value = '  \n\rtest@test.com , test2@test.com  ';

			expect(element.value).toBe('test@test.com,test2@test.com');
		});

		for (const type of ['password', 'search', 'tel', 'text']) {
			it(`Removes new lines if type is "${type}".`, () => {
				element.type = type;
				element.value = '\n\rVALUE\n\r';
				expect(element.value).toBe('VALUE');
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
			});

			it(`Sets selection range.`, () => {
				element.type = type;
				element.selectionDirection = HTMLInputElementSelectionDirectionEnum.forward;
				element.value = 'VALUE';
				expect(element.selectionStart).toBe(5);
				expect(element.selectionEnd).toBe(5);
				expect(element.selectionDirection).toBe(HTMLInputElementSelectionDirectionEnum.none);
			});
		}

		it('Sets the value if the value is a valid hex code and type is "color".', () => {
			element.type = 'color';
			element.value = '#333333';
			expect(element.value).toBe('#333333');
		});

		it('Sets the value to "#000000" if the value is not a valid hex code and type is "color".', () => {
			element.type = 'color';
			element.value = 'test';
			expect(element.value).toBe('#000000');
			element.value = '#111';
			expect(element.value).toBe('#000000');
		});

		it('Sets the value if it is a valid number and type is "number".', () => {
			element.type = 'number';
			element.value = '10';
			expect(element.value).toBe('10');
		});

		it('Sets the value to empty string if the value is not a valid number and type is "number".', () => {
			element.type = 'number';
			element.value = 'test';
			expect(element.value).toBe('');
		});

		it('Sets the value to "50" if no min or max has been set, the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.value = 'test';
			expect(element.value).toBe('50');
		});

		it('Sets the value to "25" if max has been set to "50", the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.max = '50';
			element.value = 'test';
			expect(element.value).toBe('25');
		});

		it('Sets the value to "40" if min is set to "20" and max is set to "60", the value is an invalid number and the type is "range".', () => {
			element.type = 'range';
			element.min = '20';
			element.max = '60';
			element.value = 'test';
			expect(element.value).toBe('40');
		});

		it('Sets the value to "40" if min is set to "40", the value is out of range and the type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '20';
			expect(element.value).toBe('40');
		});

		it('Sets the value to "80" if max is set to "80", the value is out of range and the type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '100';
			expect(element.value).toBe('80');
		});

		it('Sets the value if it is valid, within range and type is "range".', () => {
			element.type = 'range';
			element.min = '40';
			element.max = '80';
			element.value = '60';
			expect(element.value).toBe('60');
		});

		it('Trims and removes new lines if type is "url".', () => {
			element.type = 'url';
			element.value = '  \n\rhttp://www.test.com\n\r ';
			expect(element.value).toBe('http://www.test.com');
		});

		it('Converts null to empty string.', () => {
			element.type = 'text';
			element.value = 'test';
			element.value = null;
			expect(element.value).toBe('');
			element.value = <string>(<unknown>undefined);
			expect(element.value).toBe('undefined');
		});
	});

	describe('get valueAsNumber()', () => {
		describe('Should return NaN for non-numeric input type', () => {
			for (const type of [
				'button',
				'checkbox',
				'color',
				'email',
				'file',
				'hidden',
				'image',
				'password',
				'radio',
				'reset',
				'search',
				'submit',
				'tel',
				'text',
				'url'
			]) {
				it(`"${type}"`, () => {
					element.setAttribute('type', type);
					if (type === 'file') {
						element.value = '';
					} else {
						element.value = '0';
					}
					expect(element.valueAsNumber).toBeNaN();
				});
			}
		});
		describe('with default value', () => {
			for (const type of ['date', 'datetime-local', 'month', 'number', 'time', 'week']) {
				it(`Should return NaN for type ${type}.`, () => {
					element.type = type;
					element.value = '';
					expect(element.valueAsNumber).toBeNaN();
				});
			}
			it(`Should return middle range value for type "range".`, () => {
				element.type = 'range';
				element.value = '';
				const min = element.min ? parseFloat(element.min) : 0;
				const max = element.max ? parseFloat(element.max) : 100;
				expect(element.valueAsNumber).toBe((max - min) / 2);
			});
		});

		describe('With valid value', () => {
			const testData: { type: string; value: string; want: number }[] = [
				{ type: 'number', value: '123', want: 123 },
				{ type: 'number', value: '1.23', want: 1.23 },
				{ type: 'range', value: '75', want: 75 },
				{ type: 'range', value: '12.5', want: 12.5 },
				{ type: 'date', value: '2019-01-01', want: new Date('2019-01-01').getTime() },
				{
					type: 'datetime-local',
					value: '2019-01-01T00:00',
					want:
						new Date('2019-01-01T00:00').getTime() -
						new Date('2019-01-01T00:00').getTimezoneOffset() * 60000
				},
				{ type: 'month', value: '2019-01', want: 588 },
				{ type: 'time', value: '00:00', want: 0 },
				{ type: 'time', value: '12:00', want: 43200000 },
				{ type: 'time', value: '18:55', want: 68100000 },
				{ type: 'week', value: '2023-W22', want: 1685318400000 }
			];
			it.each(testData)(`Should return valid number for type $type`, ({ type, value, want }) => {
				element.type = type;
				element.value = value;
				expect(element.valueAsNumber).toEqual(want);
			});
		});
	});
	describe('set valueAsNumber()', () => {
		describe('Should throw exception for non-numeric input', () => {
			it.each([
				'button',
				'checkbox',
				'color',
				'email',
				'file',
				'hidden',
				'image',
				'password',
				'radio',
				'reset',
				'search',
				'submit',
				'tel',
				'text',
				'url'
			])('Of type %s.', (type) => {
				element.type = type;
				expect(() => (element.valueAsNumber = 0)).toThrowError(
					new DOMException(
						"Failed to set the 'valueAsNumber' property on 'HTMLInputElement': This input element does not support Number values.",
						DOMExceptionNameEnum.invalidStateError
					)
				);
			});
		});

		describe('With invalid value for', () => {
			it.each(['number', 'date', 'datetime-local', 'month', 'time', 'week'])(
				'Type "%s" should set default empty value.',
				(type) => {
					element.type = type;
					expect(() => {
						// @ts-ignore
						element.valueAsNumber = 'x';
					}).not.toThrow();
					expect(element.value).toBe('');
				}
			);
			it(`Type "range" should set default middle range value.`, () => {
				element.type = 'range';
				expect(() => {
					// @ts-ignore
					element.valueAsNumber = 'x';
				}).not.toThrow();
				expect(element.value).toBe('50');
			});
		});

		describe('With valid value for', () => {
			const testCases = [
				{ type: 'number', value: 123, want: '123' },
				{ type: 'number', value: 1.23, want: '1.23' },
				{ type: 'range', value: 75, want: '75' },
				{ type: 'range', value: 12.5, want: '12.5' },
				{ type: 'date', value: new Date('2019-01-01').getTime(), want: '2019-01-01' },
				{ type: 'datetime-local', value: 1546300800000, want: '2019-01-01T00:00' },
				{ type: 'month', value: 588, want: '2019-01' },
				{ type: 'time', value: 0, want: '00:00' },
				{ type: 'time', value: 43200000, want: '12:00' },
				{ type: 'time', value: 68100000, want: '18:55' },
				{ type: 'time', value: 83709010, want: '23:15:09.01' },
				{ type: 'week', value: 1685318400000, want: '2023-W22' },
				{ type: 'week', value: 1672531200000, want: '2022-W52' }
			];
			it.each(testCases)(
				`Type "$type" should set a corresponding value`,
				({ type, value, want }) => {
					element.type = type;
					element.valueAsNumber = value;
					expect(element.value).toEqual(want);
				}
			);
		});
	});

	describe('get valueAsDate()', () => {
		it.each([
			'button',
			'checkbox',
			'color',
			'date',
			'datetime-local',
			'email',
			'file',
			'hidden',
			'image',
			'month',
			'number',
			'password',
			'radio',
			'range',
			'reset',
			'search',
			'submit',
			'tel',
			'text',
			'time',
			'url',
			'week'
		])(`Should return null for type '%s' with default value`, (type) => {
			element.type = type;
			element.value = '';
			expect(element.valueAsDate).toBeNull();
		});
		it.each(<{ type: string; value: string; want: Date | null }[]>[
			{ type: 'date', value: '2019-01-01', want: new Date('2019-01-01T00:00Z') },
			{ type: 'month', value: '2019-01', want: new Date('2019-01-01') },
			{ type: 'time', value: '00:00', want: new Date('1970-01-01T00:00Z') },
			{ type: 'time', value: '12:00', want: new Date('1970-01-01T12:00Z') },
			{ type: 'time', value: '18:55', want: new Date('1970-01-01T18:55Z') },
			{ type: 'week', value: '1981-W01', want: new Date('1980-12-29T00:00Z') },
			{ type: 'week', value: '2023-W22', want: new Date('2023-05-29T00:00Z') }
		])(`Should return valid date for type $type with valid value`, ({ type, value, want }) => {
			element.type = type;
			element.value = value;
			expect(element.valueAsDate).toEqual(want);
		});
	});

	describe('set valueAsDate()', () => {
		const dateInputs = ['date', 'month', 'time', 'week'];
		it.each([
			'button',
			'checkbox',
			'color',
			'datetime-local',
			'email',
			'file',
			'hidden',
			'image',
			'number',
			'password',
			'radio',
			'range',
			'reset',
			'search',
			'submit',
			'tel',
			'text',
			'url'
		])('Should throw for type "%s"', (type) => {
			element.type = type;
			expect(() => {
				element.valueAsDate = new Date();
			}).toThrow(
				new DOMException(
					"Failed to set the 'valueAsDate' property on 'HTMLInputElement': This input element does not support Date values.",
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});
		it('Should throw with invalid value', () => {
			element.type = 'date';
			expect(() => {
				// @ts-ignore
				element.valueAsDate = 'x';
			}).toThrow(
				new TypeError(
					"Failed to set the 'valueAsDate' property on 'HTMLInputElement': Failed to convert value to 'object'."
				)
			);
			expect(() => {
				// @ts-ignore
				element.valueAsDate = {};
			}).toThrow(
				new TypeError(
					"Failed to set the 'valueAsDate' property on 'HTMLInputElement': The provided value is not a Date."
				)
			);
		});
		it.each(dateInputs)('Should accept Date object for type "%s"', (type) => {
			element.type = type;
			expect(() => {
				element.valueAsDate = new Date();
			}).not.toThrow();
		});
		it.each(dateInputs)('Should accept null for type "%s"', (type) => {
			element.type = type;
			expect(() => {
				element.valueAsDate = null;
			}).not.toThrow();
			expect(element.value).toBe('');
		});
		it.each([
			{ type: 'date', value: new Date('2019-01-01T00:00+01:00'), want: '2018-12-31' },
			{ type: 'month', value: new Date('2019-01-01T00:00+01:00'), want: '2018-12' },
			{ type: 'time', value: new Date('2019-01-01T00:00+01:00'), want: '23:00' },
			{ type: 'week', value: new Date('1982-01-03T00:00Z'), want: '1981-W53' }
		])(`Should set UTC value for type $type with valid date object`, ({ type, value, want }) => {
			element.type = type;
			element.valueAsDate = value;
			expect(element.value).toEqual(want);
		});
	});

	describe('get selectionStart()', () => {
		it('Returns the length of the attribute "value" if value has not been set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			expect(element.selectionStart).toBe(10);
		});

		it('Returns the length of the value set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionStart = 5;
			expect(element.selectionStart).toBe(5);
		});
	});

	describe('set selectionStart()', () => {
		it('Sets the value to the length of the property "value" if it is out of range.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionStart = 20;
			expect(element.selectionStart).toBe(10);
		});

		it('Sets the property.', () => {
			element.value = 'TEST_VALUE';
			element.selectionStart = 5;
			expect(element.selectionStart).toBe(5);
		});
	});

	describe('get selectionEnd()', () => {
		it('Returns the length of the attribute "value" if value has not been set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			expect(element.selectionEnd).toBe(10);
		});

		it('Returns the length of the value set using the property.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionEnd = 5;
			expect(element.selectionEnd).toBe(5);
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

	describe('get list()', () => {
		it('Returns null if the attribute "list" is not set.', () => {
			expect(element.list).toBe(null);
		});

		it('Returns null if no associated list element matches the attribuge "list".', () => {
			element.setAttribute('list', 'datalist');
			expect(element.list).toBe(null);
		});

		it('Returns the associated datalist element.', () => {
			const datalist = document.createElement('datalist');
			datalist.id = 'list_id';
			document.body.appendChild(datalist);
			element.setAttribute('list', 'list_id');
			expect(element.list).toBe(datalist);
		});

		it('Finds datalist inside a shadowroot.', () => {
			/* eslint-disable-next-line jsdoc/require-jsdoc */
			class MyComponent extends window.HTMLElement {
				/* eslint-disable-next-line jsdoc/require-jsdoc */
				constructor() {
					super();
					this.attachShadow({ mode: 'open' });
					if (this.shadowRoot) {
						this.shadowRoot.innerHTML = `
                            <datalist id="list_id">
                                <option value="1">
                                <option value="2">
                            </datalist>
                            <input list="list_id">
                        `;
					}
				}
			}
			window.customElements.define('my-component', MyComponent);
			const component = document.createElement('my-component');
			document.body.appendChild(component);
			const input = component.shadowRoot?.querySelector('input');
			const list = component.shadowRoot?.querySelector('datalist');
			expect(input?.list === list).toBe(true);
		});
	});

	describe('set selectionEnd()', () => {
		it('Sets the value to the length of the property "value" if it is out of range.', () => {
			element.setAttribute('value', 'TEST_VALUE');
			element.selectionEnd = 20;
			expect(element.selectionEnd).toBe(10);
		});

		it('Sets the property.', () => {
			element.value = 'TEST_VALUE';
			element.selectionEnd = 5;
			expect(element.selectionEnd).toBe(5);
		});
	});

	for (const property of ['disabled', 'autofocus', 'required', 'multiple', 'readOnly']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(false);
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});
		});
	}

	for (const property of [
		'name',
		'alt',
		'src',
		'accept',
		'allowdirs',
		'autocomplete',
		'min',
		'max',
		'pattern',
		'placeholder',
		'step',
		'inputMode'
	]) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe('');
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	for (const property of ['height', 'width']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(0);
				element[property] = 20;
				expect(element[property]).toBe(20);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element.setAttribute(property, '50');
				expect(element[property]).toBe(0);
				element[property] = 50;
				expect(element[property]).toBe(50);
				expect(element.getAttribute(property)).toBe('50');
			});
		});
	}

	for (const property of ['minLength', 'maxLength']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(-1);
				element.setAttribute(property, '50');
				expect(element[property]).toBe(50);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = 50;
				expect(element[property]).toBe(50);
				expect(element.getAttribute(property)).toBe('50');
			});
		});
	}

	describe('get checked()', () => {
		it('Returns attribute value if not set.', () => {
			element.setAttribute('checked', '');
			expect(element.checked).toBe(true);
		});

		it('Returns checked state overriding the attribute when set', () => {
			element.setAttribute('checked', '');
			element.checked = false;
			expect(element.checked).toBe(false);
		});
	});

	describe('set checked()', () => {
		it('Sets the checked state.', () => {
			element.setAttribute('checked', '');
			element.checked = true;
			element.removeAttribute('checked');

			expect(element.checked).toBe(true);
		});

		it('Unchecks other radio buttons with the same name in a form.', () => {
			const form = document.createElement('form');
			const radio1 = <HTMLInputElement>document.createElement('input');
			const radio2 = <HTMLInputElement>document.createElement('input');
			const radio3 = <HTMLInputElement>document.createElement('input');

			radio1.type = 'radio';
			radio2.type = 'radio';
			radio3.type = 'radio';

			radio1.name = 'radio';
			radio2.name = 'radio';
			radio3.name = 'radio';

			form.appendChild(radio1);
			form.appendChild(radio2);
			form.appendChild(radio3);

			radio1.checked = true;

			expect(radio1.checked).toBe(true);
			expect(radio2.checked).toBe(false);
			expect(radio3.checked).toBe(false);

			radio2.checked = true;

			expect(radio1.checked).toBe(false);
			expect(radio2.checked).toBe(true);
			expect(radio3.checked).toBe(false);
		});

		it('Unchecks other radio buttons with the same name outside of a form', () => {
			const radio1 = <HTMLInputElement>document.createElement('input');
			const radio2 = <HTMLInputElement>document.createElement('input');
			const radio3 = <HTMLInputElement>document.createElement('input');

			radio1.type = 'radio';
			radio2.type = 'radio';
			radio3.type = 'radio';

			radio1.name = 'radio';
			radio2.name = 'radio';
			radio3.name = 'radio';

			document.body.appendChild(radio1);
			document.body.appendChild(radio2);
			document.body.appendChild(radio3);

			radio1.checked = true;

			expect(radio1.checked).toBe(true);
			expect(radio2.checked).toBe(false);
			expect(radio3.checked).toBe(false);

			radio2.checked = true;

			expect(radio1.checked).toBe(false);
			expect(radio2.checked).toBe(true);
			expect(radio3.checked).toBe(false);
		});
	});

	describe('get type()', () => {
		it('Returns attribute value.', () => {
			expect(element.type).toBe('text');
			element.setAttribute('type', 'date');
			expect(element.type).toBe('date');
		});
	});

	describe('set type()', () => {
		it('Sets attribute value.', () => {
			element.type = 'date';
			expect(element.getAttribute('type')).toBe('date');
		});
	});

	describe('get indeterminate()', () => {
		it('Returns indeterminate  value.', () => {
			element.type = 'checkbox';
			expect(element.indeterminate).toBe(false);
			expect(element.hasAttribute('indeterminate')).toBe(false);
		});
	});

	describe('set indeterminate()', () => {
		it('Sets indeterminate  value.', () => {
			element.type = 'checkbox';
			element.indeterminate = true;
			expect(element.indeterminate).toBe(true);
			expect(element.hasAttribute('indeterminate')).toBe(false);
		});
	});

	describe('get size()', () => {
		it('Returns attribute value.', () => {
			expect(element.size).toBe(20);
			element.size = 50;
			expect(element.size).toBe(50);
		});
	});

	describe('set size()', () => {
		it('Sets attribute value.', () => {
			element.setAttribute('size', '50');
			expect(element.size).toBe(50);
			element.size = 60;
			expect(element.size).toBe(60);
			expect(element.getAttribute('size')).toBe('60');
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

		it('Returns associated labels for elements with no ID', () => {
			const parentLabel = document.createElement('label');

			element.id = '';

			parentLabel.appendChild(element);
			document.body.appendChild(parentLabel);

			const labels = element.labels;

			expect(labels.length).toBe(1);
			expect(labels[0] === parentLabel).toBe(true);
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

	describe('get defaultChecked()', () => {
		it('Returns true if the attribute "checked" has been set.', () => {
			expect(element.defaultChecked).toBe(false);
			element.setAttribute('checked', '');
			expect(element.defaultChecked).toBe(true);
		});
	});

	describe('set defaultChecked()', () => {
		it('Sets the attribute "checked".', () => {
			element.defaultChecked = true;
			expect(element.getAttribute('checked')).toBe('');
			element.defaultChecked = false;
			expect(element.getAttribute('checked')).toBe(null);
		});
	});

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('input');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('input');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('input');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('input');
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

	describe('select()', () => {
		it('Selects all text.', () => {
			let triggeredEvent: Event | null = null;
			element.addEventListener('select', (event) => (triggeredEvent = event));
			element.value = 'TEST_VALUE';
			element.select();
			expect(element.selectionStart).toBe(0);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe('none');
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('select');
		});
	});

	describe('setSelectionRange()', () => {
		it('Sets selection range.', () => {
			let triggeredEvent: Event | null = null;
			element.addEventListener('select', (event) => (triggeredEvent = event));
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 5, 'forward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(5);
			expect(element.selectionDirection).toBe('forward');
			expect((<Event>(<unknown>triggeredEvent)).type).toBe('select');
		});

		it('Sets selection end to the value length if out of range.', () => {
			element.value = 'TEST_VALUE';
			element.setSelectionRange(1, 100, 'backward');
			expect(element.selectionStart).toBe(1);
			expect(element.selectionEnd).toBe(10);
			expect(element.selectionDirection).toBe('backward');
		});
	});

	describe('disabled input', () => {
		it("doesn't focus the input when it's disabled", () => {
			document.body.appendChild(element);
			element.focus();
			expect(element).toBe(document.activeElement);
			element.blur();
			expect(element).not.toBe(document.activeElement);
			element.disabled = true;
			element.focus();
			expect(element).not.toBe(document.activeElement);
		});

		it("doesn't blur the input when it's disabled", () => {
			document.body.appendChild(element);
			element.focus();
			expect(element).toBe(document.activeElement);
			element.blur();
			expect(element).not.toBe(document.activeElement);
			element.disabled = true;
			element.blur();
			expect(element).not.toBe(document.activeElement);
		});
	});

	describe('setRangeText()', () => {
		it('Sets a range text with selection mode set to "preserve".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5);
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		it('Sets a range text with selection mode set to "select".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.select);
			expect(element.selectionStart).toBe(4);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		it('Sets a range text with selection mode set to "start".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.start);
			expect(element.selectionStart).toBe(4);
			expect(element.selectionEnd).toBe(4);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});

		it('Sets a range text with selection mode set to "end".', () => {
			element.value = 'TEST_VALUE';
			element.setRangeText('_NEW_', 4, 5, HTMLInputElementSelectionModeEnum.end);
			expect(element.selectionStart).toBe(14);
			expect(element.selectionEnd).toBe(14);
			expect(element.value).toBe('TEST_NEW_VALUE');
		});
	});

	for (const method of ['checkValidity', 'reportValidity']) {
		describe(`${method}()`, () => {
			it('Returns "true" if the field is "disabled".', () => {
				element.required = true;
				element.disabled = true;
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field is "readOnly".', () => {
				element.required = true;
				element.readOnly = true;
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field type is "hidden".', () => {
				element.required = true;
				element.type = 'hidden';
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field type is "reset".', () => {
				element.required = true;
				element.type = 'reset';
				expect(element[method]()).toBe(true);
			});

			it('Returns "true" if the field type is "button".', () => {
				element.required = true;
				element.type = 'button';
				expect(element[method]()).toBe(true);
			});

			it('Returns "false" if invalid.', () => {
				element.required = true;
				expect(element[method]()).toBe(false);
			});

			it('Triggers an "invalid" event when invalid.', () => {
				element.required = true;
				let dispatchedEvent: Event | null = null;
				element.addEventListener('invalid', (event: Event) => (dispatchedEvent = event));
				element[method]();
				expect((<Event>(<unknown>dispatchedEvent)).type).toBe('invalid');
			});
		});
	}

	describe('stepUp()', () => {
		it('Steps up with default value.', () => {
			element.type = 'number';
			element.stepUp();
			expect(element.value).toBe('1');
		});

		it('Steps up with defined increment value.', () => {
			element.type = 'number';
			element.value = '1';
			element.stepUp(3);
			expect(element.value).toBe('4');
		});

		it('Throws exception when invalid type.', () => {
			expect(() => element.stepUp()).toThrowError(
				new DOMException('This form element is not steppable.')
			);
		});
	});

	describe('stepDown()', () => {
		it('Steps up with default value.', () => {
			element.type = 'number';
			element.stepDown();
			expect(element.value).toBe('-1');
		});

		it('Steps up with defined increment value.', () => {
			element.type = 'number';
			element.value = '1';
			element.stepDown(3);
			expect(element.value).toBe('-2');
		});

		it('Throws exception when invalid type.', () => {
			expect(() => element.stepDown()).toThrowError(
				new DOMException('This form element is not steppable.')
			);
		});
	});

	describe('cloneNode()', () => {
		it('Clones when type is "checkbox".', () => {
			window.happyDOM.setURL('https://www.example.com/path/');

			element.type = 'checkbox';

			const clone = element.cloneNode(true);

			expect(clone.formAction).toBe(element.formAction);
			expect(clone.formMethod).toBe(element.formMethod);
			expect(clone.formNoValidate).toBe(element.formNoValidate);
			expect(clone.value).toBe(element.value);
			expect(clone.height).toBe(element.height);
			expect(clone.width).toBe(element.width);
			expect(clone.defaultChecked).toBe(element.defaultChecked);
			expect(clone.files).toEqual(element.files);
			expect(clone.selectionStart).toBe(element.selectionStart);
			expect(clone.selectionEnd).toBe(element.selectionEnd);
			expect(clone.selectionDirection).toBe(element.selectionDirection);
		});

		it('Clones when type is "search".', () => {
			window.happyDOM.setURL('https://www.example.com/path/');

			element.type = 'search';
			element.value = 'TEST_VALUE';
			element.selectionStart = 4;
			element.selectionEnd = 4;

			const clone = element.cloneNode(true);

			expect(clone.formAction).toBe(element.formAction);
			expect(clone.formMethod).toBe(element.formMethod);
			expect(clone.formNoValidate).toBe(element.formNoValidate);
			expect(clone.value).toBe(element.value);
			expect(clone.height).toBe(element.height);
			expect(clone.width).toBe(element.width);
			expect(clone.defaultChecked).toBe(element.defaultChecked);
			expect(clone.files).toEqual(element.files);
			expect(clone.selectionStart).toBe(element.selectionStart);
			expect(clone.selectionEnd).toBe(element.selectionEnd);
			expect(clone.selectionDirection).toBe(element.selectionDirection);
		});

		it('Clones when type is "file".', () => {
			window.happyDOM.setURL('https://www.example.com/path/');

			element.type = 'file';
			element.files.push(new File(['test'], 'file.jpg'));

			const clone = element.cloneNode(true);

			expect(clone.formAction).toBe(element.formAction);
			expect(clone.formMethod).toBe(element.formMethod);
			expect(clone.formNoValidate).toBe(element.formNoValidate);
			expect(clone.value).toBe(element.value);
			expect(clone.height).toBe(element.height);
			expect(clone.width).toBe(element.width);
			expect(clone.defaultChecked).toBe(element.defaultChecked);
			expect(clone.files).toEqual(element.files);
			expect(clone.selectionStart).toEqual(element.selectionStart);
			expect(clone.selectionEnd).toEqual(element.selectionEnd);
			expect(clone.selectionDirection).toEqual(element.selectionDirection);
		});
	});

	describe('dispatchEvent()', () => {
		it('Sets "checked" to "true" if type is "checkbox" and is a "click" event.', () => {
			let isInputTriggered = false;
			let isChangeTriggered = false;

			element.type = 'checkbox';

			element.addEventListener('input', () => (isInputTriggered = true));
			element.addEventListener('change', () => (isChangeTriggered = true));

			// "input" and "change" events should only be triggered if connected to DOM
			element.dispatchEvent(new MouseEvent('click'));

			expect(isInputTriggered).toBe(false);
			expect(isChangeTriggered).toBe(false);
			expect(element.checked).toBe(true);

			document.body.appendChild(element);

			element.dispatchEvent(new MouseEvent('click'));

			// "input" and "change" events should now have been triggered as it is connected to DOM
			expect(isInputTriggered).toBe(true);
			expect(isChangeTriggered).toBe(true);
			expect(element.checked).toBe(false);

			element.dispatchEvent(new MouseEvent('click'));

			expect(element.checked).toBe(true);
		});

		it('Switch "checked" to "true" or "false" and "indeterminate" to "false" if type is "checkbox" and "indeterminate" is "true" and is a "click" event.', () => {
			element.type = 'checkbox';
			element.indeterminate = true;

			// "input" and "change" events should only be triggered if connected to DOM
			document.body.appendChild(element);

			element.dispatchEvent(new MouseEvent('click'));

			expect(element.checked).toBe(true);
			expect(element.indeterminate).toBe(false);

			element.indeterminate = true;

			element.dispatchEvent(new MouseEvent('click'));

			expect(element.checked).toBe(false);
			expect(element.indeterminate).toBe(false);
		});

		it('Sets "checked" to "true" if type is "radio" and is a "click" event.', () => {
			let isInputTriggered = false;
			let isChangeTriggered = false;

			element.type = 'radio';

			element.addEventListener('input', () => (isInputTriggered = true));
			element.addEventListener('change', () => (isChangeTriggered = true));

			element.dispatchEvent(new PointerEvent('click'));

			// "input" and "change" events should only be triggered if connected to DOM
			expect(isInputTriggered).toBe(false);
			expect(isChangeTriggered).toBe(false);
			expect(element.checked).toBe(true);

			element.checked = false;

			document.body.appendChild(element);

			element.dispatchEvent(new PointerEvent('click'));

			// "input" and "change" events should now have been triggered as it is connected to DOM
			expect(isInputTriggered).toBe(true);
			expect(isChangeTriggered).toBe(true);
			expect(element.checked).toBe(true);

			element.dispatchEvent(new PointerEvent('click'));

			expect(element.checked).toBe(true);
		});

		it('Doesn\'t trigger "change" and "input" event if type is "radio" it is already checked when dispatching a "click" event.', () => {
			let isInputTriggered = false;
			let isChangeTriggered = false;

			element.addEventListener('input', () => (isInputTriggered = true));
			element.addEventListener('change', () => (isChangeTriggered = true));

			element.type = 'radio';
			element.checked = true;

			document.body.appendChild(element);

			element.dispatchEvent(new PointerEvent('click'));

			expect(isInputTriggered).toBe(false);
			expect(isChangeTriggered).toBe(false);
		});

		it('Sets "checked" to "true" before triggering listeners if type is "checkbox".', () => {
			let isInputChecked = false;
			let isChangeChecked = false;
			let isClickChecked = false;

			element.type = 'checkbox';

			element.addEventListener('input', () => (isInputChecked = element.checked));
			element.addEventListener('change', () => (isChangeChecked = element.checked));
			element.addEventListener('click', () => (isClickChecked = element.checked));

			document.body.appendChild(element);

			element.dispatchEvent(new PointerEvent('click'));

			expect(isInputChecked).toBe(true);
			expect(isChangeChecked).toBe(true);
			expect(isClickChecked).toBe(true);
			expect(element.checked).toBe(true);
		});

		it('Sets "checked" to "true" before triggering listeners if type is "radio".', () => {
			let isInputChecked = false;
			let isChangeChecked = false;
			let isClickChecked = false;

			element.type = 'radio';

			element.addEventListener('input', () => (isInputChecked = element.checked));
			element.addEventListener('change', () => (isChangeChecked = element.checked));
			element.addEventListener('click', () => (isClickChecked = element.checked));

			document.body.appendChild(element);

			element.dispatchEvent(new PointerEvent('click'));

			expect(isInputChecked).toBe(true);
			expect(isChangeChecked).toBe(true);
			expect(isClickChecked).toBe(true);
			expect(element.checked).toBe(true);
		});

		it('Sets "checked" to "true" before triggering listeners, but restores the value if preventDefault() is executed in the click listener, when type is "checkbox".', () => {
			let isClickChecked = false;

			element.type = 'checkbox';

			element.addEventListener('click', (event) => {
				event.preventDefault();
				isClickChecked = element.checked;
			});

			document.body.appendChild(element);

			element.dispatchEvent(new PointerEvent('click', { cancelable: true }));

			expect(isClickChecked).toBe(true);
			expect(element.checked).toBe(false);

			element.checked = true;

			element.dispatchEvent(new PointerEvent('click', { cancelable: true }));

			expect(element.checked).toBe(true);
		});

		it('Sets "checked" to "true" before triggering listeners, but restores the value if preventDefault() is executed in the click listener, when type is "radio".', () => {
			let isClickChecked = false;

			element.type = 'radio';

			element.addEventListener('click', (event) => {
				event.preventDefault();
				isClickChecked = element.checked;
			});

			document.body.appendChild(element);

			element.dispatchEvent(new PointerEvent('click', { cancelable: true }));

			expect(isClickChecked).toBe(true);
			expect(element.checked).toBe(false);

			element.checked = true;

			element.dispatchEvent(new PointerEvent('click', { cancelable: true }));

			expect(element.checked).toBe(true);
		});

		it('Submits form if type is "submit" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLInputElement>document.createElement('input');

			let submitTriggeredCount = 0;

			button.type = 'submit';

			form.appendChild(button);

			document.body.appendChild(form);

			let submitter: HTMLInputElement | null = null;
			form.addEventListener('submit', (event) => {
				submitTriggeredCount++;
				submitter = <HTMLInputElement>(<SubmitEvent>event).submitter;
			});

			button.click();

			expect(submitTriggeredCount).toBe(1);
			expect(submitter).toBe(button);
		});

		it('Submits form associated by ID if type is "submit" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLInputElement>document.createElement('input');

			let submitTriggeredCount = 0;

			form.id = 'test-form';
			button.type = 'submit';
			button.setAttribute('form', 'test-form');

			document.body.appendChild(form);
			document.body.appendChild(button);

			let submitter: HTMLInputElement | null = null;
			form.addEventListener('submit', (event) => {
				submitTriggeredCount++;
				submitter = <HTMLInputElement>(<SubmitEvent>event).submitter;
			});

			button.click();

			expect(submitTriggeredCount).toBe(1);
			expect(submitter).toBe(button);
		});

		it('Resets form if type is "reset" and is a "click" event.', () => {
			const form = <HTMLFormElement>document.createElement('form');
			const button = <HTMLInputElement>document.createElement('input');

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
			const button = <HTMLInputElement>document.createElement('input');

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
