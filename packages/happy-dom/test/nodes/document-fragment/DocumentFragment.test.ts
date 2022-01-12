import Window from '../../../src/window/Window';
import Node from '../../../src/nodes/node/Node';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility';
import QuerySelector from '../../../src/query-selector/QuerySelector';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement';
import Text from '../../../src/nodes/text/Text';
import INodeList from '../../../src/nodes/node/INodeList';
import IElement from '../../../src/nodes/element/IElement';

describe('DocumentFragment', () => {
	let window;
	let document;
	let documentFragment;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		documentFragment = document.createDocumentFragment();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get children()', () => {
		it('Returns Element child nodes.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.children).toEqual([div, span]);
		});
	});

	describe('get childElementCount()', () => {
		it('Returns child element count.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.childElementCount).toEqual(2);
		});
	});

	describe('get firstElementChild()', () => {
		it('Returns first element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.firstElementChild).toEqual(div);
		});
	});

	describe('get lastElementChild()', () => {
		it('Returns last element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createTextNode('test'));
			documentFragment.appendChild(span);
			expect(documentFragment.lastElementChild).toEqual(span);
		});
	});

	describe('get textContent()', () => {
		it('Returns text node data of children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');
			documentFragment.appendChild(div);
			documentFragment.appendChild(textNode2);
			div.appendChild(textNode1);
			expect(documentFragment.textContent).toBe('text1text2');
		});
	});

	describe('set textContent()', () => {
		it('Replaces child nodes with a text node.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			documentFragment.appendChild(div);
			documentFragment.appendChild(textNode1);
			documentFragment.appendChild(textNode2);

			documentFragment.textContent = 'new_text';

			expect(documentFragment.textContent).toBe('new_text');
			expect(documentFragment.childNodes.length).toBe(1);
			expect((<Text>documentFragment.childNodes[0]).textContent).toBe('new_text');
		});

		it('Removes all child nodes if textContent is set to empty string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			documentFragment.appendChild(div);
			documentFragment.appendChild(textNode1);
			documentFragment.appendChild(textNode2);

			documentFragment.textContent = '';

			expect(documentFragment.childNodes.length).toBe(0);
		});
	});

	describe('append()', () => {
		it('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode).toBe(documentFragment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			documentFragment.append(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('prepend()', () => {
		it('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'prepend').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode).toBe(documentFragment);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			documentFragment.prepend(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceChildren()', () => {
		it('Replaces the existing children of a ParentNode with a specified new set of children.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest
				.spyOn(ParentNodeUtility, 'replaceChildren')
				.mockImplementation((parentNode, ...nodes) => {
					expect(parentNode).toBe(documentFragment);
					expect(nodes).toEqual([node1, node2]);
					isCalled = true;
				});

			documentFragment.replaceChildren(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		it('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(documentFragment);
				expect(selector).toEqual(expectedSelector);
				return <INodeList<IElement>>[element];
			});

			expect(documentFragment.querySelectorAll(expectedSelector)).toEqual([element]);
		});
	});

	describe('querySelector()', () => {
		it('Query CSS selector to find a matching element.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(documentFragment);
				expect(selector).toEqual(expectedSelector);
				return element;
			});

			expect(documentFragment.querySelector(expectedSelector)).toEqual(element);
		});
	});

	describe('appendChild()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(span);

			expect(documentFragment.children).toEqual([div, span]);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the children instead of the actual element if the type is DocumentFragment.', () => {
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const clone = template.content.cloneNode(true);

			documentFragment.appendChild(clone);

			expect(clone.childNodes).toEqual([]);
			expect(clone.children).toEqual([]);
			expect(documentFragment.children.map(child => child.outerHTML).join('')).toBe(
				'<div>Div</div><span>Span</span>'
			);
		});
	});

	describe('removeChild()', () => {
		it('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(div);
			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(span);

			documentFragment.removeChild(div);

			expect(documentFragment.children).toEqual([span]);
		});
	});

	describe('insertBefore()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');

			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(div1);
			documentFragment.appendChild(document.createComment('test'));
			documentFragment.appendChild(span);
			documentFragment.insertBefore(div2, div1);

			expect(documentFragment.children).toEqual([div2, div1, span]);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Insert the children instead of the actual element before another reference Node if the type is DocumentFragment.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Template DIV 1</div><span>Template SPAN 1</span>';

			const clone = template.content.cloneNode(true);

			documentFragment.appendChild(child1);
			documentFragment.appendChild(child2);

			documentFragment.insertBefore(clone, child2);

			expect(documentFragment.children.length).toBe(4);
			expect(documentFragment.children.map(child => child.outerHTML).join('')).toEqual(
				'<span></span><div>Template DIV 1</div><span>Template SPAN 1</span><span></span>'
			);
		});
	});

	describe('cloneNode', () => {
		it('Makes a shallow clone of a node (default behavior).', () => {
			const text = document.createTextNode('test');
			const div = document.createElement('div');
			const comment = document.createComment('test');

			documentFragment.appendChild(text);
			documentFragment.appendChild(div);
			documentFragment.appendChild(comment);

			const clone = documentFragment.cloneNode(false);

			expect(clone.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
			expect(clone._rootNode).toBe(clone);
			expect(clone.childNodes.length).toBe(0);
			expect(clone.children.length).toBe(0);
		});

		it('Makes a deep clone of the document fragment.', () => {
			const text = document.createTextNode('test');
			const div = document.createElement('div');
			const comment = document.createComment('test');

			documentFragment.appendChild(text);
			documentFragment.appendChild(div);
			documentFragment.appendChild(comment);

			const clone = documentFragment.cloneNode(true);

			expect(clone.nodeType).toBe(Node.DOCUMENT_FRAGMENT_NODE);
			expect(clone._rootNode).toBe(clone);
			expect(clone.childNodes.length).toBe(3);
			expect(clone.children).toEqual(
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		});
	});
});
