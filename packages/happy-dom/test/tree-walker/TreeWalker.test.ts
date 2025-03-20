import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import NodeFilter from '../../src/tree-walker/NodeFilter.js';
import Element from '../../src/nodes/element/Element.js';
import Comment from '../../src/nodes/comment/Comment.js';
import Node from '../../src/nodes/node/Node.js';
import TreeWalkerHTML from './data/TreeWalkerHTML.js';
import { beforeEach, describe, it, expect } from 'vitest';

const NODE_TO_STRING = (node: Node): string => {
	if (node instanceof Element) {
		return node.outerHTML;
	} else if (node instanceof Comment) {
		return '<!--' + node.textContent + '-->';
	} else {
		return node['textContent'];
	}
};

describe('TreeWalker', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		document.write(TreeWalkerHTML);
	});

	describe('nextNode()', () => {
		it('Walks into each node in the DOM tree.', () => {
			const treeWalker = document.createTreeWalker(document.body);
			const html: string[] = [];
			let currentNode;

			while ((currentNode = treeWalker.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'\n\t\t\t',
				'<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>',
				'\n\t\t\t\t',
				'<!-- Comment 1 !-->',
				'\n\t\t\t\t',
				'<b>Bold</b>',
				'Bold',
				'\n\t\t\t\t',
				'<!-- Comment 2 !-->',
				'\n\t\t\t\t',
				'<span>Span</span>',
				'Span',
				'\n\t\t\t',
				'\n\t\t\t',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'\n\t\t\t\t',
				'<!-- Comment 1 !-->',
				'\n\t\t\t\t',
				'<b>Bold</b>',
				'Bold',
				'\n\t\t\t\t',
				'<!-- Comment 2 !-->',
				'\n\t\t\t',
				'\n\t\t\n\t'
			]);
		});

		it('Walks into each HTMLElement in the DOM tree when whatToShow is set to NodeFilter.SHOW_ELEMENT.', () => {
			const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
			const html: string[] = [];
			let currentNode;

			while ((currentNode = treeWalker.nextNode())) {
				html.push(currentNode.outerHTML);
			}

			expect(html).toEqual([
				'<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>',
				'<b>Bold</b>',
				'<span>Span</span>',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'<b>Bold</b>'
			]);
		});

		it('Walks into each HTMLElement and Comment in the DOM tree when whatToShow is set to NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT.', () => {
			const treeWalker = document.createTreeWalker(
				document.body,
				NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT
			);
			const html: string[] = [];
			let currentNode;

			while ((currentNode = treeWalker.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>',
				'<!-- Comment 1 !-->',
				'<b>Bold</b>',
				'<!-- Comment 2 !-->',
				'<span>Span</span>',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'<!-- Comment 1 !-->',
				'<b>Bold</b>',
				'<!-- Comment 2 !-->'
			]);
		});

		it('Walks into each HTMLElement in the DOM tree when whatToShow is set to NodeFilter.SHOW_ALL and provided filter function returns NodeFilter.FILTER_SKIP if not an HTMLElement and NodeFilter.FILTER_ACCEPT if it is.', () => {
			const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL, {
				acceptNode: (node: Node) =>
					node.nodeType === Node.ELEMENT_NODE ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
			});
			const html: string[] = [];
			let currentNode;

			while ((currentNode = treeWalker.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>',
				'<b>Bold</b>',
				'<span>Span</span>',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'<b>Bold</b>'
			]);
		});

		it('Rejects the two first nodes when provided filter function returns NodeFilter.FILTER_REJECT on the two first nodes.', () => {
			let rejected = 0;
			const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL, {
				acceptNode: () => {
					if (rejected < 2) {
						rejected++;
						return NodeFilter.FILTER_REJECT;
					}
					return NodeFilter.FILTER_ACCEPT;
				}
			});
			const html: string[] = [];
			let currentNode;

			while ((currentNode = treeWalker.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'\n\t\t\t',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'\n\t\t\t\t',
				'<!-- Comment 1 !-->',
				'\n\t\t\t\t',
				'<b>Bold</b>',
				'Bold',
				'\n\t\t\t\t',
				'<!-- Comment 2 !-->',
				'\n\t\t\t',
				'\n\t\t\n\t'
			]);
		});
	});

	describe('previousNode()', () => {
		it('Returns the previous node when executed after a nextNode() call.', () => {
			const treeWalker = document.createTreeWalker(document.body);
			let expectedPreviousNode: Node | null = null;
			let previousNode: Node | null = null;
			let currentNode: Node | null = null;

			while ((currentNode = treeWalker.nextNode())) {
				if (previousNode) {
					previousNode = treeWalker.previousNode();
					expect(previousNode === expectedPreviousNode).toBe(true);
					treeWalker.nextNode();
				}
				expectedPreviousNode = currentNode;
			}
		});
	});

	describe('parentNode()', () => {
		it('Returns the parent node.', () => {
			const treeWalker = document.createTreeWalker(document.body);
			const node = treeWalker.nextNode();
			expect(treeWalker.parentNode() === node?.parentNode).toBe(true);
		});

		it('Returns null if there is no parent.', () => {
			const treeWalker = document.createTreeWalker(document.body);
			treeWalker.nextNode();
			treeWalker.parentNode();
			expect(treeWalker.parentNode() === null).toBe(true);
		});

		it('Returns parent node in a hierarchy', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <span>
                    <!-- Comment 1 -->
                    <div>
                        <span>Span</span>
                        <b>B1</b>
                    </div>
                    <article>
                        <b>B2</b>
                    </article>
                </span>
            `;
			const treeWalker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT);

			treeWalker.currentNode = <Node>div.querySelector('b');

			expect(treeWalker.parentNode()).toBe(div.querySelector('div'));
			expect(treeWalker.parentNode()).toBe(div.querySelector('span'));
			expect(treeWalker.parentNode()).toBe(div);
			expect(treeWalker.parentNode()).toBe(null);
		});

		it('Returns parent node in a hierarchy using filtering', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <span>
                    <!-- Comment 1 -->
                    <div>
                        <span>Span</span>
                        <b>B1</b>
                    </div>
                    <article>
                        <b>B2</b>
                    </article>
                </span>
            `;
			const treeWalker = document.createTreeWalker(div, NodeFilter.SHOW_ELEMENT, {
				acceptNode: (node: Node) =>
					(<Element>node).tagName === 'DIV' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
			});

			treeWalker.currentNode = <Node>div.querySelector('b');

			expect(treeWalker.parentNode()).toBe(div.querySelector('div'));
			expect(treeWalker.parentNode()).toBe(div);
			expect(treeWalker.parentNode()).toBe(null);
		});
	});

	describe('firstChild()', () => {
		it('Returns the first child node.', () => {
			const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
			const node = treeWalker.nextNode();
			expect(node).toBeInstanceOf(Element);
			expect(treeWalker.firstChild()).toBe((<Element>node).firstElementChild);
		});

		it('Returns first sibling when it matches', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <span>
                    <!-- Comment 1 -->
                    <div>
                        <span>Span</span>
                        <b>B1</b>
                    </div>
                    <article>
                        <b>B2</b>
                    </article>
                </span>
            `;
			const treeWalker = document.createTreeWalker(div, NodeFilter.SHOW_ALL, {
				acceptNode: (node: Node) =>
					node.nodeType === Node.ELEMENT_NODE &&
					((<Element>node).tagName === 'ARTICLE' || (<Element>node).tagName === 'B')
						? NodeFilter.FILTER_ACCEPT
						: NodeFilter.FILTER_SKIP
			});

			const firstChild = <Element>treeWalker.firstChild();

			expect(firstChild.tagName).toBe('B');
			expect(firstChild.textContent).toBe('B1');

			expect(treeWalker.firstChild()).toBe(null);

			const nextSibling = <Element>treeWalker.nextSibling();

			expect(nextSibling.tagName).toBe('ARTICLE');
			expect(nextSibling.textContent.trim()).toBe('B2');
		});
	});

	describe('lastChild()', () => {
		it('Returns last sibling when it matches', () => {
			const div = document.createElement('div');
			div.innerHTML = `
                <span>
                    <!-- Comment 1 -->
                    <div>
                        <span>Span</span>
                        <b>B1</b>
                    </div>
                    <article>
                        <b>B2</b>
                    </article>
                </span>
            `;
			const treeWalker = document.createTreeWalker(div, NodeFilter.SHOW_ALL, {
				acceptNode: (node: Node) =>
					node.nodeType === Node.ELEMENT_NODE &&
					((<Element>node).tagName === 'ARTICLE' || (<Element>node).tagName === 'B')
						? NodeFilter.FILTER_ACCEPT
						: NodeFilter.FILTER_SKIP
			});

			const lastChild = <Element>treeWalker.lastChild();

			expect(lastChild.tagName).toBe('ARTICLE');
			expect(lastChild.textContent.trim()).toBe('B2');

			const previousSibling = <Element>treeWalker.previousSibling();

			expect(previousSibling.tagName).toBe('B');
			expect(previousSibling.textContent.trim()).toBe('B1');
		});
	});
});
