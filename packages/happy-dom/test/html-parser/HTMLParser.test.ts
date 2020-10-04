import HTMLParser from '../../src/html-parser/HTMLParser';
import Window from '../../src/window/Window';
import HTMLElement from '../../src/nodes/basic/html-element/HTMLElement';
import HTMLParserHTML from './data/HTMLParserHTML';

describe('HTMLParser', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('parse()', () => {
		test('Parses HTML with a single <div>.', () => {
			const root = HTMLParser.parse(window.document, '<div></div>');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
		});

		test('Parses HTML with a single <div> with attributes.', () => {
			const root = HTMLParser.parse(
				window.document,
				'<div class="class1 class2" id="id" data-no-value></div>'
			);
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect((<HTMLElement>root.childNodes[0]).id).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).className).toBe('class1 class2');
			expect((<HTMLElement>root.childNodes[0]).attributes).toEqual({
				'0': { name: 'class', value: 'class1 class2', namespaceURI: null },
				'1': { name: 'id', value: 'id', namespaceURI: null },
				'2': { name: 'data-no-value', value: '', namespaceURI: null },
				class: { name: 'class', value: 'class1 class2', namespaceURI: null },
				id: { name: 'id', value: 'id', namespaceURI: null },
				'data-no-value': { name: 'data-no-value', value: '', namespaceURI: null },
				length: 3
			});
		});

		test('Parses an entire HTML page.', () => {
			const root = HTMLParser.parse(window.document, HTMLParserHTML);
			expect(root.innerHTML).toBe(HTMLParserHTML);
		});

		test('Sets property values if a property name matches the attribute name.', () => {
			const root = HTMLParser.parse(
				window.document,
				'<input name="name" type="number" tabindex="5" disabled />'
			);
			const input = root.childNodes[0];

			expect(input['name']).toBe('name');
			expect(input['type']).toBe('number');
			expect(input['tabIndex']).toBe(5);
			expect(input['disabled']).toBe(true);
		});
	});
});
