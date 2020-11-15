import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLScriptElement from '../../../src/nodes/html-script-element/HTMLScriptElement';

describe('HTMLScriptElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	for (const property of ['type', 'src', 'charset', 'lang']) {
		describe(`get ${property}()`, () => {
			test(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('script');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			test(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('script');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	for (const property of ['async', 'defer']) {
		describe(`get ${property}()`, () => {
			test(`Returns "true" if the "${property}" attribute is defined.`, () => {
				const element = document.createElement('script');
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			test(`Sets the "${property}" attribute to an empty string if set to "true".`, () => {
				const element = document.createElement('script');
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});
		});
	}

	describe('get text()', () => {
		test('Returns the data of text nodes.', () => {
			const element = <HTMLScriptElement>document.createElement('script');
			const text = document.createTextNode('test');
			element.appendChild(text);
			expect(element.text).toBe('test');
		});

		test('Replaces all child nodes with a text node.', () => {
			const element = <HTMLScriptElement>document.createElement('script');
			const text = document.createTextNode('test');
			element.appendChild(text);
			element.text = 'test2';
			expect(element.text).toBe('test2');
		});
	});

	describe('set isConnected()', () => {
		test('Evaluates the text content as code when appended to an element that is connected to the document.', () => {
			const element = <HTMLScriptElement>document.createElement('script');
			element.text = 'global.test = "test";';
			document.body.appendChild(element);
			expect(global['test']).toBe('test');
			delete global['test'];
		});

		test('Evaluates the text content as code when inserted before an element that is connected to the document.', () => {
			const element = <HTMLScriptElement>document.createElement('script');
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');

			element.text = 'global.test = "test";';

			div1.appendChild(element);

			document.body.appendChild(div2);
			document.body.insertBefore(div1, div2);
			document.body.appendChild(element);

			expect(global['test']).toBe('test');
			delete global['test'];
		});

		test('Does not evaluate code when added as innerHTML.', () => {
			const div = document.createElement('div');
			div.innerHTML = '<script>global.test = "test";</script>';
			document.body.appendChild(div);
			expect(global['test']).toBe(undefined);
		});

		test('Does not evaluate code when added as outerHTML.', () => {
			const div = document.createElement('div');
			document.body.appendChild(div);
			div.outerHTML = '<script>global.test = "test";</script>';
			expect(global['test']).toBe(undefined);
		});

		test('Evaluates the text content as code when using document.write().', () => {
			document.write('<script>global.test = "test";</script>');
			expect(global['test']).toBe('test');
			delete global['test'];
		});

		test('Evaluates the text content as code when using DOMParser.parseFromString().', () => {
			const domParser = new window.DOMParser();
			domParser.parseFromString('<script>global.test = "test";</script>', 'text/html');
			expect(global['test']).toBe('test');
			delete global['test'];
		});
	});
});
