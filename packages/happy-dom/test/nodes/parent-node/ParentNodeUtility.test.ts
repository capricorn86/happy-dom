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
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span><span class="child4"></span>'
			);
		});

		it('Appends a mixed list of Node and DOMString after the last child of the ParentNode', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.append(parent, ...[newTextChildContent, ...newChildrenParent.children]);
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
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child4"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
		});

		it('Prepends a mixed list of Node and DOMString before the first child of the ParentNode', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.prepend(parent, ...[newTextChildContent, ...newChildrenParent.children]);
			expect(parent.innerHTML).toBe(
				'&lt;span class="child4"&gt;&lt;/span&gt;<span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child1"></span><span class="child2"></span><span class="child3"></span>'
			);
		});
	});

	describe('replaceChildren()', () => {
		it('Replaces the existing children of a ParentNode with a mixed list of Node and DOMString.', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			ParentNodeUtility.replaceChildren(
				parent,
				...[newTextChildContent, ...newChildrenParent.children]
			);
			expect(parent.innerHTML).toBe(
				'&lt;span class="child4"&gt;&lt;/span&gt;<span class="child5"></span><span class="child6"></span><span class="child7"></span>'
			);
			expect(
				Array.from(parent.children)
					.map((element) => element.outerHTML)
					.join('')
			).toBe(
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>'
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

		it('Supports space-separated class names.', () => {
			const addedClassName = 'className otherClassName verySeparatedClassName';
			const queriedClassName = 'className otherClassName       verySeparatedClassName';

			const parent = document.createElement('div');
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			const element3 = document.createElement('div');

			element1.className = addedClassName;
			element2.className = addedClassName;
			element3.className = addedClassName;

			parent.appendChild(element1);
			element1.appendChild(element2);
			element1.appendChild(element3);

			const elementByClassName = ParentNodeUtility.getElementsByClassName(parent, queriedClassName);

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

		it('Handles SVG elements.', () => {
			const parent = document.createElement('div');
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const rect = document.createElementNS(NamespaceURI.svg, 'rect');
			const clipPath = document.createElementNS(NamespaceURI.svg, 'clippath');

			parent.appendChild(svg);
			svg.appendChild(rect);
			svg.appendChild(clipPath);

			const svgElements = ParentNodeUtility.getElementsByTagName(parent, 'svg');
			const rectElements = ParentNodeUtility.getElementsByTagName(parent, 'rect');
			const clipPathElements = ParentNodeUtility.getElementsByTagName(parent, 'ClIpPaTh');

			expect(svgElements.length).toBe(1);
			expect(svgElements[0]).toBe(svg);

			expect(rectElements.length).toBe(1);
			expect(rectElements[0]).toBe(rect);

			expect(clipPathElements.length).toBe(1);
			expect(clipPathElements[0]).toBe(clipPath);
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

		it('Matches SVG elements local name and namespace.', () => {
			const parent = document.createElement('div');
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const clipPath = document.createElementNS(NamespaceURI.svg, 'clippath');

			parent.appendChild(svg);
			svg.appendChild(clipPath);

			const clipPathElements = ParentNodeUtility.getElementsByTagNameNS(
				parent,
				NamespaceURI.svg,
				'clippath'
			);

			expect(clipPathElements.length).toBe(1);
			expect(clipPathElements[0]).toBe(clipPath);

			expect(
				ParentNodeUtility.getElementsByTagNameNS(parent, NamespaceURI.svg, 'clipPath').length
			).toBe(0);
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

		it('Converts number IDs to string.', () => {
			const parent = document.createElement('div');
			const div = document.createElement('div');

			parent.appendChild(div);
			div.id = <string>(<unknown>12345);

			expect(ParentNodeUtility.getElementById(parent, <string>(<unknown>12345))).toEqual(div);
		});
	});
});
