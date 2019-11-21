import DOMImplementation from '../../lib/dom-implementation/DOMImplementation';
import Window from '../../lib/Window';

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
