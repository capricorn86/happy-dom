import ElementRenderer from '../../lib/html-renderer/ElementRenderer';
import Window from '../../lib/Window';
import HTMLElement from '../../lib/nodes/basic-types/html-element/HTMLElement';
import HTMLPage from './data/HTMLPage';

describe('ElementRenderer', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('parse()', () => {
		test('Parses HTML with a single <div>.', () => {
			const root = ElementRenderer.parse(window.document, '<div></div>');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
		});

		test('Parses HTML with a single <div> with attributes.', () => {
			const root = ElementRenderer.parse(window.document, '<div class="class1 class2" id="id" data-no-value></div>');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect((<HTMLElement>root.childNodes[0]).id).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).className).toBe('class1 class2');
			expect((<HTMLElement>root.childNodes[0]).attributes).toEqual({
				'0': { name: 'class', value: 'class1 class2' },
				'1': { name: 'id', value: 'id' },
				'2': { name: 'data-no-value', value: '' },
				class: { name: 'class', value: 'class1 class2' },
				id: { name: 'id', value: 'id' },
				'data-no-value': { name: 'data-no-value', value: '' },
				length: 3
			});
		});

		test('Parses an entire HTML page.', () => {
			const root = ElementRenderer.parse(window.document, HTMLPage);
			expect(root.innerHTML).toBe(HTMLPage);
		});
	});
});
