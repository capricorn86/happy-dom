import Window from '../../../src/window/Window';
import XMLSerializer from '../../../src/xml-serializer/XMLSerializer';
import XMLParser from '../../../src/xml-parser/XMLParser';
import CustomElement from '../../CustomElement';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot';
import Document from '../../../src/nodes/document/Document';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement';
import Text from '../../../src/nodes/text/Text';
import DOMRect from '../../../src/nodes/element/DOMRect';
import Range from '../../../src/nodes/element/Range';
import NamespaceURI from '../../../src/config/NamespaceURI';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility';
import QuerySelector from '../../../src/query-selector/QuerySelector';
import ChildNodeUtility from '../../../src/nodes/child-node/ChildNodeUtility';
import NonDocumentChildNodeUtility from '../../../src/nodes/child-node/NonDocumentChildNodeUtility';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement';
import Node from '../../../src/nodes/node/Node';
import IHTMLCollection from '../../../src/nodes/element/IHTMLCollection';
import IElement from '../../../src/nodes/element/IElement';
import INodeList from '../../../src/nodes/node/INodeList';

const NAMESPACE_URI = 'https://test.test';

describe('Element', () => {
	let window: Window;
	let document: Document;
	let element: HTMLElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLElement>document.createElement('div');
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('children', () => {
		it('Returns nodes of type Element.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const textNode = document.createTextNode('text');
			element.appendChild(div1);
			element.appendChild(textNode);
			element.appendChild(div2);
			expect(element.children).toEqual([div1, div2]);
		});
	});

	describe('get id()', () => {
		it('Returns the element "id" attribute.', () => {
			element.setAttribute('id', 'id');
			expect(element.id).toBe('id');
		});
	});

	describe('set id()', () => {
		it('Sets the element "id" as an attribute.', () => {
			element.id = 'id';
			expect(element.getAttribute('id')).toBe('id');
		});
	});

	describe('get className()', () => {
		it('Returns the element "class" attribute.', () => {
			element.setAttribute('class', 'class');
			expect(element.className).toBe('class');
		});
	});

	describe('set id()', () => {
		it('Sets the element "class" as an attribute.', () => {
			element.className = 'class';
			expect(element.getAttribute('class')).toBe('class');
		});
	});

	describe('get namespaceURI()', () => {
		it('Returns the "namespaceURI" property of the element.', () => {
			expect(element.namespaceURI).toEqual(NamespaceURI.html);
		});
	});

	describe('get nodeName()', () => {
		it('Returns the "tagName" property of the element.', () => {
			expect(element.nodeName).toEqual('DIV');
		});
	});

	describe('get localName()', () => {
		it('Returns the "tagName" property of the element in lower case.', () => {
			expect(element.localName).toEqual('div');
		});
	});

	describe('get textContent()', () => {
		it('Returns text node data of children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');
			element.appendChild(div);
			element.appendChild(textNode2);
			div.appendChild(textNode1);
			expect(element.textContent).toBe('text1text2');
		});
	});

	describe('set textContent()', () => {
		it('Replaces child nodes with a text node.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			element.appendChild(div);
			element.appendChild(textNode1);
			element.appendChild(textNode2);

			element.textContent = 'new_text';

			expect(element.textContent).toBe('new_text');
			expect(element.childNodes.length).toBe(1);
			expect((<Text>element.childNodes[0]).textContent).toBe('new_text');
		});
	});

	describe('get innerHTML()', () => {
		it('Returns HTML of children as a concatenated string.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			jest.spyOn(XMLSerializer.prototype, 'serializeToString').mockImplementation(rootElement => {
				expect(rootElement).toBe(div);
				return 'EXPECTED_HTML';
			});

			expect(element.innerHTML).toBe('EXPECTED_HTML');
		});
	});

	describe('set innerHTML()', () => {
		it('Creates child nodes from provided HTML.', () => {
			const root = document.createElement('div');
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			element.appendChild(document.createElement('div'));
			div.appendChild(textNode);
			root.appendChild(div);

			jest.spyOn(XMLParser, 'parse').mockImplementation((parseDocument, html) => {
				expect(parseDocument).toBe(document);
				expect(html).toBe('SOME_HTML');
				return root;
			});
			element.innerHTML = 'SOME_HTML';

			expect(element.innerHTML).toBe('<div>text1</div>');
		});
	});

	describe('get innerHTML()', () => {
		it('Returns HTML of an elements children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');

			element.appendChild(div);
			element.appendChild(textNode1);

			expect(element.outerHTML).toBe('<div><div></div>text1</div>');
		});
	});

	describe('get outerHTML()', () => {
		it('Returns HTML of an element and its children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			div.appendChild(textNode);

			element.appendChild(div);

			expect(element.innerHTML).toBe('<div>text1</div>');
		});
	});

	describe('set outerHTML()', () => {
		it('Sets outer HTML of an element.', () => {
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			div.appendChild(textNode);

			element.appendChild(div);

			div.outerHTML = '<span>text2</span>';

			expect(element.innerHTML).toBe('<span>text2</span>');
		});
	});

	describe('get attributes()', () => {
		it('Returns all attributes as an object.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');
			element.setAttribute('key3', 'value3');

			expect(element.attributes).toEqual({
				'0': {
					name: 'key1',
					value: 'value1',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				'1': {
					name: 'key2',
					value: 'value2',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				'2': {
					name: 'key3',
					value: 'value3',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				key1: {
					name: 'key1',
					value: 'value1',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				key2: {
					name: 'key2',
					value: 'value2',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				key3: {
					name: 'key3',
					value: 'value3',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				length: 3
			});
		});
	});

	describe('get childElementCount()', () => {
		it('Returns child element count.', () => {
			document.appendChild(document.createElement('div'));
			document.appendChild(document.createTextNode('test'));
			expect(document.childElementCount).toEqual(2);
		});
	});

	describe('get firstElementChild()', () => {
		it('Returns first element child.', () => {
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
		it('Returns last element child.', () => {
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
		it('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
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
		it('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
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

	describe('insertAdjacentElement()', () => {
		it('Inserts a Node right before the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);

			const insertedNode = parent.insertAdjacentElement('beforebegin', newNode);

			expect(insertedNode).toBe(newNode);
			expect(parent.childNodes).toEqual([]);
			expect(insertedNode.isConnected).toBe(true);
			expect(document.body.childNodes[0]).toBe(newNode);
		});

		it('Returns with null if cannot insert with "beforebegin".', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');
			const insertedNode = parent.insertAdjacentElement('beforebegin', newNode);

			expect(insertedNode).toBe(null);
			expect(newNode.isConnected).toBe(false);
		});

		it('Inserts a Node inside the reference element before the first child and returns with it.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const newNode = document.createElement('span');

			parent.appendChild(child);

			document.body.appendChild(parent);

			const insertedNode = parent.insertAdjacentElement('afterbegin', newNode);

			expect(insertedNode).toBe(newNode);
			expect(parent.childNodes[0]).toBe(insertedNode);
			expect(insertedNode.isConnected).toBe(true);
		});

		it('Inserts a Node inside the reference element after the last child and returns with it.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const newNode = document.createElement('span');

			parent.appendChild(child);
			document.body.appendChild(parent);

			const insertedNode = parent.insertAdjacentElement('beforeend', newNode);

			expect(insertedNode).toBe(newNode);
			expect(parent.childNodes[1]).toBe(insertedNode);
			expect(insertedNode.isConnected).toBe(true);
		});

		it('Inserts a Node right after the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);

			const insertedNode = parent.insertAdjacentElement('afterend', newNode);

			expect(insertedNode).toBe(newNode);
			expect(parent.childNodes).toEqual([]);
			expect(insertedNode.isConnected).toBe(true);

			expect(document.body.childNodes[0]).toBe(parent);
			expect(document.body.childNodes[1]).toBe(insertedNode);
		});

		it('Inserts a Node right after the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);
			document.body.appendChild(sibling);

			const insertedNode = parent.insertAdjacentElement('afterend', newNode);

			expect(insertedNode).toBe(newNode);
			expect(parent.childNodes).toEqual([]);
			expect(newNode.isConnected).toBe(true);

			expect(document.body.childNodes[0]).toBe(parent);
			expect(document.body.childNodes[1]).toBe(insertedNode);
			expect(document.body.childNodes[2]).toBe(sibling);
		});

		it('Returns with null if cannot insert with "afterend".', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');
			const insertedNode = parent.insertAdjacentElement('afterend', newNode);

			expect(insertedNode).toBe(null);
			expect(newNode.isConnected).toBe(false);
		});
	});

	describe('insertAdjacentHTML()', () => {
		it('Inserts the given HTML right before the reference element.', () => {
			const parent = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			parent.insertAdjacentHTML('beforebegin', markup);

			expect(parent.childNodes).toEqual([]);
			expect((<IElement>document.body.childNodes[0]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML inside the reference element before the first child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const markup = '<span>markup</span>';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterbegin', markup);

			expect((<IElement>parent.childNodes[0]).outerHTML).toEqual(markup);
			expect(parent.childNodes[1]).toBe(child);
		});

		it('Inserts the given HTML inside the reference element after the last child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const markup = '<span>markup</span>';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentHTML('beforeend', markup);

			expect(parent.childNodes[0]).toBe(child);
			expect((<IElement>parent.childNodes[1]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML right after the reference element.', () => {
			const parent = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0]).toBe(parent);
			expect((<IElement>document.body.childNodes[1]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML right after the reference element if it has a sibling.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			document.body.appendChild(sibling);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0]).toBe(parent);
			expect((<IElement>document.body.childNodes[1]).outerHTML).toEqual(markup);
			expect(document.body.childNodes[2]).toBe(sibling);
		});
	});

	describe('insertAdjacentText()', () => {
		it('Inserts the given text right before the reference element.', () => {
			const parent = document.createElement('div');
			const text = 'lorem';

			document.body.appendChild(parent);
			parent.insertAdjacentText('beforebegin', text);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
			expect(document.body.childNodes[0].textContent).toEqual(text);
		});

		it('Inserts the given text inside the reference element before the first child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const text = 'lorem';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentText('afterbegin', text);

			expect(parent.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
			expect(parent.childNodes[0].textContent).toEqual(text);
			expect(parent.childNodes[1]).toBe(child);
		});

		it('Inserts the given text inside the reference element after the last child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const text = 'lorem';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentText('beforeend', text);

			expect(parent.childNodes[0]).toBe(child);
			expect(parent.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
			expect(parent.childNodes[1].textContent).toEqual(text);
		});

		it('Inserts the given text right after the reference element.', () => {
			const parent = document.createElement('div');
			const text = 'lorem';

			document.body.appendChild(parent);
			parent.insertAdjacentText('afterend', text);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0]).toBe(parent);
			expect(document.body.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
			expect(document.body.childNodes[1].textContent).toEqual(text);
		});

		it('Inserts the given text right after the reference element.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');
			const text = 'lorem';

			document.body.appendChild(parent);
			document.body.appendChild(sibling);
			parent.insertAdjacentText('afterend', text);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0]).toBe(parent);
			expect(document.body.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
			expect(document.body.childNodes[1].textContent).toEqual(text);
			expect(document.body.childNodes[2]).toBe(sibling);
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
					expect(parentNode).toBe(document);
					expect(nodes).toEqual([node1, node2]);
					isCalled = true;
				});

			document.replaceChildren(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('matches()', () => {
		it('Checks if the element matches a selector string.', () => {
			const element = document.createElement('div');

			element.className = 'container active';

			expect(element.matches('.container.active')).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		it('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(expectedSelector);
				return <INodeList<IElement>>[element];
			});

			expect(document.querySelectorAll(expectedSelector)).toEqual([element]);
		});
	});

	describe('querySelector()', () => {
		it('Query CSS selector to find a matching element.', () => {
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
		it('Returns an elements by class name.', () => {
			const child = document.createElement('div');
			const className = 'className';

			jest
				.spyOn(ParentNodeUtility, 'getElementsByClassName')
				.mockImplementation((parentNode, requestedClassName) => {
					expect(parentNode).toBe(element);
					expect(requestedClassName).toEqual(className);
					return <IHTMLCollection<IElement>>[child];
				});

			expect(element.getElementsByClassName(className)).toEqual([child]);
		});
	});

	describe('getElementsByTagName()', () => {
		it('Returns an elements by tag name.', () => {
			const child = document.createElement('div');
			const tagName = 'tag-name';

			jest
				.spyOn(ParentNodeUtility, 'getElementsByTagName')
				.mockImplementation((parentNode, requestedTagName) => {
					expect(parentNode).toBe(element);
					expect(requestedTagName).toEqual(tagName);
					return <IHTMLCollection<IElement>>[child];
				});

			expect(element.getElementsByTagName(tagName)).toEqual([child]);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		it('Returns an elements by tag name and namespace.', () => {
			const child = document.createElement('div');
			const tagName = 'tag-name';
			const namespaceURI = '/namespace/uri/';

			jest
				.spyOn(ParentNodeUtility, 'getElementsByTagNameNS')
				.mockImplementation((parentNode, requestedNamespaceURI, requestedTagName) => {
					expect(parentNode).toBe(element);
					expect(requestedNamespaceURI).toEqual(namespaceURI);
					expect(requestedTagName).toEqual(tagName);
					return <IHTMLCollection<IElement>>[child];
				});

			expect(element.getElementsByTagNameNS(namespaceURI, tagName)).toEqual([child]);
		});
	});

	describe('remove()', () => {
		it('Removes the node from its parent.', () => {
			const element = document.createElement('div');
			let isCalled = false;

			jest.spyOn(ChildNodeUtility, 'remove').mockImplementation(childNode => {
				expect(childNode).toBe(element);
				isCalled = true;
			});

			element.remove();
			expect(isCalled).toBe(true);
		});
	});

	describe('replaceWith()', () => {
		it('Replaces a Node in the children list of its parent with a set of Node or DOMString objects.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ChildNodeUtility, 'replaceWith').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(element);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			element.replaceWith(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('before()', () => {
		it("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ChildNodeUtility, 'before').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(element);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			element.before(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('after()', () => {
		it("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ChildNodeUtility, 'after').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(element);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			element.after(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('appendChild()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			element.appendChild(document.createComment('test'));
			element.appendChild(div);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);

			expect(element.children).toEqual([div, span]);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the children instead of the actual element if the type is DocumentFragment.', () => {
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const clone = template.content.cloneNode(true);

			element.appendChild(clone);

			expect(clone.childNodes).toEqual([]);
			expect(clone.children).toEqual([]);
			expect(element.innerHTML).toBe('<div>Div</div><span>Span</span>');
		});
	});

	describe('removeChild()', () => {
		it('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			element.appendChild(document.createComment('test'));
			element.appendChild(div);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);

			element.removeChild(div);

			expect(element.children).toEqual([span]);
		});
	});

	describe('insertBefore()', () => {
		it('Updates the children property when appending an element child.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const span = document.createElement('span');

			element.appendChild(document.createComment('test'));
			element.appendChild(div1);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);
			element.insertBefore(div2, div1);

			expect(element.children).toEqual([div2, div1, span]);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Insert the children instead of the actual element before another reference Node if the type is DocumentFragment.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Template DIV 1</div><span>Template SPAN 1</span>';

			const clone = template.content.cloneNode(true);

			element.appendChild(child1);
			element.appendChild(child2);

			element.insertBefore(clone, child2);

			expect(element.children.length).toBe(4);
			expect(element.innerHTML).toEqual(
				'<span></span><div>Template DIV 1</div><span>Template SPAN 1</span><span></span>'
			);
		});
	});

	describe('get previousElementSibling()', () => {
		it('Returns previous element sibling..', () => {
			const node = document.createComment('test');
			const previousElementSibling = document.createElement('div');
			jest
				.spyOn(NonDocumentChildNodeUtility, 'previousElementSibling')
				.mockImplementation(childNode => {
					expect(childNode).toBe(node);
					return previousElementSibling;
				});

			expect(node.previousElementSibling).toBe(previousElementSibling);
		});
	});

	describe('get nextElementSibling()', () => {
		it('Returns next element sibling..', () => {
			const node = document.createComment('test');
			const nextElementSibling = document.createElement('div');
			jest
				.spyOn(NonDocumentChildNodeUtility, 'nextElementSibling')
				.mockImplementation(childNode => {
					expect(childNode).toBe(node);
					return nextElementSibling;
				});

			expect(node.nextElementSibling).toBe(nextElementSibling);
		});
	});

	describe('attributeChangedCallback()', () => {
		it('Calls attribute changed callback when it is implemented by a custom element (web component).', () => {
			const customElement = <CustomElement>document.createElement('custom-element');

			element.appendChild(customElement);
			document.body.appendChild(element);

			customElement.setAttribute('key1', 'value1');
			customElement.setAttribute('key2', 'value2');
			customElement.setAttribute('KEY1', 'newValue');

			expect(customElement.changedAttributes).toEqual([
				{
					name: 'key1',
					newValue: 'value1',
					oldValue: null
				},
				{
					name: 'key2',
					newValue: 'value2',
					oldValue: null
				},
				{
					name: 'key1',
					newValue: 'newValue',
					oldValue: 'value1'
				}
			]);
		});

		it('Does not call the attribute changed callback when the attribute name is not available in the observedAttributes() getter method.', () => {
			const customElement = <CustomElement>document.createElement('custom-element');

			element.appendChild(customElement);
			document.body.appendChild(element);

			customElement.setAttribute('k1', 'value1');
			customElement.setAttribute('k2', 'value2');

			expect(customElement.changedAttributes).toEqual([]);
		});
	});

	describe('setAttribute()', () => {
		it('Sets an attribute on an element.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.attributes).toEqual({
				'0': {
					name: 'key1',
					value: 'value1',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				'1': {
					name: 'key2',
					value: '',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				key1: {
					name: 'key1',
					value: 'value1',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				key2: {
					name: 'key2',
					value: '',
					namespaceURI: null,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				length: 2
			});
		});
	});

	describe('setAttributeNS()', () => {
		it('Sets a namespace attribute on an element.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local1', 'value1');
			element.setAttributeNS(NAMESPACE_URI, 'global:local2', '');
			expect(element.attributes).toEqual({
				'0': {
					name: 'global:local1',
					value: 'value1',
					namespaceURI: NAMESPACE_URI,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				'1': {
					name: 'global:local2',
					value: '',
					namespaceURI: NAMESPACE_URI,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				'global:local1': {
					name: 'global:local1',
					value: 'value1',
					namespaceURI: NAMESPACE_URI,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				'global:local2': {
					name: 'global:local2',
					value: '',
					namespaceURI: NAMESPACE_URI,
					specified: true,
					ownerElement: element,
					ownerDocument: document
				},
				length: 2
			});
		});
	});

	describe('getAttributeNames()', () => {
		it('Returns attribute names.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local1', 'value1');
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.getAttributeNames()).toEqual(['global:local1', 'key1', 'key2']);
		});
	});

	describe('hasAttribute()', () => {
		it('Returns "true" if an element has an attribute.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.hasAttribute('key1')).toBe(true);
			expect(element.hasAttribute('key2')).toBe(true);
			element.removeAttribute('key1');
			element.removeAttribute('key2');
			expect(element.hasAttribute('key1')).toBe(false);
			expect(element.hasAttribute('key2')).toBe(false);
		});
	});

	describe('hasAttributeNS()', () => {
		it('Returns "true" if an element has a namespace attribute.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local1', 'value1');
			element.setAttributeNS(NAMESPACE_URI, 'global:local2', '');
			expect(element.hasAttributeNS(NAMESPACE_URI, 'local1')).toBe(true);
			expect(element.hasAttributeNS(NAMESPACE_URI, 'local2')).toBe(true);
			element.removeAttributeNS(NAMESPACE_URI, 'local1');
			element.removeAttributeNS(NAMESPACE_URI, 'local2');
			expect(element.hasAttributeNS(NAMESPACE_URI, 'local1')).toBe(false);
			expect(element.hasAttributeNS(NAMESPACE_URI, 'local2')).toBe(false);
		});
	});

	describe('removeAttribute()', () => {
		it('Removes an attribute.', () => {
			element.setAttribute('key1', 'value1');
			element.removeAttribute('key1');
			expect(element.attributes).toEqual({
				length: 0
			});
		});
	});

	describe('removeAttributeNS()', () => {
		it('Removes a namespace attribute.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local', 'value');
			element.removeAttributeNS(NAMESPACE_URI, 'local');
			expect(element.attributes).toEqual({
				length: 0
			});
		});
	});

	describe('attachShadow()', () => {
		it('Creates a new ShadowRoot node and sets it to the shadowRoot property.', () => {
			element.attachShadow({ mode: 'open' });
			expect(element.shadowRoot instanceof ShadowRoot).toBe(true);
			expect(element.shadowRoot.ownerDocument).toBe(document);
			expect(element.shadowRoot.isConnected).toBe(false);
			document.appendChild(element);
			expect(element.shadowRoot.isConnected).toBe(true);
		});
	});

	for (const functionName of ['scroll', 'scrollTo']) {
		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft.', () => {
				element[functionName](50, 60);
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft using object.', () => {
				element[functionName]({ left: 50, top: 60 });
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets only the property scrollTop.', () => {
				element[functionName]({ top: 60 });
				expect(element.scrollLeft).toBe(0);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets only the property scrollLeft.', () => {
				element[functionName]({ left: 60 });
				expect(element.scrollLeft).toBe(60);
				expect(element.scrollTop).toBe(0);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft with animation.', async () => {
				element[functionName]({ left: 50, top: 60, behavior: 'smooth' });
				expect(element.scrollLeft).toBe(0);
				expect(element.scrollTop).toBe(0);
				await window.happyDOM.whenAsyncComplete();
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});
	}

	describe('toString()', () => {
		it('Returns the same as outerHTML.', () => {
			expect(element.toString()).toBe(element.outerHTML);
		});
	});

	describe('getBoundingClientRect()', () => {
		it('Returns an instance of DOMRect.', () => {
			const domRect = element.getBoundingClientRect();
			expect(domRect instanceof DOMRect).toBe(true);
		});
	});

	describe('createTextRange()', () => {
		it('Returns an instance of Range.', () => {
			const range = element.createTextRange();
			expect(range instanceof Range).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		it('Clones the properties of the element when cloned.', () => {
			const child = document.createElement('div');

			child.className = 'className';

			element.tagName = 'tagName';
			(<number>element.scrollLeft) = 10;
			(<number>element.scrollTop) = 10;

			// @ts-ignore
			element.namespaceURI = 'namespaceURI';

			element.appendChild(child);

			const clone = element.cloneNode(false);
			const clone2 = element.cloneNode(true);
			expect(clone.tagName).toBe('tagName');
			expect(clone.scrollLeft).toBe(10);
			expect(clone.scrollTop).toBe(10);
			expect(clone.namespaceURI).toBe('namespaceURI');
			expect(clone.children).toEqual([]);
			expect(clone2.children.length).toBe(1);
			expect(clone2.children[0].outerHTML).toBe('<div class="className"></div>');
		});
	});

	for (const method of ['setAttributeNode', 'setAttributeNodeNS']) {
		describe(`${method}()`, () => {
			it('Sets an Attr node on a <div> element.', () => {
				const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
				const attribute2 = document.createAttribute('KEY2');

				attribute1.value = 'value1';
				attribute2.value = 'value2';

				element[method](attribute1);
				element[method](attribute2);

				expect(element.attributes).toEqual({
					'0': {
						name: 'key1',
						namespaceURI: NamespaceURI.svg,
						value: 'value1',
						specified: true,
						ownerElement: element,
						ownerDocument: document
					},
					'1': {
						name: 'key2',
						namespaceURI: null,
						value: 'value2',
						specified: true,
						ownerElement: element,
						ownerDocument: document
					},
					key1: {
						name: 'key1',
						namespaceURI: NamespaceURI.svg,
						value: 'value1',
						specified: true,
						ownerElement: element,
						ownerDocument: document
					},
					key2: {
						name: 'key2',
						namespaceURI: null,
						value: 'value2',
						specified: true,
						ownerElement: element,
						ownerDocument: document
					},
					length: 2
				});
			});

			it('Sets an Attr node on an <svg> element.', () => {
				const svg = document.createElementNS(NamespaceURI.svg, 'svg');
				const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
				const attribute2 = document.createAttribute('KEY2');

				attribute1.value = 'value1';
				attribute2.value = 'value2';

				svg[method](attribute1);
				svg[method](attribute2);

				expect(svg.attributes).toEqual({
					'0': {
						name: 'KEY1',
						namespaceURI: NamespaceURI.svg,
						value: 'value1',
						specified: true,
						ownerElement: svg,
						ownerDocument: document
					},
					'1': {
						name: 'key2',
						namespaceURI: null,
						value: 'value2',
						specified: true,
						ownerElement: svg,
						ownerDocument: document
					},
					KEY1: {
						name: 'KEY1',
						namespaceURI: NamespaceURI.svg,
						value: 'value1',
						specified: true,
						ownerElement: svg,
						ownerDocument: document
					},
					key2: {
						name: 'key2',
						namespaceURI: null,
						value: 'value2',
						specified: true,
						ownerElement: svg,
						ownerDocument: document
					},
					length: 2
				});
			});
		});
	}

	describe(`getAttributeNode()`, () => {
		it('Returns an Attr node from a <div> element.', () => {
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			const attribute2 = document.createAttribute('KEY2');

			attribute1.value = 'value1';
			attribute2.value = 'value2';

			element.setAttributeNode(attribute1);
			element.setAttributeNode(attribute2);

			expect(element.getAttributeNode('key1')).toBe(attribute1);
			expect(element.getAttributeNode('key2')).toBe(attribute2);
			expect(element.getAttributeNode('KEY1')).toBe(attribute1);
			expect(element.getAttributeNode('KEY2')).toBe(attribute2);
		});

		it('Returns an Attr node from an <svg> element.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			const attribute2 = document.createAttribute('KEY2');

			attribute1.value = 'value1';
			attribute2.value = 'value2';

			svg.setAttributeNode(attribute1);
			svg.setAttributeNode(attribute2);

			expect(svg.getAttributeNode('key1')).toBe(null);
			expect(svg.getAttributeNode('key2')).toBe(attribute2);
			expect(svg.getAttributeNode('KEY1')).toBe(attribute1);
			expect(svg.getAttributeNode('KEY2')).toBe(null);
		});
	});

	describe(`getAttributeNode()`, () => {
		it('Returns a namespaced Attr node from a <div> element.', () => {
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');

			attribute1.value = 'value1';

			element.setAttributeNode(attribute1);

			expect(element.getAttributeNodeNS(NamespaceURI.svg, 'key1')).toBe(attribute1);
			expect(element.getAttributeNodeNS(NamespaceURI.svg, 'KEY1')).toBe(attribute1);
		});

		it('Returns an Attr node from an <svg> element.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');

			attribute1.value = 'value1';

			svg.setAttributeNode(attribute1);

			expect(svg.getAttributeNodeNS(NamespaceURI.svg, 'key1')).toBe(null);
			expect(svg.getAttributeNodeNS(NamespaceURI.svg, 'KEY1')).toBe(attribute1);
			expect(svg.getAttributeNodeNS(NamespaceURI.svg, 'KEY2')).toBe(null);
		});
	});

	for (const method of ['removeAttributeNode', 'removeAttributeNodeNS']) {
		describe(`${method}()`, () => {
			it('Removes an Attr node.', () => {
				const attribute = document.createAttribute('KEY1');

				attribute.value = 'value1';
				element.setAttributeNode(attribute);
				element[method](attribute);

				expect(element.attributes).toEqual({ length: 0 });
			});
		});
	}

	describe('replaceWith()', () => {
		it('Replaces a node with another node.', () => {
			const parent = document.createElement('div');
			const newChild = document.createElement('span');
			newChild.className = 'child4';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			parent.children[2].replaceWith(newChild);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span>'
			);
		});

		it('Replaces a node with a mixed list of Node and DOMString (string).', () => {
			const parent = document.createElement('div');
			const newChildrenParent = document.createElement('div');
			const newChildrenHtml =
				'<span class="child4"></span><span class="child5"></span><span class="child6"></span>';
			newChildrenParent.innerHTML =
				'<span class="child7"></span><span class="child8"></span><span class="child9"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			parent.children[2].replaceWith(...[newChildrenHtml, ...newChildrenParent.children]);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span><span class="child4"></span><span class="child5"></span><span class="child6"></span><span class="child7"></span><span class="child8"></span><span class="child9"></span>'
			);
		});
	});

	describe('scroll()', () => {
		it('Sets the properties "scrollTop" and "scrollLeft".', () => {
			const div = document.createElement('div');
			div.scroll(10, 15);
			expect(div.scrollLeft).toBe(10);
			expect(div.scrollTop).toBe(15);
		});
	});
});
