import XMLParser from '../../src/xml-parser/XMLParser';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import Node from '../../src/nodes/node/Node';
import IHTMLElement from '../../src/nodes/html-element/IHTMLElement';
import IHTMLTemplateElement from '../../src/nodes/html-template-element/IHTMLTemplateElement';
import XMLParserHTML from './data/XMLParserHTML';
import NamespaceURI from '../../src/config/NamespaceURI';
import DocumentType from '../../src/nodes/document-type/DocumentType';

const GET_EXPECTED_HTML = (html: string): string =>
	html
		.replace('<?Question mark comment>', '<!--?Question mark comment-->')
		.replace('<!Exclamation mark comment>', '<!--Exclamation mark comment-->')
		.replace('<self-closing-custom-tag />', '<self-closing-custom-tag></self-closing-custom-tag>')
		.replace(/[\s]/gm, '');

describe('XMLParser', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('parse()', () => {
		it('Parses HTML with a single <div>.', () => {
			const root = XMLParser.parse(window.document, '<div></div>');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<IHTMLElement>root.childNodes[0]).tagName).toBe('DIV');
		});

		it('Parses HTML with a single <div> with attributes.', () => {
			const root = XMLParser.parse(
				window.document,
				'<div class="class1 class2" id="id" data-no-value></div>'
			);
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<IHTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect((<IHTMLElement>root.childNodes[0]).id).toBe('id');
			expect((<IHTMLElement>root.childNodes[0]).className).toBe('class1 class2');
			expect((<IHTMLElement>root.childNodes[0]).attributes).toEqual({
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

		it('Does not parse the content of script, style and template elements.', () => {
			const root = XMLParser.parse(
				window.document,
				`<div>
					<script>if(1<Math['random']()){else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
					<template><b></b></template>
				</div>`
			);

			expect((<IHTMLElement>root.children[0].children[0]).innerText).toBe(
				`if(1<Math['random']()){else if(Math['random']()>1){console.log("1")}`
			);

			expect((<IHTMLElement>root.children[0].children[1]).innerText).toBe('<b></b>');
			expect((<IHTMLElement>root.children[0].children[2]).innerText).toBe('<b></b>');
			expect((<IHTMLTemplateElement>root.children[0].children[3]).content.textContent).toBe(
				'<b></b>'
			);

			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(
				`<div>
					<script>if(1<Math['random']()){else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
					<template></template>
				</div>`.replace(/[\s]/gm, '')
			);
		});

		it('Handles unclosed regular elements.', () => {
			const root = XMLParser.parse(window.document, `<div>test`);

			expect(root.childNodes.length).toBe(1);
			expect((<IHTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect(root.childNodes[0].childNodes[0].nodeType).toBe(Node.TEXT_NODE);
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
			expect(svg.namespaceURI).toBe(NamespaceURI.svg);
			expect(circle.namespaceURI).toBe(NamespaceURI.svg);

			// Attributes should be in lower-case now as the namespace is HTML
			expect(svg.attributes).toEqual({
				'0': {
					name: 'viewBox',
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
					namespaceURI: NamespaceURI.html,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				viewBox: {
					name: 'viewBox',
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
					namespaceURI: NamespaceURI.html,
					specified: true,
					ownerElement: svg,
					ownerDocument: document
				},
				length: 4
			});

			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<circle cx="50" cy="50" r="40"></circle>
						<circle cx="150" cy="50" r="4"></circle>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4"></circle>
						</svg>
					</svg>
				</div>
			`.replace(/[\s]/gm, '')
			);
		});

		it('Parses a malformed SVG with "xmlns" set to HTML.', () => {
			const root = XMLParser.parse(
				window.document,
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<ellipse cx="50" cy="50" r="40">
						<line cx="50" cy="50" r="40">
						<path cx="50" cy="50" r="40">
						<polygon cx="50" cy="50" r="40">
						<polyline cx="50" cy="50" r="40" />
						<rect cx="50" cy="50" r="40" />
						<stop cx="50" cy="50" r="40" />
						<use cx="50" cy="50" r="40" />
						<circle cx="150" cy="50" r="4"><test></test></circle>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4" />
						</svg>
					</svg>
				</div>
			`
			);

			expect(root.innerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<ellipse cx="50" cy="50" r="40">
						<line cx="50" cy="50" r="40">
						<path cx="50" cy="50" r="40">
						<polygon cx="50" cy="50" r="40">
						<polyline cx="50" cy="50" r="40"></polyline>
						<rect cx="50" cy="50" r="40"></rect>
						<stop cx="50" cy="50" r="40"></stop>
						<use cx="50" cy="50" r="40"></use>
						<circle cx="150" cy="50" r="4"><test></test></circle>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4"></circle>
						</svg>
					</polygon></path></line></ellipse></svg>
				</div>
			`.replace(/[\s]/gm, '')
			);
		});
	});
});
