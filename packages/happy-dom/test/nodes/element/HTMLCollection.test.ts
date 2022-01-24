import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';

describe('HTMLCollection', () => {
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
			const div = document.createElement('div');
			const span = document.createElement('span');
			document.body.appendChild(div);
			document.body.appendChild(span);
			expect(document.body.childNodes.item(0) === div).toBe(true);
			expect(document.body.childNodes.item(1) === span).toBe(true);
		});
	});
});
