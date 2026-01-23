import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import ChildNodeUtility from '../../../src/nodes/child-node/ChildNodeUtility.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('ChildNodeUtility', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('remove()', () => {
		it('Removes a node.', () => {
			const parent = document.createElement('div');
			const node = document.createComment('test');
			parent.appendChild(node);
			ChildNodeUtility.remove(node);
			expect(node.parentNode).toBe(null);
			expect(parent.childNodes.length).toBe(0);
		});
	});

	describe('replaceWith()', () => {
		it('Replaces a node with another node.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.replaceWith(parent.children[2], newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span>'
			);
		});

		it('Replaces a node with a mixed list of Node and DOMString (string).', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.replaceWith(
				parent.children[2],
				...[newTextChildContent, ...newChildrenParent.children]
			);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span>&lt;span class="child4"&gt;&lt;/span&gt;<span class="child5"></span><span class="child6"></span><span class="child7"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span>'
			);
		});
	});

	describe('before()', () => {
		it('Inserts a node before the child node.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.before(parent.children[2], newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span><span class="child3"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span><span class="child3"></span>'
			);
		});

		it('Inserts a mixed list of Node and DOMString (string) before the child node.', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.before(
				parent.children[2],
				...[newTextChildContent, ...newChildrenParent.children]
			);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span>&lt;span class="child4"&gt;&lt;/span&gt;<span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child3"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child3"></span>'
			);
		});
	});

	describe('after()', () => {
		it('Inserts a node after the child node by appending the new node.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.after(parent.children[2], newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
		});

		it('Inserts a node after the child node by inserting the new node.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.after(parent.children[1], newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span><span class="child3"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span><span class="child3"></span>'
			);
		});

		it('Inserts a mixed list of Node and DOMString (string) after the child node by appending the new nodes.', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ChildNodeUtility.after(
				parent.children[2],
				...[newTextChildContent, ...newChildrenParent.children]
			);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>&lt;span class="child4"&gt;&lt;/span&gt;<span class="child5"></span><span class="child6"></span><span class="child7"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span>'
			);
		});
	});
});
