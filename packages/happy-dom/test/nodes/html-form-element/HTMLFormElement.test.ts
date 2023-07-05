import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement.js';
import RadioNodeList from '../../../src/nodes/html-form-element/RadioNodeList.js';
import IHTMLInputElement from '../../../src/nodes/html-input-element/IHTMLInputElement.js';
import Event from '../../../src/event/Event.js';
import SubmitEvent from '../../../src/event/events/SubmitEvent.js';
import IHTMLSelectElement from '../../../src/nodes/html-select-element/IHTMLSelectElement.js';
import IHTMLTextAreaElement from '../../../src/nodes/html-text-area-element/IHTMLTextAreaElement.js';
import IHTMLButtonElement from '../../../src/nodes/html-button-element/IHTMLButtonElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLFormElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLFormElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLFormElement>document.createElement('form');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLFormElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLFormElement]');
		});
	});

	for (const property of [
		'name',
		'target',
		'action',
		'encoding',
		'enctype',
		'acceptCharset',
		'autocomplete'
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

	describe('get noValidate()', () => {
		it('Returns "true" if defined.', () => {
			expect(element.noValidate).toBe(false);
			element.setAttribute('novalidate', '');
			expect(element.noValidate).toBe(true);
		});
	});

	describe('set noValidate()', () => {
		it('Sets attribute value.', () => {
			element.noValidate = true;
			expect(element.getAttribute('novalidate')).toBe('');
		});
	});

	describe('get method()', () => {
		it('Returns attribute value.', () => {
			expect(element.method).toBe('get');
			element.setAttribute('method', 'post');
			expect(element.method).toBe('post');
		});
	});

	describe('set method()', () => {
		it('Sets attribute value.', () => {
			element.method = 'post';
			expect(element.getAttribute('method')).toBe('post');
		});
	});

	describe('get elements()', () => {
		it('Returns control elements.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" value="value1">
					<button name="button1" value="value1"></button>
                    <input type="checkbox" name="checkbox1" value="value1">
                    <input type="checkbox" name="checkbox1" value="value2" checked>
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio1" value="value2" checked>
                    <input type="radio" name="radio1" value="value3">
                    <input type="hidden" name="1" value="value1">
                </div>
            `;
			const elements = element.elements;
			const root = element.children[0];

			expect(element.length).toBe(9);
			expect(elements.length).toBe(9);

			expect(element[0] === root.children[0]).toBe(true);
			expect(element[1] === root.children[1]).toBe(true);
			expect(element[2] === root.children[2]).toBe(true);
			expect(element[3] === root.children[3]).toBe(true);
			expect(element[4] === root.children[4]).toBe(true);
			expect(element[5] === root.children[5]).toBe(true);
			expect(element[6] === root.children[6]).toBe(true);
			expect(element[7] === root.children[7]).toBe(true);
			expect(element[8] === root.children[8]).toBe(true);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);
			expect(elements[5] === root.children[5]).toBe(true);
			expect(elements[6] === root.children[6]).toBe(true);
			expect(elements[7] === root.children[7]).toBe(true);
			expect(elements[8] === root.children[8]).toBe(true);

			expect(elements.item(0) === root.children[0]).toBe(true);
			expect(elements.item(1) === root.children[1]).toBe(true);
			expect(elements.item(2) === root.children[2]).toBe(true);
			expect(elements.item(3) === root.children[3]).toBe(true);
			expect(elements.item(4) === root.children[4]).toBe(true);
			expect(elements.item(5) === root.children[5]).toBe(true);
			expect(elements.item(6) === root.children[6]).toBe(true);
			expect(elements.item(7) === root.children[7]).toBe(true);
			expect(elements.item(8) === root.children[8]).toBe(true);

			const radioNodeList1 = new RadioNodeList();
			const radioNodeList2 = new RadioNodeList();

			radioNodeList1.push(root.children[2]);
			radioNodeList1.push(root.children[3]);
			radioNodeList1.push(root.children[4]);

			radioNodeList2.push(root.children[5]);
			radioNodeList2.push(root.children[6]);
			radioNodeList2.push(root.children[7]);

			expect(element['text1'] === root.children[0]).toBe(true);
			expect(element['button1'] === root.children[1]).toBe(true);
			expect(element['checkbox1']).toEqual(radioNodeList1);
			expect(element['radio1']).toEqual(radioNodeList2);

			expect(elements['text1'] === root.children[0]).toBe(true);
			expect(elements['button1'] === root.children[1]).toBe(true);
			expect(elements['checkbox1']).toEqual(radioNodeList1);
			expect(elements['radio1']).toEqual(radioNodeList2);

			expect(elements.namedItem('text1') === root.children[0]).toBe(true);
			expect(elements.namedItem('button1') === root.children[1]).toBe(true);
			expect(elements.namedItem('checkbox1')).toEqual(radioNodeList1);
			expect(elements.namedItem('checkbox1')?.value).toBe('value2');
			expect(elements.namedItem('radio1')).toEqual(radioNodeList2);
			expect(elements.namedItem('radio1')?.value).toBe('value2');
			expect(elements.namedItem('1')?.value).toBe('value1');

			(<IHTMLInputElement>elements.namedItem('text1')).name = 'text2';
			(<IHTMLInputElement>elements.namedItem('text2')).id = 'text3';

			expect(element['text2'] === root.children[0]).toBe(true);
			expect(element['text3'] === root.children[0]).toBe(true);

			expect(elements['text2'] === root.children[0]).toBe(true);
			expect(elements['text3'] === root.children[0]).toBe(true);

			const anotherElement = document.createElement('div');
			anotherElement.innerHTML = `
                <span>
                    <input type="text" name="anotherText1" value="value1">
                    <button name="anotherButton1" value="value1"></button>
                    <input type="checkbox" name="anotherCheckbox1" value="value1">
                    <input type="checkbox" name="anotherCheckbox1" value="value2" checked>
                    <input type="checkbox" name="anotherCheckbox1" value="value3">
                    <input type="radio" name="anotherRadio1" value="value1">
                    <input type="radio" name="anotherRadio1" value="value2" checked>
                    <input type="radio" name="anotherRadio1" value="value3">
                </span>
            `;

			const anotherRoot = anotherElement.children[0];

			root.appendChild(anotherElement);

			expect(element.length).toBe(17);
			expect(elements.length).toBe(17);

			expect(element[9] === anotherRoot.children[0]).toBe(true);
			expect(element[10] === anotherRoot.children[1]).toBe(true);
			expect(element[11] === anotherRoot.children[2]).toBe(true);
			expect(element[12] === anotherRoot.children[3]).toBe(true);
			expect(element[13] === anotherRoot.children[4]).toBe(true);
			expect(element[14] === anotherRoot.children[5]).toBe(true);
			expect(element[15] === anotherRoot.children[6]).toBe(true);
			expect(element[16] === anotherRoot.children[7]).toBe(true);

			expect(elements[9] === anotherRoot.children[0]).toBe(true);
			expect(elements[10] === anotherRoot.children[1]).toBe(true);
			expect(elements[11] === anotherRoot.children[2]).toBe(true);
			expect(elements[12] === anotherRoot.children[3]).toBe(true);
			expect(elements[13] === anotherRoot.children[4]).toBe(true);
			expect(elements[14] === anotherRoot.children[5]).toBe(true);
			expect(elements[15] === anotherRoot.children[6]).toBe(true);
			expect(elements[16] === anotherRoot.children[7]).toBe(true);

			const anotherRadioNodeList1 = new RadioNodeList();
			const anotherRadioNodeList2 = new RadioNodeList();

			anotherRadioNodeList1.push(anotherRoot.children[2]);
			anotherRadioNodeList1.push(anotherRoot.children[3]);
			anotherRadioNodeList1.push(anotherRoot.children[4]);

			anotherRadioNodeList2.push(anotherRoot.children[5]);
			anotherRadioNodeList2.push(anotherRoot.children[6]);
			anotherRadioNodeList2.push(anotherRoot.children[7]);

			expect(element['anotherText1'] === anotherRoot.children[0]).toBe(true);
			expect(element['anotherButton1'] === anotherRoot.children[1]).toBe(true);
			expect(element['anotherCheckbox1']).toEqual(anotherRadioNodeList1);
			expect(element['anotherRadio1']).toEqual(anotherRadioNodeList2);

			expect(elements['anotherText1'] === anotherRoot.children[0]).toBe(true);
			expect(elements['anotherButton1'] === anotherRoot.children[1]).toBe(true);
			expect(elements['anotherCheckbox1']).toEqual(anotherRadioNodeList1);
			expect(elements['anotherRadio1']).toEqual(anotherRadioNodeList2);

			for (const child of root.children.slice()) {
				if (child !== anotherElement) {
					root.removeChild(child);
				}
			}

			expect(element.length).toBe(8);
			expect(elements.length).toBe(8);

			expect(element[0] === anotherRoot.children[0]).toBe(true);
			expect(element[1] === anotherRoot.children[1]).toBe(true);
			expect(element[2] === anotherRoot.children[2]).toBe(true);
			expect(element[3] === anotherRoot.children[3]).toBe(true);
			expect(element[4] === anotherRoot.children[4]).toBe(true);
			expect(element[5] === anotherRoot.children[5]).toBe(true);
			expect(element[6] === anotherRoot.children[6]).toBe(true);
			expect(element[7] === anotherRoot.children[7]).toBe(true);

			expect(elements[0] === anotherRoot.children[0]).toBe(true);
			expect(elements[1] === anotherRoot.children[1]).toBe(true);
			expect(elements[2] === anotherRoot.children[2]).toBe(true);
			expect(elements[3] === anotherRoot.children[3]).toBe(true);
			expect(elements[4] === anotherRoot.children[4]).toBe(true);
			expect(elements[5] === anotherRoot.children[5]).toBe(true);
			expect(elements[6] === anotherRoot.children[6]).toBe(true);
			expect(elements[7] === anotherRoot.children[7]).toBe(true);

			expect(element['text1'] === undefined).toBe(true);
			expect(element['button1'] === undefined).toBe(true);
			expect(element['checkbox1'] === undefined).toBe(true);
			expect(element['radio1'] === undefined).toBe(true);

			expect(elements['text1'] === undefined).toBe(true);
			expect(elements['button1'] === undefined).toBe(true);
			expect(elements['checkbox1'] === undefined).toBe(true);
			expect(elements['radio1'] === undefined).toBe(true);
		});

		it('Returns control elements using the same name as properties and methods of the HTMLCollection class.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="length" value="value1">
                    <input type="checkbox" name="namedItem" value="value1">
                    <input type="checkbox" name="namedItem" value="value2" checked>
                    <input type="checkbox" name="namedItem" value="value3">
                    <input type="hidden" name="push" value="value1">
                </div>
            `;
			const elements = element.elements;
			const root = element.children[0];

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			expect(element[0] === root.children[0]).toBe(true);
			expect(element[1] === root.children[1]).toBe(true);
			expect(element[2] === root.children[2]).toBe(true);
			expect(element[3] === root.children[3]).toBe(true);
			expect(element[4] === root.children[4]).toBe(true);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);

			expect(elements.item(0) === root.children[0]).toBe(true);
			expect(elements.item(1) === root.children[1]).toBe(true);
			expect(elements.item(2) === root.children[2]).toBe(true);
			expect(elements.item(3) === root.children[3]).toBe(true);
			expect(elements.item(4) === root.children[4]).toBe(true);

			const radioNodeList = new RadioNodeList();
			radioNodeList.push(root.children[1]);
			radioNodeList.push(root.children[2]);
			radioNodeList.push(root.children[3]);

			expect(typeof elements.push).toBe('function');
			expect(typeof elements.namedItem).toBe('function');
			expect(elements.namedItem('length') === root.children[0]).toBe(true);
			expect(elements.namedItem('namedItem')).toEqual(radioNodeList);
			expect(elements.namedItem('push') === root.children[4]).toBe(true);

			const children = root.children.slice();

			for (const child of children) {
				root.removeChild(child);
			}

			expect(element.length).toBe(0);

			for (const child of children) {
				root.appendChild(child);
			}

			expect(element.length).toBe(5);
			expect(elements.length).toBe(5);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);

			expect(typeof elements.push).toBe('function');
			expect(typeof elements.namedItem).toBe('function');
			expect(elements.namedItem('length') === root.children[0]).toBe(true);
			expect(elements.namedItem('namedItem')).toEqual(radioNodeList);
			expect(elements.namedItem('push') === root.children[4]).toBe(true);
		});
	});

	describe('submit()', () => {
		it('Does nothing.', () => {
			element.submit();
		});
	});

	describe('requestSubmit()', () => {
		it('Validates form and triggers a "submit" event when valid.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" required>
					<button name="button1"></button>
                    <input type="checkbox" name="checkbox1" value="value1" required>
                    <input type="checkbox" name="checkbox1" value="value2">
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1" required>
                    <input type="radio" name="radio1" value="value2" required>
                    <input type="radio" name="radio1" value="value3" required>
                </div>
            `;

			document.body.appendChild(element);

			const root = element.children[0];
			let submitEvent: Event | null = null;

			element.addEventListener('submit', (event: Event) => (submitEvent = event));

			element.noValidate = true;
			element.requestSubmit();

			expect(submitEvent).toBeInstanceOf(SubmitEvent);
			expect((<SubmitEvent>(<unknown>submitEvent)).type).toBe('submit');
			expect((<SubmitEvent>(<unknown>submitEvent)).submitter).toBe(element);

			submitEvent = null;

			element.noValidate = false;
			element.requestSubmit();

			expect(submitEvent).toBe(null);

			(<IHTMLInputElement>root.children[0]).value = 'value';
			(<IHTMLInputElement>root.children[2]).click();
			(<IHTMLInputElement>root.children[6]).click();

			element.requestSubmit(<IHTMLButtonElement>root.children[1]);

			expect((<SubmitEvent>(<unknown>submitEvent)).type).toBe('submit');
			expect((<SubmitEvent>(<unknown>submitEvent)).submitter).toBe(root.children[1]);
		});

		it('Skips validating if a submitter is sent that has "formNoValidate" set to "true".', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" required>
                    <input type="checkbox" name="checkbox1" value="value1" required>
                    <input type="checkbox" name="checkbox1" value="value2">
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1" required>
                    <input type="radio" name="radio1" value="value2" required>
                    <input type="radio" name="radio1" value="value3" required>
					<input type="submit" name="button1"></input>
                </div>
            `;

			document.body.appendChild(element);

			const root = element.children[0];
			const submitter = <IHTMLInputElement>root.children[7];
			let submitEvent: Event | null = null;

			element.addEventListener('submit', (event: Event) => (submitEvent = event));

			submitter.formNoValidate = true;
			element.requestSubmit(submitter);

			expect((<SubmitEvent>(<unknown>submitEvent)).type).toBe('submit');
		});
	});

	describe('reset()', () => {
		it('Resets the form.', () => {
			element.innerHTML = `
                <div>
                    <input type="text" name="text1" value="Default value">
                    <select>
                        <option value="value1"></option>
                        <option value="value2" selected></option>
                        <option value="value3"></option>
                    </select>
                    <textarea name="textarea1">Default value</textarea>
                    <input type="checkbox" name="checkbox1" value="value1">
                    <input type="checkbox" name="checkbox1" value="value2" checked>
                    <input type="checkbox" name="checkbox1" value="value3">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio1" value="value2" checked>
                    <input type="radio" name="radio1" value="value3">
                </div>
            `;

			document.body.appendChild(element);

			const root = element.children[0];
			let resetEvent: Event | null = null;

			(<IHTMLInputElement>root.children[0]).value = 'New value';
			(<IHTMLSelectElement>root.children[1]).value = 'value3';
			(<IHTMLTextAreaElement>root.children[2]).value = 'New value';
			(<IHTMLInputElement>root.children[3]).click();
			(<IHTMLInputElement>root.children[5]).click();
			(<IHTMLInputElement>root.children[7]).click();

			element.addEventListener('reset', (event: Event) => (resetEvent = event));

			element.reset();

			expect((<Event>(<unknown>resetEvent)).type).toBe('reset');

			expect((<IHTMLInputElement>root.children[0]).value).toBe('Default value');
			expect((<IHTMLSelectElement>root.children[1]).value).toBe('value2');
			expect((<IHTMLTextAreaElement>root.children[2]).value).toBe('Default value');

			expect((<IHTMLInputElement>root.children[3]).checked).toBe(false);
			expect((<IHTMLInputElement>root.children[4]).checked).toBe(true);
			expect((<IHTMLInputElement>root.children[5]).checked).toBe(false);

			expect((<IHTMLInputElement>root.children[6]).checked).toBe(false);
			expect((<IHTMLInputElement>root.children[7]).checked).toBe(true);
			expect((<IHTMLInputElement>root.children[8]).checked).toBe(false);
		});
	});

	for (const method of ['checkValidity', 'reportValidity']) {
		describe(`${method}()`, () => {
			it('Validates the form.', () => {
				element.innerHTML = `
                <div>
                    <input type="text" name="text1" required>
                    <select required>
                        <option></option>
                    </select>
                    <textarea name="textarea1" required></textarea>
                    <input type="checkbox" name="checkbox1" value="value1" required>
                    <input type="checkbox" name="checkbox1" value="value2" required>
                    <input type="checkbox" name="checkbox1" value="value3" required>
                    <input type="radio" name="radio1" value="value1" required>
                    <input type="radio" name="radio1" value="value2" required>
                    <input type="radio" name="radio1" value="value3" required>
                </div>
            `;

				document.body.appendChild(element);

				const root = element.children[0];
				let invalidEvents: Event[] = [];

				element.addEventListener('invalid', (event: Event) => invalidEvents.push(event));

				expect(element[method]()).toBe(false);
				expect(invalidEvents.length).toBe(7);
				invalidEvents = [];

				(<IHTMLInputElement>root.children[0]).value = 'value';
				(<IHTMLSelectElement>root.children[1]).options[0].value = 'value';
				(<IHTMLTextAreaElement>root.children[2]).value = 'value';
				(<IHTMLInputElement>root.children[3]).click();
				(<IHTMLInputElement>root.children[4]).click();
				(<IHTMLInputElement>root.children[5]).click();
				(<IHTMLInputElement>root.children[7]).click();

				expect(element[method]()).toBe(true);
				expect(invalidEvents.length).toBe(0);
			});
		});
	}
});
