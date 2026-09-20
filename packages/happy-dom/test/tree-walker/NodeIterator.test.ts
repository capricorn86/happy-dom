import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';
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

	describe('referenceNode and pointerBeforeReferenceNode', () => {
		it('Starts at the root with the pointer before the reference node.', () => {
			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);

			expect(nodeIterator.referenceNode).toBe(document.body);
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(true);

			expect(nodeIterator.nextNode()).toBe(document.body);
			expect(nodeIterator.referenceNode).toBe(document.body);
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
		});
	});

	describe('detach()', () => {
		it('Is a no-op that does not stop iteration.', () => {
			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);

			expect(nodeIterator.detach()).toBe(undefined);
			expect(nodeIterator.nextNode()).toBe(document.body);
		});
	});

	describe('pre-removing steps', () => {
		it('Continues after the current node is removed when its children were inserted after it.', () => {
			document.body.innerHTML =
				'<div id="outer"><div id="inner"><strong id="leaf">x</strong></div></div>';

			const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let node;

			while ((node = iterator.nextNode())) {
				visited.push((<Element>node).id || node.nodeName);
				if ((<Element>node).id === 'outer') {
					const children = [...node.childNodes];
					for (let i = children.length - 1; i >= 0; --i) {
						node.parentNode!.insertBefore(children[i], node.nextSibling);
					}
					node.parentNode!.removeChild(node);
				}
			}

			expect(visited).toEqual(['BODY', 'outer', 'inner', 'leaf']);
		});

		it('Continues to following siblings after the current node is removed.', () => {
			document.body.innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';

			const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let node;

			while ((node = iterator.nextNode())) {
				visited.push((<Element>node).id || node.nodeName);
				if ((<Element>node).id === 'a') {
					node.parentNode!.removeChild(node);
				}
			}

			expect(visited).toEqual(['BODY', 'a', 'b', 'c']);
		});

		it('Continues after an ancestor of the reference node is removed.', () => {
			document.body.innerHTML =
				'<div id="wrap"><div id="a"></div><div id="b"></div></div><div id="after"></div>';

			const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let node;

			while ((node = iterator.nextNode())) {
				visited.push((<Element>node).id || node.nodeName);
				if ((<Element>node).id === 'a') {
					document.getElementById('wrap')!.remove();
				}
			}

			expect(visited).toEqual(['BODY', 'wrap', 'a', 'after']);
		});

		it('Does not visit children hoisted before the removed node.', () => {
			document.body.innerHTML =
				'<div id="outer"><div id="inner"><strong id="leaf">x</strong></div></div>';

			const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let node;

			while ((node = iterator.nextNode())) {
				visited.push((<Element>node).id || node.nodeName);
				if ((<Element>node).id === 'outer') {
					const children = [...node.childNodes];
					for (let i = 0; i < children.length; i++) {
						node.parentNode!.insertBefore(children[i], node);
					}
					node.parentNode!.removeChild(node);
				}
			}

			expect(visited).toEqual(['BODY', 'outer']);
		});

		it('Continues after replaceChild() removes the current node.', () => {
			document.body.innerHTML = '<div id="a"></div><div id="b"></div>';

			const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let node;

			while ((node = iterator.nextNode())) {
				visited.push((<Element>node).id || node.nodeName);
				if ((<Element>node).id === 'a') {
					const replacement = document.createElement('div');
					replacement.id = 'replacement';
					node.parentNode!.replaceChild(replacement, node);
				}
			}

			// replaceChild inserts the replacement before the old node, so it stays behind
			// the iterator. Pre-removing must still advance past the removed node to "b".
			expect(visited).toEqual(['BODY', 'a', 'b']);
		});

		it('Moves the reference past a removed ancestor when the pointer is before the reference.', () => {
			document.body.innerHTML =
				'<div id="a"><span id="a1"></span></div><div id="b"><span id="b1"></span></div><div id="c"></div>';

			const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const nodes: Record<string, Element> = {};
			for (const id of ['a', 'a1', 'b', 'b1', 'c']) {
				nodes[id] = document.getElementById(id)!;
			}

			while (iterator.nextNode() !== nodes.b1) {
				// Advance until b1 is the reference.
			}

			expect(iterator.referenceNode).toBe(nodes.b1);
			expect(iterator.pointerBeforeReferenceNode).toBe(false);

			expect(iterator.previousNode()).toBe(nodes.b1);
			expect(iterator.pointerBeforeReferenceNode).toBe(true);

			nodes.b.remove();

			expect(iterator.referenceNode).toBe(nodes.c);
			expect(iterator.pointerBeforeReferenceNode).toBe(true);
			expect(iterator.nextNode()).toBe(nodes.c);
		});
	});
});
