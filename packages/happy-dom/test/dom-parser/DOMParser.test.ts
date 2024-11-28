import Window from '../../src/window/Window.js';
import XMLSerializer from '../../src/xml-serializer/XMLSerializer.js';
import DOMParser from '../../src/dom-parser/DOMParser.js';
import DOMParserHTML from './data/DOMParserHTML.js';
import { beforeEach, describe, it, expect } from 'vitest';
import DOMParserSVG from './data/DOMParserSVG';

describe('DOMParser', () => {
	let domParser: DOMParser;
	let window: Window;

	beforeEach(() => {
		window = new Window({
			settings: {
				disableJavaScriptFileLoading: true,
				disableJavaScriptEvaluation: true,
				disableCSSFileLoading: true,
				enableFileSystemHttpRequests: false
			}
		});
		domParser = new window.DOMParser();
	});

	describe('parseFromString()', () => {
		it('Parses HTML of a page and returns a new document.', () => {
			const newDocument = domParser.parseFromString(DOMParserHTML, 'text/html');
			expect(new XMLSerializer().serializeToString(newDocument).replace(/[\s]/gm, '')).toBe(
				DOMParserHTML.replace(/[\s]/gm, '')
			);
		});

		it('Parses HTML with just a string and returns a new document with <html>, <head> and <body> tags.', () => {
			const newDocument = domParser.parseFromString('Test', 'text/html');
			expect(new XMLSerializer().serializeToString(newDocument)).toBe(
				'<!DOCTYPE html><html><head></head><body>Test</body></html>'
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
			expect(new XMLSerializer().serializeToString(newDocument)).toBe(
				`<!DOCTYPE html><html><head>
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
			expect(new XMLSerializer().serializeToString(newDocument)).toBe(
				`<!DOCTYPE html><html><head></head><body>
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

		it('Parses XML', () => {
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
			expect(new XMLSerializer().serializeToString(newDocument)).toBe(`<breakfast_menu>
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
	});
});
