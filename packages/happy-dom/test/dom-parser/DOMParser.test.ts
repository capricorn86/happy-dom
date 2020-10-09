import Window from '../../src/window/Window';
import DOMParserHTML from './data/DOMParserHTML';

describe('DOMParser', () => {
	let domParser, window;

	beforeEach(() => {
		window = new Window();
		domParser = new window.DOMParser();
	});

	describe('parseFromString()', () => {
		test('Parses HTML of a page and returns a new document.', () => {
			const newDocument = domParser.parseFromString(DOMParserHTML, 'text/html');
			expect(newDocument.documentElement.outerHTML).toBe(DOMParserHTML);
		});

		test('Parses HTML with just a string and returns a new document with <html>, <head> and <body> tags.', () => {
			const newDocument = domParser.parseFromString('Test', 'text/html');
			expect(newDocument.documentElement.outerHTML).toBe(
				'<html><head></head><body>Test</body></html>'
			);
		});

		test('Adds elements outside of the <html> tag to the <body> tag.', () => {
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
			expect(newDocument.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
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
	});
});
