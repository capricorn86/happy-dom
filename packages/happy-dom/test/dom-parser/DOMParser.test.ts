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
			expect(new XMLSerializer().serializeToString(newDocument).replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
						<div>Should be added to body</div>
					</body>
				</html>
				`.replace(/[\s]/gm, '')
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
			expect(new XMLSerializer().serializeToString(newDocument).replace(/\s/g, '')).toBe(
				`<html>
					<body>
						<script>
							var test = {className:"meta",begin:/<![a-z]/,end:/>/,contains:[t,i,l,c]};
						</script>
					</body>
				</html>`.replace(/\s/g, '')
			);
		});

		it('Decodes HTML entities.', () => {
			const newDocument = domParser.parseFromString(
				'<p>here is some</p> html el&#225;stica ',
				'text/html'
			);
			// Spurious comment `<!--[a-z]/,end:/-->` should be solved
			expect(newDocument.body.textContent).toBe('here is some html elástica ');
		});

		it('parses SVGs', () => {
			const newDocument = domParser.parseFromString(DOMParserSVG, 'image/svg+xml');
			expect(new XMLSerializer().serializeToString(newDocument).replace(/[\s]/gm, '')).toBe(
				DOMParserSVG.replace(/[\s]/gm, '')
			);
		});

		it('recognises BODY', () => {
			const newDocument = domParser.parseFromString('<body><example></example>Example Text</body>', 'text/html');
			expect(newDocument.body.innerHTML).toBe('<example></example>Example Text');
		});
	});
});
