import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLFormElement from '../../../src/nodes/html-form-element/HTMLFormElement';

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
                    <input type="checkbox" name="checkbox1" value"value1">
                    <input type="checkbox" name="checkbox2" value"value1">
                    <input type="radio" name="radio1" value="value1">
                    <input type="radio" name="radio2" value="value2">
                    <input type="radio" name="radio3" value="value3">
                </div>
            `;
			const elements = element.elements;
			expect(elements.length).toBe(6);

			expect(elements[0] === element.children[0].children[0]).toBe(true);
			expect(elements[1] === element.children[0].children[1]).toBe(true);
			expect(elements[2] === element.children[0].children[2]).toBe(true);
			expect(elements[3] === element.children[0].children[3]).toBe(true);
			expect(elements[4] === element.children[0].children[4]).toBe(true);
			expect(elements[5] === element.children[0].children[5]).toBe(true);

			expect(elements['text1'] === element.children[0].children[0]).toBe(true);
			expect(elements['checkbox1'] === element.children[0].children[1]).toBe(true);
			expect(elements['checkbox2'] === element.children[0].children[2]).toBe(true);
			expect(elements['radio1'] === element.children[0].children[3]).toBe(true);
			expect(elements['radio2'] === element.children[0].children[4]).toBe(true);
			expect(elements['radio3'] === element.children[0].children[5]).toBe(true);
		});
	});
});
