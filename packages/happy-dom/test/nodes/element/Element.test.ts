import Window from '../../../src/window/Window.js';
import HTMLSerializer from '../../../src/html-serializer/HTMLSerializer.js';
import HTMLParser from '../../../src/html-parser/HTMLParser.js';
import CustomElement from '../../CustomElement.js';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot.js';
import type Document from '../../../src/nodes/document/Document.js';
import type Text from '../../../src/nodes/text/Text.js';
import DOMRect from '../../../src/dom/DOMRect.js';
import NamespaceURI from '../../../src/config/NamespaceURI.js';
import ParentNodeUtility from '../../../src/nodes/parent-node/ParentNodeUtility.js';
import QuerySelector from '../../../src/query-selector/QuerySelector.js';
import ChildNodeUtility from '../../../src/nodes/child-node/ChildNodeUtility.js';
import NonDocumentChildNodeUtility from '../../../src/nodes/child-node/NonDocumentChildNodeUtility.js';
import type HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement.js';
import Node from '../../../src/nodes/node/Node.js';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';
import Element from '../../../src/nodes/element/Element.js';
import type NodeList from '../../../src/nodes/node/NodeList.js';
import Event from '../../../src/event/Event.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import DOMTokenList from '../../../src/dom/DOMTokenList.js';

const NAMESPACE_URI = 'https://test.test';

describe('Element', () => {
	let window: Window;
	let document: Document;
	let element: Element;

	beforeEach(() => {
		window = new Window({
			settings: { enableJavaScriptEvaluation: true, suppressCodeGenerationFromStringsWarning: true }
		});
		document = window.document;
		element = <Element>document.createElement('div');
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		CustomElement.serializable = false;
		vi.restoreAllMocks();
	});

	for (const event of [
		'fullscreenerror',
		'fullscreenchange',
		'beforecopy',
		'beforecut',
		'beforepaste',
		'search'
	]) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect((<any>element)[`on${event}`]).toBeTypeOf('function');
				(<any>element)[`on${event}`](new Event(event));
				expect((<any>window)['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				(<any>element)[`on${event}`] = () => {
					(<any>window)['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect((<any>window)['test']).toBe(1);
			});
		});
	}

	describe('get children()', () => {
		it('Returns nodes of type Element.', () => {
			const div1 = document.createElement('div');
			const div2 = document.createElement('div');
			const textNode = document.createTextNode('text');
			element.appendChild(div1);
			element.appendChild(textNode);
			element.appendChild(div2);
			expect(element.children.length).toBe(2);
			expect(element.children[0] === div1).toBe(true);
			expect(element.children[1] === div2).toBe(true);
		});

		it('Is a getter.', () => {
			expect(typeof Object.getOwnPropertyDescriptor(Element.prototype, 'children')?.get).toBe(
				'function'
			);
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

		it('Adds the "id" attribute as a property to Window.', () => {
			element.setAttribute('id', 'element1');

			expect((<any>window)['element1']).toBeUndefined();

			document.body.appendChild(element);

			expect((<any>window)['element1']).toBe(element);

			document.body.removeChild(element);

			expect((<any>window)['element1']).toBeUndefined();

			document.body.appendChild(element);

			expect((<any>window)['element1']).toBe(element);

			element.setAttribute('id', 'element2');

			expect((<any>window)['element1']).toBeUndefined();
			expect((<any>window)['element2']).toBe(element);

			const element2 = document.createElement('div');
			element2.id = 'element2';

			document.body.appendChild(element2);

			expect((<any>window)['element2']).toBeInstanceOf(HTMLCollection);
			expect((<any>window)['element2'].length).toBe(2);
			expect((<any>window)['element2'][0]).toBe(element);
			expect((<any>window)['element2'][1]).toBe(element2);

			document.body.removeChild(element2);

			expect((<any>window)['element2']).toBe(element);

			document.body.appendChild(element2);

			expect((<any>window)['element2']).toBeInstanceOf(HTMLCollection);
			expect((<any>window)['element2'].length).toBe(2);

			element2.removeAttribute('id');

			expect((<any>window)['element2']).toBe(element);

			element.removeAttribute('id');

			expect((<any>window)['element2']).toBe(undefined);
		});

		it(`Doesn't add the "id" attribute as a property to Window if it collides with Window properties.`, () => {
			element.setAttribute('id', 'document');
			document.body.appendChild(element);
			expect((<any>window)['document']).toBe(document);
		});

		it(`Doesn't add the "opener" attribute as a property to Window when the property value is null (#1841).`, () => {
			document.body.appendChild(element);
			element.id = 'opener';
			expect((<any>window)['opener']).toBe(null);
		});
	});

	describe('get slot()', () => {
		it('Returns the element "slot" attribute.', () => {
			element.setAttribute('slot', 'slot');
			expect(element.slot).toBe('slot');
		});
	});

	describe('set slot()', () => {
		it('Sets the element "slot" as an attribute.', () => {
			element.slot = 'slot';
			expect(element.getAttribute('slot')).toBe('slot');
		});
	});

	describe('get className()', () => {
		it('Returns the element "class" attribute.', () => {
			element.setAttribute('class', 'class');
			expect(element.className).toBe('class');
		});
	});

	describe('set className()', () => {
		it('Sets the element "class" as an attribute.', () => {
			element.className = 'class';
			expect(element.getAttribute('class')).toBe('class');
		});
	});

	describe('get role()', () => {
		it('Returns the element "role" attribute.', () => {
			element.setAttribute('role', 'role');
			expect(element.role).toBe('role');
		});
	});

	describe('set role()', () => {
		it('Sets the element "role" as an attribute.', () => {
			element.role = 'role';
			expect(element.getAttribute('role')).toBe('role');
		});
	});

	describe('get classList()', () => {
		it('Returns a DOMTokenList object.', () => {
			element.setAttribute('class', 'value1 value2');
			expect(element.classList).toBeInstanceOf(DOMTokenList);
			expect(element.classList.value).toBe('value1 value2');
			expect(element.classList.length).toBe(2);
			expect(element.classList[0]).toBe('value1');
			expect(element.classList[1]).toBe('value2');
		});

		it('Handles cache correctly (#1812)', () => {
			element.classList.add('foo', 'bar', 'baz');
			expect(element.outerHTML).toEqual('<div class="foo bar baz"></div>');
			element.className = '';
			element.classList.add('bar', 'baz');
			expect(element.outerHTML).toEqual('<div class="bar baz"></div>');
			element.classList.remove('baz');
			expect(element.outerHTML).toEqual('<div class="bar"></div>');
			element.classList.replace('bar', 'foo');
			expect(element.outerHTML).toEqual('<div class="foo"></div>');
		});
	});

	describe('set classList()', () => {
		it('Sets the attribute "class".', () => {
			element.classList = 'value1 value2';
			expect(element.getAttribute('class')).toBe('value1 value2');
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

		it('Returns values HTML entity encoded.', () => {
			const div = document.createElement('div');
			div.innerHTML = '<div>&gt;</div>';
			expect(div.textContent).toBe('>');
			const el = document.createElement('div');
			el.innerHTML = '<div id="testnode">&gt;howdy</div>';
			expect(el.textContent).toBe('>howdy');
			div.appendChild(el);
			expect(div.textContent).toBe('>>howdy');
			const el2 = document.createElement('div');
			el2.innerHTML = '<div id="testnode">&gt;&lt;&amp;&quot;&apos;&nbsp;</div>';
			expect(el2.textContent).toBe('><&"\'' + String.fromCharCode(160));
			const el3 = document.createElement('div');
			el3.innerHTML = '&#x3C;div&#x3E;Hello, world!&#x3C;/div&#x3E;';
			expect(el3.textContent).toBe('<div>Hello, world!</div>');
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

		it('Removes all child nodes if textContent is set to empty string.', () => {
			const div = document.createElement('div');
			const textNode1 = document.createTextNode('text1');
			const textNode2 = document.createTextNode('text2');

			element.appendChild(div);
			element.appendChild(textNode1);
			element.appendChild(textNode2);

			element.textContent = '';

			expect(element.childNodes.length).toBe(0);
		});
	});

	describe('get innerHTML()', () => {
		it('Returns HTML of children as a concatenated string.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			vi.spyOn(HTMLSerializer.prototype, 'serializeToString').mockImplementation((rootElement) => {
				expect(rootElement).toBe(div);
				return 'EXPECTED_HTML';
			});

			expect(element.innerHTML).toBe('EXPECTED_HTML');
		});

		it('Returns HTML of a mixture of normal and raw text elements as a concatenated string.', () => {
			const container = document.createElement('div');
			const testString = `/* &<>\xA0 */`;
			const div = document.createElement('div');
			div.textContent = testString;
			const script = document.createElement('script');
			script.textContent = testString;
			const style = document.createElement('style');
			style.textContent = testString;
			container.append(div, script, style);
			expect(container.innerHTML).toBe(
				'<div>/* &amp;&lt;&gt;&nbsp; */</div><script>/* &<>\xA0 */</script><style>/* &<>\xA0 */</style>'
			);
		});
	});

	describe('set innerHTML()', () => {
		it('Creates child nodes from provided HTML.', () => {
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			element.appendChild(document.createElement('div'));
			div.appendChild(textNode);

			vi.spyOn(HTMLParser.prototype, 'parse').mockImplementation(function (
				this: HTMLParser,
				html,
				rootNode
			) {
				expect((<any>this).window).toBe(window);
				expect(html).toBe('SOME_HTML');
				expect(rootNode).toBe(element);
				element.appendChild(div);
				return element;
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

			expect(element.attributes.length).toBe(3);

			expect(element.attributes[0].name).toBe('key1');
			expect(element.attributes[0].value).toBe('value1');
			expect(element.attributes[0].namespaceURI).toBe(null);
			expect(element.attributes[0].specified).toBe(true);
			expect(element.attributes[0].ownerElement === element).toBe(true);
			expect(element.attributes[0].ownerDocument === document).toBe(true);

			expect(element.attributes[1].name).toBe('key2');
			expect(element.attributes[1].value).toBe('value2');
			expect(element.attributes[1].namespaceURI).toBe(null);
			expect(element.attributes[1].specified).toBe(true);
			expect(element.attributes[1].ownerElement === element).toBe(true);
			expect(element.attributes[1].ownerDocument === document).toBe(true);

			expect(element.attributes[2].name).toBe('key3');
			expect(element.attributes[2].value).toBe('value3');
			expect(element.attributes[2].namespaceURI).toBe(null);
			expect(element.attributes[2].specified).toBe(true);
			expect(element.attributes[2].ownerElement === element).toBe(true);
			expect(element.attributes[2].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['key1'].name).toBe('key1');
			expect((<any>element).attributes['key1'].value).toBe('value1');
			expect((<any>element).attributes['key1'].namespaceURI).toBe(null);
			expect((<any>element).attributes['key1'].specified).toBe(true);
			expect((<any>element).attributes['key1'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['key1'].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['key2'].name).toBe('key2');
			expect((<any>element).attributes['key2'].value).toBe('value2');
			expect((<any>element).attributes['key2'].namespaceURI).toBe(null);
			expect((<any>element).attributes['key2'].specified).toBe(true);
			expect((<any>element).attributes['key2'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['key2'].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['key3'].name).toBe('key3');
			expect((<any>element).attributes['key3'].value).toBe('value3');
			expect((<any>element).attributes['key3'].namespaceURI).toBe(null);
			expect((<any>element).attributes['key3'].specified).toBe(true);
			expect((<any>element).attributes['key3'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['key3'].ownerDocument === document).toBe(true);
		});
	});

	describe('get childElementCount()', () => {
		it('Returns child element count.', () => {
			document.body.appendChild(document.createElement('div'));
			document.body.appendChild(document.createTextNode('test'));
			expect(document.body.childElementCount).toEqual(1);
		});
	});

	describe('get firstElementChild()', () => {
		it('Returns first element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of Array.from(document.childNodes)) {
				node.parentNode?.removeChild(node);
			}

			div.appendChild(text1);
			div.appendChild(span1);
			div.appendChild(span2);
			div.appendChild(text2);

			expect(div.firstElementChild === span1).toBe(true);
		});
	});

	describe('get lastElementChild()', () => {
		it('Returns last element child.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');

			for (const node of Array.from(document.childNodes)) {
				node.parentNode?.removeChild(node);
			}

			div.appendChild(text1);
			div.appendChild(span1);
			div.appendChild(span2);
			div.appendChild(text2);

			expect(div.lastElementChild === span2).toBe(true);
		});
	});

	describe('getInnerHTML()', () => {
		it('Returns HTML of children as a concatenated string.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			vi.spyOn(HTMLSerializer.prototype, 'serializeToString').mockImplementation((rootElement) => {
				expect(rootElement === div).toBe(true);
				return 'EXPECTED_HTML';
			});

			expect(element.getInnerHTML()).toBe('EXPECTED_HTML');
		});

		it('Returns HTML of children and shadow roots of custom elements serialized to HTML when the option "includeShadowRoots" is set.', () => {
			document.body.innerHTML = '<div><custom-element></custom-element></div>';

			expect(
				document.body.getInnerHTML({ includeShadowRoots: true }).includes('<span class="propKey">')
			).toBe(true);
		});
	});

	describe('getHTML()', () => {
		it('Returns HTML of children as a concatenated string.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			vi.spyOn(HTMLSerializer.prototype, 'serializeToString').mockImplementation((rootElement) => {
				expect(rootElement === div).toBe(true);
				return 'EXPECTED_HTML';
			});

			expect(element.getHTML()).toBe('EXPECTED_HTML');
		});

		it('Returns HTML of children and shadow roots of custom elements serialized to HTML when the option "serializableShadowRoots" is set.', () => {
			document.body.innerHTML = '<div><custom-element></custom-element></div>';

			expect(
				document.body.getHTML({ serializableShadowRoots: true }).includes('<span class="propKey">')
			).toBe(false);

			CustomElement.serializable = true;

			document.body.innerHTML = '<div><custom-element></custom-element></div>';

			expect(
				document.body.getHTML({ serializableShadowRoots: true }).includes('<span class="propKey">')
			).toBe(true);
		});

		it('Returns HTML of children and shadow roots of custom elements serialized to HTML when the option "shadowRoots" is set.', () => {
			CustomElement.serializable = true;

			document.body.innerHTML = '<div><custom-element></custom-element></div>';

			expect(
				document.body
					.getHTML({
						shadowRoots: []
					})
					.includes('<span class="propKey">')
			).toBe(false);

			expect(
				document.body
					.getHTML({
						shadowRoots: [<ShadowRoot>document.body.querySelector('custom-element')?.shadowRoot]
					})
					.includes('<span class="propKey">')
			).toBe(true);
		});

		it('Returns HTML slotted elements.', () => {
			CustomElement.serializable = true;

			document.body.innerHTML =
				'<div><custom-element key1="value1" key2="value2"><span>Slotted</span></custom-element></div>';

			expect(document.body.getHTML({ serializableShadowRoots: true }).replace(/\s/g, '')).toBe(
				`
                <div>
                    <custom-element key1="value1" key2="value2">
                        <template shadowrootmode="open" shadowrootserializable="">
                            <style>
                                :host {
                                    display: block;
                                    font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
                                }

                                span {
                                    color: pink;
                                }

                                .propKey {
                                    color: yellow;
                                }
                            </style>
                            <div>
                                <span class="propKey">
                                    key1 is "value1" and key2 is "value2".
                                </span>
                                <span class="children"></span>
                                <span>
                                    <slot></slot>
                                </span>
                            </div>
                        </template>
                        <span>Slotted</span>
                    </custom-element>
                </div>
                `.replace(/\s/g, '')
			);
		});
	});

	describe('append()', () => {
		it('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document.body).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.body.append(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('prepend()', () => {
		it('Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ParentNodeUtility, 'prepend').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document.body).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
				isCalled = true;
			});

			document.body.prepend(node1, node2);
			expect(isCalled).toBe(true);
		});
	});

	describe('insertAdjacentElement()', () => {
		it('Inserts a Node right before the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);

			const insertedNode = <Node>parent.insertAdjacentElement('beforebegin', newNode);

			expect(insertedNode === newNode).toBe(true);
			expect(parent.childNodes.length).toEqual(0);
			expect(insertedNode.isConnected).toBe(true);
			expect(document.body.childNodes[0] === newNode).toBe(true);
		});

		it('Returns with null if cannot insert with "beforebegin".', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');
			const insertedNode = parent.insertAdjacentElement('beforebegin', newNode);

			expect(insertedNode === null).toBe(true);
			expect(newNode.isConnected).toBe(false);
		});

		it('Inserts a Node inside the reference element before the first child and returns with it.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const newNode = document.createElement('span');

			parent.appendChild(child);

			document.body.appendChild(parent);

			const insertedNode = <Node>parent.insertAdjacentElement('afterbegin', newNode);

			expect(insertedNode === newNode).toBe(true);
			expect(parent.childNodes[0] === insertedNode).toBe(true);
			expect(insertedNode.isConnected).toBe(true);
		});

		it('Inserts a Node inside the reference element after the last child and returns with it.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const newNode = document.createElement('span');

			parent.appendChild(child);
			document.body.appendChild(parent);

			const insertedNode = <Node>parent.insertAdjacentElement('beforeend', newNode);

			expect(insertedNode === newNode).toBe(true);
			expect(parent.childNodes[1] === insertedNode).toBe(true);
			expect(insertedNode.isConnected).toBe(true);
		});

		it('Inserts a Node right after the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);

			const insertedNode = <Node>parent.insertAdjacentElement('afterend', newNode);

			expect(insertedNode === newNode).toBe(true);
			expect(parent.childNodes.length).toEqual(0);
			expect(insertedNode.isConnected).toBe(true);

			expect(document.body.childNodes[0] === parent).toBe(true);
			expect(document.body.childNodes[1] === insertedNode).toBe(true);
		});

		it('Inserts a Node right after the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);
			document.body.appendChild(sibling);

			const insertedNode = parent.insertAdjacentElement('afterend', newNode);

			expect(insertedNode === newNode).toBe(true);
			expect(parent.childNodes.length).toBe(0);
			expect(newNode.isConnected).toBe(true);

			expect(document.body.childNodes[0] === parent).toBe(true);
			expect(document.body.childNodes[1] === insertedNode).toBe(true);
			expect(document.body.childNodes[2] === sibling).toBe(true);
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

			expect(parent.childNodes.length).toBe(0);
			expect((<Element>document.body.childNodes[0]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML inside the reference element before the first child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const markup = '<span>markup</span>';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterbegin', markup);

			expect((<Element>parent.childNodes[0]).outerHTML).toEqual(markup);
			expect(parent.childNodes[1] === child).toBe(true);
		});

		it('Inserts the given HTML inside the reference element after the last child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const markup = '<span>markup</span>';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentHTML('beforeend', markup);

			expect(parent.childNodes[0] === child).toBe(true);
			expect((<Element>parent.childNodes[1]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML right after the reference element.', () => {
			const parent = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes.length).toEqual(0);
			expect(document.body.childNodes[0] === parent).toBe(true);
			expect((<Element>document.body.childNodes[1]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML right after the reference element if it has a sibling.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			document.body.appendChild(sibling);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes.length).toBe(0);
			expect(document.body.childNodes[0] === parent).toBe(true);
			expect((<Element>document.body.childNodes[1]).outerHTML).toEqual(markup);
			expect(document.body.childNodes[2] === sibling).toBe(true);
		});
	});

	describe('insertAdjacentText()', () => {
		it('Inserts the given text right before the reference element.', () => {
			const parent = document.createElement('div');
			const text = 'lorem';

			document.body.appendChild(parent);
			parent.insertAdjacentText('beforebegin', text);

			expect(parent.childNodes.length).toEqual(0);
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

			expect(parent.childNodes[0] === child).toBe(true);
			expect(parent.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
			expect(parent.childNodes[1].textContent).toEqual(text);
		});

		it('Inserts the given text right after the reference element.', () => {
			const parent = document.createElement('div');
			const text = 'lorem';

			document.body.appendChild(parent);
			parent.insertAdjacentText('afterend', text);

			expect(parent.childNodes.length).toBe(0);
			expect(document.body.childNodes[0] === parent).toBe(true);
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

			expect(parent.childNodes.length).toBe(0);
			expect(document.body.childNodes[0] === parent).toBe(true);
			expect(document.body.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
			expect(document.body.childNodes[1].textContent).toEqual(text);
			expect(document.body.childNodes[2] === sibling).toBe(true);
		});

		it('Does nothing is an emptry string is sent.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');

			document.body.appendChild(parent);
			document.body.appendChild(sibling);
			parent.insertAdjacentText('afterend', '');

			expect(parent.childNodes.length).toBe(0);
			expect(document.body.childNodes[0] === parent).toBe(true);
			expect(document.body.childNodes[1] === sibling).toBe(true);
		});
	});

	describe('replaceChildren()', () => {
		it('Replaces the existing children of a ParentNode with a specified new set of children.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ParentNodeUtility, 'replaceChildren').mockImplementation((parentNode, ...nodes) => {
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

		it('Checks if the element matches any selector in a string separated by comma.', () => {
			const element = document.createElement('div');

			element.className = 'container active';

			expect(element.matches('.container, .active')).toBe(true);
		});

		it('Checks if the element matches a selector string containing escaped characters.', () => {
			const element = document.createElement('div');

			element.className = 'foo:bar';

			expect(element.matches('.foo\\:bar')).toBe(true);
		});

		it('Checks if the element matches with a descendant combinator', () => {
			const grandparentElement = document.createElement('div');
			grandparentElement.setAttribute('role', 'alert');
			document.body.appendChild(grandparentElement);

			const parentElement = document.createElement('div');
			parentElement.setAttribute('role', 'status');
			grandparentElement.appendChild(parentElement);

			const element = document.createElement('div');
			element.className = 'active';
			parentElement.appendChild(element);

			expect(element.matches('div[role="alert"] div.active')).toBe(true);
			expect(element.matches('div[role="article"] div.active')).toBe(false);
			expect(element.matches('.nonexistent-class div.active')).toBe(false);
		});

		it('Checks if a detached element matches with a descendant combinator', () => {
			const parentElement = document.createElement('div');
			parentElement.setAttribute('role', 'status');

			const element = document.createElement('div');
			element.className = 'active';
			parentElement.appendChild(element);

			expect(element.matches('div[role="status"] div.active')).toBe(true);
			expect(element.matches('div[role="article"] div.active')).toBe(false);
			expect(parentElement.matches('.nonexistent-class div[role="status"]')).toBe(false);
		});

		it('Checks if the element matches with a child combinator', () => {
			const grandparentElement = document.createElement('div');
			grandparentElement.setAttribute('role', 'alert');

			const parentElement = document.createElement('div');
			parentElement.setAttribute('role', 'status');
			grandparentElement.appendChild(parentElement);

			const element = document.createElement('div');
			element.className = 'active';
			parentElement.appendChild(element);

			expect(element.matches('div[role="status"] > div.active')).toBe(true);
			expect(element.matches('div[role="alert"] > div.active')).toBe(false);
			expect(grandparentElement.matches('div > div[role="alert"]')).toBe(false);
		});

		it('Checks if the ancestor element matches with a child combinator using ".x > .x"', () => {
			const a = document.createElement('div');
			a.classList.add('a');

			const b = document.createElement('div');
			b.classList.add('b');

			const c = document.createElement('div');
			c.classList.add('c');

			const d = document.createElement('div');
			d.classList.add('d');

			a.appendChild(b);
			b.appendChild(c);
			c.appendChild(d);

			a.classList.add('x');
			b.classList.add('x');
			d.classList.add('x');

			expect(a.matches('.x > .x')).toBe(false);
			expect(b.matches('.x > .x')).toBe(true);
			expect(c.matches('.x > .x')).toBe(false);
			expect(d.matches('.x > .x')).toBe(false);
		});
	});

	describe('closest()', () => {
		it('Finds the closest matching element when connected to DOM.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const article = document.createElement('article');
			const b = document.createElement('b');

			span.className = 'span';

			article.appendChild(b);
			span.appendChild(article);
			div.appendChild(span);

			document.body.appendChild(div);

			expect(b.closest('div') === div).toBe(true);
			expect(b.closest('div span') === span).toBe(true);
			expect(b.closest('div .span') === span).toBe(true);
			expect(b.closest('div .span b') === b).toBe(true);
			expect(b.closest('div .span article b') === b).toBe(true);
		});

		it('Finds the closest matching element when not connected to DOM.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const article = document.createElement('article');
			const b = document.createElement('b');

			span.className = 'span';

			article.appendChild(b);
			span.appendChild(article);
			div.appendChild(span);

			expect(b.closest('div') === div).toBe(true);
			expect(b.closest('div span') === span).toBe(true);
			expect(b.closest('div .span') === span).toBe(true);
			expect(b.closest('div .span b') === b).toBe(true);
			expect(b.closest('div .span article b') === b).toBe(true);
		});
	});

	describe('querySelectorAll()', () => {
		it('Query CSS selector to find matching elements.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			vi.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(expectedSelector);
				return <NodeList<Element>>(<unknown>[element]);
			});

			const result = document.querySelectorAll(expectedSelector);
			expect(result.length).toBe(1);
			expect(result[0] === element).toBe(true);
		});
	});

	describe('querySelector()', () => {
		it('Query CSS selector to find a matching element.', () => {
			const element = document.createElement('div');
			const expectedSelector = 'selector';

			vi.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(expectedSelector);
				return element;
			});

			expect(document.querySelector(expectedSelector) === element).toEqual(true);
		});
	});

	describe('getElementsByClassName()', () => {
		it('Returns an elements by class name.', () => {
			const child = document.createElement('div');
			const className = 'className';

			vi.spyOn(ParentNodeUtility, 'getElementsByClassName').mockImplementation(
				(parentNode, requestedClassName) => {
					expect(parentNode).toBe(element);
					expect(requestedClassName).toEqual(className);
					return new HTMLCollection<Element>(PropertySymbol.illegalConstructor, () => [child]);
				}
			);

			const result = element.getElementsByClassName(className);
			expect(result.length).toBe(1);
			expect(result[0] === child).toBe(true);
		});
	});

	describe('getElementsByTagName()', () => {
		it('Returns an elements by tag name.', () => {
			const child = document.createElement('div');
			const tagName = 'tag-name';

			vi.spyOn(ParentNodeUtility, 'getElementsByTagName').mockImplementation(
				(parentNode, requestedTagName) => {
					expect(parentNode).toBe(element);
					expect(requestedTagName).toEqual(tagName);
					return new HTMLCollection<Element>(PropertySymbol.illegalConstructor, () => [child]);
				}
			);

			const result = element.getElementsByTagName(tagName);
			expect(result.length).toBe(1);
			expect(result[0] === child).toBe(true);
		});
	});

	describe('getElementsByTagNameNS()', () => {
		it('Returns an elements by tag name and namespace.', () => {
			const child = document.createElement('div');
			const tagName = 'tag-name';
			const namespaceURI = '/namespace/uri/';

			vi.spyOn(ParentNodeUtility, 'getElementsByTagNameNS').mockImplementation(
				(parentNode, requestedNamespaceURI, requestedTagName) => {
					expect(parentNode).toBe(element);
					expect(requestedNamespaceURI).toEqual(namespaceURI);
					expect(requestedTagName).toEqual(tagName);
					return new HTMLCollection<Element>(PropertySymbol.illegalConstructor, () => [child]);
				}
			);

			const result = element.getElementsByTagNameNS(namespaceURI, tagName);
			expect(result.length).toBe(1);
			expect(result[0] === child).toBe(true);
		});
	});

	describe('remove()', () => {
		it('Removes the node from its parent.', () => {
			const element = document.createElement('div');
			let isCalled = false;

			vi.spyOn(ChildNodeUtility, 'remove').mockImplementation((childNode) => {
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

			vi.spyOn(ChildNodeUtility, 'replaceWith').mockImplementation((childNode, ...nodes) => {
				expect(childNode).toBe(element);
				expect(nodes).toEqual([node1, node2]);
				isCalled = true;
			});

			element.replaceWith(node1, node2);
			expect(isCalled).toBe(true);
		});

		it('Should not throw when there is no parent node.', () => {
			document.createElement('div').replaceWith(document.createElement('div'));
		});
	});

	describe('before()', () => {
		it("Inserts a set of Node or DOMString objects in the children list of this ChildNode's parent, just before this ChildNode. DOMString objects are inserted as equivalent Text nodes.", () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			vi.spyOn(ChildNodeUtility, 'before').mockImplementation((childNode, ...nodes) => {
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

			vi.spyOn(ChildNodeUtility, 'after').mockImplementation((childNode, ...nodes) => {
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

			expect(element.children.length).toBe(2);
			expect(element.children[0] === div).toBe(true);
			expect(element.children[1] === span).toBe(true);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the children instead of the actual element if the type is DocumentFragment.', () => {
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const clone = template.content.cloneNode(true);

			element.appendChild(clone);

			expect(clone.childNodes.length).toBe(0);
			expect(clone.children.length).toBe(0);
			expect(element.innerHTML).toBe('<div>Div</div><span>Span</span>');
		});

		it('Removes child from previous parent.', () => {
			const otherParent = document.createElement('div');
			const div = document.createElement('div');
			const span = document.createElement('span');
			const otherDiv = document.createElement('div');
			const otherSpan = document.createElement('span');

			div.setAttribute('id', 'div1');
			div.setAttribute('name', 'div2');
			span.setAttribute('id', 'span');
			otherDiv.setAttribute('id', 'otherDiv');
			otherSpan.setAttribute('id', 'otherSpan');

			otherParent.appendChild(document.createComment('test'));
			otherParent.appendChild(otherDiv);
			otherParent.appendChild(document.createComment('test'));
			otherParent.appendChild(div);
			otherParent.appendChild(document.createComment('test'));
			otherParent.appendChild(otherSpan);

			expect(otherParent.children.length).toBe(3);
			expect(otherParent.children[0] === otherDiv).toBe(true);
			expect(otherParent.children[1] === div).toBe(true);
			expect(otherParent.children[2] === otherSpan).toBe(true);
			expect((<any>otherParent.children)['div1'] === div).toBe(true);
			expect((<any>otherParent.children)['div2'] === div).toBe(true);
			expect((<any>otherParent.children)['otherDiv'] === otherDiv).toBe(true);
			expect((<any>otherParent.children)['otherSpan'] === otherSpan).toBe(true);

			element.appendChild(document.createComment('test'));
			element.appendChild(div);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);

			expect(otherParent.children.length).toBe(2);
			expect(otherParent.children[0] === otherDiv).toBe(true);
			expect(otherParent.children[1] === otherSpan).toBe(true);
			expect((<any>otherParent.children)['div1'] === undefined).toBe(true);
			expect((<any>otherParent.children)['div2'] === undefined).toBe(true);
			expect((<any>otherParent.children)['otherDiv'] === otherDiv).toBe(true);
			expect((<any>otherParent.children)['otherSpan'] === otherSpan).toBe(true);

			expect(element.children.length).toBe(2);
			expect(element.children[0] === div).toBe(true);
			expect(element.children[1] === span).toBe(true);
			expect((<any>element.children)['div1'] === div).toBe(true);
			expect((<any>element.children)['div2'] === div).toBe(true);
			expect((<any>element.children)['span'] === span).toBe(true);
		});
	});

	describe('removeChild()', () => {
		it('Updates the children property when removing an element child.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');

			div.setAttribute('name', 'div');
			span.setAttribute('name', 'span');

			element.appendChild(document.createComment('test'));
			element.appendChild(div);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);

			expect((<any>element.children)['div'] === div).toBe(true);
			expect((<any>element.children)['span'] === span).toBe(true);

			element.removeChild(div);

			expect(element.children.length).toBe(1);
			expect(element.children[0] === span).toBe(true);
			expect((<any>element.children)['div'] === undefined).toBe(true);
			expect((<any>element.children)['span'] === span).toBe(true);
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

			expect(element.children.length).toBe(3);
			expect(element.children[0] === div2).toBe(true);
			expect(element.children[1] === div1).toBe(true);
			expect(element.children[2] === span).toBe(true);
		});

		it('Inserts elements of the same parent correctly.', () => {
			const div = document.createElement('div');
			div.innerHTML =
				'<span id="a"></span><span id="b"></span><span id="c"></span><span id="d"></span>';

			const a = <Element>div.querySelector('#a');
			const b = <Element>div.querySelector('#b');

			div.insertBefore(a, b);

			expect(div.innerHTML).toBe(
				'<span id="a"></span><span id="b"></span><span id="c"></span><span id="d"></span>'
			);
		});

		it('After should add child element correctly', () => {
			document.body.innerHTML = `<div class="container"></div>\n`;
			expect(document.body.children.length).toBe(1);
			const container = document.querySelector('.container');

			const div1 = document.createElement('div');
			div1.classList.add('someClassName');
			div1.innerHTML = 'div1';
			container?.after(div1);
			expect(document.body.children.length).toBe(2);

			const div2 = document.createElement('div');
			div2.classList.add('someClassName');
			div2.innerHTML = 'div2';
			div1.after(div2);

			expect(document.body.children.length).toBe(3);
			expect(document.body.children[1] === div1).toBe(true);
			expect(document.body.children[2] === div2).toBe(true);
			expect(document.getElementsByClassName('someClassName').length).toBe(2);
		});

		it('Insert before comment node should be at the correct location.', () => {
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const span3 = document.createElement('span');
			const comment = document.createComment('test');

			element.appendChild(span1);
			element.appendChild(comment);
			element.appendChild(span2);
			element.insertBefore(span3, comment);

			expect(element.children.length).toBe(3);
			expect(element.children[0] === span1).toBe(true);
			expect(element.children[1] === span3).toBe(true);
			expect(element.children[2] === span2).toBe(true);
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

		it('Removes child from previous parent node when moved.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const otherParent = document.createElement('div');
			const otherSpan1 = document.createElement('span');
			const otherSpan2 = document.createElement('span');

			div.setAttribute('id', 'div');
			span1.setAttribute('id', 'span1');
			span2.setAttribute('id', 'span2');
			otherSpan1.setAttribute('id', 'otherSpan1');
			otherSpan2.setAttribute('id', 'otherSpan2');

			otherParent.appendChild(document.createComment('test'));
			otherParent.appendChild(otherSpan1);
			otherParent.appendChild(document.createComment('test'));
			otherParent.appendChild(otherSpan2);
			otherParent.insertBefore(div, otherSpan2);

			expect(otherParent.children.length).toBe(3);
			expect(otherParent.children[0] === otherSpan1).toBe(true);
			expect(otherParent.children[1] === div).toBe(true);
			expect(otherParent.children[2] === otherSpan2).toBe(true);
			expect((<any>otherParent.children)['otherSpan1'] === otherSpan1).toBe(true);
			expect((<any>otherParent.children)['div'] === div).toBe(true);
			expect((<any>otherParent.children)['otherSpan2'] === otherSpan2).toBe(true);

			element.appendChild(document.createComment('test'));
			element.appendChild(span1);
			element.appendChild(document.createComment('test'));
			element.appendChild(document.createComment('test'));
			element.appendChild(span2);
			element.appendChild(document.createComment('test'));

			element.insertBefore(div, span2);

			expect(otherParent.children.length).toBe(2);
			expect(otherParent.children[0] === otherSpan1).toBe(true);
			expect(otherParent.children[1] === otherSpan2).toBe(true);
			expect((<any>otherParent.children)['div'] === undefined).toBe(true);
			expect((<any>otherParent.children)['otherSpan1'] === otherSpan1).toBe(true);
			expect((<any>otherParent.children)['otherSpan2'] === otherSpan2).toBe(true);

			expect(element.children.length).toBe(3);
			expect(element.children[0] === span1).toBe(true);
			expect(element.children[1] === div).toBe(true);
			expect(element.children[2] === span2).toBe(true);
			expect((<any>element.children)['span1'] === span1).toBe(true);
			expect((<any>element.children)['div'] === div).toBe(true);
			expect((<any>element.children)['span2'] === span2).toBe(true);
		});

		it('Inserts correctly with comment reference node', () => {
			const container = document.createElement('div');
			const child = document.createElement('p');
			child.textContent = 'A';
			container.appendChild(child);
			const comment = document.createComment('');
			container.appendChild(comment);
			container.insertBefore(child, comment);
			const elements = container.querySelectorAll('p');
			expect(elements.length).toBe(1);
		});

		it('Inserts correctly with when adding a children that is already inserted', () => {
			const container = document.createElement('div');
			const child = document.createElement('p');
			child.textContent = 'A';
			container.appendChild(child);

			container.insertBefore(child, child);

			const elements = container.querySelectorAll('p');
			expect(elements.length).toBe(1);
		});
	});

	describe('get previousElementSibling()', () => {
		it('Returns previous element sibling..', () => {
			const node = document.createComment('test');
			const previousElementSibling = document.createElement('div');
			vi.spyOn(NonDocumentChildNodeUtility, 'previousElementSibling').mockImplementation(
				(childNode) => {
					expect(childNode).toBe(node);
					return previousElementSibling;
				}
			);

			expect(node.previousElementSibling === previousElementSibling).toBe(true);
		});
	});

	describe('get nextElementSibling()', () => {
		it('Returns next element sibling..', () => {
			const node = document.createComment('test');
			const nextElementSibling = document.createElement('div');
			vi.spyOn(NonDocumentChildNodeUtility, 'nextElementSibling').mockImplementation(
				(childNode) => {
					expect(childNode).toBe(node);
					return nextElementSibling;
				}
			);

			expect(node.nextElementSibling === nextElementSibling).toBe(true);
		});
	});

	describe('get scrollHeight()', () => {
		it('Returns the scroll height.', () => {
			expect(element.scrollHeight).toBe(0);
		});
	});

	describe('get scrollWidth()', () => {
		it('Returns the scroll width.', () => {
			expect(element.scrollWidth).toBe(0);
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

			expect(customElement.changedAttributes.length).toBe(3);

			expect(customElement.changedAttributes[0].name).toBe('key1');
			expect(customElement.changedAttributes[0].newValue).toBe('value1');
			expect(customElement.changedAttributes[0].oldValue).toBe(null);

			expect(customElement.changedAttributes[1].name).toBe('key2');
			expect(customElement.changedAttributes[1].newValue).toBe('value2');
			expect(customElement.changedAttributes[1].oldValue).toBe(null);

			expect(customElement.changedAttributes[2].name).toBe('key1');
			expect(customElement.changedAttributes[2].newValue).toBe('newValue');
			expect(customElement.changedAttributes[2].oldValue).toBe('value1');
		});

		it('Does not call the attribute changed callback when the attribute name is not available in the observedAttributes() getter method.', () => {
			const customElement = <CustomElement>document.createElement('custom-element');

			element.appendChild(customElement);
			document.body.appendChild(element);

			customElement.setAttribute('k1', 'value1');
			customElement.setAttribute('k2', 'value2');

			expect(customElement.changedAttributes.length).toBe(0);
		});
	});

	describe('setAttribute()', () => {
		it('Sets an attribute on an element.', () => {
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');

			expect(element.attributes.length).toBe(2);

			expect(element.attributes[0].name).toBe('key1');
			expect(element.attributes[0].value).toBe('value1');
			expect(element.attributes[0].namespaceURI).toBe(null);
			expect(element.attributes[0].specified).toBe(true);
			expect(element.attributes[0].ownerElement === element).toBe(true);
			expect(element.attributes[0].ownerDocument === document).toBe(true);

			expect(element.attributes[1].name).toBe('key2');
			expect(element.attributes[1].value).toBe('');
			expect(element.attributes[1].namespaceURI).toBe(null);
			expect(element.attributes[1].specified).toBe(true);
			expect(element.attributes[1].ownerElement === element).toBe(true);
			expect(element.attributes[1].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['key1'].name).toBe('key1');
			expect((<any>element).attributes['key1'].value).toBe('value1');
			expect((<any>element).attributes['key1'].namespaceURI).toBe(null);
			expect((<any>element).attributes['key1'].specified).toBe(true);
			expect((<any>element).attributes['key1'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['key1'].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['key2'].name).toBe('key2');
			expect((<any>element).attributes['key2'].value).toBe('');
			expect((<any>element).attributes['key2'].namespaceURI).toBe(null);
			expect((<any>element).attributes['key2'].specified).toBe(true);
			expect((<any>element).attributes['key2'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['key2'].ownerDocument === document).toBe(true);
		});

		it('Sets valid attribute names', () => {
			// ✅ Basic letters (lowercase & uppercase)
			element.setAttribute(`abc`, '1');
			expect(element.getAttribute('abc')).toBe('1'); // lowercase letters

			element.setAttribute(`ABC`, '1');
			expect(element.getAttribute('ABC')).toBe('1'); // uppercase letters

			element.setAttribute(`AbC`, '1');
			expect(element.getAttribute('AbC')).toBe('1'); // mixed case

			// ✅ Length variations
			element.setAttribute(`a`, '1');
			expect(element.getAttribute('a')).toBe('1'); // single character

			element.setAttribute(`ab`, '1');
			expect(element.getAttribute('ab')).toBe('1'); // two characters

			element.setAttribute(`attribute`, '1');
			expect(element.getAttribute('attribute')).toBe('1'); // common length

			element.setAttribute(`averyverylongattributenamethatisvalid`, '1');
			expect(element.getAttribute('averyverylongattributenamethatisvalid')).toBe('1'); // long attribute name

			// ✅ Attribute names with digits
			element.setAttribute(`attr1`, '1');
			expect(element.getAttribute('attr1')).toBe('1'); // digit at the end

			element.setAttribute(`a123`, '1');
			expect(element.getAttribute('a123')).toBe('1'); // multiple digits at the end

			element.setAttribute(`x9y`, '1');
			expect(element.getAttribute('x9y')).toBe('1'); // digit in the middle

			// ✅ Attribute names with allowed special characters
			element.setAttribute(`_underscore`, '1');
			expect(element.getAttribute('_underscore')).toBe('1'); // starts with underscore

			element.setAttribute(`under_score`, '1');
			expect(element.getAttribute('under_score')).toBe('1'); // contains underscore

			element.setAttribute(`hyphen-ated`, '1');
			expect(element.getAttribute('hyphen-ated')).toBe('1'); // contains hyphen

			element.setAttribute(`ns:attribute`, '1');
			expect(element.getAttribute('ns:attribute')).toBe('1'); // namespace-style (colon allowed)

			// ✅ Unicode-based attribute names
			element.setAttribute(`ö`, '1');
			expect(element.getAttribute('ö')).toBe('1'); // Latin extended

			element.setAttribute(`ñ`, '1');
			expect(element.getAttribute('ñ')).toBe('1'); // Spanish tilde-n

			element.setAttribute(`名`, '1');
			expect(element.getAttribute('名')).toBe('1'); // Chinese character

			element.setAttribute(`имя`, '1');
			expect(element.getAttribute('имя')).toBe('1'); // Cyrillic (Russian)

			element.setAttribute(`أسم`, '1');
			expect(element.getAttribute('أسم')).toBe('1'); // Arabic script

			element.setAttribute(`𝒜𝒷𝒸`, '1');
			expect(element.getAttribute('𝒜𝒷𝒸')).toBe('1'); // Unicode math letters

			element.setAttribute(`ⓐⓑⓒ`, '1');
			expect(element.getAttribute('ⓐⓑⓒ')).toBe('1'); // Enclosed alphanumerics

			element.setAttribute(`Ωμέγα`, '1');
			expect(element.getAttribute('Ωμέγα')).toBe('1'); // Greek letters

			// ✅ Edge cases
			element.setAttribute(`a`, '1');
			expect(element.getAttribute('a')).toBe('1'); // single lowercase letter

			element.setAttribute(`Z`, '1');
			expect(element.getAttribute('Z')).toBe('1'); // single uppercase letter

			element.setAttribute(`_`, '1');
			expect(element.getAttribute('_')).toBe('1'); // single underscore (valid but unusual)

			// TODO: retest in XML content type
			// element.setAttribute(`:`, '1');
			// expect(element.getAttribute(':')).toBe('1'); // single colon (valid in XML namespaces)
			// element.setAttribute(`-`, '1');
			// expect(element.getAttribute('-')).toBe('1'); // single hyphen (valid in XML but discouraged in HTML)
			// element.setAttribute(`-hyphen`, '1');
			// expect(element.getAttribute('-hyphen')).toBe('1'); // starts with hyphen (allowed in XML)

			element.setAttribute(`valid-attribute-name-123`, '1');
			expect(element.getAttribute('valid-attribute-name-123')).toBe('1'); // mixed with hyphens and digits

			element.setAttribute(`data-custom`, '1');
			expect(element.getAttribute('data-custom')).toBe('1'); // common custom attribute pattern
		});

		it('Sets SVG attribute "xmlns:xlink" on an element.', () => {
			const div = document.createElement('div');

			div.innerHTML =
				'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use/></svg>';

			div.children[0].setAttribute('xmlns:xlink', 'test');
			div.children[0].children[0].setAttribute('xlink:href', '#a');

			expect(div.children[0].getAttributeNode('xmlns:xlink')?.namespaceURI).toBe(
				NamespaceURI.xmlns
			);
			expect(div.children[0].getAttribute('xmlns:xlink')).toBe('test');

			expect(div.children[0].children[0].getAttributeNode('xlink:href')?.namespaceURI).toBe(
				NamespaceURI.xlink
			);
			expect(div.children[0].children[0].getAttribute('xlink:href')).toBe('#a');
		});

		it('Throws an error when given an invalid character in the attribute name', () => {
			try {
				element.setAttribute('☺', '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				// eslint-disable-next-line
				element.setAttribute({} as string, '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute('', '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute('=', '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute(' ', '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute('"', '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute(`'`, '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute(`>`, '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute(`\/`, '1');
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute(`\u007F`, '1'); // control character delete
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
			try {
				element.setAttribute(`\u9FFFE`, '1'); // non character
			} catch (error) {
				expect((<any>error).name).toBe(DOMExceptionNameEnum.invalidCharacterError);
			}
		});
	});

	describe('setAttributeNS()', () => {
		it('Sets a namespace attribute on an element.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local1', 'value1');
			element.setAttributeNS(NAMESPACE_URI, 'global:local2', '');

			expect(element.attributes.length).toBe(2);

			expect(element.attributes[0].name).toBe('global:local1');
			expect(element.attributes[0].value).toBe('value1');
			expect(element.attributes[0].namespaceURI).toBe(NAMESPACE_URI);
			expect(element.attributes[0].specified).toBe(true);
			expect(element.attributes[0].ownerElement === element).toBe(true);
			expect(element.attributes[0].ownerDocument === document).toBe(true);

			expect(element.attributes[1].name).toBe('global:local2');
			expect(element.attributes[1].value).toBe('');
			expect(element.attributes[1].namespaceURI).toBe(NAMESPACE_URI);
			expect(element.attributes[1].specified).toBe(true);
			expect(element.attributes[1].ownerElement === element).toBe(true);
			expect(element.attributes[1].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['global:local1'].name).toBe('global:local1');
			expect((<any>element).attributes['global:local1'].value).toBe('value1');
			expect((<any>element).attributes['global:local1'].namespaceURI).toBe(NAMESPACE_URI);
			expect((<any>element).attributes['global:local1'].specified).toBe(true);
			expect((<any>element).attributes['global:local1'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['global:local1'].ownerDocument === document).toBe(true);

			expect((<any>element).attributes['global:local2'].name).toBe('global:local2');
			expect((<any>element).attributes['global:local2'].value).toBe('');
			expect((<any>element).attributes['global:local2'].namespaceURI).toBe(NAMESPACE_URI);
			expect((<any>element).attributes['global:local2'].specified).toBe(true);
			expect((<any>element).attributes['global:local2'].ownerElement === element).toBe(true);
			expect((<any>element).attributes['global:local2'].ownerDocument === document).toBe(true);
		});
	});

	describe('getAttribute()', () => {
		it('Returns null when cannot find attribute.', () => {
			element.setAttribute('key2', '');
			expect(element.getAttribute('random')).toEqual(null);
		});
	});

	describe('getAttributeNames()', () => {
		it('Returns attribute names.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local1', 'value1');
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.getAttributeNames()).toEqual(['global:local1', 'key1', 'key2']);
		});

		it('Returns attribute names using the same local name with different prefix.', () => {
			element.setAttribute('ns1:key', 'value1');
			element.setAttribute('ns2:key', 'value1');
			element.setAttribute('key1', 'value1');
			element.setAttribute('key2', '');
			expect(element.getAttributeNames()).toEqual(['ns1:key', 'ns2:key', 'key1', 'key2']);
		});

		it('Returns attribute names when using namespaces.', () => {
			element.setAttributeNS('namespace', 'key', 'value1');
			element.setAttributeNS('namespace', 'key', 'value2');
			element.setAttributeNS('namespace2', 'key', 'value3');
			element.setAttributeNS('namespace3', 'key', 'value4');

			expect(element.getAttributeNames()).toEqual(['key', 'key', 'key']);
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
			expect(element.attributes.length).toBe(0);
		});

		it('Should stringify a non string attribute and remove it', () => {
			element.setAttribute('undefined', 'value1');
			element.removeAttribute(<string>(<unknown>undefined));
			expect(element.attributes.length).toBe(0);
		});
	});

	describe('removeAttributeNS()', () => {
		it('Removes a namespace attribute.', () => {
			element.setAttributeNS(NAMESPACE_URI, 'global:local', 'value');
			element.removeAttributeNS(NAMESPACE_URI, 'local');
			expect(element.attributes.length).toBe(0);
		});
	});

	describe('toggleAttribute()', () => {
		it('Toggles an attribute.', () => {
			element.toggleAttribute('key1');
			expect(element.hasAttribute('key1')).toBe(true);
			element.toggleAttribute('key1');
			expect(element.hasAttribute('key1')).toBe(false);
			element.toggleAttribute('key1', true);
			expect(element.hasAttribute('key1')).toBe(true);
			element.toggleAttribute('key1', true);
			expect(element.hasAttribute('key1')).toBe(true);
			element.toggleAttribute('key1', false);
			expect(element.hasAttribute('key1')).toBe(false);
		});
	});

	describe('attachShadow()', () => {
		it('Creates a new open ShadowRoot node and sets it to the "shadowRoot" property.', () => {
			element.attachShadow({ mode: 'open' });
			expect(element[PropertySymbol.shadowRoot] instanceof ShadowRoot).toBe(true);
			expect(element.shadowRoot instanceof ShadowRoot).toBe(true);
			expect(element.shadowRoot?.ownerDocument === document).toBe(true);
			expect(element.shadowRoot?.isConnected).toBe(false);
			document.body.appendChild(element);
			expect(element.shadowRoot?.isConnected).toBe(true);
		});

		it('Creates a new closed ShadowRoot node and sets it to the internal "[PropertySymbol.shadowRoot]" property.', () => {
			element.attachShadow({ mode: 'closed' });
			expect(element.shadowRoot).toBe(null);
			expect(element[PropertySymbol.shadowRoot] instanceof ShadowRoot).toBe(true);
			expect(element[PropertySymbol.shadowRoot]?.ownerDocument === document).toBe(true);
			expect(element[PropertySymbol.shadowRoot]?.isConnected).toBe(false);
			document.body.appendChild(element);
			expect(element[PropertySymbol.shadowRoot]?.isConnected).toBe(true);
		});
	});

	for (const functionName of ['scroll', 'scrollTo']) {
		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft.', () => {
				(<any>element)[functionName](50, 60);
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft using object.', () => {
				(<any>element)[functionName]({ left: 50, top: 60 });
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets only the property scrollTop.', () => {
				(<any>element)[functionName]({ top: 60 });
				expect(element.scrollLeft).toBe(0);
				expect(element.scrollTop).toBe(60);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets only the property scrollLeft.', () => {
				(<any>element)[functionName]({ left: 60 });
				expect(element.scrollLeft).toBe(60);
				expect(element.scrollTop).toBe(0);
			});
		});

		describe(`${functionName}()`, () => {
			it('Sets the properties scrollTop and scrollLeft with animation.', async () => {
				(<any>element)[functionName]({ left: 50, top: 60, behavior: 'smooth' });
				expect(element.scrollLeft).toBe(0);
				expect(element.scrollTop).toBe(0);
				await window.happyDOM?.waitUntilComplete();
				expect(element.scrollLeft).toBe(50);
				expect(element.scrollTop).toBe(60);
			});
		});
	}

	describe('scrollIntoView()', () => {
		it('Does nothing as it is currently not possible to implement.', () => {
			element.scrollIntoView();
			element.scrollIntoView(false);
			element.scrollIntoView({
				block: 'start',
				inline: 'start',
				behavior: 'auto'
			});
		});
	});

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

	describe('setPointerCapture()', () => {
		it('Sets pointer capture for the given pointer ID.', () => {
			element.setPointerCapture(1);
			expect(element.hasPointerCapture(1)).toBe(true);
		});

		it('Can capture multiple pointer IDs.', () => {
			element.setPointerCapture(1);
			element.setPointerCapture(2);
			expect(element.hasPointerCapture(1)).toBe(true);
			expect(element.hasPointerCapture(2)).toBe(true);
		});
	});

	describe('hasPointerCapture()', () => {
		it('Returns false when no pointer capture is set.', () => {
			expect(element.hasPointerCapture(1)).toBe(false);
		});

		it('Returns true after setPointerCapture() is called with the same pointer ID.', () => {
			element.setPointerCapture(5);
			expect(element.hasPointerCapture(5)).toBe(true);
			expect(element.hasPointerCapture(6)).toBe(false);
		});
	});

	describe('releasePointerCapture()', () => {
		it('Releases pointer capture for the given pointer ID.', () => {
			element.setPointerCapture(1);
			expect(element.hasPointerCapture(1)).toBe(true);
			element.releasePointerCapture(1);
			expect(element.hasPointerCapture(1)).toBe(false);
		});

		it('Does not throw when releasing a pointer ID that was not captured.', () => {
			expect(() => element.releasePointerCapture(999)).not.toThrow();
		});
	});

	describe('cloneNode()', () => {
		it('Clones the properties of the element when cloned.', () => {
			const child = document.createElement('div');

			child.className = 'className';

			element[PropertySymbol.tagName] = 'tagName';
			element[PropertySymbol.namespaceURI] = 'namespaceURI';

			element.appendChild(child);

			const clone = element.cloneNode(false);
			const clone2 = element.cloneNode(true);
			expect(clone.tagName).toBe('tagName');
			expect(clone.namespaceURI).toBe('namespaceURI');
			expect(clone.children.length).toEqual(0);
			expect(clone2.children.length).toBe(1);
			expect(clone2.children[0].outerHTML).toBe('<div class="className"></div>');
		});

		it('Sets the properties of the cloned element.', () => {
			const div1 = document.createElement('div');
			div1.className = 'div1';
			const cloned = div1.cloneNode(true);
			cloned.className = 'cloned';

			expect(div1.className).toBe('div1');
			expect(cloned.className).toBe('cloned');

			expect(div1.outerHTML).toBe('<div class="div1"></div>');
			expect(cloned.outerHTML).toBe('<div class="cloned"></div>');
		});

		it('Clones shadow root when it is "clonable".', () => {
			/* eslint-disable jsdoc/require-jsdoc */
			class CustomElementA extends window.HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode: 'open', clonable: false });
				}

				public connectedCallback(): void {
					(<ShadowRoot>this.shadowRoot).innerHTML = `
                        <div>Test A</div>
                    `;
				}
			}
			class CustomElementB extends window.HTMLElement {
				constructor() {
					super();
					if (!this.shadowRoot) {
						this.attachShadow({ mode: 'open', clonable: true });
					}
				}

				public connectedCallback(): void {
					(<ShadowRoot>this.shadowRoot).innerHTML = `
                        <div>Test B</div>
                    `;
				}
			}
			/* eslint-enable jsdoc/require-jsdoc */

			window.customElements.define('custom-element-a', CustomElementA);
			window.customElements.define('custom-element-b', CustomElementB);

			const customElementA = document.createElement('custom-element-a');
			const customElementB = document.createElement('custom-element-b');

			element.appendChild(customElementA);
			element.appendChild(customElementB);

			document.body.innerHTML = `
                <custom-element-a></custom-element-a>
                <custom-element-b></custom-element-b>
            `;

			const clone = document.body.cloneNode(true);

			expect(clone.children[0].shadowRoot?.innerHTML).toBe('');
			expect(clone.children[0].shadowRoot?.host).toBe(clone.children[0]);
			expect(clone.children[1].shadowRoot?.innerHTML.trim()).toBe('<div>Test B</div>');
			expect(clone.children[1].shadowRoot?.host).toBe(clone.children[1]);
		});
	});

	for (const method of ['setAttributeNode', 'setAttributeNodeNS']) {
		describe(`${method}()`, () => {
			it('Sets an Attr node on a <div> element.', () => {
				const element = document.createElement('div');
				const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
				const attribute2 = document.createAttributeNS(NamespaceURI.svg, 'key2');
				const attribute3 = document.createAttribute('KEY3');

				attribute1.value = 'value1';
				attribute2.value = 'value2';
				attribute3.value = 'value3';

				(<any>element)[method](attribute1);
				(<any>element)[method](attribute2);
				(<any>element)[method](attribute3);

				expect(element.attributes.length).toBe(3);

				expect(element.attributes[0].name).toBe('KEY1');
				expect(element.attributes[0].namespaceURI).toBe(NamespaceURI.svg);
				expect(element.attributes[0].value).toBe('value1');
				expect(element.attributes[0].specified).toBe(true);
				expect(element.attributes[0].ownerElement === element).toBe(true);
				expect(element.attributes[0].ownerDocument === document).toBe(true);

				expect(element.attributes[1].name).toBe('key2');
				expect(element.attributes[1].namespaceURI).toBe(NamespaceURI.svg);
				expect(element.attributes[1].value).toBe('value2');
				expect(element.attributes[1].specified).toBe(true);
				expect(element.attributes[1].ownerElement === element).toBe(true);
				expect(element.attributes[1].ownerDocument === document).toBe(true);

				expect(element.attributes[2].name).toBe('key3');
				expect(element.attributes[2].namespaceURI).toBe(null);
				expect(element.attributes[2].value).toBe('value3');
				expect(element.attributes[2].specified).toBe(true);
				expect(element.attributes[2].ownerElement === element).toBe(true);
				expect(element.attributes[2].ownerDocument === document).toBe(true);

				// "undefined" as the key is in upper case which should not be considered as a named item when the element is in the HTML namespace
				expect((<any>element).attributes['key1']).toBe(undefined);
				expect((<any>element).attributes['KEY1']).toBe(undefined);

				// Lower case SVG namespace key is fine
				expect((<any>element).attributes['key2'].name).toBe('key2');
				expect((<any>element).attributes['key2'].namespaceURI).toBe(NamespaceURI.svg);
				expect((<any>element).attributes['key2'].value).toBe('value2');
				expect((<any>element).attributes['key2'].specified).toBe(true);
				expect((<any>element).attributes['key2'].ownerElement === element).toBe(true);
				expect((<any>element).attributes['key2'].ownerDocument === document).toBe(true);

				// Matches the key in the HTML namespace
				expect((<any>element).attributes['key3'].name).toBe('key3');
				expect((<any>element).attributes['key3'].namespaceURI).toBe(null);
				expect((<any>element).attributes['key3'].value).toBe('value3');
				expect((<any>element).attributes['key3'].specified).toBe(true);
				expect((<any>element).attributes['key3'].ownerElement === element).toBe(true);
				expect((<any>element).attributes['key3'].ownerDocument === document).toBe(true);

				// Is converted to lower case through the Proxy in the HTML namespace
				expect((<any>element).attributes['KeY3'].name).toBe('key3');
				expect((<any>element).attributes['KeY3'].namespaceURI).toBe(null);
				expect((<any>element).attributes['KeY3'].value).toBe('value3');
				expect((<any>element).attributes['KeY3'].specified).toBe(true);
				expect((<any>element).attributes['KeY3'].ownerElement === element).toBe(true);
				expect((<any>element).attributes['KeY3'].ownerDocument === document).toBe(true);
			});

			it('Sets an Attr node on an <svg> element.', () => {
				const svg = document.createElementNS(NamespaceURI.svg, 'svg');
				const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
				const attribute2 = document.createAttribute('KEY2');

				attribute1.value = 'value1';
				attribute2.value = 'value2';

				(<any>svg)[method](attribute1);
				(<any>svg)[method](attribute2);

				expect(svg.attributes.length).toBe(2);

				expect((<any>svg.attributes)[0].name).toBe('KEY1');
				expect((<any>svg.attributes)[0].namespaceURI).toBe(NamespaceURI.svg);
				expect((<any>svg.attributes)[0].value).toBe('value1');
				expect((<any>svg.attributes)[0].specified).toBe(true);
				expect((<any>svg.attributes)[0].ownerElement === svg).toBe(true);
				expect((<any>svg.attributes)[0].ownerDocument).toBe(document);

				expect((<any>svg.attributes)[1].name).toBe('key2');
				expect((<any>svg.attributes)[1].namespaceURI).toBe(null);
				expect((<any>svg.attributes)[1].value).toBe('value2');
				expect((<any>svg.attributes)[1].specified).toBe(true);
				expect((<any>svg.attributes)[1].ownerElement === svg).toBe(true);
				expect((<any>svg.attributes)[1].ownerDocument).toBe(document);

				// "undefined" as the SVG namespace should not lowercase the key
				expect((<any>svg.attributes)['key1']).toBe(undefined);
				expect((<any>svg.attributes)['kEy1']).toBe(undefined);

				// Matching key is fine in the SVG namespace
				expect((<any>svg.attributes)['KEY1'].name).toBe('KEY1');
				expect((<any>svg.attributes)['KEY1'].namespaceURI).toBe(NamespaceURI.svg);
				expect((<any>svg.attributes)['KEY1'].value).toBe('value1');
				expect((<any>svg.attributes)['KEY1'].specified).toBe(true);
				expect((<any>svg.attributes)['KEY1'].ownerElement === svg).toBe(true);
				expect((<any>svg.attributes)['KEY1'].ownerDocument).toBe(document);

				// "undefined" as the SVG namespace should not lowercase the key
				expect((<any>svg.attributes)['KeY2']).toBe(undefined);

				// Works when matching in the SVG namespace
				expect((<any>svg.attributes)['key2'].name).toBe('key2');
				expect((<any>svg.attributes)['key2'].namespaceURI).toBe(null);
				expect((<any>svg.attributes)['key2'].value).toBe('value2');
				expect((<any>svg.attributes)['key2'].specified).toBe(true);
				expect((<any>svg.attributes)['key2'].ownerElement === svg).toBe(true);
				expect((<any>svg.attributes)['key2'].ownerDocument).toBe(document);
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

			expect(element.getAttributeNode('key1') === null).toBe(true);
			expect(element.getAttributeNode('key2') === attribute2).toBe(true);
			expect(element.getAttributeNode('KEY1') === null).toBe(true);
			expect(element.getAttributeNode('KEY2') === attribute2).toBe(true);
		});

		it('Returns an Attr node from an <svg> element.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
			const attribute2 = document.createAttribute('KEY2');

			attribute1.value = 'value1';
			attribute2.value = 'value2';

			svg.setAttributeNode(attribute1);
			svg.setAttributeNode(attribute2);

			expect(svg.getAttributeNode('key1') === null).toBe(true);
			expect(svg.getAttributeNode('key2') === attribute2).toBe(true);
			expect(svg.getAttributeNode('KEY1') === attribute1).toBe(true);
			expect(svg.getAttributeNode('KEY2') === null).toBe(true);
		});
	});

	describe(`getAttributeNode()`, () => {
		it('Returns a namespaced Attr node from a <div> element.', () => {
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');

			attribute1.value = 'value1';

			element.setAttributeNode(attribute1);

			expect(element.getAttributeNodeNS(NamespaceURI.svg, 'key1') === null).toBe(true);
			expect(element.getAttributeNodeNS(NamespaceURI.svg, 'KEY1') === attribute1).toBe(true);
		});

		it('Returns an Attr node from an <svg> element.', () => {
			const svg = document.createElementNS(NamespaceURI.svg, 'svg');
			const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');

			attribute1.value = 'value1';

			svg.setAttributeNode(attribute1);

			expect(svg.getAttributeNodeNS(NamespaceURI.svg, 'key1') === null).toBe(true);
			expect(svg.getAttributeNodeNS(NamespaceURI.svg, 'KEY1') === attribute1).toBe(true);
			expect(svg.getAttributeNodeNS(NamespaceURI.svg, 'KEY2') === null).toBe(true);
		});
	});

	describe(`removeAttributeNode()`, () => {
		it('Removes an Attr node.', () => {
			const attribute = document.createAttribute('KEY1');

			attribute.value = 'value1';
			element.setAttributeNode(attribute);
			element.removeAttributeNode(attribute);

			expect(element.attributes.length).toBe(0);
		});
	});

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
			const newTextChildContent = '<span class="child4"></span>'; // this should not be parsed as HTML!
			newChildrenParent.innerHTML =
				'<span class="child5"></span><span class="child6"></span><span class="child7"></span>';
			parent.innerHTML =
				'<span class="child1"></span><span class="child2"></span><span class="child3"></span>';

			parent.children[2].replaceWith(...[newTextChildContent, ...newChildrenParent.children]);
			expect(parent.innerHTML).toBe(
				'<span class="child1"></span><span class="child2"></span>&lt;span class="child4"&gt;&lt;/span&gt;<span class="child5"></span><span class="child6"></span><span class="child7"></span>'
			);
		});
	});

	for (const functionName of ['scroll', 'scrollTo']) {
		describe(`${functionName}()`, () => {
			it('Sets the properties "scrollTop" and "scrollLeft".', () => {
				const div = document.createElement('div');

				div.scrollLeft = 10;
				div.scrollTop = 15;

				(<any>div)[functionName](20, 30);

				expect(div.scrollLeft).toBe(20);
				expect(div.scrollTop).toBe(30);
			});

			it('Sets the properties "scrollTop" and "scrollLeft" using an object.', () => {
				const div = document.createElement('div');

				div.scrollLeft = 10;
				div.scrollTop = 15;

				(<any>div)[functionName]({ left: 20, top: 30 });

				expect(div.scrollLeft).toBe(20);
				expect(div.scrollTop).toBe(30);
			});

			it('Supports smooth behavior.', async () => {
				const div = document.createElement('div');

				div.scrollLeft = 10;
				div.scrollTop = 15;

				(<any>div)[functionName]({ left: 20, top: 30, behavior: 'smooth' });

				expect(div.scrollLeft).toBe(10);
				expect(div.scrollTop).toBe(15);

				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(div.scrollLeft).toBe(20);
				expect(div.scrollTop).toBe(30);
			});

			it('Throws an exception if the there is only one argument and it is not an object.', () => {
				const div = document.createElement('div');
				expect(() => (<any>div)[functionName](10)).toThrow(
					new TypeError(
						`Failed to execute '${functionName}' on 'Element': The provided value is not of type 'ScrollToOptions'.`
					)
				);
			});
		});
	}

	describe('scrollBy()', () => {
		it('Appends to the properties "scrollTop" and "scrollLeft" using numbers.', () => {
			const div = document.createElement('div');

			div.scrollLeft = 10;
			div.scrollTop = 15;

			div.scrollBy(10, 15);

			expect(div.scrollLeft).toBe(20);
			expect(div.scrollTop).toBe(30);
		});

		it('Appends to the properties "scrollTop" and "scrollLeft" using an object.', () => {
			const div = document.createElement('div');

			div.scrollLeft = 10;
			div.scrollTop = 15;

			div.scrollBy({ left: 10, top: 15 });

			expect(div.scrollLeft).toBe(20);
			expect(div.scrollTop).toBe(30);
		});

		it('Supports smooth behavior.', async () => {
			const div = document.createElement('div');

			div.scrollLeft = 10;
			div.scrollTop = 15;

			div.scrollBy({ left: 10, top: 15, behavior: 'smooth' });

			expect(div.scrollLeft).toBe(10);
			expect(div.scrollTop).toBe(15);

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(div.scrollLeft).toBe(20);
			expect(div.scrollTop).toBe(30);
		});

		it('Throws an exception if the there is only one argument and it is not an object.', () => {
			const div = document.createElement('div');
			expect(() => div.scrollBy(10)).toThrow(
				new TypeError(
					"Failed to execute 'scrollBy' on 'Element': The provided value is not of type 'ScrollToOptions'."
				)
			);
		});
	});

	describe('dispatchEvent()', () => {
		it('Evaluates attribute event listeners.', () => {
			const div = document.createElement('div');
			div.setAttribute('onclick', 'divClicked = true');
			div.dispatchEvent(new Event('click'));
			expect((<any>window)['divClicked']).toBe(true);
		});

		it("Doesn't evaluate attribute event listener is immediate propagation has been stopped.", () => {
			const div = document.createElement('div');
			div.addEventListener('click', (e: Event) => e.stopImmediatePropagation());
			div.setAttribute('onclick', 'divClicked = true');
			div.dispatchEvent(new Event('click'));
			expect((<any>window)['divClicked']).toBe(undefined);
		});
	});
});
