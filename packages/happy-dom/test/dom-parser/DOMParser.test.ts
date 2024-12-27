import Window from '../../src/window/Window.js';
import HTMLSerializer from '../../src/html-serializer/HTMLSerializer.js';
import DOMParser from '../../src/dom-parser/DOMParser.js';
import DOMParserHTML from './data/DOMParserHTML.js';
import { beforeEach, describe, it, expect } from 'vitest';
import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import HTMLElement from '../../src/nodes/html-element/HTMLElement.js';
import Document from '../../src/nodes/document/Document.js';

describe('DOMParser', () => {
	let domParser: DOMParser;
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window({
			settings: {
				disableJavaScriptFileLoading: true,
				disableJavaScriptEvaluation: true,
				disableCSSFileLoading: true,
				enableFileSystemHttpRequests: false
			}
		});
		document = window.document;
		domParser = new window.DOMParser();
	});

	describe('parseFromString()', () => {
		it('Parses HTML of a page and returns a new document.', () => {
			const newDocument = domParser.parseFromString(DOMParserHTML, 'text/html');
			expect(new HTMLSerializer().serializeToString(newDocument).replace(/[\s]/gm, '')).toBe(
				DOMParserHTML.replace(/[\s]/gm, '')
			);
		});

		it('Parses HTML with just a string and returns a new document with <html>, <head> and <body> tags.', () => {
			const newDocument = domParser.parseFromString('Test', 'text/html');
			expect(new HTMLSerializer().serializeToString(newDocument)).toBe(
				'<html><head></head><body>Test</body></html>'
			);
		});

		it('Adds elements outside of the <html> tag to the <body> tag.', () => {
			const newDocument = domParser.parseFromString(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
				<div>Should be added to body</div>
			`,
				'text/html'
			);
			expect(new HTMLSerializer().serializeToString(newDocument)).toBe(
				`<html><head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					
				
				<div>Should be added to body</div>
			</body></html>`
			);
		});

		it('Correctly parses JS script with `<!` in it.', () => {
			const newDocument = domParser.parseFromString(
				`<html>
					<body>
						<script>
							var test = {className:"meta",begin:/<![a-z]/,end:/>/,contains:[t,i,l,c]};
						</script>
					</body>
				</html>`,
				'text/html'
			);
			// Spurious comment `<!--[a-z]/,end:/-->` should be solved
			expect(new HTMLSerializer().serializeToString(newDocument)).toBe(
				`<html><head></head><body>
						<script>
							var test = {className:"meta",begin:/<![a-z]/,end:/>/,contains:[t,i,l,c]};
						</script>
					
				</body></html>`
			);
		});

		it('Decodes HTML entities.', () => {
			const newDocument = domParser.parseFromString(
				'<p>here is some</p> html el&#225;stica ',
				'text/html'
			);
			expect(newDocument.body.textContent).toBe('here is some html elástica ');
		});

		it('Parses SVGs', () => {
			const newDocument = domParser.parseFromString(
				`
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 6.53333V7.46667H7.46667V14H6.53333V7.46667H0V6.53333H6.53333V0H7.46667V6.53333H14Z" fill="#0078D4"></path>
                    </svg>
                `,
				'image/svg+xml'
			);
			expect(new XMLSerializer().serializeToString(newDocument))
				.toBe(`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M14 6.53333V7.46667H7.46667V14H6.53333V7.46667H0V6.53333H6.53333V0H7.46667V6.53333H14Z" fill="#0078D4"/>
                    </svg>`);
			expect(newDocument.documentElement).toBe(newDocument.childNodes[0]);
		});

		it('Parses body', () => {
			const newDocument = domParser.parseFromString(
				'<body><example></example>Example Text</body>',
				'text/html'
			);
			expect(newDocument.body.innerHTML).toBe('<example></example>Example Text');
		});

		it('Parses basic XML', () => {
			const newDocument = domParser.parseFromString(
				`<?xml version="1.0" encoding="UTF-8"?>
                <breakfast_menu>
                    <food>
                        <name>Belgian Waffles</name>
                        <price>$5.95</price>
                        <description>Two of our famous Belgian Waffles with plenty of real maple syrup</description>
                        <calories>650</calories>
                    </food>
                    <food>
                        <name>Strawberry Belgian Waffles</name>
                        <price>$7.95</price>
                        <description>Light Belgian waffles covered with strawberries and whipped cream</description>
                        <calories>900</calories>
                    </food>
                </breakfast_menu>
                `,
				'application/xml'
			);
			expect(new HTMLSerializer().serializeToString(newDocument)).toBe(`<breakfast_menu>
                    <food>
                        <name>Belgian Waffles</name>
                        <price>$5.95</price>
                        <description>Two of our famous Belgian Waffles with plenty of real maple syrup</description>
                        <calories>650</calories>
                    </food>
                    <food>
                        <name>Strawberry Belgian Waffles</name>
                        <price>$7.95</price>
                        <description>Light Belgian waffles covered with strawberries and whipped cream</description>
                        <calories>900</calories>
                    </food>
                </breakfast_menu>`);
		});

		it('Parses XML with style tags', () => {
			const newDocument = domParser.parseFromString(
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
                </start>`,
				'application/xml'
			);

			expect(newDocument.defaultView).toBe(window);

			expect(new XMLSerializer().serializeToString(newDocument))
				.toBe(`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE start SYSTEM "http://xml.start.com/pub/start.dtd"><start>
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
                </start>`);
		});

		it('Does not call connectedCallback on custom elements as they are not connected to the main document', () => {
			/* eslint-disable jsdoc/require-jsdoc */
			class CustomElement extends HTMLElement {
				public connectedCount = 0;
				public disconnectedCount = 0;
				public changedAttributes = 0;

				constructor() {
					super();
					this.attachShadow({ mode: 'open' });
				}

				public connectedCallback(): void {
					this.connectedCount++;
				}

				public disconnectedCallback(): void {
					this.disconnectedCount++;
				}

				public attributeChangedCallback(): void {
					this.changedAttributes++;
				}
			}

			window.customElements.define('custom-element', CustomElement);

			/* eslint-enable jsdoc/require-jsdoc */

			const newDocument = domParser.parseFromString(
				'<custom-element></custom-element>',
				'text/html'
			);

			expect(newDocument.isConnected).toBe(true);
			expect(newDocument.defaultView).toBe(window);

			const customElement = <CustomElement>newDocument.querySelector('custom-element');

			expect(customElement.connectedCount).toBe(0);
			expect(customElement.disconnectedCount).toBe(0);
			expect(customElement.changedAttributes).toBe(0);

			document.body.appendChild(customElement);

			expect(customElement.connectedCount).toBe(1);
			expect(customElement.disconnectedCount).toBe(0);
		});
	});
});
