import AsyncWindow from '../../../src/window/AsyncWindow';
import XMLSerializer from '../../../src/xml-serializer/XMLSerializer';
import XMLParser from '../../../src/xml-parser/XMLParser';
import CustomElement from '../../CustomElement';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot';
import Document from '../../../src/nodes/document/Document';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement';
import TextNode from '../../../src/nodes/text-node/TextNode';
import DOMRect from '../../../src/nodes/element/DOMRect';
import Range from '../../../src/nodes/element/Range';
import NamespaceURI from '../../../src/config/NamespaceURI';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility';
import QuerySelector from '../../../src/query-selector/QuerySelector';
import ChildNodeUtility from '../../../src/nodes/child-node/ChildNodeUtility';
import NonDocumentChildNodeUtility from '../../../src/nodes/child-node/NonDocumentChildNodeUtility';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement';

const NAMESPACE_URI = 'https://test.test';

describe('Element', () => {
	let window: AsyncWindow;
	let document: Document;
	let element: HTMLElement;

	beforeEach(() => {
		window = new AsyncWindow();
		document = window.document;
		element = <HTMLElement>document.createElement('div');
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('children', () => {
		test('Returns nodes of type Element.', () => {
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
		test('Returns the element "id" attribute.', () => {
			element.setAttribute('id', 'id');
			expect(element.id).toBe('id');
		});
	});

	describe('set id()', () => {
		test('Sets the element "id" as an attribute.', () => {
			element.id = 'id';
			expect(element.getAttribute('id')).toBe('id');
		});
	});

	describe('get className()', () => {
		test('Returns the element "class" attribute.', () => {
			element.setAttribute('class', 'class');
			expect(element.className).toBe('class');
		});
	});

	describe('set id()', () => {
		test('Sets the element "class" as an attribute.', () => {
			element.className = 'class';
			expect(element.getAttribute('class')).toBe('class');
		});
	});

	describe('get namespaceURI()', () => {
		test('Returns the "namespaceURI" property of the element.', () => {
			expect(element.namespaceURI).toEqual(NamespaceURI.html);
		});
	});

	describe('get nodeName()', () => {
		test('Returns the "tagName" property of the element.', () => {
			expect(element.nodeName).toEqual('DIV');
		});
	});

	describe('get localName()', () => {
		test('Returns the "tagName" property of the element in lower case.', () => {
			expect(element.localName).toEqual('div');
		});
	});

	describe('get textContent()', () => {
		test('Returns text node data of children as a concatenated string.', () => {
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
		test('Replaces child nodes with a text node.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			element.appendChild(div);
			element.appendChild(textNode1);
			element.appendChild(textNode2);

			element.textContent = 'new_text';

			expect(element.textContent).toBe('new_text');
			expect(element.childNodes.length).toBe(1);
			expect((<TextNode>element.childNodes[0]).textContent).toBe('new_text');
		});
	});

	describe('get innerHTML()', () => {
		test('Returns HTML of children as a concatenated string.', () => {
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
		test('Creates child nodes from provided HTML.', () => {
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
		test('Returns HTML of an elements children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');

			element.appendChild(div);
			element.appendChild(textNode1);

			expect(element.outerHTML).toBe('<div><div></div>text1</div>');
		});
	});

	describe('get outerHTML()', () => {
		test('Returns HTML of an element and its children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			div.appendChild(textNode);

			element.appendChild(div);

			expect(element.innerHTML).toBe('<div>text1</div>');
		});
	});

	describe('set outerHTML()', () => {
		test('Sets outer HTML of an element.', () => {
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			div.appendChild(textNode);

			element.appendChild(div);

			div.outerHTML = '<span>text2</span>';

			expect(element.innerHTML).toBe('<span>text2</span>');
		});
	});

	describe('get attributes()', () => {
		test('Returns all attributes as an object.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', 'value2');
			element.setAttribute('key3', 'value3');

			expect(element.attributes).toEqual({
				'0': { name: 'key1', value: 'value1', namespaceURI: null },
				'1': { name: 'key2', value: 'value2', namespaceURI: null },
				'2': { name: 'key3', value: 'value3', namespaceURI: null },
				key1: { name: 'key1', value: 'value1', namespaceURI: null },
				key2: { name: 'key2', value: 'value2', namespaceURI: null },
				key3: { name: 'key3', value: 'value3', namespaceURI: null },
				length: 3
			});
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

	describe('matches()', () => {
		test('Checks if the element matches a selector string.', () => {
			const element = document.createElement('div');

			element.className = 'container active';

			expect(element.matches('.container.active')).toBe(true);
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

			(<string>element1.namespaceURI) = '/namespace/';

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

	describe('remove()', () => {
		test('Removes the node from its parent.', () => {
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
		test('Replaces a Node in the children list of its parent with a set of Node or DOMString objects.', () => {
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
		test("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
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
		test("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just after this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
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
		test('Updates the children property when appending an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			element.appendChild(document.createComment('test'));
			element.appendChild(div);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);

			expect(element.children).toEqual([div, span]);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		test('Append the children instead of the actual element if the type is DocumentFragment.', () => {
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
		test('Updates the children property when removing an element child.', () => {
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
		test('Updates the children property when appending an element child.', () => {
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
		test('Insert the children instead of the actual element before another reference Node if the type is DocumentFragment.', () => {
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
		test('Returns previous element sibling..', () => {
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
		test('Returns next element sibling..', () => {
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
		test('Calls attribute changed callback when it is implemented by a custom element (web component).', () => {
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

		test('Does not call the attribute changed callback when the attribute name is not available in the observedAttributes() getter method.', () => {
			const customElement = <CustomElement>document.createElement('custom-element');

			element.appendChild(customElement);
			document.body.appendChild(element);

			customElement.setAttribute('k1', 'value1');
			customElement.setAttribute('k2', 'value2');

			expect(customElement.changedAttributes).toEqual([]);
		});
	});

	describe('setAttribute()', () => {
		test('Sets an attribute on an element.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.attributes).toEqual({
				'0': { name: 'key1', value: 'value1', namespaceURI: null },
				'1': { name: 'key2', value: '', namespaceURI: null },
				key1: { name: 'key1', value: 'value1', namespaceURI: null },
				key2: { name: 'key2', value: '', namespaceURI: null },
				length: 2
			});
		});
	});

	describe('setAttributeNS()', () => {
		test('Sets a namespace attribute on an element.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local1', 'value1');
			element.setAttributeNS(NAMESPACE_URI, 'global:local2', '');
			expect(element.attributes).toEqual({
				'0': { name: 'global:local1', value: 'value1', namespaceURI: NAMESPACE_URI },
				'1': { name: 'global:local2', value: '', namespaceURI: NAMESPACE_URI },
				'global:local1': { name: 'global:local1', value: 'value1', namespaceURI: NAMESPACE_URI },
				'global:local2': { name: 'global:local2', value: '', namespaceURI: NAMESPACE_URI },
				length: 2
			});
		});
	});

	describe('hasAttribute()', () => {
		test('Returns "true" if an element has an attribute.', () => {
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
		test('Returns "true" if an element has a namespace attribute.', () => {
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
		test('Removes an attribute.', () => {
			element.setAttribute('key1', 'value1');
			element.removeAttribute('key1');
			expect(element.attributes).toEqual({
				length: 0
			});
		});
	});

	describe('removeAttributeNS()', () => {
		test('Removes a namespace attribute.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local', 'value');
			element.removeAttributeNS(NAMESPACE_URI, 'local');
			expect(element.attributes).toEqual({
				length: 0
			});
		});
	});

	describe('attachShadow()', () => {
		test('Creates a new ShadowRoot node and sets it to the shadowRoot property.', () => {
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
			test('Sets the properties scrollTop and scrollLeft.', () => {
				element[functionName](50, 60);
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			test('Sets the properties scrollTop and scrollLeft using object.', () => {
				element[functionName]({ left: 50, top: 60 });
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			test('Sets only the property scrollTop.', () => {
				element[functionName]({ top: 60 });
				expect(element.scrollLeft).toBe(0);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			test('Sets only the property scrollLeft.', () => {
				element[functionName]({ left: 60 });
				expect(element.scrollLeft).toBe(60);
				expect(element.scrollTop).toBe(0);
			});
		});

		describe(`${functionName}()`, () => {
			test('Sets the properties scrollTop and scrollLeft with animation.', async () => {
				element[functionName]({ left: 50, top: 60, behavior: 'smooth' });
				expect(element.scrollLeft).toBe(0);
				expect(element.scrollTop).toBe(0);
				await window.whenAsyncComplete();
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});
	}

	describe('toString()', () => {
		test('Returns the same as outerHTML.', () => {
			expect(element.toString()).toBe(element.outerHTML);
		});
	});

	describe('getBoundingClientRect()', () => {
		test('Returns an instance of DOMRect.', () => {
			const domRect = element.getBoundingClientRect();
			expect(domRect instanceof DOMRect).toBe(true);
		});
	});

	describe('createTextRange()', () => {
		test('Returns an instance of Range.', () => {
			const range = element.createTextRange();
			expect(range instanceof Range).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		test('Clones the properties of the element when cloned.', () => {
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

	describe('setAttributeNode()', () => {
		test('Sets an Attr node on a <div> element.', () => {
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			const attribute2 = document.createAttribute('KEY2');

			attribute1.value = 'value1';
			attribute2.value = 'value2';

			element.setAttributeNode(attribute1);
			element.setAttributeNode(attribute2);

			expect(element.attributes).toEqual({
				'0': {
					name: 'key1',
					namespaceURI: NamespaceURI.svg,
					value: 'value1'
				},
				'1': {
					name: 'key2',
					namespaceURI: null,
					value: 'value2'
				},
				key1: {
					name: 'key1',
					namespaceURI: NamespaceURI.svg,
					value: 'value1'
				},
				key2: {
					name: 'key2',
					namespaceURI: null,
					value: 'value2'
				},
				length: 2
			});
		});

		test('Sets an Attr node on an <svg> element.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			const attribute2 = document.createAttribute('KEY2');

			attribute1.value = 'value1';
			attribute2.value = 'value2';

			svg.setAttributeNode(attribute1);
			svg.setAttributeNode(attribute2);

			expect(svg.attributes).toEqual({
				'0': {
					name: 'KEY1',
					namespaceURI: NamespaceURI.svg,
					value: 'value1'
				},
				'1': {
					name: 'key2',
					namespaceURI: null,
					value: 'value2'
				},
				KEY1: {
					name: 'KEY1',
					namespaceURI: NamespaceURI.svg,
					value: 'value1'
				},
				key2: {
					name: 'key2',
					namespaceURI: null,
					value: 'value2'
				},
				length: 2
			});
		});
	});

	describe('getAttributeNode()', () => {
		test('Returns an Attr node from a <div> element.', () => {
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

		test('Returns an Attr node from an <svg> element.', () => {
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

	describe('removeAttributeNode()', () => {
		test('Removes an Attr node.', () => {
			const attribute = document.createAttribute('KEY1');

			attribute.value = 'value1';
			element.setAttributeNode(attribute);
			element.removeAttributeNode(attribute);

			expect(element.attributes).toEqual({ length: 0 });
		});
	});

	describe('replaceWith()', () => {
		test('Replaces a node with another node.', () => {
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

		test('Replaces a node with a mixed list of Node and DOMString (string).', () => {
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
		test('Sets the properties "scrollTop" and "scrollLeft".', () => {
			const div = document.createElement('div');
			div.scroll(10, 15);
			expect(div.scrollLeft).toBe(10);
			expect(div.scrollTop).toBe(15);
		});
	});
});
