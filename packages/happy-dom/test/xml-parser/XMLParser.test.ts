import XMLParser from '../../src/xml-parser/XMLParser.js';
import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import NamespaceURI from '../../src/config/NamespaceURI.js';
import DocumentType from '../../src/nodes/document-type/DocumentType.js';
import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import NodeTypeEnum from '../../src/nodes/node/NodeTypeEnum.js';
import { beforeEach, describe, it, expect } from 'vitest';
import CustomElement from '../CustomElement.js';
import Element from '../../src/nodes/element/Element.js';
import ProcessingInstruction from '../../src/nodes/processing-instruction/ProcessingInstruction.js';

describe('XMLParser', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('parse()', () => {
		it('Parses XML with a single <div>.', () => {
			const result = new XMLParser(window).parse('<div></div>');
			expect(result.childNodes.length).toBe(1);
			expect(result.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>result.childNodes[0]).tagName).toBe('div');
		});

		it('Parses XML with a single <div> with attributes.', () => {
			const result = new XMLParser(window).parse(
				'<div class="class1 class2" id="id" data-no-value=""></div>'
			);
			expect(result.childNodes.length).toBe(1);
			expect(result.childNodes[0].childNodes.length).toBe(0);
			expect((<HTMLElement>result.childNodes[0]).tagName).toBe('div');
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
			expect((<HTMLElement>result.childNodes[0]).attributes[0].ownerDocument === result).toBe(true);

			expect((<HTMLElement>result.childNodes[0]).attributes[1].name).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes[1].value).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes[1].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes[1].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes[1].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes[1].ownerDocument === result).toBe(true);

			expect((<HTMLElement>result.childNodes[0]).attributes[2].name).toBe('data-no-value');
			expect((<HTMLElement>result.childNodes[0]).attributes[2].value).toBe('');
			expect((<HTMLElement>result.childNodes[0]).attributes[2].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes[2].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes[2].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes[2].ownerDocument === result).toBe(true);

			expect((<HTMLElement>result.childNodes[0]).attributes['class'].name).toBe('class');
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].value).toBe('class1 class2');
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['class'].ownerElement ===
					result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes['class'].ownerDocument === result).toBe(
				true
			);

			expect((<HTMLElement>result.childNodes[0]).attributes['id'].name).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].value).toBe('id');
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].namespaceURI).toBe(null);
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].specified).toBe(true);
			expect(
				(<HTMLElement>result.childNodes[0]).attributes['id'].ownerElement === result.childNodes[0]
			).toBe(true);
			expect((<HTMLElement>result.childNodes[0]).attributes['id'].ownerDocument === result).toBe(
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
				(<HTMLElement>result.childNodes[0]).attributes['data-no-value'].ownerDocument === result
			).toBe(true);
		});

		it("Doesn't use the config for unnestable elements when there are siblings.", () => {
			const result = new XMLParser(window).parse(
				`<article xmlsns="http://www.w3.org/1999/xhtml">
                    <span>
                        <div>
                            <a><a>Test</a></a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>`
			);
			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<article xmlsns="http://www.w3.org/1999/xhtml">
                    <span>
                        <div>
                            <a><a>Test</a></a>
                        </div>
                    </span>
                    <b>Test</b>
                </article>`
			);
		});

		it('Can parse document types.', () => {
			const html = `<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">
            <html>
                <head>
                    <title>Title</title>
                </head>
                <body>
                    <div class="class1 class2" id="id"></div>
                </body>
            </html>`;
			const expected = `<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd"><html>
                <head>
                    <title>Title</title>
                </head>
                <body>
                    <div class="class1 class2" id="id"/>
                </body>
            </html>`;

			const result = new XMLParser(window).parse(html);
			const doctype = <DocumentType>result.childNodes[0];
			expect(doctype.name).toBe('math');
			expect(doctype.publicId).toBe('');
			expect(doctype.systemId).toBe('http://www.w3.org/Math/DTD/mathml1/mathml.dtd');
			expect(new XMLSerializer().serializeToString(result)).toBe(expected);
		});

		it('Outputs error for malformed processing instructions.', () => {
			const result = new XMLParser(window).parse(`<?processing-instruction><article></article>`);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 25: ParsePI: PI processing-instruction space expected
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);
		});

		it('Outputs error for missing end of start tag character.', () => {
			const result = new XMLParser(window).parse(`<article>
                <div
            </article>`);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<article><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 3 at column 13: error parsing attribute name
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></article>`
			);
		});

		it('Parses content of script tag as normal tags.', () => {
			const result = new XMLParser(window).parse(
				`<div>
					<script><b></b></script>
					<style><b></b></style>
				</div>`
			);

			expect((<HTMLElement>result.children[0].children[0]).textContent).toBe('');
			expect((<HTMLElement>result.children[0].children[1]).textContent).toBe('');
			expect((<HTMLElement>result.children[0].children[0]).innerHTML).toBe('<b></b>');
			expect((<HTMLElement>result.children[0].children[1]).innerHTML).toBe('<b></b>');
		});

		it('Outputs error for incomplete end tag.', () => {
			const result = new XMLParser(window).parse(`<article>test`);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<article><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 14: Premature end of data in tag article line 1
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>test</article>`
			);
		});

		it('Parses an SVG with "xmlns" set to SVG.', () => {
			const result = new XMLParser(window).parse(
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

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" stroke="red" fill="grey">
						<circle cx="50" cy="50" r="40"/>
						<circle cx="150" cy="50" r="4"/>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clippath>
								<circle cx="5" cy="5" r="4"/>
							</clippath>
						</svg>
					</svg>
				</div>`
			);

			const div = result.children[0];
			const svg = div.children[0];
			const circle = svg.children[0];

			expect(div.namespaceURI).toBe(null);
			expect(svg.namespaceURI).toBe(NamespaceURI.svg);
			expect(circle.namespaceURI).toBe(NamespaceURI.svg);

			// Attributes should be in lower-case now as the namespace is HTML
			expect(svg.attributes.length).toBe(4);

			expect(svg.attributes[0].name).toBe('viewBox');
			expect(svg.attributes[0].value).toBe('0 0 300 100');
			expect(svg.attributes[0].namespaceURI).toBe(null);
			expect(svg.attributes[0].specified).toBe(true);
			expect(svg.attributes[0].ownerElement === svg).toBe(true);
			expect(svg.attributes[0].ownerDocument === result).toBe(true);

			expect(svg.attributes[1].name).toBe('stroke');
			expect(svg.attributes[1].value).toBe('red');
			expect(svg.attributes[1].namespaceURI).toBe(null);
			expect(svg.attributes[1].specified).toBe(true);
			expect(svg.attributes[1].ownerElement === svg).toBe(true);
			expect(svg.attributes[1].ownerDocument === result).toBe(true);

			expect(svg.attributes[2].name).toBe('fill');
			expect(svg.attributes[2].value).toBe('grey');
			expect(svg.attributes[2].namespaceURI).toBe(null);
			expect(svg.attributes[2].specified).toBe(true);
			expect(svg.attributes[2].ownerElement === svg).toBe(true);
			expect(svg.attributes[2].ownerDocument === result).toBe(true);

			expect(svg.attributes[3].name).toBe('xmlns');
			expect(svg.attributes[3].value).toBe(NamespaceURI.svg);
			expect(svg.attributes[3].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes[3].specified).toBe(true);
			expect(svg.attributes[3].ownerElement === svg).toBe(true);
			expect(svg.attributes[3].ownerDocument === result).toBe(true);

			expect(svg.attributes['viewBox'].name).toBe('viewBox');
			expect(svg.attributes['viewBox'].value).toBe('0 0 300 100');
			expect(svg.attributes['viewBox'].namespaceURI).toBe(null);
			expect(svg.attributes['viewBox'].specified).toBe(true);
			expect(svg.attributes['viewBox'].ownerElement === svg).toBe(true);
			expect(svg.attributes['viewBox'].ownerDocument === result).toBe(true);

			expect(svg.attributes['stroke'].name).toBe('stroke');
			expect(svg.attributes['stroke'].value).toBe('red');
			expect(svg.attributes['stroke'].namespaceURI).toBe(null);
			expect(svg.attributes['stroke'].specified).toBe(true);
			expect(svg.attributes['stroke'].ownerElement === svg).toBe(true);
			expect(svg.attributes['stroke'].ownerDocument === result).toBe(true);

			expect(svg.attributes['fill'].name).toBe('fill');
			expect(svg.attributes['fill'].value).toBe('grey');
			expect(svg.attributes['fill'].namespaceURI).toBe(null);
			expect(svg.attributes['fill'].specified).toBe(true);
			expect(svg.attributes['fill'].ownerElement === svg).toBe(true);
			expect(svg.attributes['fill'].ownerDocument === result).toBe(true);

			expect(svg.attributes['xmlns'].name).toBe('xmlns');
			expect(svg.attributes['xmlns'].value).toBe(NamespaceURI.svg);
			expect(svg.attributes['xmlns'].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes['xmlns'].specified).toBe(true);
			expect(svg.attributes['xmlns'].ownerElement === svg).toBe(true);
			expect(svg.attributes['xmlns'].ownerDocument === result).toBe(true);
		});

		it('Parses an SVG with "xmlns" set to HTML.', () => {
			const result = new XMLParser(window).parse(
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

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div>
					<svg xmlns="http://www.w3.org/1999/xhtml" viewBox="0 0 300 100" stroke="red" fill="grey">
						<circle cx="50" cy="50" r="40"></circle>
						<circle cx="150" cy="50" r="4"></circle>
					
						<svg viewBox="0 0 10 10" x="200" width="100">
							<clippath>
								<circle cx="5" cy="5" r="4"></circle>
							</clippath>
						</svg>
					</svg>
				</div>`
			);

			const div = result.children[0];
			const svg = div.children[0];
			const circle = svg.children[0];

			expect(div.namespaceURI).toBe(null);
			expect(svg.namespaceURI).toBe(NamespaceURI.html);
			expect(circle.namespaceURI).toBe(NamespaceURI.html);

			// Attributes should be in lower-case now as the namespace is HTML
			expect(svg.attributes.length).toBe(4);

			expect(svg.attributes[0].name).toBe('viewBox');
			expect(svg.attributes[0].value).toBe('0 0 300 100');
			expect(svg.attributes[0].namespaceURI).toBe(null);
			expect(svg.attributes[0].specified).toBe(true);
			expect(svg.attributes[0].ownerElement === svg).toBe(true);
			expect(svg.attributes[0].ownerDocument === result).toBe(true);

			expect(svg.attributes[1].name).toBe('stroke');
			expect(svg.attributes[1].value).toBe('red');
			expect(svg.attributes[1].namespaceURI).toBe(null);
			expect(svg.attributes[1].specified).toBe(true);
			expect(svg.attributes[1].ownerElement === svg).toBe(true);
			expect(svg.attributes[1].ownerDocument === result).toBe(true);

			expect(svg.attributes[2].name).toBe('fill');
			expect(svg.attributes[2].value).toBe('grey');
			expect(svg.attributes[2].namespaceURI).toBe(null);
			expect(svg.attributes[2].specified).toBe(true);
			expect(svg.attributes[2].ownerElement === svg).toBe(true);
			expect(svg.attributes[2].ownerDocument === result).toBe(true);

			expect(svg.attributes[3].name).toBe('xmlns');
			expect(svg.attributes[3].value).toBe(NamespaceURI.html);
			expect(svg.attributes[3].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes[3].specified).toBe(true);
			expect(svg.attributes[3].ownerElement === svg).toBe(true);
			expect(svg.attributes[3].ownerDocument === result).toBe(true);

			expect(svg.attributes['viewBox'].name).toBe('viewBox');
			expect(svg.attributes['viewBox'].value).toBe('0 0 300 100');
			expect(svg.attributes['viewBox'].namespaceURI).toBe(null);
			expect(svg.attributes['viewBox'].specified).toBe(true);
			expect(svg.attributes['viewBox'].ownerElement === svg).toBe(true);
			expect(svg.attributes['viewBox'].ownerDocument === result).toBe(true);

			expect(svg.attributes['stroke'].name).toBe('stroke');
			expect(svg.attributes['stroke'].value).toBe('red');
			expect(svg.attributes['stroke'].namespaceURI).toBe(null);
			expect(svg.attributes['stroke'].specified).toBe(true);
			expect(svg.attributes['stroke'].ownerElement === svg).toBe(true);
			expect(svg.attributes['stroke'].ownerDocument === result).toBe(true);

			expect(svg.attributes['fill'].name).toBe('fill');
			expect(svg.attributes['fill'].value).toBe('grey');
			expect(svg.attributes['fill'].namespaceURI).toBe(null);
			expect(svg.attributes['fill'].specified).toBe(true);
			expect(svg.attributes['fill'].ownerElement === svg).toBe(true);
			expect(svg.attributes['fill'].ownerDocument === result).toBe(true);

			expect(svg.attributes['xmlns'].name).toBe('xmlns');
			expect(svg.attributes['xmlns'].value).toBe(NamespaceURI.html);
			expect(svg.attributes['xmlns'].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(svg.attributes['xmlns'].specified).toBe(true);
			expect(svg.attributes['xmlns'].ownerElement === svg).toBe(true);
			expect(svg.attributes['xmlns'].ownerDocument === result).toBe(true);
		});

		it('Outputs error for a malformed SVG.', () => {
			const result = new XMLParser(window).parse(
				`
				<div>
					<svg viewBox="0 0 300 100" stroke="red" fill="grey" xmlns="${NamespaceURI.svg}">
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

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 13 at column 74: Opening and ending tag mismatch: circle line 13 and clippath
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>
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
                        <clippath><circle cx="5" cy="5" r="4"/></clippath></polygon></path></line></ellipse></svg></div>`
			);
		});

		it('Outputs error for start tag and end tag in different casing', () => {
			const result = new XMLParser(window).parse(
				`
				<script type="text/JavaScript">console.log('hello')</SCRIPT>
				`
			);

			expect(new XMLSerializer().serializeToString(result))
				.toBe(`<script type="text/JavaScript"><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 2 at column 65: Opening and ending tag mismatch: script line 2 and SCRIPT
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></script>`);
		});

		it('Outputs error for missing document element', () => {
			const result = new XMLParser(window).parse(`Test`);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Start tag expected, '&lt;' not found</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);
		});

		it('Handles different value types.', () => {
			const result1 = new XMLParser(window).parse(<string>(<unknown>null));
			expect(new XMLSerializer().serializeToString(result1)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Start tag expected, '&lt;' not found</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);

			const result2 = new XMLParser(window).parse(<string>(<unknown>undefined));
			expect(new XMLSerializer().serializeToString(result2)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Start tag expected, '&lt;' not found</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);

			const result3 = new XMLParser(window).parse(<string>(<unknown>1000));
			expect(new XMLSerializer().serializeToString(result3)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Start tag expected, '&lt;' not found</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);

			const result4 = new XMLParser(window).parse(<string>(<unknown>false));
			expect(new XMLSerializer().serializeToString(result4)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Start tag expected, '&lt;' not found</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);
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
				const result = new XMLParser(window).parse(`<article>\n${html}\n</article>`);
				expect(new XMLSerializer().serializeToString(result)).toBe(
					`<article>\n${html}\n</article>`
				);
			}
		});

		it('Parses comments with dash in them.', () => {
			const result = new XMLParser(window).parse(
				'<article><!-- comment with - in - it --></article>'
			);
			expect(result.childNodes.length).toBe(1);
			expect(result.childNodes[0].childNodes[0].nodeType).toBe(NodeTypeEnum.commentNode);
			expect(result.childNodes[0].childNodes[0].nodeValue).toBe(' comment with - in - it ');
		});

		it('Parses XML with attributes with value containing ">".', () => {
			const result = new XMLParser(window).parse(
				'<root><component disabled="index > 1" data-testid="button"/></root>'
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				'<root><component disabled="index &gt; 1" data-testid="button"/></root>'
			);
		});

		it('Parses XML with attributes on new lines.', () => {
			const result = new XMLParser(window).parse(
				`<root><component disabled="part1
part2" data-testid="button"
                /></root>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				'<root><component disabled="part1 part2" data-testid="button"/></root>'
			);
		});

		it('Outputs error for attributes names containing invalid characters (like ":").', () => {
			const result = new XMLParser(window).parse(
				'<root><component :is="type" data-testid="button"/></root>'
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 21: Failed to parse QName ':is'
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></root>`
			);
		});

		it('Outputs error for double apostrophes.', () => {
			const result = new XMLParser(window).parse(
				'<root><component is="type"" data-testid="button"/></root>'
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 27: attributes construct error
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></root>`
			);
		});

		it('Outputs error for missing end apostrophe.', () => {
			const result = new XMLParser(window).parse(
				'<root><component is="type data-testid="button"/></root>'
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 40: attributes construct error
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></root>`
			);
		});

		it('Outputs error for missing end apostrophe at the end.', () => {
			const result = new XMLParser(window).parse(
				'<root><component is="type" data-testid="button/></root>'
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 49: Unescaped '&lt;' not allowed in attributes values
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></root>`
			);
		});

		it('Parses attributes with single apostrophs.', () => {
			const result = new XMLParser(window).parse(`<div key1='value1' key2='value2'>Test</div>`);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div key1="value1" key2="value2">Test</div>`
			);
		});

		it('Supports self closing elements.', () => {
			const result = new XMLParser(window).parse(
				`<root>
                    <span key1="value1"/>
                    <span key1="value1" key2=""/>
                    <span key2=""/>
                </root>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root>
                    <span key1="value1"/>
                    <span key1="value1" key2=""/>
                    <span key2=""/>
                </root>`
			);
		});

		it('Outputs error when value for attribute is missing.', () => {
			const result = new XMLParser(window).parse(
				`<root>
                    <span key1="value1"/>
                    <span key1="value1" key2/>
                    <span key2/>
                </root>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 3 at column 45: Specification mandates value for attribute key2
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>
                    <span key1="value1"/></root>`
			);
		});

		it('Can read text with ">" in it.', () => {
			const result = new XMLParser(window).parse(`<span>1 > 0</span>`);

			expect(new XMLSerializer().serializeToString(result)).toBe(`<span>1 &gt; 0</span>`);
		});

		it('Parses HTML with end ">" on a new line.', () => {
			const result = new XMLParser(window).parse(
				`
                <div key1="value1">
                    Test
                </div
                >
                `
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(`<div key1="value1">
                    Test
                </div>`);
			expect(result.children[0].textContent).toBe(`
                    Test
                `);
		});

		it('Outputs error for unclosed tags.', () => {
			const result = new XMLParser(window).parse(
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

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 7 at column 29: error parsing attribute name
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>
                    <ul>
                        <li>
                            <ul>
                                <li>aaaaa</li></ul></li></ul></div>`
			);
		});

		it('Handles complex style attributes', () => {
			const result = new XMLParser(window).parse(
				`<div class="container">
                    <div class="sliderContainer">
                        <input class="slider" type="range" step="1" min="0" max="100" />
                            
                        <div class="value">
                            <kompis-text-0-0-0 data-element-name="kompis-text"><!---->0<!----></kompis-text-0-0-0>
                        </div>
		
					    <div class="sliderBackground" style="background: linear-gradient(to right, rgb(17, 17, 17) 0%, rgb(17, 17, 17) 0.75rem, rgb(223, 223, 223) 0.75rem, rgb(223, 223, 223) 100%);"></div>
				    </div>
			    </div>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div class="container">
                    <div class="sliderContainer">
                        <input class="slider" type="range" step="1" min="0" max="100"/>
                            
                        <div class="value">
                            <kompis-text-0-0-0 data-element-name="kompis-text"><!---->0<!----></kompis-text-0-0-0>
                        </div>
		
					    <div class="sliderBackground" style="background: linear-gradient(to right, rgb(17, 17, 17) 0%, rgb(17, 17, 17) 0.75rem, rgb(223, 223, 223) 0.75rem, rgb(223, 223, 223) 100%);"/>
				    </div>
			    </div>`
			);
		});

		it('Handles parsing custom elements registered with non-ASCII characters.', () => {
			window.customElements.define('a-Öa', CustomElement);

			const result = new XMLParser(window).parse(
				`
                <div>
                    <a-Öa key1="value1" key2="value2">
                        <span>Test</span>
                    </a-Öa>
                </div>
                `
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div>
                    <a-Öa key1="value1" key2="value2">
                        <span>Test</span>
                    </a-Öa>
                </div>`
			);
		});

		it('Outputs error for multiple <!DOCTYPE>.', () => {
			const result = new XMLParser(window).parse(
				`<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">
                <!DOCTYPE html>
                <html>
                    <head></head>
                    <body><div>Test</div></body>
                </html>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 2 at column 18: StartTag: invalid element name
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);
		});

		it('Outputs error when multiple document elements', () => {
			const result = new XMLParser(window).parse(
				`<root>
                    <title>Title 1</title>
                </root>
                <secondRoot>
                    <title>Title 2</title>
                </secondRoot>`
			);

			expect(new XMLSerializer().serializeToString(result))
				.toBe(`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 4 at column 17: Extra content at the end of the document
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror>
                    <title>Title 1</title>
                </root>`);
		});

		it('Handles "xml" processing instruction.', () => {
			const result = new XMLParser(window).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <div>
                    <div>Test</div>
                </div>`
			);

			// The processing is never added to the DOM when target is "xml"
			// Instead a flag is set on the document and it is added when serializing

			expect(result.childNodes.length).toBe(1);
			expect((<Element>result.childNodes[0]).tagName).toBe('div');

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<?xml version="1.0" encoding="UTF-8"?><div>
                    <div>Test</div>
                </div>`
			);
		});

		it('Handles custom processing instructions.', () => {
			const result = new XMLParser(window).parse(
				`<?custom data="test"?>
                <div>
                    <div>Test</div>
                </div>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<?custom data="test"?><div>
                    <div>Test</div>
                </div>`
			);

			expect(result.childNodes.length).toBe(2);
			expect((<ProcessingInstruction>result.childNodes[0]).target).toBe('custom');
			expect((<ProcessingInstruction>result.childNodes[0]).textContent).toBe('data="test"');
			expect((<Element>result.childNodes[1]).tagName).toBe('div');
		});

		it('Handles namespaced XML', () => {
			const result = new XMLParser(window).parse(
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

			expect(result.children[0].namespaceURI).toBe('http://www.your.example.com/xml/person');
			expect(result.children[0].attributes[0].name).toBe('xmlns:personxml');
			expect(result.children[0].attributes[0].value).toBe('http://www.your.example.com/xml/person');
			expect(result.children[0].attributes[0].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(result.children[0].attributes[1].name).toBe('xmlns:cityxml');
			expect(result.children[0].attributes[1].value).toBe('http://www.my.example.com/xml/cities');
			expect(result.children[0].attributes[1].namespaceURI).toBe(NamespaceURI.xmlns);

			expect(result.children[0].children[0].namespaceURI).toBe(
				'http://www.your.example.com/xml/person'
			);

			expect(result.children[0].children[1].namespaceURI).toBe(
				'http://www.your.example.com/xml/person'
			);

			expect(result.children[0].children[2].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[2].children[0].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[2].children[1].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[2].children[2].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
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

		it('Handles default namespace', () => {
			const result = new XMLParser(window).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <root xmlns="http://www.example.com">
                    <personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                        <personxml:name>Rob</personxml:name>
                        <personxml:age>37</personxml:age>
                        <cityxml:homecity>
                            <cityxml:name>London</cityxml:name>
                            <cityxml:lat>123.000</cityxml:lat>
                            <cityxml:long>0.00</cityxml:long>
                        </cityxml:homecity>
                        <homecity></homecity>
                        <cityxml/>
                        <test xmlns="http://www.other.com">
                            <child/>
                        </test>
                    </personxml:person>
                </root>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<?xml version="1.0" encoding="UTF-8"?><root xmlns="http://www.example.com">
                    <personxml:person xmlns:personxml="http://www.your.example.com/xml/person" xmlns:cityxml="http://www.my.example.com/xml/cities">
                        <personxml:name>Rob</personxml:name>
                        <personxml:age>37</personxml:age>
                        <cityxml:homecity>
                            <cityxml:name>London</cityxml:name>
                            <cityxml:lat>123.000</cityxml:lat>
                            <cityxml:long>0.00</cityxml:long>
                        </cityxml:homecity>
                        <homecity/>
                        <cityxml/>
                        <test xmlns="http://www.other.com">
                            <child/>
                        </test>
                    </personxml:person>
                </root>`
			);

			expect(result.children[0].constructor.name).toBe('Element');

			expect(result.children[0].namespaceURI).toBe('http://www.example.com');
			expect(result.children[0].attributes[0].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(result.children[0].attributes[0].name).toBe('xmlns');
			expect(result.children[0].attributes[0].value).toBe('http://www.example.com');

			expect(result.children[0].children[0].namespaceURI).toBe(
				'http://www.your.example.com/xml/person'
			);
			expect(result.children[0].children[0].attributes[0].name).toBe('xmlns:personxml');
			expect(result.children[0].children[0].attributes[0].value).toBe(
				'http://www.your.example.com/xml/person'
			);
			expect(result.children[0].children[0].attributes[0].namespaceURI).toBe(NamespaceURI.xmlns);
			expect(result.children[0].children[0].attributes[1].name).toBe('xmlns:cityxml');
			expect(result.children[0].children[0].attributes[1].value).toBe(
				'http://www.my.example.com/xml/cities'
			);
			expect(result.children[0].children[0].attributes[1].namespaceURI).toBe(NamespaceURI.xmlns);

			expect(result.children[0].children[0].children[0].namespaceURI).toBe(
				'http://www.your.example.com/xml/person'
			);

			expect(result.children[0].children[0].children[1].namespaceURI).toBe(
				'http://www.your.example.com/xml/person'
			);

			expect(result.children[0].children[0].children[2].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[0].children[2].children[0].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[0].children[2].children[1].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[0].children[2].children[2].namespaceURI).toBe(
				'http://www.my.example.com/xml/cities'
			);

			expect(result.children[0].children[0].children[3].namespaceURI).toBe(
				'http://www.example.com'
			);

			expect(result.children[0].children[0].children[4].namespaceURI).toBe(
				'http://www.example.com'
			);

			expect(result.children[0].children[0].children[5].namespaceURI).toBe('http://www.other.com');

			expect(result.children[0].children[0].children[5].children[0].namespaceURI).toBe(
				'http://www.other.com'
			);
		});

		it('Outputs error for "xml" processing instructions not at the start of the document', () => {
			const result = new XMLParser(window).parse(
				`<div>
                    <?xml version="1.0" encoding="UTF-8"?>
                    <div>Test</div>
                </div>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<div><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 2 at column 26: XML declaration allowed only at the start of the document
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></div>`
			);
		});

		it('Outputs error for "xml" processing instruction without version attribute', () => {
			const result = new XMLParser(window).parse(
				`<?xml encoding="UTF-8"?>
                <div>
                    <div>Test</div>
                </div>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<html xmlns="http://www.w3.org/1999/xhtml"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 7: Malformed declaration expecting version
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>`
			);
		});

		it('Encodes HTML entities encoded.', () => {
			const result = new XMLParser(window).parse(
				`<root>
                    <div>&gt;</div>
                    <div id="testnode">&gt;howdy</div>
                    <div>&gt;&lt;&amp;&quot;&apos;</div>
                    <div>&#x3C;div&#x3E;Hello, world!&#x3C;/div&#x3E;</div>
                </root>`
			);

			const div1 = result.documentElement.children[0];
			expect(div1.textContent).toBe('>');

			const div2 = result.documentElement.children[1];
			expect(div2.textContent).toBe('>howdy');

			const div3 = result.documentElement.children[2];
			expect(div3.textContent).toBe('><&"\'');

			const div4 = result.documentElement.children[3];
			expect(div4.textContent).toBe('<div>Hello, world!</div>');

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<root>
                    <div>&gt;</div>
                    <div id="testnode">&gt;howdy</div>
                    <div>&gt;&lt;&amp;"'</div>
                    <div>&lt;div&gt;Hello, world!&lt;/div&gt;</div>
                </root>`
			);
		});

		it('Outputs error for the "&nbsp;" entity.', () => {
			const result = new XMLParser(window).parse(`<div>
                Hello&nbsp;World!
            </div>`);

			expect(new XMLSerializer().serializeToString(result))
				.toBe(`<div><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 2 at column 28: Entity 'nbsp' not defined
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></div>`);
		});

		it('Handles XML in #282', () => {
			const result = new XMLParser(window).parse(
				`<?xml version="1.0" encoding="UTF-8"?>
                <!DOCTYPE start SYSTEM "http://xml.start.com/pub/start.dtd">
                <start>
                <div style="--en-clipped-content:fullPage; --en-clipped-source-url:https://l3pro.netlify.app/; --en-clipped-source-title:https://l3pro.netlify.app/;">
                <div><br></br></div><div style="; font-size: 16px; display:inline-block; min-width: 100%; position: relative;"> <span><div>
                <div>
                    <h1 title="H1 " style="text-align:center;color:#006600;text-decoration:underline;"> This is a test </h1>
                    <h2></h2>

                    <p title="P " style="color:#660000;font-family:sans-serif;">This has some dynamic generated content</p>
                    <p title="P " style="color:#660000;font-family:sans-serif;">This should be enought to test</p>
                    <hr></hr>

                    <p title="P " style="color:#660000;font-family:sans-serif;">Absolute paths</p>
                    <img src="https://l3pro.netlify.app/celes.jpeg" width="50" height="100"></img>
                    <img src="https://l3pro.netlify.app/img/guitar.jpeg" width="50" height="100"></img>
                        <img src="https://l3pro.netlify.app/img/mk2.jpg" width="50" height="100"></img>
                            <img src="https://l3pro.netlify.app/img/yo.png" width="50" height="100"></img>

                <p title="P " style="color:#660000;font-family:sans-serif;">Relative paths</p>
                    <img src="celes.jpeg" width="50" height="100"></img>
                    <img src="img/guitar.jpeg" width="50" height="100"></img>
                    <img src="img/mk2.jpg" width="50" height="100"></img>
                                <img src="img/yo.png" width="50" height="100"></img>


                    
                

                </div></div></span></div>
                </div>
                </start>`
			);

			expect(new XMLSerializer().serializeToString(result)).toBe(
				`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE start SYSTEM "http://xml.start.com/pub/start.dtd"><start>
                <div style="--en-clipped-content:fullPage; --en-clipped-source-url:https://l3pro.netlify.app/; --en-clipped-source-title:https://l3pro.netlify.app/;">
                <div><br/></div><div style="; font-size: 16px; display:inline-block; min-width: 100%; position: relative;"> <span><div>
                <div>
                    <h1 title="H1 " style="text-align:center;color:#006600;text-decoration:underline;"> This is a test </h1>
                    <h2/>

                    <p title="P " style="color:#660000;font-family:sans-serif;">This has some dynamic generated content</p>
                    <p title="P " style="color:#660000;font-family:sans-serif;">This should be enought to test</p>
                    <hr/>

                    <p title="P " style="color:#660000;font-family:sans-serif;">Absolute paths</p>
                    <img src="https://l3pro.netlify.app/celes.jpeg" width="50" height="100"/>
                    <img src="https://l3pro.netlify.app/img/guitar.jpeg" width="50" height="100"/>
                        <img src="https://l3pro.netlify.app/img/mk2.jpg" width="50" height="100"/>
                            <img src="https://l3pro.netlify.app/img/yo.png" width="50" height="100"/>

                <p title="P " style="color:#660000;font-family:sans-serif;">Relative paths</p>
                    <img src="celes.jpeg" width="50" height="100"/>
                    <img src="img/guitar.jpeg" width="50" height="100"/>
                    <img src="img/mk2.jpg" width="50" height="100"/>
                                <img src="img/yo.png" width="50" height="100"/>


                    
                

                </div></div></span></div>
                </div>
                </start>`
			);
		});

		it('Supports comments with XML content.', () => {
			const result = new XMLParser(window).parse(`<root>
                <!-- <div>Test</div> -->
            </root>`);

			expect(result.childNodes[0].nodeType).toBe(NodeTypeEnum.elementNode);
			expect(result.childNodes[0].childNodes[1].nodeType).toBe(NodeTypeEnum.commentNode);
			expect(result.childNodes[0].childNodes[1].textContent).toBe(' <div>Test</div> ');

			expect(new XMLSerializer().serializeToString(result)).toBe(`<root>
                <!-- <div>Test</div> -->
            </root>`);
		});

		it('Outputs error for unclosed comment', () => {
			const result = new XMLParser(window).parse(`<root>
                <!-- <div>Test</div>
            </root>`);

			expect(new XMLSerializer().serializeToString(result))
				.toBe(`<root><parsererror xmlns="http://www.w3.org/1999/xhtml" style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 3 at column 20: Comment not terminated
</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></root>`);
		});
	});
});
