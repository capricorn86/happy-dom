import DOMImplementation from '../../src/dom-implementation/DOMImplementation';
import Window from '../../src/window/Window';

describe('DOMImplementation', () => {
	let domImplementation: DOMImplementation;
	let window: Window;

	beforeEach(() => {
		window = new Window();
		domImplementation = new DOMImplementation(window);
	});

	describe('createHTMLDocument()', () => {
		test('Returns a new Document.', () => {
			const document = domImplementation.createHTMLDocument();
			expect(document.constructor.name).toBe('Document');
			expect(document.defaultView).toBe(window);
		});
	});
});
