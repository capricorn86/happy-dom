import XMLParser from '../../src/xml-parser/XMLParser.js';
import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import Node from '../../src/nodes/node/Node.js';
import HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import NamespaceURI from '../../src/config/NamespaceURI.js';
import DocumentType from '../../src/nodes/document-type/DocumentType.js';
import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import HTMLTemplateElement from '../../src/nodes/html-template-element/HTMLTemplateElement.js';
import NodeTypeEnum from '../../src/nodes/node/NodeTypeEnum.js';
import { beforeEach, describe, it, expect } from 'vitest';
import CustomElement from '../CustomElement.js';
import XMLParserModeEnum from '../../src/xml-parser/XMLParserModeEnum.js';
import HTMLHtmlElement from '../../src/nodes/html-html-element/HTMLHtmlElement.js';
import HTMLSerializer from '../../src/html-serializer/HTMLSerializer.js';

describe('XMLParser', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('parse()', () => {
		it('Parses HTML with a single <div>.', () => {
			const root = new XMLParser(window).parse('<div></div>');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
		});

		it('Parses HTML with a single <div> with attributes.', () => {
			const root = new XMLParser(window).parse(
				'<div class="class1 class2" id="id" data-no-value></div>'
			);
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect((<HTMLElement>root.childNodes[0]).id).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).className).toBe('class1 class2');

			expect((<HTMLElement>root.childNodes[0]).attributes.length).toBe(3);

			expect((<HTMLElement>root.childNodes[0]).attributes[0].name).toBe('class');
			expect((<HTMLElement>root.childNodes[0]).attributes[0].value).toBe('class1 class2');
			expect((<HTMLElement>root.childNodes[0]).attributes[0].namespaceURI).toBe(null);
			expect((<HTMLElement>root.childNodes[0]).attributes[0].specified).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes[0].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>root.childNodes[0]).attributes[0].ownerDocument === document).toBe(true);

			expect((<HTMLElement>root.childNodes[0]).attributes[1].name).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).attributes[1].value).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).attributes[1].namespaceURI).toBe(null);
			expect((<HTMLElement>root.childNodes[0]).attributes[1].specified).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes[1].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>root.childNodes[0]).attributes[1].ownerDocument === document).toBe(true);

			expect((<HTMLElement>root.childNodes[0]).attributes[2].name).toBe('data-no-value');
			expect((<HTMLElement>root.childNodes[0]).attributes[2].value).toBe('');
			expect((<HTMLElement>root.childNodes[0]).attributes[2].namespaceURI).toBe(null);
			expect((<HTMLElement>root.childNodes[0]).attributes[2].specified).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes[2].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>root.childNodes[0]).attributes[2].ownerDocument === document).toBe(true);

			expect((<HTMLElement>root.childNodes[0]).attributes['class'].name).toBe('class');
			expect((<HTMLElement>root.childNodes[0]).attributes['class'].value).toBe('class1 class2');
			expect((<HTMLElement>root.childNodes[0]).attributes['class'].namespaceURI).toBe(null);
			expect((<HTMLElement>root.childNodes[0]).attributes['class'].specified).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes['class'].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>root.childNodes[0]).attributes['class'].ownerDocument === document).toBe(
				true
			);

			expect((<HTMLElement>root.childNodes[0]).attributes['id'].name).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).attributes['id'].value).toBe('id');
			expect((<HTMLElement>root.childNodes[0]).attributes['id'].namespaceURI).toBe(null);
			expect((<HTMLElement>root.childNodes[0]).attributes['id'].specified).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes['id'].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>root.childNodes[0]).attributes['id'].ownerDocument === document).toBe(
				true
			);

			expect((<HTMLElement>root.childNodes[0]).attributes['data-no-value'].name).toBe(
				'data-no-value'
			);
			expect((<HTMLElement>root.childNodes[0]).attributes['data-no-value'].value).toBe('');
			expect((<HTMLElement>root.childNodes[0]).attributes['data-no-value'].namespaceURI).toBe(null);
			expect((<HTMLElement>root.childNodes[0]).attributes['data-no-value'].specified).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes['data-no-value'].ownerElement ===
					root.childNodes[0]
			).toBe(true);
			expect(
				(<HTMLElement>root.childNodes[0]).attributes['data-no-value'].ownerDocument === document
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
			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(html);
			expect(new HTMLSerializer().serializeToString(root)).toBe(expected);
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

			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(html);
			const doctype = <DocumentType>root.childNodes[0];
			expect(doctype.name).toBe('html');
			expect(doctype.publicId).toBe('-//W3C//DTD HTML 4.01//EN');
			expect(doctype.systemId).toBe('http://www.w3.org/TR/html4/strict.dtd');
			expect(new HTMLSerializer().serializeToString(root)).toBe(expected);
		});

		it('Handles unnestable elements correctly when there are siblings.', () => {
			const root = new XMLParser(window).parse(
				`<article>
                    <span>
                        <div>
                            <a><a>Test</a></a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>`
			);
			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
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
			const root = new XMLParser(window).parse(
				`<article>
                    <span>
                        <div>
                            <a><span><a>Test</a></span></a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>`
			);
			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
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

			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(html);
			const doctype = <DocumentType>root.childNodes[0];
			expect(doctype.name).toBe('math');
			expect(doctype.publicId).toBe('');
			expect(doctype.systemId).toBe('http://www.w3.org/Math/DTD/mathml1/mathml.dtd');
			expect(new HTMLSerializer().serializeToString(root)).toBe(expected);
		});

		it('Handles unclosed tags of unnestable elements (e.g. <a>, <li>).', () => {
			const root = new XMLParser(window).parse(
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

			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
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
			const root = new XMLParser(window).parse(
				`<div>
					<script>if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
				</div>`
			);

			expect((<HTMLElement>root.children[0].children[0]).innerText).toBe(
				`if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}`
			);

			expect((<HTMLElement>root.children[0].children[1]).innerText).toBe('<b></b>');
			expect((<HTMLElement>root.children[0].children[2]).innerText).toBe('<b></b>');

			expect(new HTMLSerializer().serializeToString(root)).toBe(
				`<div>
					<script>if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
				</div>`
			);

			const root2 = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
				`<html>
                    <head>
                        <title>Title</title>
                    </head>
                    <body>
                        <script type="text/javascript">var vars = []; for (var i=0;i<vars.length;i++) {}</script>
                    </body>
                </html>`
			);
			expect((<HTMLElement>root2.children[0].children[1].children[0]).innerText).toBe(
				'var vars = []; for (var i=0;i<vars.length;i++) {}'
			);
		});

		it('Handles unclosed regular elements.', () => {
			const root = new XMLParser(window).parse(`<div>test`);

			expect(root.childNodes.length).toBe(1);
			expect((<HTMLElement>root.childNodes[0]).tagName).toBe('DIV');
			expect(root.childNodes[0].childNodes[0].nodeType).toBe(Node.TEXT_NODE);
		});

		it('Parses an SVG with "xmlns" set to HTML.', () => {
			const root = new XMLParser(window).parse(
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

			const div = root.children[0];
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

			expect(new HTMLSerializer().serializeToString(root)).toBe(
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
		});

		it('Parses a malformed SVG with "xmlns" set to HTML.', () => {
			const root = new XMLParser(window).parse(
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

			expect(new HTMLSerializer().serializeToString(root)).toBe(
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
		});

		it('Parses childless elements with start and end tag names in different case', () => {
			const root = new XMLParser(window).parse(
				`
				<script type="text/JavaScript">console.log('hello')</SCRIPT>
				`
			);

			expect((<HTMLElement>root.children[0]).innerText).toBe(`console.log('hello')`);
		});

		it('Handles different value types.', () => {
			const root1 = new XMLParser(window).parse(<string>(<unknown>null));
			expect(new HTMLSerializer().serializeToString(root1)).toBe('');

			const root2 = new XMLParser(window).parse(<string>(<unknown>undefined));
			expect(new HTMLSerializer().serializeToString(root2)).toBe('');

			const root3 = new XMLParser(window).parse(<string>(<unknown>1000));
			expect(new HTMLSerializer().serializeToString(root3)).toBe('1000');

			const root4 = new XMLParser(window).parse(<string>(<unknown>false));
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
				const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlFragment }).parse(html);
				expect(new HTMLSerializer().serializeToString(root)).toBe(html);
			}
		});

		it('Parses conditional comments for IE 9 with multiple scripts', () => {
			const html =
				'<!DOCTYPE html><html lang="en">\n' +
				'<head>\n' +
				'    <meta charset="UTF-8">\n' +
				'    <title>Title</title>\n' +
				'</head>\n' +
				'<body>\n' +
				'<!--[if lt IE 9]>\n' +
				"<script>window.location = 'browser.htm';</script>\n" +
				'<![endif]-->\n' +
				'\n' +
				'\n' +
				'<script>\n' +
				"    const node = document.createElement('a');\n" +
				"    node.href = 'http://www.google.com';\n" +
				"    node.target = '_blank';\n" +
				"    node.innerHTML = 'google';\n" +
				'    window.document.body.appendChild(node);\n' +
				'</script>\n' +
				'</body>\n' +
				'</html>\n';
			const expected =
				'<!DOCTYPE html><html lang="en">' +
				'<head>\n' +
				'    <meta charset="UTF-8">\n' +
				'    <title>Title</title>\n' +
				'</head>\n' +
				'<body>\n' +
				'<!--[if lt IE 9]>\n' +
				"<script>window.location = 'browser.htm';</script>\n" +
				'<![endif]-->\n' +
				'\n' +
				'\n' +
				'<script>\n' +
				"    const node = document.createElement('a');\n" +
				"    node.href = 'http://www.google.com';\n" +
				"    node.target = '_blank';\n" +
				"    node.innerHTML = 'google';\n" +
				'    window.document.body.appendChild(node);\n' +
				'</script>\n\n\n' +
				'</body>' +
				'</html>';

			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(html);
			expect(new HTMLSerializer().serializeToString(root)).toBe(expected);
		});

		it('Parses comments with dash in them.', () => {
			const root = new XMLParser(window).parse('<!-- comment with - in - it -->');
			expect(root.childNodes.length).toBe(1);
			expect(root.childNodes[0].nodeType).toBe(NodeTypeEnum.commentNode);
			expect(root.childNodes[0].nodeValue).toBe(' comment with - in - it ');
		});

		it('Parses <template> elements, including its content.', () => {
			const root = new XMLParser(window).parse(
				'<div><template><tr><td></td></tr></template></div>'
			);
			expect(root.childNodes.length).toBe(1);
			const template = <HTMLTemplateElement>root.childNodes[0].childNodes[0];
			expect(template.childNodes.length).toBe(0);
			expect(template.children.length).toBe(0);
			expect(template.content.children.length).toBe(1);
			expect(template.content.children[0].tagName).toBe('TR');
			expect(template.content.children[0].children.length).toBe(1);
			expect(template.content.children[0].children[0].tagName).toBe('TD');
		});

		it('Parses HTML with attributes using colon (:) and value containing ">".', () => {
			const root = new XMLParser(window).parse(
				'<template><component :is="type" :disabled="index > 1" data-testid="button"/></template>'
			);

			expect(root.childNodes.length).toBe(1);

			const template = <HTMLTemplateElement>root.childNodes[0];
			expect(template.content.childNodes.length).toBe(1);
			expect((<HTMLElement>template.content.childNodes[0]).tagName).toBe('COMPONENT');
			expect((<HTMLElement>template.content.childNodes[0]).getAttribute(':disabled')).toBe(
				'index > 1'
			);
		});

		it('Doesn\'t close non-void elements when using "/>" when namespace is HTML.', () => {
			const root = new XMLParser(window).parse(
				`
                <span key1="value1"/>
                <span key1="value1" key2/>
                <span key2/>
                `
			);

			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
				`
                <span key1="value1">
                    <span key1="value1" key2="">
                        <span key2=""></span>
                    </span>
                </span>`.replace(/\s/gm, '')
			);
		});

		it('Can read text with ">" in it.', () => {
			const root = new XMLParser(window).parse(`<span>1 > 0</span>`);

			expect(new HTMLSerializer().serializeToString(root)).toBe(`<span>1 &gt; 0</span>`);
		});

		it('Parses malformed attributes.', () => {
			const root = new XMLParser(window).parse(
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

			expect(root.children.length).toBe(9);

			expect(root.children[0].attributes.length).toBe(1);
			expect(root.children[0].attributes[0].name).toBe('key1');
			expect(root.children[0].attributes[0].value).toBe('value1');

			expect(root.children[1].attributes.length).toBe(2);
			expect(root.children[1].attributes[0].name).toBe('key1');
			expect(root.children[1].attributes[0].value).toBe('value1');
			expect(root.children[1].attributes[1].name).toBe('key2');
			expect(root.children[1].attributes[1].value).toBe('');

			expect(root.children[2].attributes.length).toBe(3);
			expect(root.children[2].attributes[0].name).toBe('key1');
			expect(root.children[2].attributes[0].value).toBe('');
			expect(root.children[2].attributes[1].name).toBe('key2');
			expect(root.children[2].attributes[1].value).toBe('');
			expect(root.children[2].attributes[2].name).toBe('key3');
			expect(root.children[2].attributes[2].value).toBe('value3');

			expect(root.children[3].attributes.length).toBe(2);
			expect(root.children[3].attributes[0].name).toBe('key1');
			expect(root.children[3].attributes[0].value).toBe('value1');
			expect(root.children[3].attributes[1].name).toBe('key2');
			expect(root.children[3].attributes[1].value).toBe('');

			expect(root.children[4].attributes.length).toBe(1);
			expect(root.children[4].attributes[0].name).toBe('key1');
			expect(root.children[4].attributes[0].value).toBe('value1');

			expect(root.children[5].attributes.length).toBe(2);
			expect(root.children[5].attributes[0].name).toBe('key1');
			expect(root.children[5].attributes[0].value).toBe('value1');
			expect(root.children[5].attributes[1].name).toBe('key2');
			expect(root.children[5].attributes[1].value).toBe('');

			expect(root.children[6].attributes.length).toBe(3);
			expect(root.children[6].attributes[0].name).toBe('key1');
			expect(root.children[6].attributes[0].value).toBe('');
			expect(root.children[6].attributes[1].name).toBe('key2');
			expect(root.children[6].attributes[1].value).toBe('');
			expect(root.children[6].attributes[2].name).toBe('key3');
			expect(root.children[6].attributes[2].value).toBe('value3');

			expect(root.children[7].attributes.length).toBe(1);
			expect(root.children[7].attributes[0].name).toBe('key1');
			expect(root.children[7].attributes[0].value).toBe('value1 > value2');

			expect(root.children[8].attributes.length).toBe(1);
			expect(root.children[8].attributes[0].name).toBe('key1');
			expect(root.children[8].attributes[0].value).toBe('value1 /> value2');
		});

		it('Parses attributes with characters that lit-html is using (".", "$", "@").', () => {
			const root = new XMLParser(window).parse(
				`
                <img key1="value1" key2/>
                <img key1="value1"/>
                <span .key$lit$="{{lit-11111}}"></span>
                <div @event="{{lit-22222}}"></div>
                <article ?checked="{{lit-33333}}"></div>
                <img key1="value1" key2/>
                `
			);

			expect(root.querySelector('span')?.getAttribute('.key$lit$')).toBe('{{lit-11111}}');
			expect(root.querySelector('div')?.getAttribute('@event')).toBe('{{lit-22222}}');
			expect(root.querySelector('article')?.getAttribute('?checked')).toBe('{{lit-33333}}');
		});

		it('Parses attributes without apostrophs.', () => {
			const root = new XMLParser(window).parse(
				`<div .theme$lit$={{lit-12345}} key1="value1">Test</div>`
			);

			expect(new HTMLSerializer().serializeToString(root)).toBe(
				'<div .theme$lit$="{{lit-12345}}" key1="value1">Test</div>'
			);
		});

		it('Parses attributes with URL without apostrophs.', () => {
			const root = new XMLParser(window).parse(`<a href=http://www.github.com/path>Click me</a>`);

			expect(new HTMLSerializer().serializeToString(root)).toBe(
				'<a href="http://www.github.com/path">Click me</a>'
			);
		});

		it('Parses attributes with single apostrophs.', () => {
			const root = new XMLParser(window).parse(`<div key1='value1' key2='value2'>Test</div>`);

			expect(new HTMLSerializer().serializeToString(root)).toBe(
				`<div key1="value1" key2="value2">Test</div>`
			);
		});

		it('Parses HTML with end ">" on a new line.', () => {
			const root = new XMLParser(window).parse(
				`
                <div key1="value1">
                    Test
                </div
                >
                `
			);

			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
				'<divkey1="value1">Test</div>'
			);
			expect(root.children[0].textContent.replace(/\s/gm, '')).toBe('Test');
		});

		it('Parses <ul> and <li> elements.', () => {
			const root = new XMLParser(window).parse(
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

			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
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

			const root2 = new XMLParser(window).parse(`<li><li><span>Test</span></li></li>`);

			expect(new HTMLSerializer().serializeToString(root2).replace(/\s/gm, '')).toBe(
				`<li></li><li><span>Test</span></li>`.replace(/\s/gm, '')
			);
		});

		it('Handles ending with unclosed start tag.', () => {
			const root = new XMLParser(window).parse(
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

			expect(new HTMLSerializer().serializeToString(root)).toBe(
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
			const root = new XMLParser(window).parse(
				`<div class="container">
                    <div class="sliderContainer">
                        <input class="slider" type="range" step="1" min="0" max="100">
                            
                        <div class="value">
                            <kompis-text-0-0-0 data-element-name="kompis-text"><!---->0<!----></kompis-text-0-0-0>
                        </div>
		
					    <div class="sliderBackground" style="background: linear-gradient(to right, rgb(17, 17, 17) 0%, rgb(17, 17, 17) 0.75rem, rgb(223, 223, 223) 0.75rem, rgb(223, 223, 223) 100%);"></div>
				    </div>
			    </div>`
			);

			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
				`<div class="container">
                    <div class="sliderContainer">
                        <input class="slider" type="range" step="1" min="0" max="100">
                            
                        <div class="value">
                            <kompis-text-0-0-0 data-element-name="kompis-text"><!---->0<!----></kompis-text-0-0-0>
                        </div>
		
					    <div class="sliderBackground" style="background: linear-gradient(to right, rgb(17, 17, 17) 0%, rgb(17, 17, 17) 0.75rem, rgb(223, 223, 223) 0.75rem, rgb(223, 223, 223) 100%);"></div>
				    </div>
			    </div>`.replace(/\s/gm, '')
			);
		});

		it('Handles parsing custom elements registered with non-ASCII characters.', () => {
			window.customElements.define('a-Öa', CustomElement);

			const root = new XMLParser(window).parse(
				`
                <div>
                    <a-Öa key1="value1" key2="value2">
                        <span>Test</span>
                    </a-Öa>
                </div>
                `
			);

			expect(new HTMLSerializer().serializeToString(root).replace(/\s/gm, '')).toBe(
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

			const root = new XMLParser(window).parse(
				`
                <div>
                    <custom-element key1="value1"></custom-element>
                </div>
                `
			);

			document.body.appendChild(root.children[0]);

			expect(document.body.children[0].children[0]['key1']).toBe('value1');
		});

		it('Ignores <!DOCTYPE>, <html>, <head> and <body> when parsing an HTML fragment.', () => {
			const root = new XMLParser(window).parse(
				'<!DOCTYPE html><html><head></head><body><div>Test</div></body></html>'
			);

			expect(new HTMLSerializer().serializeToString(root)).toBe('<div>Test</div>');
		});

		it('Handles multiple <!DOCTYPE>.', () => {
			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
				`<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">
                <!DOCTYPE html>
                <html>
                    <head></head>
                    <body><div>Test</div></body>
                </html>`
			);

			expect((<Document>root).doctype).toBe(root.childNodes[0]);
			expect(root.childNodes.length).toBe(2);
			expect(root.childNodes[0].nodeType).toBe(NodeTypeEnum.documentTypeNode);
			expect((<DocumentType>root.childNodes[0]).name).toBe('math');
			expect((<DocumentType>root.childNodes[0]).publicId).toBe('');
			expect((<DocumentType>root.childNodes[0]).systemId).toBe(
				'http://www.w3.org/Math/DTD/mathml1/mathml.dtd'
			);
			expect(root.childNodes[1]).toBeInstanceOf(HTMLHtmlElement);
		});

		it('Handles multiple <html> tag names', () => {
			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
				`<html>
                    <head></head>
                    <body><div>Test</div></body>
                </html>
                <html style="color: red">
                    <head></head>
                    <body><div>Test</div></body>
                </html>`
			);

			expect(new HTMLSerializer().serializeToString(root)).toBe(
				`<!DOCTYPE html><html style="color: red"><head></head>
                    <body><div>Test</div>
                
                
                    
                    <div>Test</div>
                </body></html>`
			);
		});

		it('Handles multiple <head> tag names without <body>', () => {
			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
				`<head style="color: red">
                    <title>Title 1</title>
                </head>
                <head style="color: green">
                    <title>Title 2</title>
                </head>`
			);

			expect(new HTMLSerializer().serializeToString(root))
				.toBe(`<!DOCTYPE html><html><head style="color: red">
                    <title>Title 1</title>
                <title>Title 2</title></head>
                
                    
                <body></body></html>`);
		});

		it('Handles multiple <head> tag names with <body>', () => {
			const root = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
				`<head>
                    <title>Title 1</title>
                </head>
                <body></body>
                <head style="color: green">
                    <title>Title 2</title>
                </head>`
			);

			expect(new HTMLSerializer().serializeToString(root)).toBe(`<!DOCTYPE html><html><head>
                    <title>Title 1</title>
                </head>
                <body>
                
                    <title>Title 2</title>
                </body></html>`);
		});

		it('Handles multiple <body> tag names', () => {
			const root1 = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
				`<body>
                    <div>Test 1</div>
                </body>
                <body style="color: red">
                    <div>Test 2</div>
                </body>`
			);

			expect(new HTMLSerializer().serializeToString(root1))
				.toBe(`<!DOCTYPE html><html><head></head><body style="color: red">
                    <div>Test 1</div>
                
                
                    <div>Test 2</div>
                </body></html>`);

			const root2 = new XMLParser(window, { mode: XMLParserModeEnum.htmlDocument }).parse(
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
                </html>`
			);

			expect(new HTMLSerializer().serializeToString(root2)).toBe(`<!DOCTYPE html><html><head>
                        <title>Title</title>
                    </head>
                    <body style="color: red">
                        <div>Test 1</div>
                    
                    
                        <div>Test 2</div>
                    
                </body></html>`);
		});

		it('Handles processing instructions as comments when parser mode is HTML.', () => {
			const root = new XMLParser(window).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <div>
                    <div>Test</div>
                </div>`
			);

			expect(new HTMLSerializer().serializeToString(root)).toBe(
				`<!--?xml version="1.0" encoding="UTF-8"?-->
                <div>
                    <div>Test</div>
                </div>`
			);
		});

		it('Ignores processing instructions as comments when parser mode is XML.', () => {
			const root = new XMLParser(window, { mode: XMLParserModeEnum.xmlDocument }).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <div>
                    <div>Test</div>
                </div>`
			);

			expect(new XMLSerializer().serializeToString(root)).toBe(
				`<div>
                    <div>Test</div>
                </div>`
			);
		});

		it('Handles namespaced XML', () => {
			const root = new XMLParser(window, { mode: XMLParserModeEnum.xmlDocument }).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                <personxml:name>Rob</personxml:name>
                <personxml:age>37</personxml:age>
                <cityxml:homecity>
                    <cityxml:name>London</cityxml:name>
                    <cityxml:lat>123.000</cityxml:lat>
                    <cityxml:long>0.00</cityxml:long>
                </cityxml:homecity>
                </personxml:person>`
			);

			expect(new XMLSerializer().serializeToString(root)).toBe(
				`<?xml version="1.0" encoding="UTF-8"?><personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                <personxml:name>Rob</personxml:name>
                <personxml:age>37</personxml:age>
                <cityxml:homecity>
                    <cityxml:name>London</cityxml:name>
                    <cityxml:lat>123.000</cityxml:lat>
                    <cityxml:long>0.00</cityxml:long>
                </cityxml:homecity>
                </personxml:person>`
			);
		});
	});
});
