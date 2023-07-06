import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('ParentNodeUtility', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('append()', () => {
		it('Appends a node after the last child of the ParentNode.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.append(parent, newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
			expect(parent.children.map((element) => element.outerHTML).join('')).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
		});

		it('Appends a mixed list of Node and DOMString after the last child of the ParentNode', () => {
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
			expect(parent.children.map((element) => element.outerHTML).join('')).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
		});
	});

	describe('prepend()', () => {
		it('Prepends a node after the before the first child of the ParentNode.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.prepend(parent, newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child4"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
			expect(parent.children.map((element) => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
		});

		it('Prepends a mixed list of Node and DOMString before the first child of the ParentNode', () => {
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
			expect(parent.children.map((element) => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
		});
	});

	describe('replaceChildren()', () => {
		it('Replaces the existing children of a ParentNode with a mixed list of Node and DOMString.', () => {
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
			expect(parent.children.map((element) => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
		});
	});

	describe('getElementsByClassName()', () => {
		it('Returns elements by class name.', () => {
			const className = 'className';
			const parent = document.createElement('div');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			const element3 = document.createElement('div');

			element1.className = className;
			element2.className = className;
			element3.className = className;

			parent.appendChild(element1);
			element1.appendChild(element2);
			element1.appendChild(element3);

			const elementByClassName = ParentNodeUtility.getElementsByClassName(parent, className);

			expect(elementByClassName instanceof HTMLCollection).toBe(true);
			expect(elementByClassName.length).toBe(3);
			expect(elementByClassName[0]).toBe(element1);
			expect(elementByClassName[1]).toBe(element2);
			expect(elementByClassName[2]).toBe(element3);
		});
	});

	describe('getElementsByTagName()', () => {
		it('Returns elements by tag name.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			const div4 = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');

			parent.appendChild(div1);
			div1.appendChild(div2);
			div2.appendChild(span1);
			span1.appendChild(div3);
			div3.appendChild(span2);
			div3.appendChild(span3);
			span3.appendChild(div4);

			const elementsByTagName = ParentNodeUtility.getElementsByTagName(parent, 'div');

			expect(elementsByTagName instanceof HTMLCollection).toBe(true);
			expect(elementsByTagName.length).toBe(4);
			expect(elementsByTagName[0]).toBe(div1);
			expect(elementsByTagName[1]).toBe(div2);
			expect(elementsByTagName[2]).toBe(div3);
			expect(elementsByTagName[3]).toBe(div4);
		});

		it('Returns all elements when tag name is *.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			const div4 = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');

			parent.appendChild(div1);
			div1.appendChild(div2);
			div2.appendChild(span1);
			span1.appendChild(div3);
			div3.appendChild(span2);
			div3.appendChild(span3);
			span3.appendChild(div4);

			expect(ParentNodeUtility.getElementsByTagName(parent, '*').length).toEqual(7);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		it('Returns elements by tag name.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElementNS(NamespaceURI.svg, 'div');
			const div2 = document.createElement('div');
			const div3 = document.createElementNS(NamespaceURI.svg, 'div');
			const div4 = document.createElement('div');
			const span1 = document.createElementNS(NamespaceURI.svg, 'span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');

			parent.appendChild(div1);
			div1.appendChild(div2);
			div2.appendChild(span1);
			span1.appendChild(div3);
			div3.appendChild(span2);
			div3.appendChild(span3);
			span3.appendChild(div4);

			const elementsByTagName = ParentNodeUtility.getElementsByTagNameNS(
				parent,
				NamespaceURI.svg,
				'div'
			);

			expect(elementsByTagName instanceof HTMLCollection).toBe(true);
			expect(elementsByTagName.length).toBe(2);
			expect(elementsByTagName[0]).toBe(div1);
			expect(elementsByTagName[1]).toBe(div3);
		});

		it('Returns all elements when tag name is *.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElementNS(NamespaceURI.svg, 'div');
			const div2 = document.createElement('div');
			const div3 = document.createElementNS(NamespaceURI.svg, 'div');
			const div4 = document.createElement('div');
			const span1 = document.createElementNS(NamespaceURI.svg, 'span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');

			parent.appendChild(div1);
			div1.appendChild(div2);
			div2.appendChild(span1);
			span1.appendChild(div3);
			div3.appendChild(span2);
			div3.appendChild(span3);
			span3.appendChild(div4);

			expect(
				ParentNodeUtility.getElementsByTagNameNS(parent, NamespaceURI.svg, '*').length
			).toEqual(3);
		});
	});

	describe('getElementByTagName()', () => {
		it('Returns the first element matching a tag name.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			const div4 = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');

			parent.appendChild(div1);
			div1.appendChild(div2);
			div2.appendChild(span1);
			span1.appendChild(div3);
			div3.appendChild(span2);
			div3.appendChild(span3);
			span3.appendChild(div4);

			expect(ParentNodeUtility.getElementByTagName(parent, 'div') === div1).toBe(true);
		});
	});

	describe('getElementById()', () => {
		it('Returns the first element matching an id.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const div3 = document.createElement('div');
			const div4 = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');

			parent.appendChild(div1);
			div1.appendChild(div2);
			div2.appendChild(span1);
			span1.appendChild(div3);
			div3.appendChild(span2);
			div3.appendChild(span3);
			span3.appendChild(div4);

			div1.id = 'div1';
			div2.id = 'div2';
			div3.id = 'div3';
			div4.id = 'div4';

			expect(ParentNodeUtility.getElementById(parent, 'div3')).toEqual(div3);
		});
	});
});
