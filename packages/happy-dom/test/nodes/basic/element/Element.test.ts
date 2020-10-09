import Window from '../../../../src/window/Window';
import HTMLRenderer from '../../../../src/html-renderer/HTMLRenderer';
import HTMLParser from '../../../../src/html-parser/HTMLParser';
import CustomElement from '../../../CustomElement';
import ShadowRoot from '../../../../src/nodes/basic/shadow-root/ShadowRoot';
import Document from '../../../../src/nodes/basic/document/Document';
import HTMLElement from '../../../../src/nodes/basic/html-element/HTMLElement';
import TextNode from '../../../../src/nodes/basic/text-node/TextNode';
import DOMRect from '../../../../src/nodes/basic/element/DOMRect';
import Range from '../../../../src/nodes/basic/element/Range';
import QuerySelector from '../../../../src/query-selector/QuerySelector';
import NamespaceURI from '../../../../src/html-config/NamespaceURI';

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

	describe('get children()', () => {
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
			jest.spyOn(HTMLRenderer, 'getInnerHTML').mockImplementation(renderElement => {
				expect(renderElement).toBe(element);
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

			jest.spyOn(HTMLParser, 'parse').mockImplementation((parseDocument, html) => {
				expect(parseDocument).toBe(document);
				expect(html).toBe('SOME_HTML');
				return root;
			});
			element.innerHTML = 'SOME_HTML';

			expect(element.innerHTML).toBe('<div>text1</div>');
		});
	});

	describe('get innerHTML()', () => {
		test('Returns HTML an element and its children as a concatenated string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');

			element.appendChild(div);
			element.appendChild(textNode1);

			expect(element.outerHTML).toBe('<div><div></div>text1</div>');
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

		test('Sets "style" attribute as a property.', () => {
			element.setAttribute('style', 'border-radius: 2px; padding: 2px;');
			expect(element.style).toEqual({
				borderRadius: '2px',
				padding: '2px'
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

	describe('scrollTo()', () => {
		test('Does nothing as there is no support for scrolling yet.', () => {
			element.scrollTo();
			expect(typeof element.scrollTo).toBe('function');
		});
	});

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

	describe('querySelectorAll()', () => {
		test('Returns elements matching a CSS selector.', () => {
			const selector = '*';
			const result = [];
			jest
				.spyOn(QuerySelector, 'querySelectorAll')
				.mockImplementation((targetElement, targetSelector) => {
					expect(targetElement).toBe(element);
					expect(targetSelector).toBe(selector);
					return result;
				});
			expect(element.querySelectorAll(selector)).toBe(result);
		});
	});

	describe('querySelector()', () => {
		test('Returns an element matching a CSS selector.', () => {
			const selector = '*';
			const result = document.createElement('div');
			jest
				.spyOn(QuerySelector, 'querySelector')
				.mockImplementation((targetElement, targetSelector) => {
					expect(targetElement).toBe(element);
					expect(targetSelector).toBe(selector);
					return result;
				});
			expect(element.querySelector(selector)).toBe(result);
		});
	});

	describe('getElementsByTagName()', () => {
		test('Returns elements matching a tag name.', () => {
			const tagName = 'div';
			const result = [];
			jest
				.spyOn(QuerySelector, 'querySelectorAll')
				.mockImplementation((targetElement, targetSelector) => {
					expect(targetElement).toBe(element);
					expect(targetSelector).toBe(tagName);
					return result;
				});
			expect(element.getElementsByTagName(tagName)).toBe(result);
		});
	});

	describe('getElementsByClassName()', () => {
		test('Returns elements matching a class name.', () => {
			const className = 'class1';
			const result = [];
			jest
				.spyOn(QuerySelector, 'querySelectorAll')
				.mockImplementation((targetElement, targetSelector) => {
					expect(targetElement).toBe(element);
					expect(targetSelector).toBe('.' + className);
					return result;
				});
			expect(element.getElementsByClassName(className)).toBe(result);
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
});
