import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement';
import RadioNodeList from '../../../src/nodes/html-form-element/RadioNodeList';

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
                    <input type="text" name="text1" value"value1">
					<button name="button1" value="value1"></button>
                    <input type="checkbox" name="checkbox1" value"value1">
                    <input type="checkbox" name="checkbox1" value"value2" checked>
                    <input type="checkbox" name="checkbox1" value"value3">
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

			const radioNodeList1 = new RadioNodeList();
			const radioNodeList2 = new RadioNodeList();

			radioNodeList1.push(root.children[2]);
			radioNodeList1.push(root.children[3]);
			radioNodeList1.push(root.children[4]);

			radioNodeList2.push(root.children[5]);
			radioNodeList2.push(root.children[6]);
			radioNodeList2.push(root.children[7]);

			expect(elements['text1']).toBe(root.children[0]);
			expect(elements['button1']).toBe(root.children[1]);
			expect(elements['checkbox1']).toEqual(radioNodeList1);
			expect(elements['radio1']).toEqual(radioNodeList2);
		});
	});
});
