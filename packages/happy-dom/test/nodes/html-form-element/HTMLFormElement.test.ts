import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement';
import RadioNodeList from '../../../src/nodes/html-form-element/RadioNodeList';
import { IHTMLInputElement } from '../../../src';

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
		'autocomplete',
		'noValidate'
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
                </div>
            `;
			const elements = element.elements;
			const root = element.children[0];

			expect(elements.length).toBe(8);

			expect(elements[0] === root.children[0]).toBe(true);
			expect(elements[1] === root.children[1]).toBe(true);
			expect(elements[2] === root.children[2]).toBe(true);
			expect(elements[3] === root.children[3]).toBe(true);
			expect(elements[4] === root.children[4]).toBe(true);
			expect(elements[5] === root.children[5]).toBe(true);
			expect(elements[6] === root.children[6]).toBe(true);
			expect(elements[7] === root.children[7]).toBe(true);

			expect(elements.item(0) === root.children[0]).toBe(true);
			expect(elements.item(1) === root.children[1]).toBe(true);
			expect(elements.item(2) === root.children[2]).toBe(true);
			expect(elements.item(3) === root.children[3]).toBe(true);
			expect(elements.item(4) === root.children[4]).toBe(true);
			expect(elements.item(5) === root.children[5]).toBe(true);
			expect(elements.item(6) === root.children[6]).toBe(true);
			expect(elements.item(7) === root.children[7]).toBe(true);

			const radioNodeList1 = new RadioNodeList();
			const radioNodeList2 = new RadioNodeList();

			radioNodeList1.push(root.children[2]);
			radioNodeList1.push(root.children[3]);
			radioNodeList1.push(root.children[4]);

			radioNodeList2.push(root.children[5]);
			radioNodeList2.push(root.children[6]);
			radioNodeList2.push(root.children[7]);

			expect(elements['text1'] === root.children[0]).toBe(true);
			expect(elements['button1'] === root.children[1]).toBe(true);
			expect(elements['checkbox1']).toEqual(radioNodeList1);
			expect(elements['radio1']).toEqual(radioNodeList2);

			expect(elements.namedItem('text1') === root.children[0]).toBe(true);
			expect(elements.namedItem('button1') === root.children[1]).toBe(true);
			expect(elements.namedItem('checkbox1')).toEqual(radioNodeList1);
			expect(elements.namedItem('checkbox1').value).toBe('value2');
			expect(elements.namedItem('radio1')).toEqual(radioNodeList2);
			expect(elements.namedItem('radio1').value).toBe('value2');

			(<IHTMLInputElement>elements.namedItem('text1')).name = 'text2';
			(<IHTMLInputElement>elements.namedItem('text2')).id = 'text3';

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

			expect(elements.length).toBe(16);

			expect(elements[8] === anotherRoot.children[0]).toBe(true);
			expect(elements[9] === anotherRoot.children[1]).toBe(true);
			expect(elements[10] === anotherRoot.children[2]).toBe(true);
			expect(elements[11] === anotherRoot.children[3]).toBe(true);
			expect(elements[12] === anotherRoot.children[4]).toBe(true);
			expect(elements[13] === anotherRoot.children[5]).toBe(true);
			expect(elements[14] === anotherRoot.children[6]).toBe(true);
			expect(elements[15] === anotherRoot.children[7]).toBe(true);

			const anotherRadioNodeList1 = new RadioNodeList();
			const anotherRadioNodeList2 = new RadioNodeList();

			anotherRadioNodeList1.push(anotherRoot.children[2]);
			anotherRadioNodeList1.push(anotherRoot.children[3]);
			anotherRadioNodeList1.push(anotherRoot.children[4]);

			anotherRadioNodeList2.push(anotherRoot.children[5]);
			anotherRadioNodeList2.push(anotherRoot.children[6]);
			anotherRadioNodeList2.push(anotherRoot.children[7]);

			expect(elements['anotherText1'] === anotherRoot.children[0]).toBe(true);
			expect(elements['anotherButton1'] === anotherRoot.children[1]).toBe(true);
			expect(elements['anotherCheckbox1']).toEqual(anotherRadioNodeList1);
			expect(elements['anotherRadio1']).toEqual(anotherRadioNodeList2);
		});
	});
});
