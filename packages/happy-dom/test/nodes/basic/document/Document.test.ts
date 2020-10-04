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
			expect(div instanceof HTMLElement).toBe(true);
		});

		test('Creates an svg element.', () => {
			const div = document.createElement('svg');
			expect(div.tagName).toBe('SVG');
			expect(div instanceof SVGSVGElement).toBe(true);
		});

		test('Creates a custom element.', () => {
			window.customElements.define('custom-element', CustomElement);
			const div = document.createElement('custom-element');
			expect(div.tagName).toBe('CUSTOM-ELEMENT');
			expect(div instanceof HTMLElement).toBe(true);
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
