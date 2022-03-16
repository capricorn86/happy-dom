import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility';
import QuerySelector from '../../../src/query-selector/QuerySelector';
import NamespaceURI from '../../../src/config/NamespaceURI';
import IHTMLCollection from '../../../src/nodes/element/IHTMLCollection';
import IElement from '../../../src/nodes/element/IElement';

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
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
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
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
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
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
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
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
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
			expect(parent.children.map(element => element.outerHTML).join('')).toBe(
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
		});
	});

	describe('getElementsByClassName()', () => {
		it('Returns elements by class name.', () => {
			const parent = document.createElement('div');
			const element = document.createElement('div');
			const className = 'className';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(parent);
				expect(selector).toEqual(`.${className}`);
				return <IHTMLCollection<IElement>>[element];
			});

			expect(ParentNodeUtility.getElementsByClassName(parent, className)).toEqual([element]);
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

			expect(ParentNodeUtility.getElementsByTagName(parent, 'div')).toEqual([
				div1,
				div2,
				div3,
				div4
			]);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		it('Returns elements by tag name.', () => {
			const parent = document.createElement('div');
			const div1 = document.createElementNS(NamespaceURI.svg, 'div');
			const div2 = document.createElement('div');
			const div3 = document.createElementNS(NamespaceURI.svg, 'div');
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

			expect(ParentNodeUtility.getElementsByTagNameNS(parent, NamespaceURI.svg, 'div')).toEqual([
				div1,
				div3
			]);
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

			expect(ParentNodeUtility.getElementByTagName(parent, 'div')).toEqual(div1);
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
