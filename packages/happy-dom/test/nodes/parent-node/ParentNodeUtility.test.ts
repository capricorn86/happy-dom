import Window from '../../../src/window/Window';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility';

describe('ParentNodeUtility', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('append()', () => {
		test('Appends a node after the last child of the ParentNode.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.append(parent, newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
		});

		test('Appends a mixed list of Node and DOMString after the last child of the ParentNode', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newChildrenHtml =
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span>';
			newChildrenParent.innerHTML =
				'<span class="child7"></span><span class="child8"></span><span class="child9"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.append(parent, ...[newChildrenHtml, ...newChildrenParent.children]);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
		});
	});

	describe('prepend()', () => {
		test('Prepends a node after the before the first child of the ParentNode.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.prepend(parent, newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child4"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
		});

		test('Prepends a mixed list of Node and DOMString before the first child of the ParentNode', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newChildrenHtml =
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span>';
			newChildrenParent.innerHTML =
				'<span class="child7"></span><span class="child8"></span><span class="child9"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.prepend(parent, ...[newChildrenHtml, ...newChildrenParent.children]);
			expect(parent.innerHTML).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
		});
	});

	describe('replaceChildren()', () => {
		test('Replaces the existing children of a ParentNode with a mixed list of Node and DOMString.', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newChildrenHtml =
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span>';
			newChildrenParent.innerHTML =
				'<span class="child7"></span><span class="child8"></span><span class="child9"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.replaceChildren(
				parent,
				...[newChildrenHtml, ...newChildrenParent.children]
			);
			expect(parent.innerHTML).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
		});
	});
});
