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
	}
	return node['textContent'];
};

describe('NodeIterator', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		document.write(TreeWalkerHTML);
	});

	describe('nextNode()', () => {
		it('Walks into each node in the DOM tree.', () => {
			const nodeIterator = document.createNodeIterator(document.body);
			const html: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'<body>\n\t\t\t<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>\n\t\t\t<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>\n\t\t\n\t</body>',
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
			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const html: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				html.push(currentNode.outerHTML);
			}

			expect(html).toEqual([
				'<body>\n\t\t\t<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>\n\t\t\t<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>\n\t\t\n\t</body>',
				'<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>',
				'<b>Bold</b>',
				'<span>Span</span>',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'<b>Bold</b>'
			]);
		});

		it('Walks into each HTMLElement and Comment in the DOM tree when whatToShow is set to NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT.', () => {
			const nodeIterator = document.createNodeIterator(
				document.body,
				NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT
			);
			const html: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'<body>\n\t\t\t<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>\n\t\t\t<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>\n\t\t\n\t</body>',
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
			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ALL, {
				acceptNode: (node: Node) =>
					node.nodeType === Node.ELEMENT_NODE ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
			});
			const html: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
				'<body>\n\t\t\t<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>\n\t\t\t<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>\n\t\t\n\t</body>',
				'<div class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t\t<span>Span</span>\n\t\t\t</div>',
				'<b>Bold</b>',
				'<span>Span</span>',
				'<article class="class1 class2" id="id">\n\t\t\t\t<!-- Comment 1 !-->\n\t\t\t\t<b>Bold</b>\n\t\t\t\t<!-- Comment 2 !-->\n\t\t\t</article>',
				'<b>Bold</b>'
			]);
		});

		it('Rejects the two first nodes when provided filter function returns NodeFilter.FILTER_REJECT on the two first nodes.', () => {
			let rejected = 0;
			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ALL, {
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

			while ((currentNode = nodeIterator.nextNode())) {
				html.push(NODE_TO_STRING(currentNode));
			}

			expect(html).toEqual([
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
	});

	describe('previousNode()', () => {
		it('Returns the previous node when executed after a nextNode() call.', () => {
			const nodeIterator = document.createNodeIterator(document.body);
			let expectedPreviousNode: Node | null = null;
			let previousNode: Node | null = null;
			let currentNode: Node | null = null;

			while ((currentNode = nodeIterator.nextNode())) {
				if (previousNode) {
					previousNode = nodeIterator.previousNode();
					expect(previousNode === expectedPreviousNode).toBe(true);
					nodeIterator.nextNode();
				}
				expectedPreviousNode = currentNode;
			}
		});
	});
});
