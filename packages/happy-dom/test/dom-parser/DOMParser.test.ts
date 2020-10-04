import Window from '../../src/window/Window';
import DOMParserHTML from './data/DOMParserHTML';

describe('DOMParser', () => {
	let domParser, window;

	beforeEach(() => {
		window = new Window();
		domParser = new window.DOMParser();
	});

	describe('parseFromString()', () => {
		test('Parses HTML and returns a new document.', () => {
			const newDocument = domParser.parseFromString(DOMParserHTML, 'text/html');
			expect(newDocument.documentElement.outerHTML).toBe(DOMParserHTML);
		});
	});

	describe('parseFromString()', () => {
		test('Parses HTML and returns a new document.', () => {
			const newDocument = domParser.parseFromString('Test', 'text/html');
			expect(newDocument.documentElement.outerHTML).toBe(
				'<html><head></head><body>Test</body></html>'
			);
		});
	});
});
