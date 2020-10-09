import Window from '../../../../src/window/Window';
import CustomElement from '../../../CustomElement';
import HTMLElement from '../../../../src/nodes/basic/html-element/HTMLElement';
import TextNode from '../../../../src/nodes/basic/text-node/TextNode';
import CommentNode from '../../../../src/nodes/basic/comment-node/CommentNode';
import DocumentFragment from '../../../../src/nodes/basic/document-fragment/DocumentFragment';
import TreeWalker from '../../../../src/tree-walker/TreeWalker';
import Node from '../../../../src/nodes/basic/node/Node';
import Event from '../../../../src/event/Event';
import SVGSVGElement from '../../../../src/nodes/elements/svg/SVGSVGElement';
import NamespaceURI from '../../../../src/html-config/NamespaceURI';
import Attr from '../../../../src/attribute/Attr';

describe('Document', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('get nodeName()', () => {
		test('Returns "#document".', () => {
			expect(document.nodeName).toBe('#document');
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
			const filter = (node: Node): boolean => node instanceof Node;
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
			const clone = document.importNode(node);
			expect(clone.tagName).toBe('DIV');
			expect(clone.ownerDocument).toBe(document);
			expect(clone instanceof HTMLElement).toBe(true);
		});
	});
});
