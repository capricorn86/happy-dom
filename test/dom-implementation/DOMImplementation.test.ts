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

	describe('requestAnimationFrame()', () => {
		test('Requesting an animation frame', () => {
			const frame = window.requestAnimationFrame(() => 'Frame');
			expect(Number.isInteger(frame)).toBeTruthy();
			expect(frame).toBeGreaterThanOrEqual(1);
		});
	});

	describe('cancelAnimationFrame()', () => {
		test('Cancel an animation frame', () => {
			const res = window.cancelAnimationFrame(2);
			expect(res).toBeUndefined();
		});
	});
});
