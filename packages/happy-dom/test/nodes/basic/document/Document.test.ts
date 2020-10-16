import Window from '../../../../src/window/Window';
import CustomElement from '../../../CustomElement';
import HTMLElement from '../../../../src/nodes/basic/html-element/HTMLElement';
import TextNode from '../../../../src/nodes/basic/text-node/TextNode';
import CommentNode from '../../../../src/nodes/basic/comment-node/CommentNode';
import DocumentFragment from '../../../../src/nodes/basic/document-fragment/DocumentFragment';
import TreeWalker from '../../../../src/tree-walker/TreeWalker';
import Node from '../../../../src/nodes/basic/node/Node';
import Document from '../../../../src/nodes/basic/document/Document';
import Element from '../../../../src/nodes/basic/element/Element';
import Event from '../../../../src/event/Event';
import SVGSVGElement from '../../../../src/nodes/elements/svg/SVGSVGElement';
import NamespaceURI from '../../../../src/html-config/NamespaceURI';
import Attr from '../../../../src/attribute/Attr';
import ParentNodeUtility from '../../../../src/nodes/basic/parent-node/ParentNodeUtility';
import QuerySelector from '../../../../src/query-selector/QuerySelector';
import NodeFilter from '../../../../src/tree-walker/NodeFilter';

describe('Document', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get nodeName()', () => {
		test('Returns "#document".', () => {
			expect(document.nodeName).toBe('#document');
		});
	});

	describe('get children()', () => {
		test('Returns Element child nodes.', () => {
			document.appendChild(document.createTextNode('test'));
			expect(document.children).toEqual([document.documentElement]);
		});
	});

	describe('get childElementCount()', () => {
		test('Returns child element count.', () => {
			document.appendChild(document.createElement('div'));
			document.appendChild(document.createTextNode('test'));
			expect(document.childElementCount).toEqual(2);
		});
	});

	describe('get firstElementChild()', () => {
		test('Returns first element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			div.appendChild(text1);
			div.appendChild(span1);
			div.appendChild(span2);
			div.appendChild(text2);

			expect(div.firstElementChild).toBe(span1);
		});
	});

	describe('get lastElementChild()', () => {
		test('Returns last element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			div.appendChild(text1);
			div.appendChild(span1);
			div.appendChild(span2);
			div.appendChild(text2);

			expect(div.lastElementChild).toBe(span2);
		});
	});

	describe('append()', () => {
		test('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode).toBe(document);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			document.append(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('prepend()', () => {
		test('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'prepend').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode).toBe(document);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			document.prepend(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceChildren()', () => {
		test('Replaces the existing children of a ParentNode with a specified new set of children.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest
				.spyOn(ParentNodeUtility, 'replaceChildren')
				.mockImplementation((parentNode, ...nodes) => {
					expect(parentNode).toBe(document);
					expect(nodes).toEqual([node1, node2]);
					isCalled = true;
				});

			document.replaceChildren(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		test('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(expectedSelector);
				return [element];
			});

			expect(document.querySelectorAll(expectedSelector)).toEqual([element]);
		});
	});

	describe('querySelector()', () => {
		test('Query CSS selector to find a matching element.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(expectedSelector);
				return element;
			});

			expect(document.querySelector(expectedSelector)).toEqual(element);
		});
	});

	describe('getElementsByClassName()', () => {
		test('Returns an elements by class name.', () => {
			const element = document.createElement('div');
			const className = 'className';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(`.${className}`);
				return [element];
			});

			expect(document.getElementsByClassName(className)).toEqual([element]);
		});
	});

	describe('getElementsByTagName()', () => {
		test('Returns an elements by tag name.', () => {
			const element = document.createElement('div');
			const tagName = 'tag-name';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(tagName);
				return [element];
			});

			expect(document.getElementsByTagName(tagName)).toEqual([element]);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		test('Returns an elements by tag name and namespace.', () => {
			const element1 = document.createElement('div');
			const element2 = document.createElement('div');
			const tagName = 'tag-name';

			// @ts-ignore
			element1.namespaceURI = '/namespace/';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(tagName);
				return [element1, element2];
			});

			expect(document.getElementsByTagNameNS('/namespace/', tagName)).toEqual([element1]);
		});
	});

	describe('getElementById()', () => {
		test('Returns an element by ID.', () => {
			const element = document.createElement('div');
			const id = 'id';

			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(`#${id}`);
				return element;
			});

			expect(document.getElementById(id)).toEqual(element);
		});
	});

	describe('appendChild()', () => {
		test('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(document.createComment('test'));
			document.appendChild(div);
			document.appendChild(document.createComment('test'));
			document.appendChild(span);

			expect(document.children).toEqual([div, span]);
		});
	});

	describe('removeChild()', () => {
		test('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(document.createComment('test'));
			document.appendChild(div);
			document.appendChild(document.createComment('test'));
			document.appendChild(span);

			document.removeChild(div);

			expect(document.children).toEqual([span]);
		});
	});

	describe('insertBefore()', () => {
		test('Updates the children property when appending an element child.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(document.createComment('test'));
			document.appendChild(div1);
			document.appendChild(document.createComment('test'));
			document.appendChild(span);
			document.insertBefore(div2, div1);

			expect(document.children).toEqual([div2, div1, span]);
		});
	});

	describe('write()', () => {
		test('Replaces the content of documentElement with new content the first time it is called and writes the body part to the body the second time.', () => {
			const html = `
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
			`;
			document.write(html);
			document.write(html);
			expect(document.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
						<span>Body</span>
					</body>
				</html>
				`.replace(/[\s]/gm, '')
			);
		});

		test('Adds elements outside of the <html> tag to the <body> tag.', () => {
			const html = `
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
				<div>Should be added to body</div>
			`;
			document.write(html);
			expect(document.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
				`
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
						<div>Should be added to body</div>
					</body>
				</html>
				`.replace(/[\s]/gm, '')
			);
		});
	});

	describe('open()', () => {
		test('Clears the document and opens it for writing.', () => {
			const html = `
				<html>
					<head>
						<title>Title</title>
					</head>
					<body>
						<span>Body</span>
					</body>
				</html>
			`;
			document.write(html);
			document.open();
			document.write(html);
			expect(document.documentElement.outerHTML.replace(/[\s]/gm, '')).toBe(
				html.replace(/[\s]/gm, '')
			);
		});
	});

	describe('close()', () => {
		test('Has a close method.', () => {
			document.close();
			expect(typeof document.close).toBe('function');
		});
	});

	describe('createElement()', () => {
		test('Creates an element.', () => {
			const div = document.createElement('div');
			expect(div.tagName).toBe('DIV');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof HTMLElement).toBe(true);
		});

		test('Creates an svg element.', () => {
			const div = document.createElement('svg');
			expect(div.tagName).toBe('SVG');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof SVGSVGElement).toBe(true);
		});

		test('Creates a custom element.', () => {
			window.customElements.define('custom-element', CustomElement);
			const div = document.createElement('custom-element');
			expect(div.tagName).toBe('CUSTOM-ELEMENT');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof CustomElement).toBe(true);
		});

		test('Creates a custom element that has been extended from an "li" element.', () => {
			window.customElements.define('custom-element', CustomElement, { extends: 'li' });
			const div = document.createElement('li', { is: 'custom-element' });
			expect(div.tagName).toBe('LI');
			expect(div.namespaceURI).toBe(NamespaceURI.html);
			expect(div instanceof CustomElement).toBe(true);
		});
	});

	describe('createElementNS()', () => {
		test('Creates an svg element with namespace set to SVG.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			expect(svg.tagName).toBe('SVG');
			expect(svg.namespaceURI).toBe(NamespaceURI.svg);
			expect(svg instanceof SVGSVGElement).toBe(true);
		});

		test('Creates a custom element with namespace set to SVG.', () => {
			window.customElements.define('custom-element', CustomElement);
			const div = document.createElementNS(NamespaceURI.svg, 'custom-element');
			expect(div.tagName).toBe('CUSTOM-ELEMENT');
			expect(div.namespaceURI).toBe(NamespaceURI.svg);
			expect(div instanceof CustomElement).toBe(true);
		});

		test('Creates a custom element that has been extended from an "li" element with namespace set to SVG.', () => {
			window.customElements.define('custom-element', CustomElement, { extends: 'li' });
			const div = document.createElementNS(NamespaceURI.svg, 'li', { is: 'custom-element' });
			expect(div.tagName).toBe('LI');
			expect(div.namespaceURI).toBe(NamespaceURI.svg);
			expect(div instanceof CustomElement).toBe(true);
		});
	});

	describe('createAttribute()', () => {
		test('Creates an Attr node.', () => {
			const attribute = document.createAttribute('KEY1');
			expect(attribute instanceof Attr).toBe(true);
			expect(attribute).toEqual({
				value: null,
				name: 'key1',
				namespaceURI: null
			});
		});
	});

	describe('createAttributeNS()', () => {
		test('Creates an Attr node with namespace set to HTML.', () => {
			const attribute = document.createAttributeNS(NamespaceURI.html, 'KEY1');
			expect(attribute instanceof Attr).toBe(true);
			expect(attribute).toEqual({
				value: null,
				name: 'KEY1',
				namespaceURI: NamespaceURI.html
			});
		});

		test('Creates an Attr node with namespace set to SVG.', () => {
			const attribute = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			expect(attribute instanceof Attr).toBe(true);
			expect(attribute).toEqual({
				value: null,
				name: 'KEY1',
				namespaceURI: NamespaceURI.svg
			});
		});
	});

	describe('createTextNode()', () => {
		test('Creates a text node.', () => {
			const textContent = 'text';
			const textNode = document.createTextNode(textContent);
			expect(textNode.textContent).toBe(textContent);
			expect(textNode instanceof TextNode).toBe(true);
		});
	});

	describe('createComment()', () => {
		test('Creates a comment node.', () => {
			const textContent = 'text';
			const commentNode = document.createComment(textContent);
			expect(commentNode.textContent).toBe(textContent);
			expect(commentNode instanceof CommentNode).toBe(true);
		});
	});

	describe('createDocumentFragment()', () => {
		test('Creates a document fragment.', () => {
			const documentFragment = document.createDocumentFragment();
			expect(documentFragment.ownerDocument).toBe(document);
			expect(documentFragment instanceof DocumentFragment).toBe(true);
		});
	});

	describe('createTreeWalker()', () => {
		test('Creates a document fragment.', () => {
			const root = document.createElement('div');
			const whatToShow = 1;
			const filter = {
				acceptNode: node => {
					if (node === Node.ELEMENT_NODE) {
						return NodeFilter.FILTER_ACCEPT;
					}
					return NodeFilter.FILTER_REJECT;
				}
			};
			const treeWalker = document.createTreeWalker(root, whatToShow, filter);
			expect(treeWalker.root).toBe(root);
			expect(treeWalker.whatToShow).toBe(whatToShow);
			expect(treeWalker.filter).toBe(filter);
			expect(treeWalker instanceof TreeWalker).toBe(true);
		});
	});

	describe('createEvent()', () => {
		test('Creates a legacy event.', () => {
			const event = document.createEvent('Event');
			event.initEvent('click', true, true);
			expect(event.type).toBe('click');
			expect(event.bubbles).toBe(true);
			expect(event.cancelable).toBe(true);
			expect(event instanceof Event).toBe(true);
		});
	});

	describe('importNode()', () => {
		test('Creates a clone of a Node and sets the ownerDocument to be the current document.', () => {
			const node = new Window().document.createElement('div');
			const clone = <Element>document.importNode(node);
			expect(clone.tagName).toBe('DIV');
			expect(clone.ownerDocument).toBe(document);
			expect(clone instanceof HTMLElement).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		test('Clones the properties of the document when cloned.', () => {
			const child = document.createElement('div');
			child.className = 'className';

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}

			document.appendChild(child);

			const clone = document.cloneNode(false);
			const clone2 = document.cloneNode(true);
			expect(clone.defaultView).toBe(window);
			expect(clone.children).toEqual([]);
			expect(clone2.children.length).toBe(1);
			expect(clone2.children[0].outerHTML).toBe('<div class="className"></div>');
		});
	});
});
