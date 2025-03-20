import HTMLParser from '../../src/html-parser/HTMLParser.js';
import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import Node from '../../src/nodes/node/Node.js';
import HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import NamespaceURI from '../../src/config/NamespaceURI.js';
import DocumentType from '../../src/nodes/document-type/DocumentType.js';
import HTMLSerializer from '../../src/html-serializer/HTMLSerializer.js';
import HTMLTemplateElement from '../../src/nodes/html-template-element/HTMLTemplateElement.js';
import NodeTypeEnum from '../../src/nodes/node/NodeTypeEnum.js';
import { beforeEach, describe, it, expect } from 'vitest';
import CustomElement from '../CustomElement.js';
import HTMLHtmlElement from '../../src/nodes/html-html-element/HTMLHtmlElement.js';
import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import TreeWalkerHTML from '../tree-walker/data/TreeWalkerHTML.js';

describe('HTMLParser', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('parse()', () => {
		it('Parses HTML with a single <div>.', () => {
			const result = new HTMLParser(window).parse('<div></div>');
			expect(result.childNodes.length).toBe(1);
			expect(result.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>result.childNodes[0]).tagName).toBe('DIV');
		});

		it('Parses HTML with a single <div> with attributes.', () => {
			const result = new HTMLParser(window).parse(
				'<div class="class1 class2" id="id" data-no-value></div>'
			);
			expect(result.childNodes.length).toBe(1);
			expect(result.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>result.childNodes[0]).tagName).toBe('DIV');
			expect((<HTMLElement>result.childNodes[0]).id).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).className).toBe('class1 class2');

			expect((<HTMLElement>result.childNodes[0]).attributes.length).toBe(3);

			expect((<HTMLElement>result.childNodes[0]).attributes[0].name).toBe('class');
			expect((<HTMLElement>result.childNodes[0]).attributes[0].value).toBe('class1 class2');
			expect((<HTMLElement>result.childNodes[0]).attributes[0].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes[0].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes[0].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes[0].ownerDocument === document).toBe(
				true
			);

			expect((<HTMLElement>result.childNodes[0]).attributes[1].name).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes[1].value).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes[1].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes[1].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes[1].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes[1].ownerDocument === document).toBe(
				true
			);

			expect((<HTMLElement>result.childNodes[0]).attributes[2].name).toBe('data-no-value');
			expect((<HTMLElement>result.childNodes[0]).attributes[2].value).toBe('');
			expect((<HTMLElement>result.childNodes[0]).attributes[2].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes[2].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes[2].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes[2].ownerDocument === document).toBe(
				true
			);

			expect((<HTMLElement>result.childNodes[0]).attributes['class'].name).toBe('class');
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].value).toBe('class1 class2');
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['class'].ownerElement ===
					result.childNodes[0]
			).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['class'].ownerDocument === document
			).toBe(true);

			expect((<HTMLElement>result.childNodes[0]).attributes['id'].name).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].value).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['id'].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].ownerDocument === document).toBe(
				true
			);

			expect((<HTMLElement>result.childNodes[0]).attributes['data-no-value'].name).toBe(
				'data-no-value'
			);
			expect((<HTMLElement>result.childNodes[0]).attributes['data-no-value'].value).toBe('');
			expect((<HTMLElement>result.childNodes[0]).attributes['data-no-value'].namespaceURI).toBe(
				null
			);
			expect((<HTMLElement>result.childNodes[0]).attributes['data-no-value'].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['data-no-value'].ownerElement ===
					result.childNodes[0]
			).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['data-no-value'].ownerDocument === document
			).toBe(true);
		});

		it('Parses an entire HTML page.', () => {
			const html = `
	<!DOCTYPE html>
	<html>
		<head>
			<title>Title</title>
		</head>
		<body>
			<div class="class1 class2" id="id">
				<!--Comment 1!-->
				<?processing instruction?>
				<?processing-instruction>
				<!Exclamation mark comment>
				<b>Bold</b>
				<!-- Comment 2 !-->
				<span>Span</span>
                <!>
			</div>
			<article class="class1 class2" id="id">
				<!-- Comment 1 !-->
				<b>Bold</b>
				<!-- Comment 2 !-->
			</article>
			<img>
			<img />
		</body>
	</html>
`;
			const expected = `<!DOCTYPE html><html><head>
			<title>Title</title>
		</head>
		<body>
			<div class="class1 class2" id="id">
				<!--Comment 1!-->
				<!--?processing instruction?-->
				<!--?processing-instruction-->
				<!--Exclamation mark comment-->
				<b>Bold</b>
				<!-- Comment 2 !-->
				<span>Span</span>
                <!---->
			</div>
			<article class="class1 class2" id="id">
				<!-- Comment 1 !-->
				<b>Bold</b>
				<!-- Comment 2 !-->
			</article>
			<img>
			<img>
		
	
</body></html>`;
			const result = <Document>(
				new HTMLParser(window).parse(html, document.implementation.createHTMLDocument())
			);
			expect(result.childNodes[0].ownerDocument).toBe(result);
			expect(result.childNodes[1].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[0].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[1].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[2].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[3].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[4].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[5].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[6].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[7].ownerDocument).toBe(result);
			expect(result.body.children[0].childNodes[8].ownerDocument).toBe(result);

			expect(new HTMLSerializer().serializeToString(result)).toBe(expected);
		});

		it('Parses a page with document type set to "HTML 4.01".', () => {
			const html = `
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
	<html>
		<head>
			<title>Title</title>
		</head>
		<body>
			<div class="class1 class2" id="id">
				<!--Comment 1!-->
				<?processing instruction?>
				<?processing-instruction>
				<!Exclamation mark comment>
				<b>Bold</b>
				<!-- Comment 2 !-->
				<span>Span</span>
                <!>
			</div>
			<article class="class1 class2" id="id">
				<!-- Comment 1 !-->
				<b>Bold</b>
				<!-- Comment 2 !-->
			</article>
			<img>
			<img />
		</body>
	</html>
`;
			const expected = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head>
			<title>Title</title>
		</head>
		<body>
			<div class="class1 class2" id="id">
				<!--Comment 1!-->
				<!--?processing instruction?-->
				<!--?processing-instruction-->
				<!--Exclamation mark comment-->
				<b>Bold</b>
				<!-- Comment 2 !-->
				<span>Span</span>
                <!---->
			</div>
			<article class="class1 class2" id="id">
				<!-- Comment 1 !-->
				<b>Bold</b>
				<!-- Comment 2 !-->
			</article>
			<img>
			<img>
		
	
</body></html>`;

			const result = new HTMLParser(window).parse(
				html,
				document.implementation.createHTMLDocument()
			);
			const doctype = <DocumentType>result.childNodes[0];
			expect(doctype.name).toBe('html');
			expect(doctype.publicId).toBe('-//W3C//DTD HTML 4.01//EN');
			expect(doctype.systemId).toBe('http://www.w3.org/TR/html4/strict.dtd');
			expect(new HTMLSerializer().serializeToString(result)).toBe(expected);
		});

		it('Handles unnestable elements correctly when there are siblings.', () => {
			const result = new HTMLParser(window).parse(
				`<article>
                    <span>
                        <div>
                            <a><a>Test</a></a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>`
			);
			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`
                <article>
                    <span>
                        <div>
                            <a></a><a>Test</a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>
            `.replace(/\s/gm, '')
			);
		});

		it('Handles unnestable elements correctly when the nested element is wrapped by another element.', () => {
			const result = new HTMLParser(window).parse(
				`<article>
                    <span>
                        <div>
                            <a><span><a>Test</a></span></a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>`
			);
			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`
                <article>
                    <span>
                        <div>
                            <a><span></span></a><a>Test</a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>
            `.replace(/\s/gm, '')
			);
		});

		it('Parses a page with document type set to "MathML 1.01".', () => {
			const html = `<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <div class="class1 class2" id="id">
            <!--Comment 1!-->
            <?processing instruction?>
            <?processing-instruction>
            <!Exclamation mark comment>
            <b>Bold</b>
            <!-- Comment 2 !-->
            <span>Span</span>
            <!>
        </div>
        <article class="class1 class2" id="id">
            <!-- Comment 1 !-->
            <b>Bold</b>
            <!-- Comment 2 !-->
        </article>
        <img>
        <img />
    </body>
</html>`;
			const expected = `<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd"><html><head>
        <title>Title</title>
    </head>
    <body>
        <div class="class1 class2" id="id">
            <!--Comment 1!-->
            <!--?processing instruction?-->
            <!--?processing-instruction-->
            <!--Exclamation mark comment-->
            <b>Bold</b>
            <!-- Comment 2 !-->
            <span>Span</span>
            <!---->
        </div>
        <article class="class1 class2" id="id">
            <!-- Comment 1 !-->
            <b>Bold</b>
            <!-- Comment 2 !-->
        </article>
        <img>
        <img>
    
</body></html>`;

			const result = new HTMLParser(window).parse(
				html,
				document.implementation.createHTMLDocument()
			);
			const doctype = <DocumentType>result.childNodes[0];
			expect(doctype.name).toBe('math');
			expect(doctype.publicId).toBe('');
			expect(doctype.systemId).toBe('http://www.w3.org/Math/DTD/mathml1/mathml.dtd');
			expect(new HTMLSerializer().serializeToString(result)).toBe(expected);
		});

		it('Handles unclosed tags of unnestable elements (e.g. <a>, <li>).', () => {
			const result = new HTMLParser(window).parse(
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

			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`
				<div class="test" disabled="">
					<ul>
						<li><a href="http://localhost:8080/test/test" target="_blank">Test</a></li>
						<li><span>Test 2</span></li>
						<li><b>Test 3</b></li>
					</ul>
					<a></a><a>Test</a>
				</div>
				`.replace(/\s/gm, '')
			);
		});

		it('Does not parse the content of script and style elements.', () => {
			const result = new HTMLParser(window).parse(
				`<div>
					<script>if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
				</div>`
			);

			expect((<HTMLElement>result.children[0].children[0]).innerText).toBe(
				`if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}`
			);

			expect((<HTMLElement>result.children[0].children[1]).innerText).toBe('<b></b>');
			expect((<HTMLElement>result.children[0].children[2]).innerText).toBe('<b></b>');

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div>
					<script>if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
				</div>`
			);

			const root2 = new HTMLParser(window).parse(
				`<html>
                    <head>
                        <title>Title</title>
                    </head>
                    <body>
                        <script type="text/javascript">var vars = []; for (var i=0;i<vars.length;i++) {}</script>
                    </body>
                </html>`,
				document.implementation.createHTMLDocument()
			);
			expect((<HTMLElement>root2.children[0].children[1].children[0]).innerText).toBe(
				'var vars = []; for (var i=0;i<vars.length;i++) {}'
			);
		});

		it('Handles unclosed regular elements.', () => {
			const result = new HTMLParser(window).parse(`<div>test`);

			expect(result.childNodes.length).toBe(1);
			expect((<HTMLElement>result.childNodes[0]).tagName).toBe('DIV');
			expect(result.childNodes[0].childNodes[0].nodeType).toBe(Node.TEXT_NODE);
		});

		it('Parses an SVG with "xmlns" set to SVG.', () => {
			const result = new HTMLParser(window).parse(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.svg}">
						<circle cx="50" cy="50" r="40" />
						<circle cx="150" cy="50" r="4" />
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clippath>
								<circle cx="5" cy="5" r="4" />
							</clippath>
						</svg>
					</svg>
				</div>
			`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.svg}">
						<circle cx="50" cy="50" r="40"></circle>
						<circle cx="150" cy="50" r="4"></circle>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clipPath>
								<circle cx="5" cy="5" r="4"></circle>
							</clipPath>
						</svg>
					</svg>
				</div>
			`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`
				<div xmlns="http://www.w3.org/1999/xhtml">
					<svg xmlns="${NamespaceURI.svg}" viewBox="0 0 300 100" stroke="red" fill="grey">
						<circle cx="50" cy="50" r="40"/>
						<circle cx="150" cy="50" r="4"/>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clipPath>
								<circle cx="5" cy="5" r="4"/>
							</clipPath>
						</svg>
					</svg>
				</div>
			`
			);

			const div = result.children[0];
			const svg = div.children[0];
			const circle = svg.children[0];

			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(svg.namespaceURI).toBe(NamespaceURI.svg);
			expect(circle.namespaceURI).toBe(NamespaceURI.svg);

			// Attributes should be in lower-case now as the namespace is HTML
			expect(svg.attributes.length).toBe(4);

			expect(svg.attributes[0].name).toBe('viewBox');
			expect(svg.attributes[0].value).toBe('0 0 300 100');
			expect(svg.attributes[0].namespaceURI).toBe(null);
			expect(svg.attributes[0].specified).toBe(true);
			expect(svg.attributes[0].ownerElement === svg).toBe(true);
			expect(svg.attributes[0].ownerDocument === document).toBe(true);

			expect(svg.attributes[1].name).toBe('stroke');
			expect(svg.attributes[1].value).toBe('red');
			expect(svg.attributes[1].namespaceURI).toBe(null);
			expect(svg.attributes[1].specified).toBe(true);
			expect(svg.attributes[1].ownerElement === svg).toBe(true);
			expect(svg.attributes[1].ownerDocument === document).toBe(true);

			expect(svg.attributes[2].name).toBe('fill');
			expect(svg.attributes[2].value).toBe('grey');
			expect(svg.attributes[2].namespaceURI).toBe(null);
			expect(svg.attributes[2].specified).toBe(true);
			expect(svg.attributes[2].ownerElement === svg).toBe(true);
			expect(svg.attributes[2].ownerDocument === document).toBe(true);

			expect(svg.attributes[3].name).toBe('xmlns');
			expect(svg.attributes[3].value).toBe(NamespaceURI.svg);
			expect(svg.attributes[3].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes[3].specified).toBe(true);
			expect(svg.attributes[3].ownerElement === svg).toBe(true);
			expect(svg.attributes[3].ownerDocument === document).toBe(true);

			expect(svg.attributes['viewBox'].name).toBe('viewBox');
			expect(svg.attributes['viewBox'].value).toBe('0 0 300 100');
			expect(svg.attributes['viewBox'].namespaceURI).toBe(null);
			expect(svg.attributes['viewBox'].specified).toBe(true);
			expect(svg.attributes['viewBox'].ownerElement === svg).toBe(true);
			expect(svg.attributes['viewBox'].ownerDocument === document).toBe(true);

			expect(svg.attributes['stroke'].name).toBe('stroke');
			expect(svg.attributes['stroke'].value).toBe('red');
			expect(svg.attributes['stroke'].namespaceURI).toBe(null);
			expect(svg.attributes['stroke'].specified).toBe(true);
			expect(svg.attributes['stroke'].ownerElement === svg).toBe(true);
			expect(svg.attributes['stroke'].ownerDocument === document).toBe(true);

			expect(svg.attributes['fill'].name).toBe('fill');
			expect(svg.attributes['fill'].value).toBe('grey');
			expect(svg.attributes['fill'].namespaceURI).toBe(null);
			expect(svg.attributes['fill'].specified).toBe(true);
			expect(svg.attributes['fill'].ownerElement === svg).toBe(true);
			expect(svg.attributes['fill'].ownerDocument === document).toBe(true);

			expect(svg.attributes['xmlns'].name).toBe('xmlns');
			expect(svg.attributes['xmlns'].value).toBe(NamespaceURI.svg);
			expect(svg.attributes['xmlns'].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes['xmlns'].specified).toBe(true);
			expect(svg.attributes['xmlns'].ownerElement === svg).toBe(true);
			expect(svg.attributes['xmlns'].ownerDocument === document).toBe(true);
		});

		it('Parses an SVG with "xmlns" set to HTML.', () => {
			const result = new HTMLParser(window).parse(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<circle cx="50" cy="50" r="40" />
						<circle cx="150" cy="50" r="4" />
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clippath>
								<circle cx="5" cy="5" r="4" />
							</clippath>
						</svg>
					</svg>
				</div>
			`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.html}">
						<circle cx="50" cy="50" r="40"></circle>
						<circle cx="150" cy="50" r="4"></circle>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clipPath>
								<circle cx="5" cy="5" r="4"></circle>
							</clipPath>
						</svg>
					</svg>
				</div>
			`
			);

			const div = result.children[0];
			const svg = div.children[0];
			const circle = svg.children[0];

			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(svg.namespaceURI).toBe(NamespaceURI.svg);
			expect(circle.namespaceURI).toBe(NamespaceURI.svg);

			// Attributes should be in lower-case now as the namespace is HTML
			expect(svg.attributes.length).toBe(4);

			expect(svg.attributes[0].name).toBe('viewBox');
			expect(svg.attributes[0].value).toBe('0 0 300 100');
			expect(svg.attributes[0].namespaceURI).toBe(null);
			expect(svg.attributes[0].specified).toBe(true);
			expect(svg.attributes[0].ownerElement === svg).toBe(true);
			expect(svg.attributes[0].ownerDocument === document).toBe(true);

			expect(svg.attributes[1].name).toBe('stroke');
			expect(svg.attributes[1].value).toBe('red');
			expect(svg.attributes[1].namespaceURI).toBe(null);
			expect(svg.attributes[1].specified).toBe(true);
			expect(svg.attributes[1].ownerElement === svg).toBe(true);
			expect(svg.attributes[1].ownerDocument === document).toBe(true);

			expect(svg.attributes[2].name).toBe('fill');
			expect(svg.attributes[2].value).toBe('grey');
			expect(svg.attributes[2].namespaceURI).toBe(null);
			expect(svg.attributes[2].specified).toBe(true);
			expect(svg.attributes[2].ownerElement === svg).toBe(true);
			expect(svg.attributes[2].ownerDocument === document).toBe(true);

			expect(svg.attributes[3].name).toBe('xmlns');
			expect(svg.attributes[3].value).toBe(NamespaceURI.html);
			expect(svg.attributes[3].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes[3].specified).toBe(true);
			expect(svg.attributes[3].ownerElement === svg).toBe(true);
			expect(svg.attributes[3].ownerDocument === document).toBe(true);

			expect(svg.attributes['viewBox'].name).toBe('viewBox');
			expect(svg.attributes['viewBox'].value).toBe('0 0 300 100');
			expect(svg.attributes['viewBox'].namespaceURI).toBe(null);
			expect(svg.attributes['viewBox'].specified).toBe(true);
			expect(svg.attributes['viewBox'].ownerElement === svg).toBe(true);
			expect(svg.attributes['viewBox'].ownerDocument === document).toBe(true);

			expect(svg.attributes['stroke'].name).toBe('stroke');
			expect(svg.attributes['stroke'].value).toBe('red');
			expect(svg.attributes['stroke'].namespaceURI).toBe(null);
			expect(svg.attributes['stroke'].specified).toBe(true);
			expect(svg.attributes['stroke'].ownerElement === svg).toBe(true);
			expect(svg.attributes['stroke'].ownerDocument === document).toBe(true);

			expect(svg.attributes['fill'].name).toBe('fill');
			expect(svg.attributes['fill'].value).toBe('grey');
			expect(svg.attributes['fill'].namespaceURI).toBe(null);
			expect(svg.attributes['fill'].specified).toBe(true);
			expect(svg.attributes['fill'].ownerElement === svg).toBe(true);
			expect(svg.attributes['fill'].ownerDocument === document).toBe(true);

			expect(svg.attributes['xmlns'].name).toBe('xmlns');
			expect(svg.attributes['xmlns'].value).toBe(NamespaceURI.html);
			expect(svg.attributes['xmlns'].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes['xmlns'].specified).toBe(true);
			expect(svg.attributes['xmlns'].ownerElement === svg).toBe(true);
			expect(svg.attributes['xmlns'].ownerDocument === document).toBe(true);
		});

		it('Parses a malformed SVG with "xmlns" set to HTML.', () => {
			const result = new HTMLParser(window).parse(
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
                        <clippath><circle cx="5" cy="5" r="4"></clippath>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4" />
						</svg>
					</svg>
				</div>
			`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="http://www.w3.org/1999/xhtml">
						<ellipse cx="50" cy="50" r="40">
						<line cx="50" cy="50" r="40">
						<path cx="50" cy="50" r="40">
						<polygon cx="50" cy="50" r="40">
						<polyline cx="50" cy="50" r="40"></polyline>
						<rect cx="50" cy="50" r="40"></rect>
						<stop cx="50" cy="50" r="40"></stop>
						<use cx="50" cy="50" r="40"></use>
						<circle cx="150" cy="50" r="4"><test></test></circle>
                        <clipPath><circle cx="5" cy="5" r="4"></circle></clipPath>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4"></circle>
						</svg>
					</polygon></path></line></ellipse></svg>
				</div>
			`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`
				<div xmlns="http://www.w3.org/1999/xhtml">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" stroke="red" fill="grey">
						<ellipse cx="50" cy="50" r="40">
						<line cx="50" cy="50" r="40">
						<path cx="50" cy="50" r="40">
						<polygon cx="50" cy="50" r="40">
						<polyline cx="50" cy="50" r="40"/>
						<rect cx="50" cy="50" r="40"/>
						<stop cx="50" cy="50" r="40"/>
						<use cx="50" cy="50" r="40"/>
						<circle cx="150" cy="50" r="4"><test/></circle>
                        <clipPath><circle cx="5" cy="5" r="4"/></clipPath>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<circle cx="5" cy="5" r="4"/>
						</svg>
					</polygon></path></line></ellipse></svg>
				</div>
			`
			);
		});

		it('Parses XML with "xmlns:xlink" defined as attribute.', () => {
			const result = new HTMLParser(window).parse(
				`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#a"/></svg>`,
				document.body
			);

			expect(result.children[0].getAttributeNode('xmlns:xlink')?.namespaceURI).toBe(
				NamespaceURI.xmlns
			);

			expect(result.children[0].children[0].getAttributeNode('xlink:href')?.namespaceURI).toBe(
				NamespaceURI.xlink
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<body><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="#a"></use></svg></body>`
			);
		});

		it('Parses XML with unknown suffix "xmlns:unknown".', () => {
			const result = new HTMLParser(window).parse(
				`<svg xmlns="http://www.w3.org/2000/svg" xmlns:unknown="http://test.com"><use unknown:href="#a"/></svg>`,
				document.body
			);

			expect(result.children[0].getAttributeNode('xmlns:unknown')?.namespaceURI).toBe(null);
			expect(result.children[0].getAttributeNode('xmlns:unknown')?.localName).toBe('xmlns:unknown');
			expect(result.children[0].getAttributeNode('xmlns:unknown')?.prefix).toBe(null);

			expect(result.children[0].children[0].getAttributeNode('unknown:href')?.namespaceURI).toBe(
				null
			);
			expect(result.children[0].children[0].getAttributeNode('unknown:href')?.localName).toBe(
				'unknown:href'
			);
			expect(result.children[0].children[0].getAttributeNode('unknown:href')?.prefix).toBe(null);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<body><svg xmlns="http://www.w3.org/2000/svg" xmlns:unknown="http://test.com"><use unknown:href="#a"></use></svg></body>`
			);
		});

		it('Parses childless elements with start and end tag names in different case', () => {
			const result = new HTMLParser(window).parse(
				`
				<script type="text/JavaScript">console.log('hello')</SCRIPT>
				`
			);

			expect((<HTMLElement>result.children[0]).innerText).toBe(`console.log('hello')`);
		});

		it('Handles different value types.', () => {
			const root1 = new HTMLParser(window).parse(<string>(<unknown>null));
			expect(new HTMLSerializer().serializeToString(root1)).toBe('null');

			const root2 = new HTMLParser(window).parse(<string>(<unknown>undefined));
			expect(new HTMLSerializer().serializeToString(root2)).toBe('undefined');

			const root3 = new HTMLParser(window).parse(<string>(<unknown>1000));
			expect(new HTMLSerializer().serializeToString(root3)).toBe('1000');

			const root4 = new HTMLParser(window).parse(<string>(<unknown>false));
			expect(new HTMLSerializer().serializeToString(root4)).toBe('false');
		});

		it('Parses conditional comments', () => {
			const testHTML = [
				// Conditional comment - IE 8
				'<!--[if IE 8]>\n' + '<p>Welcome to Internet Explorer 8.</p>\n' + '<![endif]-->',

				// Conditional comment - IE 7
				'<!--[if gte IE 7]>\n' +
					'<script>\n' +
					'  alert("Congratulations! You are running Internet Explorer 7 or a later version of Internet Explorer.");\n' +
					'</script>\n' +
					'<p>Thank you for closing the message box.</p>\n' +
					'<![endif]-->',

				// Conditional comment - IE 5
				'<!--[if IE 5]>\n' +
					'<p>Welcome to any incremental version of Internet Explorer 5!</p>\n' +
					'<![endif]-->',

				// Conditional comment - IE 5.0000
				'<!--[if IE 5.0000]>\n' + '<p>Welcome to Internet Explorer 5.0!</p>\n' + '<![endif]-->',

				// Conditional comment - WindowsEdition 1
				'<!--[if WindowsEdition 1]>\n' +
					'<p>You are using Windows Ultimate Edition.</p>\n' +
					'<![endif]-->',

				// Conditional comment - Contoso 2
				'<!--[if lt Contoso 2]>\n' +
					'<p>Your version of the Contoso control is out of date; Please update to the latest.</p>\n' +
					'<![endif]-->'
			];

			for (const html of testHTML) {
				const result = new HTMLParser(window).parse(html);
				expect(new HTMLSerializer().serializeToString(result)).toBe(html);
			}
		});

		it('Parses conditional comments for IE 9 with multiple scripts', () => {
			const html = `<!DOCTYPE html><html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                </head>
                <body>
                <!--[if lt IE 9]>
                <script>window.location = 'browser.htm';</script>
                <![endif]-->

                <script>
                    const node = document.createElement('a');
                    node.href = 'http://www.google.com';
                    node.target = '_blank';
                    node.innerHTML = 'google';
                    window.document.body.appendChild(node);
                </script>
                </body>
            </html>`;

			const expected = `<!DOCTYPE html><html lang="en"><head>
                    <meta charset="UTF-8">
                    <title>Title</title>
                </head>
                <body>
                <!--[if lt IE 9]>
                <script>window.location = 'browser.htm';</script>
                <![endif]-->

                <script>
                    const node = document.createElement('a');
                    node.href = 'http://www.google.com';
                    node.target = '_blank';
                    node.innerHTML = 'google';
                    window.document.body.appendChild(node);
                </script>
                
            </body></html>`;

			const result = new HTMLParser(window).parse(
				html,
				document.implementation.createHTMLDocument()
			);
			expect(new HTMLSerializer().serializeToString(result)).toBe(expected);
		});

		it('Parses comments with dash in them.', () => {
			const result = new HTMLParser(window).parse('<!-- comment with - in - it -->');
			expect(result.childNodes.length).toBe(1);
			expect(result.childNodes[0].nodeType).toBe(NodeTypeEnum.commentNode);
			expect(result.childNodes[0].nodeValue).toBe(' comment with - in - it ');
		});

		it('Parses <template> elements, including its content.', () => {
			const result = new HTMLParser(window).parse(
				'<div><template><article><b></b></article></template></div>'
			);
			expect(result.childNodes.length).toBe(1);
			const template = <HTMLTemplateElement>result.childNodes[0].childNodes[0];
			expect(template.childNodes.length).toBe(0);
			expect(template.children.length).toBe(0);
			expect(template.content.children.length).toBe(1);
			expect(template.content.children[0].tagName).toBe('ARTICLE');
			expect(template.content.children[0].children.length).toBe(1);
			expect(template.content.children[0].children[0].tagName).toBe('B');
		});

		it('Parses HTML with attributes using colon (:) and value containing ">".', () => {
			const result = new HTMLParser(window).parse(
				'<template><component :is="type" :disabled="index > 1" data-testid="button"/></template>'
			);

			expect(result.childNodes.length).toBe(1);

			const template = <HTMLTemplateElement>result.childNodes[0];
			expect(template.content.childNodes.length).toBe(1);
			expect((<HTMLElement>template.content.childNodes[0]).tagName).toBe('COMPONENT');
			expect((<HTMLElement>template.content.childNodes[0]).getAttribute(':disabled')).toBe(
				'index > 1'
			);
		});

		it('Doesn\'t close non-void elements when using "/>" when namespace is HTML.', () => {
			const result = new HTMLParser(window).parse(
				`
                <span key1="value1"/>
                <span key1="value1" key2/>
                <span key2/>
                `
			);

			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`
                <span key1="value1">
                    <span key1="value1" key2="">
                        <span key2=""></span>
                    </span>
                </span>`.replace(/\s/gm, '')
			);
		});

		it('Can read text with ">" in it.', () => {
			const result = new HTMLParser(window).parse(`<span>1 > 0</span>`);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`<span>1 &gt; 0</span>`);
		});

		it('Parses malformed attributes.', () => {
			const result = new HTMLParser(window).parse(
				`
                <span key1="value1""></span>
                <span key1="value1"" key2></span>
                <span key1 key2 key3="value3""></span>
                <img key1="value1"" key2/>
                <img key1="value1""
                />
                <img key1="value1""
                key2/>
                <span key1 key2 key3="value3"''" " "></span>
                <span key1="value1 > value2"></span>
                <img key1="value1 /> value2"/>
                `
			);

			expect(result.children.length).toBe(9);

			expect(result.children[0].attributes.length).toBe(1);
			expect(result.children[0].attributes[0].name).toBe('key1');
			expect(result.children[0].attributes[0].value).toBe('value1');

			expect(result.children[1].attributes.length).toBe(2);
			expect(result.children[1].attributes[0].name).toBe('key1');
			expect(result.children[1].attributes[0].value).toBe('value1');
			expect(result.children[1].attributes[1].name).toBe('key2');
			expect(result.children[1].attributes[1].value).toBe('');

			expect(result.children[2].attributes.length).toBe(3);
			expect(result.children[2].attributes[0].name).toBe('key1');
			expect(result.children[2].attributes[0].value).toBe('');
			expect(result.children[2].attributes[1].name).toBe('key2');
			expect(result.children[2].attributes[1].value).toBe('');
			expect(result.children[2].attributes[2].name).toBe('key3');
			expect(result.children[2].attributes[2].value).toBe('value3');

			expect(result.children[3].attributes.length).toBe(2);
			expect(result.children[3].attributes[0].name).toBe('key1');
			expect(result.children[3].attributes[0].value).toBe('value1');
			expect(result.children[3].attributes[1].name).toBe('key2');
			expect(result.children[3].attributes[1].value).toBe('');

			expect(result.children[4].attributes.length).toBe(1);
			expect(result.children[4].attributes[0].name).toBe('key1');
			expect(result.children[4].attributes[0].value).toBe('value1');

			expect(result.children[5].attributes.length).toBe(2);
			expect(result.children[5].attributes[0].name).toBe('key1');
			expect(result.children[5].attributes[0].value).toBe('value1');
			expect(result.children[5].attributes[1].name).toBe('key2');
			expect(result.children[5].attributes[1].value).toBe('');

			expect(result.children[6].attributes.length).toBe(3);
			expect(result.children[6].attributes[0].name).toBe('key1');
			expect(result.children[6].attributes[0].value).toBe('');
			expect(result.children[6].attributes[1].name).toBe('key2');
			expect(result.children[6].attributes[1].value).toBe('');
			expect(result.children[6].attributes[2].name).toBe('key3');
			expect(result.children[6].attributes[2].value).toBe('value3');

			expect(result.children[7].attributes.length).toBe(1);
			expect(result.children[7].attributes[0].name).toBe('key1');
			expect(result.children[7].attributes[0].value).toBe('value1 > value2');

			expect(result.children[8].attributes.length).toBe(1);
			expect(result.children[8].attributes[0].name).toBe('key1');
			expect(result.children[8].attributes[0].value).toBe('value1 /> value2');
		});

		it('Parses attributes with characters that lit-html is using (".", "$", "@").', () => {
			const result = new HTMLParser(window).parse(
				`
                <img key1="value1" key2/>
                <img key1="value1"/>
                <span .key$lit$="{{lit-11111}}"></span>
                <div @event="{{lit-22222}}"></div>
                <article ?checked="{{lit-33333}}"></div>
                <img key1="value1" key2/>
                `
			);

			expect(result.querySelector('span')?.getAttribute('.key$lit$')).toBe('{{lit-11111}}');
			expect(result.querySelector('div')?.getAttribute('@event')).toBe('{{lit-22222}}');
			expect(result.querySelector('article')?.getAttribute('?checked')).toBe('{{lit-33333}}');
		});

		it('Parses attributes without apostrophes.', () => {
			const result = new HTMLParser(window).parse(
				`<div .theme$lit$={{lit-12345}} key1="value1">Test</div>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				'<div .theme$lit$="{{lit-12345}}" key1="value1">Test</div>'
			);
		});

		it('Parses attributes with URL without apostrophes.', () => {
			const result = new HTMLParser(window).parse(
				`<a href=http://www.github.com/path>Click me</a>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				'<a href="http://www.github.com/path">Click me</a>'
			);
		});

		it('Parses attributes with single apostrophes.', () => {
			const result = new HTMLParser(window).parse(`<div key1='value1' key2='value2'>Test</div>`);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div key1="value1" key2="value2">Test</div>`
			);
		});

		it('Parses HTML with end ">" on a new line.', () => {
			const result = new HTMLParser(window).parse(
				`
                <div key1="value1">
                    Test
                </div
                >
                `
			);

			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				'<divkey1="value1">Test</div>'
			);
			expect(result.children[0].textContent.replace(/\s/gm, '')).toBe('Test');
		});

		it('Parses <ul> and <li> elements.', () => {
			const result = new HTMLParser(window).parse(
				`<div>
                    <ul>
                        <li>
                            <ul>
                                <li>aaaaa</li>
                                <li>bbbbb</li>
                            </ul>
                        </li>
                    </ul>
                </div>`
			);

			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`<div>
                    <ul>
                        <li>
                            <ul>
                                <li>aaaaa</li>
                                <li>bbbbb</li>
                            </ul>
                        </li>
                    </ul>
                </div>`.replace(/\s/gm, '')
			);

			const root2 = new HTMLParser(window).parse(`<li><li><span>Test</span></li></li>`);

			expect(new HTMLSerializer().serializeToString(root2).replace(/\s/gm, '')).toBe(
				`<li></li><li><span>Test</span></li>`.replace(/\s/gm, '')
			);
		});

		it('Handles ending with unclosed start tag.', () => {
			const result = new HTMLParser(window).parse(
				`<div>
                    <ul>
                        <li>
                            <ul>
                                <li>aaaaa</li>
                                <li
                            </ul>
                        </li>
                    </ul>
                </div>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div>
                    <ul>
                        <li>
                            <ul>
                                <li>aaaaa</li>
                                <li <="" ul="">
                        </li>
                    </ul>
                </li></ul></div>`
			);
		});

		it('Handles complex style attributes', () => {
			const result = new HTMLParser(window).parse(
				`<div class="container">
                    <div class="sliderContainer">
                        <input class="slider" type="range" step="1" min="0" max="100">
                            
                        <div class="value">
                            <custom-text-0-0-0 data-element-name="custom-text"><!---->0<!----></custom-text-0-0-0>
                        </div>
		
					    <div class="sliderBackground" style="background: linear-gradient(to right, rgb(17, 17, 17) 0%, rgb(17, 17, 17) 0.75rem, rgb(223, 223, 223) 0.75rem, rgb(223, 223, 223) 100%);"></div>
				    </div>
			    </div>`
			);

			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`<div class="container">
                    <div class="sliderContainer">
                        <input class="slider" type="range" step="1" min="0" max="100">
                            
                        <div class="value">
                            <custom-text-0-0-0 data-element-name="custom-text"><!---->0<!----></custom-text-0-0-0>
                        </div>
		
					    <div class="sliderBackground" style="background: linear-gradient(to right, rgb(17, 17, 17) 0%, rgb(17, 17, 17) 0.75rem, rgb(223, 223, 223) 0.75rem, rgb(223, 223, 223) 100%);"></div>
				    </div>
			    </div>`.replace(/\s/gm, '')
			);
		});

		it('Handles parsing custom elements registered with non-ASCII characters.', () => {
			window.customElements.define('a-Öa', CustomElement);

			const result = new HTMLParser(window).parse(
				`
                <div>
                    <a-Öa key1="value1" key2="value2">
                        <span>Test</span>
                    </a-Öa>
                </div>
                `
			);

			expect(new HTMLSerializer().serializeToString(result).replace(/\s/gm, '')).toBe(
				`
                <div>
                    <a-Öa key1="value1" key2="value2">
                        <span>Test</span>
                    </a-Öa>
                </div>
                `.replace(/\s/gm, '')
			);
		});

		it('Sets attributes before connecting the element to the DOM.', () => {
			/* eslint-disable jsdoc/require-jsdoc */
			class CustomElement extends window.HTMLElement {
				public key1: string | null = null;
				public connectedCallback(): void {
					this.key1 = this.getAttribute('key1');
				}
			}
			/* eslint-enable jsdoc/require-jsdoc */

			window.customElements.define('custom-element', CustomElement);

			const result = new HTMLParser(window).parse(
				`
                <div>
                    <custom-element key1="value1"></custom-element>
                </div>
                `
			);

			document.body.appendChild(result.children[0]);

			expect(document.body.children[0].children[0]['key1']).toBe('value1');
		});

		it('Ignores <!DOCTYPE>, <html>, <head> and <body> when parsing an HTML fragment.', () => {
			const result = new HTMLParser(window).parse(
				'<!DOCTYPE html><html><head></head><body><div>Test</div></body></html>'
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe('<div>Test</div>');
		});

		it('Handles multiple <!DOCTYPE>.', () => {
			const result = new HTMLParser(window).parse(
				`<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">
                <!DOCTYPE html>
                <html>
                    <head></head>
                    <body><div>Test</div></body>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect((<Document>result).doctype).toBe(result.childNodes[0]);
			expect(result.childNodes.length).toBe(2);
			expect(result.childNodes[0].nodeType).toBe(NodeTypeEnum.documentTypeNode);
			expect((<DocumentType>result.childNodes[0]).name).toBe('math');
			expect((<DocumentType>result.childNodes[0]).publicId).toBe('');
			expect((<DocumentType>result.childNodes[0]).systemId).toBe(
				'http://www.w3.org/Math/DTD/mathml1/mathml.dtd'
			);
			expect(result.childNodes[1]).toBeInstanceOf(HTMLHtmlElement);
		});

		it('Handles multiple <html> tag names', () => {
			const result = new HTMLParser(window).parse(
				`<html>
                    <head></head>
                    <body><div>Test</div></body>
                </html>
                <html style="color: red">
                    <head></head>
                    <body><div>Test</div></body>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<html style="color: red"><head></head>
                    <body><div>Test</div>
                
                
                    
                    <div>Test</div>
                </body></html>`
			);
		});

		it('Handles multiple <head> tag names without <body>', () => {
			const result = new HTMLParser(window).parse(
				`<head style="color: red">
                    <title>Title 1</title>
                </head>
                <head style="color: green">
                    <title>Title 2</title>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`<html><head style="color: red">
                    <title>Title 1</title>
                <title>Title 2</title></head>
                
                    
                <body></body></html>`);
		});

		it('Handles multiple <head> tag names with <body>', () => {
			const result = new HTMLParser(window).parse(
				`<head>
                    <title>Title 1</title>
                </head>
                <body></body>
                <head style="color: green">
                    <title>Title 2</title>
                </head>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`<html><head>
                    <title>Title 1</title>
                </head>
                <body>
                
                    <title>Title 2</title>
                </body></html>`);
		});

		it('Handles multiple <body> tag names', () => {
			const root1 = new HTMLParser(window).parse(
				`<body>
                    <div>Test 1</div>
                </body>
                <body style="color: red">
                    <div>Test 2</div>
                </body>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(root1))
				.toBe(`<html><head></head><body style="color: red">
                    <div>Test 1</div>
                
                
                    <div>Test 2</div>
                </body></html>`);

			const root2 = new HTMLParser(window).parse(
				`<html>
                    <head>
                        <title>Title</title>
                    </head>
                    <body  style="color: red">
                        <div>Test 1</div>
                    </body>
                    <body style="color: green">
                        <div>Test 2</div>
                    </body>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(root2)).toBe(`<html><head>
                        <title>Title</title>
                    </head>
                    <body style="color: red">
                        <div>Test 1</div>
                    
                    
                        <div>Test 2</div>
                    
                </body></html>`);
		});

		it('Handles body in head', () => {
			const result = new HTMLParser(window).parse(
				`<head>
                    <body>
                        <div>Test</div>
                    </body>
                </head>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`<html><head>
                    </head><body>
                        <div>Test</div>
                    
                </body></html>`);
		});

		it('Handles body in body', () => {
			const result = new HTMLParser(window).parse(
				`<body>
                    <body>
                        <div>Test</div>
                    </body>
                </body>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`<html><head></head><body>
                    
                        <div>Test</div>
                    
                </body></html>`);
		});

		it('Handles body in div', () => {
			const result = new HTMLParser(window).parse(
				`<!DOCTYPE html>
                <html>
                    <head>
                        <title>Title</title>
                    </head>
                    <div>
                        <body>
                            <div>Test</div>
                        </body>
                    </div>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`<!DOCTYPE html><html><head>
                        <title>Title</title>
                    </head>
                    <body><div>
                        
                            <div>Test</div>
                        
                    </div>
                </body></html>`);
		});

		it('Handles multiple body when in fragment mode', () => {
			const result = new HTMLParser(window).parse(
				`<body>
                    <div>Test 1</div>
                </body>
                <body style="color: red">
                    <div>Test 2</div>
                </body>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(`
                    <div>Test 1</div>
                
                
                    <div>Test 2</div>
                `);

			const result2 = new HTMLParser(window).parse(
				'<body><example></example>Example Text</body><body></body>'
			);

			expect(new HTMLSerializer().serializeToString(result2)).toBe(
				'<example></example>Example Text'
			);

			const result3 = new HTMLParser(window).parse(
				'<body><body></body><example></example>Example Text</body>'
			);

			expect(new HTMLSerializer().serializeToString(result3)).toBe(
				'<example></example>Example Text'
			);
		});

		it('Handles content outside document element', () => {
			const result = new HTMLParser(window).parse(
				`<!DOCTYPE html>
                <div>Test</div>
                <html>
                    <head>
                        <title>Title</title>
                    </head>
                    <body style="color: red">
                        <div>Test</div>
                    </body>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result))
				.toBe(`<!DOCTYPE html><html><head></head><body style="color: red"><div>Test</div>
                
                    
                        <title>Title</title>
                    
                    
                        <div>Test</div>
                    
                </body></html>`);
		});

		it('Handles processing instructions as comments when parser mode is HTML.', () => {
			const result = new HTMLParser(window).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <div>
                    <div>Test</div>
                </div>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<!--?xml version="1.0" encoding="UTF-8"?-->
                <div>
                    <div>Test</div>
                </div>`
			);
		});

		it('Handles namespaced XML', () => {
			const result = new HTMLParser(window).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                <personxml:name>Rob</personxml:name>
                <personxml:age>37</personxml:age>
                <cityxml:homecity>
                    <cityxml:name>London</cityxml:name>
                    <cityxml:lat>123.000</cityxml:lat>
                    <cityxml:long>0.00</cityxml:long>
                </cityxml:homecity>
                </personxml:person>`,
				document.implementation.createHTMLDocument()
			);

			expect(result.children[0].namespaceURI).toBe('http://www.w3.org/1999/xhtml');

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<!--?xml version="1.0" encoding="UTF-8"?--><html><head></head><body><personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                <personxml:name>Rob</personxml:name>
                <personxml:age>37</personxml:age>
                <cityxml:homecity>
                    <cityxml:name>London</cityxml:name>
                    <cityxml:lat>123.000</cityxml:lat>
                    <cityxml:long>0.00</cityxml:long>
                </cityxml:homecity>
                </personxml:person></body></html>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<!--?xml version="1.0" encoding="UTF-8"?--><html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                <personxml:name>Rob</personxml:name>
                <personxml:age>37</personxml:age>
                <cityxml:homecity>
                    <cityxml:name>London</cityxml:name>
                    <cityxml:lat>123.000</cityxml:lat>
                    <cityxml:long>0.00</cityxml:long>
                </cityxml:homecity>
                </personxml:person></body></html>`
			);
		});

		it('Handles table elements', () => {
			const result = new HTMLParser(window).parse(
				`
                <table>
                    <caption>Test</caption>
                    <colgroup>
                        <col>
                        <col>
                        <col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Test 1</th>
                            <td>Test 2</td>
                            <td>Test 3</td>
                        </tr>
                        <tr>
                            <th>Test 4</th>
                            <td>Test 5</td>
                            <td>Test 6</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Test 7</th>
                            <td>Test 8</td>
                            <td>Test 9</td>
                        </tr>
                        <tr>
                            <th>Test 10</th>
                            <td>Test 11</td>
                            <td>Test 12</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Test 13</th>
                            <td>Test 14</td>
                            <td>Test 15</td>
                        </tr>
                    </tfoot>
                </table>
                `
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                <table>
                    <caption>Test</caption>
                    <colgroup>
                        <col>
                        <col>
                        <col>
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Test 1</th>
                            <td>Test 2</td>
                            <td>Test 3</td>
                        </tr>
                        <tr>
                            <th>Test 4</th>
                            <td>Test 5</td>
                            <td>Test 6</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Test 7</th>
                            <td>Test 8</td>
                            <td>Test 9</td>
                        </tr>
                        <tr>
                            <th>Test 10</th>
                            <td>Test 11</td>
                            <td>Test 12</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Test 13</th>
                            <td>Test 14</td>
                            <td>Test 15</td>
                        </tr>
                    </tfoot>
                </table>
                `
			);
		});

		it('Handles malformed table elements', () => {
			const result = new HTMLParser(window).parse(
				`
                <div class="test" disabled>
                    <dl>
                        <dt>Test
                        <dd>Test</dt></dt></dt></dt>
                        <dt>Test</dt>
                        <dd>Test
                    </dl>
                    <select>
                        <option>Test 1
                        <optgroup>
                            <option>Test 2
                            <option>Test 3</option>
                            <option>Test 4
                        <optgroup>
                            <option>Test 5
                            <option>Test 6
                    </select>
                    <ruby>明日
                        <rp>(
                        <rt>Ashita
                        <rp>)
                    </ruby>
                    <table>
                        <caption>Test
                        <colgroup>
                            <col>
                            <col>
                            <col>
                        <thead>
                            <tr>
                                <th>Test 1</th><td>Test 2<td>Test 3
                            <tr>
                                <th>Test 4<td>Test 5<td>Test 6</th></th></th>
                        <tbody>
                            <tr>
                                <th>Test 7<td>Test 8<td>Test 9</td>
                            </tr>
                            <tr>
                                <th></td></td></td></td></td></td>Test 10<td>Test 11<td>Test 12
                        <tfoot>
                            <tr>
                                <th>Test 13<td>Test 14<td>Test 15
                    </table>
                </div>
                `
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                <div class="test" disabled="">
                    <dl>
                        <dt>Test
                        </dt><dd>Test
                        </dd><dt>Test</dt>
                        <dd>Test
                    </dd></dl>
                    <select>
                        <option>Test 1
                        </option><optgroup>
                            <option>Test 2
                            </option><option>Test 3</option>
                            <option>Test 4
                        </option></optgroup><optgroup>
                            <option>Test 5
                            </option><option>Test 6
                    </option></optgroup></select>
                    <ruby>明日
                        <rp>(
                        </rp><rt>Ashita
                        </rt><rp>)
                    </rp></ruby>
                    <table>
                        <caption>Test
                        </caption><colgroup>
                            <col>
                            <col>
                            <col>
                        </colgroup><thead>
                            <tr>
                                <th>Test 1</th><td>Test 2</td><td>Test 3
                            </td></tr><tr>
                                <th>Test 4</th><td>Test 5</td><td>Test 6
                        </td></tr></thead><tbody>
                            <tr>
                                <th>Test 7</th><td>Test 8</td><td>Test 9</td>
                            </tr>
                            <tr>
                                <th>Test 10</th><td>Test 11</td><td>Test 12
                        </td></tr></tbody><tfoot>
                            <tr>
                                <th>Test 13</th><td>Test 14</td><td>Test 15
                    </td></tr></tfoot></table>
                </div>
                `
			);
		});

		it('Handles <thead> without table as parent', () => {
			const result = new HTMLParser(window).parse(
				`
                <thead>
                    <tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                </thead>
                `
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                
                    
                        Test 1
                        Test 2
                        Test 3
                    
                
                `
			);
		});

		it('Handles <tbody> without table as parent', () => {
			const result = new HTMLParser(window).parse(
				`
                <tbody>
                    <tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                </tbody>
                `
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                
                    
                        Test 1
                        Test 2
                        Test 3
                    
                
                `
			);
		});

		it('Handles <tfoot> without table as parent', () => {
			const result = new HTMLParser(window).parse(
				`
                <tfoot>
                    <tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                </tfoot>
                `
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                
                    
                        Test 1
                        Test 2
                        Test 3
                    
                
                `
			);
		});

		it('Handles <tr> without table as parent', () => {
			const result = new HTMLParser(window).parse(
				`<tr>
                    <th>Test 1</th>
                    <td>Test 2</td>
                    <td>Test 3</td>
                </tr>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                    Test 1
                    Test 2
                    Test 3
                `
			);
		});

		it('Always adds <tbody> when parsing <tr> elements', () => {
			const result = new HTMLParser(window).parse(
				`<table>
                    <tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                </table>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<table>
                    <tbody><tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                </tbody></table>`
			);
		});

		it('Adds multiple <tbody> when parsing <tr> elements', () => {
			const result = new HTMLParser(window).parse(
				`<table>
                    <tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                    <tbody>
                        <tr>
                            <th>Test 1</th>
                            <td>Test 2</td>
                            <td>Test 3</td>
                        </tr>
                    </tbody>
                </table>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<table>
                    <tbody><tr>
                        <th>Test 1</th>
                        <td>Test 2</td>
                        <td>Test 3</td>
                    </tr>
                    </tbody><tbody>
                        <tr>
                            <th>Test 1</th>
                            <td>Test 2</td>
                            <td>Test 3</td>
                        </tr>
                    </tbody>
                </table>`
			);
		});

		it('Moves invalid elements inside <table> as elements before table', () => {
			const result = new HTMLParser(window).parse(
				`<table><div><tr><th>Test 1</th><td>Test 2</td><td>Test 3</td></tr></div></table>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div></div><table><tbody><tr><th>Test 1</th><td>Test 2</td><td>Test 3</td></tr></tbody></table>`
			);
		});

		it('Moves invalid elements inside <tbody> as elements before table', () => {
			const result = new HTMLParser(window).parse(
				`<table><tbody><div><tr><th>Test 1</th><td>Test 2</td><td>Test 3</td></tr></div></tbody></table>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div></div><table><tbody><tr><th>Test 1</th><td>Test 2</td><td>Test 3</td></tr></tbody></table>`
			);
		});

		it('Closes invalid elements inside table if there is no parent to move them to', () => {
			const result = new HTMLParser(window).parse(
				`<div><tr><th>Test 1</th><td>Test 2</td><td>Test 3</td></tr></div>`,
				document.createElement('table')
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<table><div></div><tbody><tr><th>Test 1</th><td>Test 2</td><td>Test 3</td></tr></tbody></table>`
			);
		});

		it('Handles HTML used for TreeWalker test', () => {
			const result = <Document>(
				new HTMLParser(window).parse(TreeWalkerHTML, document.implementation.createHTMLDocument())
			);

			expect(result.body.childNodes.length).toBe(5);
			expect(result.body.childNodes[0].textContent).toBe('\n\t\t\t');
			expect(result.body.childNodes[1].textContent).toBe(
				'\n\t\t\t\t\n\t\t\t\tBold\n\t\t\t\t\n\t\t\t\tSpan\n\t\t\t'
			);
			expect(result.body.childNodes[2].textContent).toBe('\n\t\t\t');
			expect(result.body.childNodes[3].textContent).toBe(
				'\n\t\t\t\t\n\t\t\t\tBold\n\t\t\t\t\n\t\t\t'
			);
			expect(result.body.childNodes[4].textContent).toBe('\n\t\t\n\t');

			expect(result.documentElement.outerHTML).toBe(`<html><head>
			<title>Title</title>
		</head>
		<body>
			<div class="class1 class2" id="id">
				<!-- Comment 1 !-->
				<b>Bold</b>
				<!-- Comment 2 !-->
				<span>Span</span>
			</div>
			<article class="class1 class2" id="id">
				<!-- Comment 1 !-->
				<b>Bold</b>
				<!-- Comment 2 !-->
			</article>
		
	</body></html>`);
		});

		it('Handles HTML entities correctly for #1494', () => {
			const div = document.createElement('div');

			div.innerText = '<b>a</b>';

			expect(div.innerHTML).toBe('&lt;b&gt;a&lt;/b&gt;');
			expect(div.outerHTML).toBe('<div>&lt;b&gt;a&lt;/b&gt;</div>');
		});

		it('Handles HTML entities correctly for #1498', () => {
			const result = <Document>(
				new HTMLParser(window).parse(
					'<html test="1"><body>Test></body></html>',
					document.implementation.createHTMLDocument()
				)
			);

			expect(result.documentElement.outerHTML).toBe(
				'<html test="1"><head></head><body>Test&gt;</body></html>'
			);
		});

		it('Handles attributes with [] in the name for #1638', () => {
			const result = new HTMLParser(window).parse(`<div [innerHTML]="'TEST'"></div>`);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div [innerhtml]="'TEST'"></div>`
			);
		});

		it('Handles HTML for table tags in #1126', () => {
			const result = new HTMLParser(window).parse(
				`
                <div class="test" disabled>
                    <dl>
                        <dt>Test
                        <dd>Test</dt></dt></dt></dt>
                        <dt>Test</dt>
                        <dd>Test
                    </dl>
                    <select>
                        <option>Test 1
                        <optgroup>
                            <option>Test 2
                            <option>Test 3</option>
                            <option>Test 4
                        <optgroup>
                            <option>Test 5
                            <option>Test 6
                    </select>
                    <ruby>明日
                        <rp>(
                        <rt>Ashita
                        <rp>)
                    </ruby>
                    <table>
                        <caption>Test
                        <colgroup>
                            <col>
                            <col>
                            <col>
                        <thead>
                            <tr>
                                <th>Test 1</th><td>Test 2<td>Test 3
                            <tr>
                                <th>Test 4<td>Test 5<td>Test 6</th></th></th>
                        <tbody>
                            <tr>
                                <th>Test 7<td>Test 8<td>Test 9</td>
                            </tr>
                            <tr>
                                <th></td></td></td></td></td></td>Test 10<td>Test 11<td>Test 12
                        <tfoot>
                            <tr>
                                <th>Test 13<td>Test 14<td>Test 15
                    </table>
                </div>
                `
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`
                <div class="test" disabled="">
                    <dl>
                        <dt>Test
                        </dt><dd>Test
                        </dd><dt>Test</dt>
                        <dd>Test
                    </dd></dl>
                    <select>
                        <option>Test 1
                        </option><optgroup>
                            <option>Test 2
                            </option><option>Test 3</option>
                            <option>Test 4
                        </option></optgroup><optgroup>
                            <option>Test 5
                            </option><option>Test 6
                    </option></optgroup></select>
                    <ruby>明日
                        <rp>(
                        </rp><rt>Ashita
                        </rt><rp>)
                    </rp></ruby>
                    <table>
                        <caption>Test
                        </caption><colgroup>
                            <col>
                            <col>
                            <col>
                        </colgroup><thead>
                            <tr>
                                <th>Test 1</th><td>Test 2</td><td>Test 3
                            </td></tr><tr>
                                <th>Test 4</th><td>Test 5</td><td>Test 6
                        </td></tr></thead><tbody>
                            <tr>
                                <th>Test 7</th><td>Test 8</td><td>Test 9</td>
                            </tr>
                            <tr>
                                <th>Test 10</th><td>Test 11</td><td>Test 12
                        </td></tr></tbody><tfoot>
                            <tr>
                                <th>Test 13</th><td>Test 14</td><td>Test 15
                    </td></tr></tfoot></table>
                </div>
                `
			);
		});

		it('Handles comment with HTML for #1630', () => {
			const result = <Document>new HTMLParser(window).parse(
				`<!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <!-- <link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin /> -->
                <!-- <link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin /> --!>
                </head>
                <body>
                
                </body>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(result.documentElement.outerHTML).toBe(`<html lang="en"><head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <!-- <link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin /> -->
                <!-- <link rel="preload" href="/fonts/atkinson-regular.woff" as="font" type="font/woff" crossorigin /> -->
                </head>
                <body>
                
                
                </body></html>`);
		});

		it('Handles unknown element child without a config inside a known parent element with a config', () => {
			const result = new HTMLParser(window).parse(
				`<div>
                    <table>
                        <unknown-element></unknown-element>
                    </table>
                </div>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<div>
                    <unknown-element></unknown-element><table>
                        
                    </table>
                </div>`
			);
		});

		it('Handles document without doctype', () => {
			const result = <Document>new HTMLParser(window).parse(
				`<html lang="en">
                    <head>
                        <title>Document</title>
                    </head>
                    <body>
                        <div>Test</div>
                    </body>
                </html>`,
				document.implementation.createHTMLDocument()
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`<html lang="en"><head>
                        <title>Document</title>
                    </head>
                    <body>
                        <div>Test</div>
                    
                </body></html>`
			);
		});

		it('Handles setting documentElement.innerHTML for #1663', () => {
			document.documentElement.innerHTML = '<head></head><body></body>';
			expect(document.documentElement.outerHTML).toBe('<html><head></head><body></body></html>');

			document.documentElement.innerHTML = '<head></head><body>Test</body>';
			expect(document.documentElement.outerHTML).toBe(
				'<html><head></head><body>Test</body></html>'
			);

			document.documentElement.innerHTML = '';
			expect(document.documentElement.outerHTML).toBe('<html><head></head><body></body></html>');

			document.documentElement.innerHTML = '<body>Test</body>';
			expect(document.documentElement.outerHTML).toBe(
				'<html><head></head><body>Test</body></html>'
			);
		});

		it('Handles line breaks in attributes for #1678', () => {
			const result = new HTMLParser(window).parse(
				`            <div>
                <button class="btn btn-secondary comment_reply" data-id="{{id}}" type="button">{{message_gui_reply}}</button> <button class="btn btn-secondary comment_collapse
                 visually-hidden" type="button">{{message_gui_replies}}</button>
            </div>`
			);

			expect(new HTMLSerializer().serializeToString(result)).toBe(
				`            <div>
                <button class="btn btn-secondary comment_reply" data-id="{{id}}" type="button">{{message_gui_reply}}</button> <button class="btn btn-secondary comment_collapse
                 visually-hidden" type="button">{{message_gui_replies}}</button>
            </div>`
			);

			const element = result.querySelector('div > .comment_collapse');

			expect(element).toBe(result.children[0].children[1]);
		});
	});
});
