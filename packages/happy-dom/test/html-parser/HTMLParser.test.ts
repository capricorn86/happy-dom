import HTMLParser from '../../src/html-parser/HTMLParser';
import Window from '../../src/window/Window';
import HTMLElement from '../../src/nodes/basic/html-element/HTMLElement';
import HTMLParserHTML from './data/HTMLParserHTML';
import NamespaceURI from '../../src/html-config/NamespaceURI';

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

		test('Handles unclosed tags of unnestable elements (e.g. <a>, <li>).', () => {
			const root = HTMLParser.parse(
				window.document,
				`
				<div class="test" disabled>
					<ul>
						<li><a href="http://localhost:8080/test/test" target="_blank">Test</a>
						<li><span>Test 2</span></li>
						<li><b>Test 3</b></li>
					</ul>
					<a><a>Test</a></a>
				</div>
				`
			);

			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<div class="test" disabled="">
					<ul>
						<li><a href="http://localhost:8080/test/test" target="_blank">Test</a></li>
						<li><span>Test 2</span></li>
						<li><b>Test 3</b></li>
					</ul>
					<a></a><a>Test</a>
				</div>
				`.replace(/[\s]/gm, '')
			);
		});

		test('Parses an SVG with "xmlns" set to HTML.', () => {
			const root = HTMLParser.parse(
				window.document,
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<circle cx="50" cy="50" r="40" />
						<circle cx="150" cy="50" r="4" />
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4" />
						</svg>
					</svg>
				</div>
			`
			);

			const div = root.children[0];
			const svg = div.children[0];
			const circle = svg.children[0];

			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(svg.namespaceURI).toBe(NamespaceURI.html);
			expect(circle.namespaceURI).toBe(NamespaceURI.html);

			// Attributes should be in lower-case now as the namespace is HTML
			expect(svg.attributes).toEqual({
				'0': { name: 'viewbox', value: '0 0 300 100', namespaceURI: null },
				'1': { name: 'stroke', value: 'red', namespaceURI: null },
				'2': { name: 'fill', value: 'grey', namespaceURI: null },
				'3': { name: 'xmlns', value: NamespaceURI.html, namespaceURI: null },
				viewbox: { name: 'viewbox', value: '0 0 300 100', namespaceURI: null },
				stroke: { name: 'stroke', value: 'red', namespaceURI: null },
				fill: { name: 'fill', value: 'grey', namespaceURI: null },
				xmlns: { name: 'xmlns', value: NamespaceURI.html, namespaceURI: null },
				length: 4
			});

			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<div>
					<svg viewbox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<circle cx="50" cy="50" r="40" />
						<circle cx="150" cy="50" r="4" />
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4" />
						</svg>
					</svg>
				</div>
			`.replace(/[\s]/gm, '')
			);
		});
	});
});
