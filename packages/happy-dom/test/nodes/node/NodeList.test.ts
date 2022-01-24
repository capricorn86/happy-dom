import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';

describe('NodeList', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('item()', () => {
		it('Returns node at index.', () => {
			const text = document.createTextNode('test');
			const comment = document.createComment('test');
			document.body.appendChild(text);
			document.body.appendChild(comment);
			expect(document.body.childNodes.item(0) === text).toBe(true);
			expect(document.body.childNodes.item(1) === comment).toBe(true);
		});
	});
});
