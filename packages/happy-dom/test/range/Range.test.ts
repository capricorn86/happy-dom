import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import Range from '../../src/range/Range.js';
import NodeTypeEnum from '../../src/nodes/node/NodeTypeEnum.js';
import Text from '../../src/nodes/text/Text.js';
import DOMRect from '../../src/dom/DOMRect.js';
import { beforeEach, describe, it, expect } from 'vitest';
import Node from '../../src/nodes/node/Node.js';

describe('Range', () => {
	let window: Window;
	let document: Document;
	let range: Range;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		range = document.createRange();
	});

	describe('get collapsed()', () => {
		it('Returns true when start and end container are the same and has the same offset.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;
			range.setStart(container, 0);
			range.setEnd(container, 0);

			expect(range.collapsed).toBe(true);
		});

		it('Returns false when start and end container are the same, but does not have the same offset.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;
			range.setStart(container, 0);
			range.setEnd(container, 1);

			expect(range.collapsed).toBe(false);
		});

		it('Returns false when start and end container are not the same, but have the same offset.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;
			range.setStart(container, 0);
			range.setEnd(container.children[0], 0);

			expect(range.collapsed).toBe(false);
		});
	});

	describe('get commonAncestorContainer()', () => {
		it('Returns ancestor parent container when end container is set to a child of start container.', () => {
			const container = document.createElement('div');
			container.innerHTML = `Hello <u>world</u>!`;

			range.setStart(container, 0);
			range.setEnd(container.children[0], 0);

			expect(range.commonAncestorContainer === container).toBe(true);
		});

		it('Returns ancestor parent container when start and end container are the same.', () => {
			const container = document.createElement('div');

			range.setStart(container, 0);
			range.setEnd(container, 0);

			expect(range.commonAncestorContainer === container).toBe(true);
		});

		it('Returns end container when start and end container does not have a common ancestor.', () => {
			const container = document.createElement('div');
			const container2 = document.createElement('div');

			range.setStart(container, 0);
			range.setEnd(container2, 0);

			expect(range.commonAncestorContainer === container2).toBe(true);
		});

		it('Returns common parent container.', () => {
			const container = document.createElement('div');
			const span = document.createElement('span');
			const span2 = document.createElement('span');

			container.appendChild(span);
			container.appendChild(span2);

			range.setStart(span, 0);
			range.setEnd(span2, 0);

			expect(range.commonAncestorContainer === container).toBe(true);
		});

		it('Returns body when it is the common parent container.', () => {
			const span = document.createElement('span');
			const span2 = document.createElement('span');

			document.body.appendChild(span);
			document.body.appendChild(span2);

			range.setStart(span, 0);
			range.setEnd(span2, 0);

			expect(range.commonAncestorContainer === document.body).toBe(true);
		});
	});

	describe('collapse()', () => {
		it('Collapses the Range to the end container by default.', () => {
			const container = document.createElement('div');

			container.innerHTML = `Hello <u>world</u>!`;

			range.setStart(container, 2);
			range.setEnd(container.children[0], 1);

			range.collapse();

			expect(range.startContainer === container.children[0]).toBe(true);
			expect(range.endContainer === container.children[0]).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(1);
			expect(range.collapsed).toBe(true);
		});

		it('Collapses the Range to the end container, even though the toStart parameter is set to true, when the end container is a child of the start container.', () => {
			const container = document.createElement('div');

			container.innerHTML = `Hello <u>world</u>!`;

			range.setStart(container, 2);
			range.setEnd(container.children[0], 1);

			range.collapse(true);

			expect(range.startContainer === container.children[0]).toBe(true);
			expect(range.endContainer === container.children[0]).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(1);
			expect(range.collapsed).toBe(true);
		});

		it('Collapses the Range to the start container if the toStart parameter is set to true.', () => {
			const container = document.createElement('div');
			const span = document.createElement('span');
			const span2 = document.createElement('span');

			span.textContent = 'hello';
			span2.textContent = 'world';

			container.appendChild(span);
			container.appendChild(span2);

			range.setStart(span.firstChild, 1);
			range.setEnd(span2.firstChild, 2);

			range.collapse(true);

			expect(range.startContainer === span.firstChild).toBe(true);
			expect(range.endContainer === span.firstChild).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(1);
			expect(range.collapsed).toBe(true);
		});
	});

	describe('compareBoundaryPoints()', () => {
		it('Returns -1 when pointB is after pointA and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();
			const container = document.createElement('div');

			container.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.selectNode(container.children[0]);
			sourceRange.selectNode(container.children[1]);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(-1);
		});

		it('Returns 1 when pointA is after pointB and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();
			const container = document.createElement('div');

			container.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.selectNode(container.children[1]);
			sourceRange.selectNode(container.children[0]);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(1);
		});

		it('Returns -1 when pointA comes before pointB and the selection are text nodes and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();
			const container = document.createElement('div');

			container.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.setStart(container.children[0].firstChild, 1);
			sourceRange.setEnd(container.children[1].firstChild, 10);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(-1);
		});

		it('Returns 0 when pointA are the same as pointB and "how" is set to "START_TO_END".', () => {
			const sourceRange = document.createRange();
			const container = document.createElement('div');

			container.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.setStart(container.children[0].firstChild, 1);
			range.setEnd(container.children[1].firstChild, 10);
			sourceRange.setStart(container.children[0].firstChild, 1);
			sourceRange.setEnd(container.children[1].firstChild, 10);

			expect(range.compareBoundaryPoints(Range.START_TO_END, sourceRange)).toBe(1);
		});
	});

	describe('comparePoint()', () => {
		it('Returns 1 when referenceNode is after range.', () => {
			const container = document.createElement('div');

			container.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.selectNode(container.children[0]);

			expect(range.comparePoint(container.children[1], 0)).toBe(1);
		});

		it('Returns -1 when referenceNode is before range.', () => {
			const container = document.createElement('div');

			container.innerHTML = `
				<div>This is the Range 1 Content</div>
				<div>This is the Range 2 Content</div>
			`;

			range.selectNode(container.children[1]);

			expect(range.comparePoint(container.children[0], 0)).toBe(-1);
		});
	});

	describe('cloneContents()', () => {
		it('Clones text in a paragraph.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'My text';

			const referenceNode = paragraph.firstChild;

			range.selectNode(referenceNode);

			const documentFragment = range.cloneContents();

			expect(documentFragment.nodeType).toBe(NodeTypeEnum.documentFragmentNode);
			expect(documentFragment.childNodes.length).toBe(1);
			expect(documentFragment.firstChild.nodeType).toBe(NodeTypeEnum.textNode);
			expect((<Text>documentFragment.firstChild).data).toBe('My text');

			document.body.appendChild(documentFragment);

			expect(documentFragment.childNodes.length).toBe(0);
		});

		it('Clones multiple elements inside a paragraph.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			const documentFragment = range.cloneContents();

			document.body.appendChild(documentFragment);

			expect(document.body.innerHTML).toBe('ample: <i>italic</i> and <b>bol</b>');
		});

		// Fix for https://github.com/capricorn86/happy-dom/issues/853.
		it('Clones multiple child elements inside a paragraph.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			range.setStart((<Node>paragraph.querySelector('i')).firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			const documentFragment = range.cloneContents();

			document.body.appendChild(documentFragment);

			expect(document.body.innerHTML).toBe('<i>alic</i> and <b>bol</b>');
		});
	});

	describe('cloneRange()', () => {
		it('Returns a new range with the same start and end as the original.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			const clone = range.cloneRange();

			expect(clone.startContainer === range.startContainer).toBe(true);
			expect(clone.startOffset).toBe(range.startOffset);
			expect(clone.endContainer === range.endContainer).toBe(true);
			expect(clone.endOffset).toBe(range.endOffset);
		});
	});

	describe('createContextualFragment()', () => {
		it('Returns a document fragment with the tag string parsed as nodes.', () => {
			const paragraph = document.createElement('p');

			document.body.appendChild(paragraph);

			range.selectNode(paragraph);

			const fragment = range.createContextualFragment('<div>Test</div>');

			document.body.appendChild(fragment);

			expect(document.body.innerHTML).toBe('<p></p><div>Test</div>');
		});
	});

	describe('deleteContents()', () => {
		it('Deletes the selected content.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			range.deleteContents();

			expect(paragraph.innerHTML).toBe('Ex<b>d</b>');
		});
	});

	describe('detach()', () => {
		it('Do nothing.', () => {
			expect(range.detach()).toBe(undefined);
		});
	});

	describe('extractContents()', () => {
		it('Extracts the selected content.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			document.body.appendChild(paragraph);

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			const documentFragment = range.extractContents();

			document.body.appendChild(documentFragment);

			expect(document.body.innerHTML).toBe('<p>Ex<b>d</b></p>ample: <i>italic</i> and <b>bol</b>');
		});
	});

	describe('getBoundingClientRect()', () => {
		it('Returns an instance of DOMRect.', () => {
			const domRect = range.getBoundingClientRect();
			expect(domRect instanceof DOMRect).toBe(true);
		});
	});

	describe('getClientRects()', () => {
		it('Returns an empty DOMRectList.', () => {
			const clientRects = range.getClientRects();
			expect(Array.isArray(clientRects)).toBe(true);
			expect(typeof clientRects.item).toBe('function');
		});
	});

	describe('isPointInRange()', () => {
		it('Returns "true" if point is in Range.', () => {
			document.body.innerHTML = '<p>Example: <i>italic</i> and <b>bold</b></p><span>Test</span>';

			const paragraph = document.body.children[0];

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			expect(range.isPointInRange((<Node>paragraph.querySelector('i')).firstChild, 2)).toBe(true);
			expect(range.isPointInRange(document.body.children[1], 1)).toBe(false);
			expect(range.isPointInRange(document.body.children[1].firstChild, 2)).toBe(false);
		});
	});

	describe('insertNode()', () => {
		it('Inserts a node into the Range.', () => {
			document.body.innerHTML = '<p>Example: <i>italic</i> and <b>bold</b></p><span>Test</span>';

			const paragraph = document.body.children[0];

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			const newNode = document.createElement('u');
			newNode.innerHTML = 'New node';

			range.insertNode(newNode);

			expect(document.body.innerHTML).toBe(
				'<p>Ex<u>New node</u>ample: <i>italic</i> and <b>bold</b></p><span>Test</span>'
			);
		});
	});

	describe('intersectsNode()', () => {
		it('Returns "true" if a node intersects the Range.', () => {
			document.body.innerHTML = '<p>Example: <i>italic</i> and <b>bold</b></p><span>Test</span>';

			const paragraph = document.body.children[0];

			range.setStart(paragraph.firstChild, 2);
			range.setEnd((<Node>paragraph.querySelector('b')).firstChild, 3);

			expect(range.intersectsNode(<Node>paragraph.querySelector('i'))).toBe(true);
			expect(range.intersectsNode((<Node>paragraph.querySelector('i')).firstChild)).toBe(true);
			expect(range.intersectsNode(document.body.children[1])).toBe(false);
			expect(range.intersectsNode(document.body.children[1].firstChild)).toBe(false);
		});
	});

	describe('selectNode()', () => {
		it('Sets the start and end Node to the parent of the provided Node and offset to its corresponding index.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			const italic = <Node>paragraph.querySelector('i');

			range.selectNode(italic);

			expect(range.startContainer === paragraph).toBe(true);
			expect(range.endContainer === paragraph).toBe(true);
			expect(range.startOffset).toBe(1);
			expect(range.endOffset).toBe(2);
		});
	});

	describe('selectNodeContents()', () => {
		it('Selects the content of an element.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			const italic = <Node>paragraph.querySelector('i');

			range.selectNodeContents(italic);

			expect(range.startContainer === italic).toBe(true);
			expect(range.endContainer === italic).toBe(true);
			expect(range.startOffset).toBe(0);
			expect(range.endOffset).toBe(1);
		});

		it('Selects the content of a text node.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			const text = (<Node>paragraph.querySelector('i')).firstChild;

			range.selectNodeContents(text);

			expect(range.startContainer === text).toBe(true);
			expect(range.endContainer === text).toBe(true);
			expect(range.startOffset).toBe(0);
			expect(range.endOffset).toBe(6);
		});
	});

	describe('setStart()', () => {
		it('Selects the content of an element.', () => {
			const paragraph = document.createElement('p');

			paragraph.innerHTML = 'Example: <i>italic</i> and <b>bold</b>';

			const italic = <Node>paragraph.querySelector('i');

			range.selectNodeContents(italic);

			expect(range.startContainer === italic).toBe(true);
			expect(range.endContainer === italic).toBe(true);
			expect(range.startOffset).toBe(0);
			expect(range.endOffset).toBe(1);
		});
	});
});
