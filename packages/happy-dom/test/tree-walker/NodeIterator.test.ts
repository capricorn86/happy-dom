import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';
import NodeFilter from '../../src/tree-walker/NodeFilter.js';
import Element from '../../src/nodes/element/Element.js';
import Comment from '../../src/nodes/comment/Comment.js';
import Node from '../../src/nodes/node/Node.js';
import type HTMLTemplateElement from '../../src/nodes/html-template-element/HTMLTemplateElement.js';
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

		it('Walks into the children of a node when provided filter function returns NodeFilter.FILTER_REJECT for it.', () => {
			document.body.innerHTML = '<div id="a"><span id="a1"></span></div><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, {
				acceptNode: (node: Node) =>
					(<Element>node).id === 'a' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
			});
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
			}

			expect(visited).toEqual(['BODY', 'a1', 'b']);
		});

		it('Continues to the next sibling when the current node is removed.', () => {
			document.body.innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'a') {
					currentNode.remove();
				}
			}

			expect(visited).toEqual(['BODY', 'a', 'b', 'c']);
		});

		it('Continues to the moved children when the current node is removed after its children are moved after it.', () => {
			document.body.innerHTML =
				'<div id="outer"><div id="inner"><strong id="leaf">x</strong></div></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'outer') {
					const childNodes = currentNode.childNodes;
					for (let i = childNodes.length - 1; i >= 0; i--) {
						currentNode.parentNode.insertBefore(childNodes[i], currentNode.nextSibling);
					}
					currentNode.parentNode.removeChild(currentNode);
				}
			}

			expect(visited).toEqual(['BODY', 'outer', 'inner', 'leaf']);
		});

		it('Ends when the current node is removed after its children are moved before it.', () => {
			document.body.innerHTML =
				'<div id="outer"><div id="inner"><strong id="leaf">x</strong></div></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'outer') {
					while (currentNode.firstChild) {
						currentNode.parentNode.insertBefore(currentNode.firstChild, currentNode);
					}
					currentNode.parentNode.removeChild(currentNode);
				}
			}

			expect(visited).toEqual(['BODY', 'outer']);
		});

		it('Does not walk into the content of a template element.', () => {
			document.body.innerHTML = '<template><p id="t1"></p></template><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
			}

			expect(visited).toEqual(['BODY', 'TEMPLATE', 'b']);
		});

		it('Continues to the next sibling when the current node is removed and its previous sibling is a template element.', () => {
			document.body.innerHTML =
				'<template><p id="t1"></p></template><div id="a"></div><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'a') {
					currentNode.remove();
					expect(nodeIterator.referenceNode).toBe(document.body.firstChild);
					expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
				}
			}

			expect(visited).toEqual(['BODY', 'TEMPLATE', 'a', 'b']);
		});

		it('Continues to the next sibling when the current node is removed after root has been moved to another document.', () => {
			const otherDocument = document.implementation.createHTMLDocument();
			const root = document.createElement('div');

			root.innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';

			const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);

			otherDocument.body.appendChild(root);

			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'a') {
					currentNode.remove();
				}
			}

			expect(visited).toEqual(['DIV', 'a', 'b', 'c']);
		});

		it('Continues to the next sibling when the current node is removed after root has been moved to another document and back.', () => {
			const otherDocument = document.implementation.createHTMLDocument();
			const root = document.createElement('div');

			root.innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';

			const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);

			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'a') {
					otherDocument.body.appendChild(root);
					currentNode.remove();
				}
				if (currentNode.id === 'b') {
					document.body.appendChild(root);
					currentNode.remove();
				}
			}

			expect(visited).toEqual(['DIV', 'a', 'b', 'c']);
		});

		it('Continues to the next sibling when the current node is removed after an ancestor of root has been moved to another document.', () => {
			const otherDocument = document.implementation.createHTMLDocument();
			const outer = document.createElement('div');

			outer.innerHTML = '<div id="r"><div id="a"></div><div id="b"></div></div>';

			const nodeIterator = document.createNodeIterator(outer.firstChild!, NodeFilter.SHOW_ELEMENT);

			otherDocument.body.appendChild(outer);

			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id);
				if (currentNode.id === 'a') {
					currentNode.remove();
				}
			}

			expect(visited).toEqual(['r', 'a', 'b']);
		});

		it('Continues after the removed node when an ancestor of the current node is removed.', () => {
			document.body.innerHTML = '<div id="a"><span id="a1"></span></div><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'a1') {
					document.getElementById('a')?.remove();
				}
			}

			expect(visited).toEqual(['BODY', 'a', 'a1', 'b']);
		});

		it('Continues to the next sibling when the current node is removed and root is the document.', () => {
			document.head.innerHTML = '';
			document.body.innerHTML = '<div id="a"></div><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
				if (currentNode.id === 'a') {
					currentNode.remove();
				}
			}

			expect(visited).toEqual(['HTML', 'HEAD', 'BODY', 'a', 'b']);
		});

		it('Continues to the next sibling when the filter removes the node it accepts.', () => {
			document.body.innerHTML = '<div id="a"></div><div id="b"></div><div id="c"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, {
				acceptNode: (node: Node) => {
					if ((<Element>node).id === 'a') {
						(<Element>node).remove();
					}
					return NodeFilter.FILTER_ACCEPT;
				}
			});
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id || currentNode.nodeName);
			}

			expect(visited).toEqual(['BODY', 'a', 'b', 'c']);
		});

		it('Throws an InvalidStateError when called from inside the filter.', () => {
			document.body.innerHTML = '<div id="a"></div>';

			let errorName: string | null = null;
			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, {
				acceptNode: () => {
					try {
						nodeIterator.nextNode();
					} catch (e) {
						errorName = e.name;
					}
					return NodeFilter.FILTER_ACCEPT;
				}
			});

			expect(nodeIterator.nextNode()).toBe(document.body);
			expect(errorName).toBe('InvalidStateError');
		});

		it('Continues to the new children when the children of root are replaced with innerHTML.', () => {
			document.body.innerHTML = '<div id="a"></div><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);

			nodeIterator.nextNode();
			nodeIterator.nextNode();
			document.body.innerHTML = '<i id="new"></i>';

			expect(nodeIterator.referenceNode).toBe(document.body);
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
			expect((<Element>nodeIterator.nextNode()).id).toBe('new');
		});
	});

	describe('previousNode()', () => {
		it('Returns the current node when executed after a nextNode() call.', () => {
			document.body.innerHTML = '<div id="a"></div><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const getId = (node: Node | null): string | null =>
				node ? (<Element>node).id || node.nodeName : null;

			expect([
				getId(nodeIterator.nextNode()),
				getId(nodeIterator.nextNode()),
				getId(nodeIterator.previousNode()),
				getId(nodeIterator.previousNode()),
				getId(nodeIterator.nextNode()),
				getId(nodeIterator.nextNode())
			]).toEqual(['BODY', 'a', 'a', 'BODY', 'BODY', 'a']);
		});
		it('Does not walk into the content of a template element.', () => {
			document.body.innerHTML = '<template><p id="t1"></p></template><div id="b"></div>';

			const nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT);
			const getId = (node: Node | null): string | null =>
				node ? (<Element>node).id || node.nodeName : null;

			expect([
				getId(nodeIterator.nextNode()),
				getId(nodeIterator.nextNode()),
				getId(nodeIterator.nextNode()),
				getId(nodeIterator.previousNode()),
				getId(nodeIterator.previousNode()),
				getId(nodeIterator.previousNode()),
				getId(nodeIterator.previousNode())
			]).toEqual(['BODY', 'TEMPLATE', 'b', 'b', 'TEMPLATE', 'BODY', null]);
		});
	});

	describe('get referenceNode() and get pointerBeforeReferenceNode()', () => {
		it('Moves the reference to the following node within root when an inclusive ancestor of the reference is removed and the pointer is before the reference.', () => {
			document.body.innerHTML =
				'<div id="root"><a id="a"><b id="a1"></b></a><a id="b"><b id="b1"></b></a><a id="c"></a></div>';

			const root = <Element>document.getElementById('root');
			const nodeIterator = document.createNodeIterator(root);

			for (let i = 0; i < 5; i++) {
				nodeIterator.nextNode();
			}

			expect(nodeIterator.referenceNode).toBe(document.getElementById('b1'));
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);

			nodeIterator.previousNode();

			expect(nodeIterator.referenceNode).toBe(document.getElementById('b1'));
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(true);

			document.getElementById('b')?.remove();

			expect(nodeIterator.referenceNode).toBe(document.getElementById('c'));
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(true);
		});

		it('Moves the reference to the preceding node when the reference is removed, the pointer is before the reference and there is no following node within root.', () => {
			document.body.innerHTML =
				'<div id="root"><a id="a"><b id="a1"></b></a><a id="b"></a></div><p id="after"></p>';

			const root = <Element>document.getElementById('root');
			const nodeIterator = document.createNodeIterator(root);

			for (let i = 0; i < 4; i++) {
				nodeIterator.nextNode();
			}
			nodeIterator.previousNode();

			expect(nodeIterator.referenceNode).toBe(document.getElementById('b'));
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(true);

			document.getElementById('b')?.remove();

			expect(nodeIterator.referenceNode).toBe(document.getElementById('a1'));
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
		});

		it('Keeps the reference when root is removed and updates it for removals inside the detached root.', () => {
			document.body.innerHTML = '<div id="root"><p id="p1"></p><p id="p2"></p></div>';

			const root = <Element>document.getElementById('root');
			const p1 = <Element>document.getElementById('p1');
			const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);

			nodeIterator.nextNode();
			nodeIterator.nextNode();
			root.remove();

			expect(nodeIterator.referenceNode).toBe(p1);
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);

			p1.remove();

			expect(nodeIterator.referenceNode).toBe(root);
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
			expect((<Element>nodeIterator.nextNode()).id).toBe('p2');
		});

		it('Keeps the reference when an ancestor of root is removed.', () => {
			document.body.innerHTML =
				'<div id="outer"><div id="root"><p id="p1"></p><p id="p2"></p></div></div><p id="after"></p>';

			const root = <Element>document.getElementById('root');
			const p1 = <Element>document.getElementById('p1');
			const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT);

			nodeIterator.nextNode();
			nodeIterator.nextNode();
			(<Element>root.parentNode).remove();

			expect(nodeIterator.referenceNode).toBe(p1);
			expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
			expect((<Element>nodeIterator.nextNode()).id).toBe('p2');
			expect(nodeIterator.nextNode()).toBe(null);
		});

		it('Continues to the next sibling when the current node is removed and root is the content of a template.', () => {
			document.body.innerHTML = '<template id="t"><p id="a"></p><p id="b"></p></template>';

			const content = (<HTMLTemplateElement>document.getElementById('t')).content;
			const nodeIterator = document.createNodeIterator(content, NodeFilter.SHOW_ELEMENT);
			const visited: string[] = [];
			let currentNode;

			while ((currentNode = nodeIterator.nextNode())) {
				visited.push(currentNode.id);
				if (currentNode.id === 'a') {
					currentNode.remove();
					expect(nodeIterator.referenceNode).toBe(content);
					expect(nodeIterator.pointerBeforeReferenceNode).toBe(false);
				}
			}

			expect(visited).toEqual(['a', 'b']);
		});
	});
});
