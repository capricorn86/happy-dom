import Window from '../../../src/window/Window';
import NonDocumentChildNodeUtility from '../../../src/nodes/child-node/NonDocumentChildNodeUtility';

describe('NonDocumentChildNodeUtility', () => {
	let window;
	let document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('previousElementSibling()', () => {
		it('Returns the previous element sibling.', () => {
			const parent = document.createElement('div');
			const comment = document.createComment('test');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');

			parent.appendChild(element1);
			parent.appendChild(comment);
			parent.appendChild(element2);

			expect(NonDocumentChildNodeUtility.previousElementSibling(comment)).toBe(element1);
		});
	});

	describe('nextElementSibling()', () => {
		it('Returns the next element sibling.', () => {
			const parent = document.createElement('div');
			const comment = document.createComment('test');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');

			parent.appendChild(element1);
			parent.appendChild(comment);
			parent.appendChild(element2);

			expect(NonDocumentChildNodeUtility.nextElementSibling(comment)).toBe(element2);
		});
	});
});
