import XMLParser from '../../src/xml-parser/XMLParser';
import Window from '../../src/window/Window';
import IWindow from '../../src/window/IWindow';
import IDocument from '../../src/nodes/document/IDocument';
import Node from '../../src/nodes/node/Node';
import IHTMLElement from '../../src/nodes/html-element/IHTMLElement';
import XMLParserHTML from './data/XMLParserHTML';
import NamespaceURI from '../../src/config/NamespaceURI';
import DocumentType from '../../src/nodes/document-type/DocumentType';
import XMLSerializer from '../../src/xml-serializer/XMLSerializer';

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

			expect((<IHTMLElement>root.childNodes[0]).attributes.length).toBe(3);

			expect((<IHTMLElement>root.childNodes[0]).attributes[0].name).toBe('class');
			expect((<IHTMLElement>root.childNodes[0]).attributes[0].value).toBe('class1 class2');
			expect((<IHTMLElement>root.childNodes[0]).attributes[0].namespaceURI).toBe(null);
			expect((<IHTMLElement>root.childNodes[0]).attributes[0].specified).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes[0].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<IHTMLElement>root.childNodes[0]).attributes[0].ownerDocument === document).toBe(
				true
			);

			expect((<IHTMLElement>root.childNodes[0]).attributes[1].name).toBe('id');
			expect((<IHTMLElement>root.childNodes[0]).attributes[1].value).toBe('id');
			expect((<IHTMLElement>root.childNodes[0]).attributes[1].namespaceURI).toBe(null);
			expect((<IHTMLElement>root.childNodes[0]).attributes[1].specified).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes[1].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<IHTMLElement>root.childNodes[0]).attributes[1].ownerDocument === document).toBe(
				true
			);

			expect((<IHTMLElement>root.childNodes[0]).attributes[2].name).toBe('data-no-value');
			expect((<IHTMLElement>root.childNodes[0]).attributes[2].value).toBe('');
			expect((<IHTMLElement>root.childNodes[0]).attributes[2].namespaceURI).toBe(null);
			expect((<IHTMLElement>root.childNodes[0]).attributes[2].specified).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes[2].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<IHTMLElement>root.childNodes[0]).attributes[2].ownerDocument === document).toBe(
				true
			);

			expect((<IHTMLElement>root.childNodes[0]).attributes['class'].name).toBe('class');
			expect((<IHTMLElement>root.childNodes[0]).attributes['class'].value).toBe('class1 class2');
			expect((<IHTMLElement>root.childNodes[0]).attributes['class'].namespaceURI).toBe(null);
			expect((<IHTMLElement>root.childNodes[0]).attributes['class'].specified).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes['class'].ownerElement === root.childNodes[0]
			).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes['class'].ownerDocument === document
			).toBe(true);

			expect((<IHTMLElement>root.childNodes[0]).attributes['id'].name).toBe('id');
			expect((<IHTMLElement>root.childNodes[0]).attributes['id'].value).toBe('id');
			expect((<IHTMLElement>root.childNodes[0]).attributes['id'].namespaceURI).toBe(null);
			expect((<IHTMLElement>root.childNodes[0]).attributes['id'].specified).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes['id'].ownerElement === root.childNodes[0]
			).toBe(true);
			expect((<IHTMLElement>root.childNodes[0]).attributes['id'].ownerDocument === document).toBe(
				true
			);

			expect((<IHTMLElement>root.childNodes[0]).attributes['data-no-value'].name).toBe(
				'data-no-value'
			);
			expect((<IHTMLElement>root.childNodes[0]).attributes['data-no-value'].value).toBe('');
			expect((<IHTMLElement>root.childNodes[0]).attributes['data-no-value'].namespaceURI).toBe(
				null
			);
			expect((<IHTMLElement>root.childNodes[0]).attributes['data-no-value'].specified).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes['data-no-value'].ownerElement ===
					root.childNodes[0]
			).toBe(true);
			expect(
				(<IHTMLElement>root.childNodes[0]).attributes['data-no-value'].ownerDocument === document
			).toBe(true);
		});

		it('Parses an entire HTML page.', () => {
			const root = XMLParser.parse(window.document, XMLParserHTML);
			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
				GET_EXPECTED_HTML(XMLParserHTML)
			);
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
			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
				GET_EXPECTED_HTML(pageHTML)
			);
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
			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
				GET_EXPECTED_HTML(pageHTML)
			);
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

			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
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

		it('Does not parse the content of script and style elements.', () => {
			const root = XMLParser.parse(
				window.document,
				`<div>
					<script>if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
				</div>`
			);

			expect((<IHTMLElement>root.children[0].children[0]).innerText).toBe(
				`if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}`
			);

			expect((<IHTMLElement>root.children[0].children[1]).innerText).toBe('<b></b>');
			expect((<IHTMLElement>root.children[0].children[2]).innerText).toBe('<b></b>');

			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
				`<div>
					<script>if(1<Math['random']()){}else if(Math['random']()>1){console.log("1")}</script>
					<script><b></b></script>
					<style><b></b></style>
				</div>`.replace(/[\s]/gm, '')
			);

			const root2 = XMLParser.parse(
				window.document,
				`<html>
	<head>
		<title>Title</title>
	</head>
	<body>
		<script type="text/javascript">var vars = []; for (var i=0;i<vars.length;i++) {}</script>
	</body>
</html>`
			);
			expect((<IHTMLElement>root2.children[0].children[1].children[0]).innerText).toBe(
				'var vars = []; for (var i=0;i<vars.length;i++) {}'
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
			expect(svg.attributes[3].namespaceURI).toBe(NamespaceURI.html);
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
			expect(svg.attributes['xmlns'].namespaceURI).toBe(NamespaceURI.html);
			expect(svg.attributes['xmlns'].specified).toBe(true);
			expect(svg.attributes['xmlns'].ownerElement === svg).toBe(true);
			expect(svg.attributes['xmlns'].ownerDocument === document).toBe(true);

			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
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

			expect(new XMLSerializer().serializeToString(root).replace(/[\s]/gm, '')).toBe(
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

		it('Parses childless elements with start and end tag names in different case', () => {
			const root = XMLParser.parse(
				window.document,
				`
				<script type="text/JavaScript">console.log('hello')</SCRIPT>
				`
			);

			expect((<IHTMLElement>root.children[0]).innerText).toBe(`console.log('hello')`);
		});

		it('Handles different value types.', () => {
			const root1 = XMLParser.parse(window.document, null);
			expect(new XMLSerializer().serializeToString(root1)).toBe('');

			const root2 = XMLParser.parse(window.document, undefined);
			expect(new XMLSerializer().serializeToString(root2)).toBe('');

			const root3 = XMLParser.parse(window.document, <string>(<unknown>1000));
			expect(new XMLSerializer().serializeToString(root3)).toBe('1000');

			const root4 = XMLParser.parse(window.document, <string>(<unknown>false));
			expect(new XMLSerializer().serializeToString(root4)).toBe('false');
		});

		it('Parses conditional comments', () => {
			const testHTML = [
				'<!--[if IE 8]>\n' + '<p>Welcome to Internet Explorer 8.</p>\n' + '<![endif]-->',

				'<!--[if gte IE 7]>\n' +
					'<script>\n' +
					'  alert("Congratulations! You are running Internet Explorer 7 or a later version of Internet Explorer.");\n' +
					'</script>\n' +
					'<p>Thank you for closing the message box.</p>\n' +
					'<![endif]-->',

				'<!--[if IE 5]>\n' +
					'<p>Welcome to any incremental version of Internet Explorer 5!</p>\n' +
					'<![endif]-->',

				'<!--[if IE 5.0000]>\n' + '<p>Welcome to Internet Explorer 5.0!</p>\n' + '<![endif]-->',

				'<!--[if WindowsEdition 1]>\n' +
					'<p>You are using Windows Ultimate Edition.</p>\n' +
					'<![endif]-->',

				'<!--[if lt Contoso 2]>\n' +
					'<p>Your version of the Contoso control is out of date; Please update to the latest.</p>\n' +
					'<![endif]-->',

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
					'</html>\n'
			];

			for (const html of testHTML) {
				const root = XMLParser.parse(window.document, html);
				expect(new XMLSerializer().serializeToString(root)).toBe(html);
			}
		});
	});
});
