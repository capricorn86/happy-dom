import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import XMLSerializer from '../../../src/xml-serializer/XMLSerializer';
import XMLParser from '../../../src/xml-parser/XMLParser';
import CustomElement from '../../CustomElement';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot';
import IDocument from '../../../src/nodes/document/IDocument';
import Text from '../../../src/nodes/text/Text';
import DOMRect from '../../../src/nodes/element/DOMRect';
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
import IAttr from '../../../src/nodes/attr/IAttr';
import Event from '../../../src/event/Event';

const NAMESPACE_URI = 'https://test.test';

describe('Element', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IElement>document.createElement('div');
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
			expect(element.children.length).toBe(2);
			expect(element.children[0] === div1).toBe(true);
			expect(element.children[1] === div2).toBe(true);
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
			element.setAttribute('class', 'class1');
			expect(element.classList.value).toBe('class1');
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

		it('Converts specifial characters to HTML entities.', () => {
			const div = document.createElement('div');
			div.innerHTML = '<div>&gt;</div>';
			expect(div.textContent).toBe('>');
			const el = document.createElement('div');
			el.innerHTML = '<div id="testnode">&gt;howdy</div>';
			expect(el.textContent).toBe('>howdy');
			div.appendChild(el);
			expect(div.textContent).toBe('>>howdy');
			const el2 = document.createElement('div');
			el2.innerHTML = '<div id="testnode">&gt;&lt;&amp;&quot;&apos;&nbsp;&nbsp;</div>';
			expect(el2.textContent).toBe('><&"\'  ');
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

			jest.spyOn(XMLSerializer.prototype, 'serializeToString').mockImplementation((rootElement) => {
				expect(rootElement).toBe(div);
				return 'EXPECTED_HTML';
			});

			expect(element.innerHTML).toBe('EXPECTED_HTML');
		});
	});

	describe('set innerHTML()', () => {
		it('Creates child nodes from provided HTML.', () => {
			const div = document.createElement('div');
			const textNode = document.createTextNode('text1');

			element.appendChild(document.createElement('div'));
			div.appendChild(textNode);

			jest.spyOn(XMLParser, 'parse').mockImplementation(function (ownerDocument, xml, options) {
				expect(ownerDocument).toBe(document);
				expect(xml).toBe('SOME_HTML');
				expect(options).toEqual({ rootNode: element });
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

			expect(element.attributes['key1'].name).toBe('key1');
			expect(element.attributes['key1'].value).toBe('value1');
			expect(element.attributes['key1'].namespaceURI).toBe(null);
			expect(element.attributes['key1'].specified).toBe(true);
			expect(element.attributes['key1'].ownerElement === element).toBe(true);
			expect(element.attributes['key1'].ownerDocument === document).toBe(true);

			expect(element.attributes['key2'].name).toBe('key2');
			expect(element.attributes['key2'].value).toBe('value2');
			expect(element.attributes['key2'].namespaceURI).toBe(null);
			expect(element.attributes['key2'].specified).toBe(true);
			expect(element.attributes['key2'].ownerElement === element).toBe(true);
			expect(element.attributes['key2'].ownerDocument === document).toBe(true);

			expect(element.attributes['key3'].name).toBe('key3');
			expect(element.attributes['key3'].value).toBe('value3');
			expect(element.attributes['key3'].namespaceURI).toBe(null);
			expect(element.attributes['key3'].specified).toBe(true);
			expect(element.attributes['key3'].ownerElement === element).toBe(true);
			expect(element.attributes['key3'].ownerDocument === document).toBe(true);
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

			for (const node of document.childNodes.slice()) {
				node.parentNode.removeChild(node);
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

			jest.spyOn(XMLSerializer.prototype, 'serializeToString').mockImplementation((rootElement) => {
				expect(rootElement === div).toBe(true);
				return 'EXPECTED_HTML';
			});

			expect(element.getInnerHTML()).toBe('EXPECTED_HTML');
		});

		it('Returns HTML of children and shadow roots of custom elements as a concatenated string.', () => {
			const div = document.createElement('div');

			element.appendChild(div);

			jest
				.spyOn(XMLSerializer.prototype, 'serializeToString')
				.mockImplementation((rootElement, options) => {
					expect(rootElement === div).toBe(true);
					expect(options).toEqual({ includeShadowRoots: true });
					return 'EXPECTED_HTML';
				});

			expect(element.getInnerHTML({ includeShadowRoots: true })).toBe('EXPECTED_HTML');
		});
	});

	describe('append()', () => {
		it('Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.', () => {
			const node1 = document.createComment('test1');
			const node2 = document.createComment('test2');
			let isCalled = false;

			jest.spyOn(ParentNodeUtility, 'append').mockImplementation((parentNode, ...nodes) => {
				expect(parentNode === document).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
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
				expect(parentNode === document).toBe(true);
				expect(nodes.length).toBe(2);
				expect(nodes[0] === node1).toBe(true);
				expect(nodes[1] === node2).toBe(true);
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

			const insertedNode = parent.insertAdjacentElement('afterbegin', newNode);

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

			const insertedNode = parent.insertAdjacentElement('beforeend', newNode);

			expect(insertedNode === newNode).toBe(true);
			expect(parent.childNodes[1] === insertedNode).toBe(true);
			expect(insertedNode.isConnected).toBe(true);
		});

		it('Inserts a Node right after the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);

			const insertedNode = parent.insertAdjacentElement('afterend', newNode);

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
			expect((<IElement>parent.childNodes[1]).outerHTML).toEqual(markup);
		});

		it('Inserts the given HTML right after the reference element.', () => {
			const parent = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes.length).toEqual(0);
			expect(document.body.childNodes[0] === parent).toBe(true);
			expect((<IElement>document.body.childNodes[1]).outerHTML).toEqual(markup);
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
			expect((<IElement>document.body.childNodes[1]).outerHTML).toEqual(markup);
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
			document.appendChild(grandparentElement);

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
			grandparentElement.setAttribute('role', 'status');
			grandparentElement.appendChild(parentElement);

			const element = document.createElement('div');
			element.className = 'active';
			parentElement.appendChild(element);

			expect(element.matches('div[role="status"] > div.active')).toBe(true);
			expect(element.matches('div[role="alert"] > div.active')).toBe(false);
			expect(grandparentElement.matches('div > div[role="alert"]')).toBe(false);
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

			jest.spyOn(QuerySelector, 'querySelectorAll').mockImplementation((parentNode, selector) => {
				expect(parentNode).toBe(document);
				expect(selector).toEqual(expectedSelector);
				return <INodeList<IElement>>[element];
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

			jest.spyOn(QuerySelector, 'querySelector').mockImplementation((parentNode, selector) => {
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

			jest
				.spyOn(ParentNodeUtility, 'getElementsByClassName')
				.mockImplementation((parentNode, requestedClassName) => {
					expect(parentNode).toBe(element);
					expect(requestedClassName).toEqual(className);
					return <IHTMLCollection<IElement>>[child];
				});

			const result = element.getElementsByClassName(className);
			expect(result.length).toBe(1);
			expect(result[0] === child).toBe(true);
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

			jest
				.spyOn(ParentNodeUtility, 'getElementsByTagNameNS')
				.mockImplementation((parentNode, requestedNamespaceURI, requestedTagName) => {
					expect(parentNode).toBe(element);
					expect(requestedNamespaceURI).toEqual(namespaceURI);
					expect(requestedTagName).toEqual(tagName);
					return <IHTMLCollection<IElement>>[child];
				});

			const result = element.getElementsByTagNameNS(namespaceURI, tagName);
			expect(result.length).toBe(1);
			expect(result[0] === child).toBe(true);
		});
	});

	describe('remove()', () => {
		it('Removes the node from its parent.', () => {
			const element = document.createElement('div');
			let isCalled = false;

			jest.spyOn(ChildNodeUtility, 'remove').mockImplementation((childNode) => {
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
			expect(otherParent.children['div1'] === div).toBe(true);
			expect(otherParent.children['div2'] === div).toBe(true);
			expect(otherParent.children['otherDiv'] === otherDiv).toBe(true);
			expect(otherParent.children['otherSpan'] === otherSpan).toBe(true);

			element.appendChild(document.createComment('test'));
			element.appendChild(div);
			element.appendChild(document.createComment('test'));
			element.appendChild(span);

			expect(otherParent.children.length).toBe(2);
			expect(otherParent.children[0] === otherDiv).toBe(true);
			expect(otherParent.children[1] === otherSpan).toBe(true);
			expect(otherParent.children['div1'] === undefined).toBe(true);
			expect(otherParent.children['div2'] === undefined).toBe(true);
			expect(otherParent.children['otherDiv'] === otherDiv).toBe(true);
			expect(otherParent.children['otherSpan'] === otherSpan).toBe(true);

			expect(element.children.length).toBe(2);
			expect(element.children[0] === div).toBe(true);
			expect(element.children[1] === span).toBe(true);
			expect(element.children['div1'] === div).toBe(true);
			expect(element.children['div2'] === div).toBe(true);
			expect(element.children['span'] === span).toBe(true);
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

			expect(element.children['div'] === div).toBe(true);
			expect(element.children['span'] === span).toBe(true);

			element.removeChild(div);

			expect(element.children.length).toBe(1);
			expect(element.children[0] === span).toBe(true);
			expect(element.children['div'] === undefined).toBe(true);
			expect(element.children['span'] === span).toBe(true);
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

			const a = div.querySelector('#a');
			const b = div.querySelector('#b');

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
			container.after(div1);
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
			expect(otherParent.children['otherSpan1'] === otherSpan1).toBe(true);
			expect(otherParent.children['div'] === div).toBe(true);
			expect(otherParent.children['otherSpan2'] === otherSpan2).toBe(true);

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
			expect(otherParent.children['div'] === undefined).toBe(true);
			expect(otherParent.children['otherSpan1'] === otherSpan1).toBe(true);
			expect(otherParent.children['otherSpan2'] === otherSpan2).toBe(true);

			expect(element.children.length).toBe(3);
			expect(element.children[0] === span1).toBe(true);
			expect(element.children[1] === div).toBe(true);
			expect(element.children[2] === span2).toBe(true);
			expect(element.children['span1'] === span1).toBe(true);
			expect(element.children['div'] === div).toBe(true);
			expect(element.children['span2'] === span2).toBe(true);
		});
	});

	describe('get previousElementSibling()', () => {
		it('Returns previous element sibling..', () => {
			const node = document.createComment('test');
			const previousElementSibling = document.createElement('div');
			jest
				.spyOn(NonDocumentChildNodeUtility, 'previousElementSibling')
				.mockImplementation((childNode) => {
					expect(childNode).toBe(node);
					return previousElementSibling;
				});

			expect(node.previousElementSibling === previousElementSibling).toBe(true);
		});
	});

	describe('get nextElementSibling()', () => {
		it('Returns next element sibling..', () => {
			const node = document.createComment('test');
			const nextElementSibling = document.createElement('div');
			jest
				.spyOn(NonDocumentChildNodeUtility, 'nextElementSibling')
				.mockImplementation((childNode) => {
					expect(childNode).toBe(node);
					return nextElementSibling;
				});

			expect(node.nextElementSibling === nextElementSibling).toBe(true);
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

			expect(element.attributes['key1'].name).toBe('key1');
			expect(element.attributes['key1'].value).toBe('value1');
			expect(element.attributes['key1'].namespaceURI).toBe(null);
			expect(element.attributes['key1'].specified).toBe(true);
			expect(element.attributes['key1'].ownerElement === element).toBe(true);
			expect(element.attributes['key1'].ownerDocument === document).toBe(true);

			expect(element.attributes['key2'].name).toBe('key2');
			expect(element.attributes['key2'].value).toBe('');
			expect(element.attributes['key2'].namespaceURI).toBe(null);
			expect(element.attributes['key2'].specified).toBe(true);
			expect(element.attributes['key2'].ownerElement === element).toBe(true);
			expect(element.attributes['key2'].ownerDocument === document).toBe(true);
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

			expect(element.attributes['global:local1'].name).toBe('global:local1');
			expect(element.attributes['global:local1'].value).toBe('value1');
			expect(element.attributes['global:local1'].namespaceURI).toBe(NAMESPACE_URI);
			expect(element.attributes['global:local1'].specified).toBe(true);
			expect(element.attributes['global:local1'].ownerElement === element).toBe(true);
			expect(element.attributes['global:local1'].ownerDocument === document).toBe(true);

			expect(element.attributes['global:local2'].name).toBe('global:local2');
			expect(element.attributes['global:local2'].value).toBe('');
			expect(element.attributes['global:local2'].namespaceURI).toBe(NAMESPACE_URI);
			expect(element.attributes['global:local2'].specified).toBe(true);
			expect(element.attributes['global:local2'].ownerElement === element).toBe(true);
			expect(element.attributes['global:local2'].ownerDocument === document).toBe(true);
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
			expect(element['_shadowRoot'] instanceof ShadowRoot).toBe(true);
			expect(element.shadowRoot instanceof ShadowRoot).toBe(true);
			expect(element.shadowRoot.ownerDocument === document).toBe(true);
			expect(element.shadowRoot.isConnected).toBe(false);
			document.appendChild(element);
			expect(element.shadowRoot.isConnected).toBe(true);
		});

		it('Creates a new closed ShadowRoot node and sets it to the internal "_shadowRoot" property.', () => {
			element.attachShadow({ mode: 'closed' });
			expect(element.shadowRoot).toBe(null);
			expect(element['_shadowRoot'] instanceof ShadowRoot).toBe(true);
			expect(element['_shadowRoot'].ownerDocument === document).toBe(true);
			expect(element['_shadowRoot'].isConnected).toBe(false);
			document.appendChild(element);
			expect(element['_shadowRoot'].isConnected).toBe(true);
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

	describe('cloneNode()', () => {
		it('Clones the properties of the element when cloned.', () => {
			const child = document.createElement('div');

			child.className = 'className';

			(<string>element.tagName) = 'tagName';
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
			expect(clone.children.length).toEqual(0);
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

				expect(element.attributes.length).toBe(2);

				expect((<IAttr>element.attributes[0]).name).toBe('key1');
				expect((<IAttr>element.attributes[0]).namespaceURI).toBe(NamespaceURI.svg);
				expect((<IAttr>element.attributes[0]).value).toBe('value1');
				expect((<IAttr>element.attributes[0]).specified).toBe(true);
				expect((<IAttr>element.attributes[0]).ownerElement).toBe(element);
				expect((<IAttr>element.attributes[0]).ownerDocument).toBe(document);

				expect((<IAttr>element.attributes[1]).name).toBe('key2');
				expect((<IAttr>element.attributes[1]).namespaceURI).toBe(null);
				expect((<IAttr>element.attributes[1]).value).toBe('value2');
				expect((<IAttr>element.attributes[1]).specified).toBe(true);
				expect((<IAttr>element.attributes[1]).ownerElement).toBe(element);
				expect((<IAttr>element.attributes[1]).ownerDocument).toBe(document);

				expect((<IAttr>element.attributes['key1']).name).toBe('key1');
				expect((<IAttr>element.attributes['key1']).namespaceURI).toBe(NamespaceURI.svg);
				expect((<IAttr>element.attributes['key1']).value).toBe('value1');
				expect((<IAttr>element.attributes['key1']).specified).toBe(true);
				expect((<IAttr>element.attributes['key1']).ownerElement).toBe(element);
				expect((<IAttr>element.attributes['key1']).ownerDocument).toBe(document);

				expect((<IAttr>element.attributes['key2']).name).toBe('key2');
				expect((<IAttr>element.attributes['key2']).namespaceURI).toBe(null);
				expect((<IAttr>element.attributes['key2']).value).toBe('value2');
				expect((<IAttr>element.attributes['key2']).specified).toBe(true);
				expect((<IAttr>element.attributes['key2']).ownerElement).toBe(element);
				expect((<IAttr>element.attributes['key2']).ownerDocument).toBe(document);
			});

			it('Sets an Attr node on an <svg> element.', () => {
				const svg = document.createElementNS(NamespaceURI.svg, 'svg');
				const attribute1 = document.createAttributeNS(NamespaceURI.svg, 'KEY1');
				const attribute2 = document.createAttribute('KEY2');

				attribute1.value = 'value1';
				attribute2.value = 'value2';

				svg[method](attribute1);
				svg[method](attribute2);

				expect(svg.attributes.length).toBe(2);

				expect((<IAttr>svg.attributes[0]).name).toBe('KEY1');
				expect((<IAttr>svg.attributes[0]).namespaceURI).toBe(NamespaceURI.svg);
				expect((<IAttr>svg.attributes[0]).value).toBe('value1');
				expect((<IAttr>svg.attributes[0]).specified).toBe(true);
				expect((<IAttr>svg.attributes[0]).ownerElement).toBe(svg);
				expect((<IAttr>svg.attributes[0]).ownerDocument).toBe(document);

				expect((<IAttr>svg.attributes[1]).name).toBe('key2');
				expect((<IAttr>svg.attributes[1]).namespaceURI).toBe(null);
				expect((<IAttr>svg.attributes[1]).value).toBe('value2');
				expect((<IAttr>svg.attributes[1]).specified).toBe(true);
				expect((<IAttr>svg.attributes[1]).ownerElement).toBe(svg);
				expect((<IAttr>svg.attributes[1]).ownerDocument).toBe(document);

				expect((<IAttr>svg.attributes['KEY1']).name).toBe('KEY1');
				expect((<IAttr>svg.attributes['KEY1']).namespaceURI).toBe(NamespaceURI.svg);
				expect((<IAttr>svg.attributes['KEY1']).value).toBe('value1');
				expect((<IAttr>svg.attributes['KEY1']).specified).toBe(true);
				expect((<IAttr>svg.attributes['KEY1']).ownerElement).toBe(svg);
				expect((<IAttr>svg.attributes['KEY1']).ownerDocument).toBe(document);

				expect((<IAttr>svg.attributes['key2']).name).toBe('key2');
				expect((<IAttr>svg.attributes['key2']).namespaceURI).toBe(null);
				expect((<IAttr>svg.attributes['key2']).value).toBe('value2');
				expect((<IAttr>svg.attributes['key2']).specified).toBe(true);
				expect((<IAttr>svg.attributes['key2']).ownerElement).toBe(svg);
				expect((<IAttr>svg.attributes['key2']).ownerDocument).toBe(document);
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

			expect(element.getAttributeNode('key1') === attribute1).toBe(true);
			expect(element.getAttributeNode('key2') === attribute2).toBe(true);
			expect(element.getAttributeNode('KEY1') === attribute1).toBe(true);
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

			expect(element.getAttributeNodeNS(NamespaceURI.svg, 'key1') === attribute1).toBe(true);
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

	for (const method of ['removeAttributeNode', 'removeAttributeNodeNS']) {
		describe(`${method}()`, () => {
			it('Removes an Attr node.', () => {
				const attribute = document.createAttribute('KEY1');

				attribute.value = 'value1';
				element.setAttributeNode(attribute);
				element[method](attribute);

				expect(element.attributes.length).toBe(0);
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

	describe('dispatchEvent()', () => {
		it('Evaluates attribute event listeners.', () => {
			const div = document.createElement('div');
			div.setAttribute('onclick', 'divClicked = true');
			div.dispatchEvent(new Event('click'));
			expect(window['divClicked']).toBe(true);
		});

		it("Doesn't evaluate attribute event listener is immediate propagation has been stopped.", () => {
			const div = document.createElement('div');
			div.addEventListener('click', (e: Event) => e.stopImmediatePropagation());
			div.setAttribute('onclick', 'divClicked = true');
			div.dispatchEvent(new Event('click'));
			expect(window['divClicked']).toBe(undefined);
		});
	});
});
