import XMLParser from '../../src/xml-parser/XMLParser';
import Window from '../../src/window/Window';
import Document from '../../src/nodes/document/Document';
import HTMLElement from '../../src/nodes/html-element/HTMLElement';
import XMLParserHTML from './data/XMLParserHTML';
import NamespaceURI from '../../src/config/NamespaceURI';
import DocumentType from '../../src/nodes/document-type/DocumentType';

const GET_EXPECTED_HTML = (html: string): string =>
	html
		.replace('<?Question mark comment>', '<!--?Question mark comment-->')
		.replace('<!Exclamation mark comment>', '<!--Exclamation mark comment-->')
		.replace(/[\s]/gm, '');

describe('XMLParser', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('parse()', () => {
		it('Parses HTML with a single <div>.', () => {
			const root = XMLParser.parse(window.document, '<div></div>');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
		});

		it('Parses HTML with a single <div> with attributes.', () => {
			const root = XMLParser.parse(
				window.document,
				'<div class="class1 class2" id="id" data-no-value></div>'
			);
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect((<HTMLElement>root.childNodes[0]).id).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).className).toBe('class1 class2');
			expect((<HTMLElement>root.childNodes[0]).attributes).toEqual({
				'0': {
					name: 'class',
					value: 'class1 class2',
					namespaceURI: null,
					specified: true,
					ownerElement: root.childNodes[0],
					ownerDocument: document
				},
				'1': {
					name: 'id',
					value: 'id',
					namespaceURI: null,
					specified: true,
					ownerElement: root.childNodes[0],
					ownerDocument: document
				},
				'2': {
					name: 'data-no-value',
					value: '',
					namespaceURI: null,
					specified: true,
					ownerElement: root.childNodes[0],
					ownerDocument: document
				},
				class: {
					name: 'class',
					value: 'class1 class2',
					namespaceURI: null,
					specified: true,
					ownerElement: root.childNodes[0],
					ownerDocument: document
				},
				id: {
					name: 'id',
					value: 'id',
					namespaceURI: null,
					specified: true,
					ownerElement: root.childNodes[0],
					ownerDocument: document
				},
				'data-no-value': {
					name: 'data-no-value',
					value: '',
					namespaceURI: null,
					specified: true,
					ownerElement: root.childNodes[0],
					ownerDocument: document
				},
				length: 3
			});
		});

		it('Parses an entire HTML page.', () => {
			const root = XMLParser.parse(window.document, XMLParserHTML);
			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(GET_EXPECTED_HTML(XMLParserHTML));
		});

		it('Parses a page with document type set to "HTML 4.01".', () => {
			const pageHTML = XMLParserHTML.trim().replace(
				'<!DOCTYPE html>',
				'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'
			);
			const root = XMLParser.parse(window.document, pageHTML);
			const doctype = <DocumentType>root.childNodes[0];
			expect(doctype.name).toBe('HTML');
			expect(doctype.publicId).toBe('-//W3C//DTD HTML 4.01//EN');
			expect(doctype.systemId).toBe('http://www.w3.org/TR/html4/strict.dtd');
			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(GET_EXPECTED_HTML(pageHTML));
		});

		it('Parses a page with document type set to "MathML 1.01".', () => {
			const pageHTML = XMLParserHTML.trim().replace(
				'<!DOCTYPE html>',
				'<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">'
			);
			const root = XMLParser.parse(window.document, pageHTML);
			const doctype = <DocumentType>root.childNodes[0];
			expect(doctype.name).toBe('math');
			expect(doctype.publicId).toBe('');
			expect(doctype.systemId).toBe('http://www.w3.org/Math/DTD/mathml1/mathml.dtd');
			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(GET_EXPECTED_HTML(pageHTML));
		});

		it('Handles unclosed tags of unnestable elements (e.g. <a>, <li>).', () => {
			const root = XMLParser.parse(
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

		it('Parses an SVG with "xmlns" set to HTML.', () => {
			const root = XMLParser.parse(
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
				'0': {
					name: 'viewbox',
					value: '0 0 300 100',
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				'1': {
					name: 'stroke',
					value: 'red',
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				'2': {
					name: 'fill',
					value: 'grey',
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				'3': {
					name: 'xmlns',
					value: NamespaceURI.html,
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				viewbox: {
					name: 'viewbox',
					value: '0 0 300 100',
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				stroke: {
					name: 'stroke',
					value: 'red',
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				fill: {
					name: 'fill',
					value: 'grey',
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				xmlns: {
					name: 'xmlns',
					value: NamespaceURI.html,
					namespaceURI: null,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
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
