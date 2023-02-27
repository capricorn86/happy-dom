import Window from '../../../src/window/Window';
import Node from '../../../src/nodes/node/Node';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement';
import Event from '../../../src/event/Event';
import DOMException from '../../../src/exception/DOMException';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum';

/**
 *
 */
class CustomCounterElement extends HTMLElement {
	public static output = [];

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	/**
	 * Connected.
	 */
	public connectedCallback(): void {
		this.shadowRoot.innerHTML = '<div><span>Test</span></div>';
		(<typeof CustomCounterElement>this.constructor).output.push('Counter:connected');
	}

	/**
	 * Disconnected.
	 */
	public disconnectedCallback(): void {
		(<typeof CustomCounterElement>this.constructor).output.push('Counter:disconnected');
	}
}

/**
 *
 */
class CustomButtonElement extends HTMLElement {
	public static output = [];

	/**
	 * Connected.
	 */
	public connectedCallback(): void {
		(<typeof CustomButtonElement>this.constructor).output.push('Button:connected');
	}

	/**
	 * Disconnected.
	 */
	public disconnectedCallback(): void {
		(<typeof CustomButtonElement>this.constructor).output.push('Button:disconnected');
	}
}

describe('Node', () => {
	let window;
	let document;
	let customElementOutput;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		customElementOutput = [];
		CustomCounterElement.output = customElementOutput;
		CustomButtonElement.output = customElementOutput;
		window.customElements.define('custom-counter', CustomCounterElement);
		window.customElements.define('custom-button', CustomButtonElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get isConnected()', () => {
		it('Returns "true" if the node is connected to the document.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span);
			span.appendChild(text);

			expect(div.isConnected).toBe(false);
			expect(span.isConnected).toBe(false);
			expect(text.isConnected).toBe(false);

			document.body.appendChild(div);

			expect(div.isConnected).toBe(true);
			expect(span.isConnected).toBe(true);
			expect(text.isConnected).toBe(true);
		});
	});

	describe('get nodeValue()', () => {
		it('Returns null.', () => {
			expect(new Node().nodeValue).toBe(null);
		});
	});

	describe('get nodeName()', () => {
		it('Returns emptry string.', () => {
			expect(new Node().nodeName).toBe('');
		});
	});

	describe('get previousSibling()', () => {
		it('Returns previous sibling.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span1);
			div.appendChild(text);
			div.appendChild(span2);

			expect(span2.previousSibling).toBe(text);
		});
	});

	describe('get nextSibling()', () => {
		it('Returns next sibling.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span1);
			div.appendChild(text);
			div.appendChild(span2);

			expect(text.nextSibling).toBe(span2);
		});
	});

	describe('get firstChild()', () => {
		it('Returns the first child node.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span1);
			div.appendChild(text);
			div.appendChild(span2);

			expect(div.firstChild).toBe(span1);
		});
	});

	describe('get lastChild()', () => {
		it('Returns the last child node.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span1);
			div.appendChild(text);
			div.appendChild(span2);

			expect(div.lastChild).toBe(span2);
		});
	});

	describe('get parentElement()', () => {
		it('Returns parent element.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const text = document.createTextNode('text');

			span1.appendChild(text);
			div.appendChild(span1);

			expect(text.parentElement).toBe(span1);
		});

		it('Returns document element.', () => {
			const text1 = document.createTextNode('text1');
			const text2 = document.createTextNode('text2');
			const text3 = document.createTextNode('text3');

			text1.appendChild(text2);
			text2.appendChild(text3);

			document.documentElement.appendChild(text1);

			expect(text3.parentElement).toBe(document.documentElement);
		});

		it('Returns null if there is no parent node.', () => {
			const text = document.createTextNode('text');

			expect(text.parentElement).toBe(null);
		});

		it('Returns null if parent node is not an element.', () => {
			const htmlElement = document.createElement('html');
			document.appendChild(htmlElement);

			expect(htmlElement.parentNode).toBe(document);
			expect(htmlElement.parentElement).toBe(null);
		});
	});

	describe('get baseURI()', () => {
		it('Returns location.href.', () => {
			document.location.href = 'https://localhost:8080/base/path/to/script/?key=value=1#test';

			const div = document.createElement('div');
			expect(div.baseURI).toBe('https://localhost:8080/base/path/to/script/?key=value=1#test');
		});

		it('Returns the "href" attribute set on a <base> element.', () => {
			document.location.href = 'https://localhost:8080/base/path/to/script/?key=value=1#test';

			const base = document.createElement('base');
			base.setAttribute('href', 'https://www.test.test/base/path/to/script/?key=value=1#test');
			document.documentElement.appendChild(base);

			const div = document.createElement('div');
			expect(div.baseURI).toBe('https://www.test.test/base/path/to/script/?key=value=1#test');
		});
	});

	describe('connectedCallback()', () => {
		it('Calls connected callback when a custom element is connected to DOM.', () => {
			document.body.innerHTML = '<custom-counter><custom-button></custom-button></custom-counter>';
			document.body.innerHTML = '';
			expect(customElementOutput).toEqual([
				'Counter:connected',
				'Button:connected',
				'Counter:disconnected',
				'Button:disconnected'
			]);
		});
	});

	describe('disconnectedCallback()', () => {
		it('Calls disconnected callback when a custom element is connected to DOM.', () => {
			const customElement = document.createElement('custom-counter');
			let isConnected = false;
			let isDisconnected = false;

			customElement.connectedCallback = () => {
				isConnected = true;
			};

			customElement.disconnectedCallback = () => {
				isDisconnected = true;
			};

			document.body.appendChild(customElement);

			expect(isConnected).toBe(true);
			expect(isDisconnected).toBe(false);

			document.body.removeChild(customElement);

			expect(isDisconnected).toBe(true);
		});
	});

	describe('hasChildNodes()', () => {
		it('Returns "true" if the Node has child nodes.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');

			expect(parent.hasChildNodes()).toBe(false);

			parent.appendChild(child);

			expect(parent.hasChildNodes()).toBe(true);
		});
	});

	describe('contains()', () => {
		it('Returns "true" if a node contains another node.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span1);
			div.appendChild(span2);

			expect(div.contains(text)).toBe(false);

			span2.appendChild(text);

			expect(div.contains(text)).toBe(true);
		});
	});

	describe('getRootNode()', () => {
		it('Returns ShadowRoot when used on a node inside a ShadowRoot.', () => {
			const customElement = document.createElement('custom-counter');

			document.body.appendChild(customElement);

			const rootNode = customElement.shadowRoot.querySelector('span').getRootNode();

			expect(rootNode === customElement.shadowRoot).toBe(true);
		});

		it('Returns Document when used on a node inside a ShadowRoot and the option "composed" is set to "true".', () => {
			const customElement = document.createElement('custom-counter');

			document.body.appendChild(customElement);

			const rootNode = customElement.shadowRoot
				.querySelector('span')
				.getRootNode({ composed: true });

			expect(rootNode === document).toBe(true);
		});

		it('Returns Document when the node is not inside a ShadowRoot.', () => {
			const divElement = document.createElement('div');
			const spanElement = document.createElement('span');

			divElement.appendChild(spanElement);
			document.body.appendChild(divElement);

			const rootNode = spanElement.getRootNode();

			expect(rootNode === document).toBe(true);
		});
	});

	describe('cloneNode()', () => {
		it('Makes a shallow clone of a node (default behavior).', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const text = document.createTextNode('text');
			const comment = document.createComment('comment');

			div.appendChild(span);
			span.appendChild(text);
			span.appendChild(comment);

			document.body.appendChild(div);

			const clone = div.cloneNode();

			document.body.removeChild(div);

			div.removeChild(span);

			expect(div).toEqual(clone);
			expect(div !== clone).toBe(true);
		});

		it('Makes a deep clone of a node.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const text = document.createTextNode('text');
			const comment = document.createComment('comment');

			div.appendChild(span);
			span.appendChild(text);
			span.appendChild(comment);

			document.body.appendChild(div);

			const clone = div.cloneNode(true);

			document.body.removeChild(div);

			expect(div).toEqual(clone);
			expect(div !== clone).toBe(true);

			expect(clone.children).toEqual(
				clone.childNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE)
			);
		});
	});

	describe('appendChild()', () => {
		it('Appends an Node to another Node.', () => {
			const child = document.createElement('span');
			const parent1 = document.createElement('div');
			const parent2 = document.createElement('div');

			parent1.appendChild(child);

			expect(child.parentNode).toBe(parent1);
			expect(parent1.childNodes).toEqual([child]);

			parent2.appendChild(child);
			expect(child.parentNode).toBe(parent2);
			expect(parent1.childNodes).toEqual([]);
			expect(parent2.childNodes).toEqual([child]);

			expect(child.isConnected).toBe(false);

			document.body.appendChild(parent2);

			expect(child.isConnected).toBe(true);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the child nodes instead of the actual node if the type is DocumentFragment.', () => {
			const template = document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const div = document.createElement('div');
			const clone = template.content.cloneNode(true);

			div.appendChild(clone);

			expect(clone.childNodes).toEqual([]);
			expect(div.innerHTML).toBe('<div>Div</div><span>Span</span>');
		});

		it('Throws an error if the append node is the parentNode of the current node.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('div');
			parent.appendChild(child);
			try {
				child.appendChild(parent);
			} catch (error) {
				expect(error).toEqual(
					new DOMException(
						"Failed to execute 'appendChild' on 'Node': The new child element contains the parent.",
						DOMExceptionNameEnum.domException
					)
				);
			}
		});
	});

	describe('removeChild()', () => {
		it('Removes a child Node from its parent and returns a reference to a removed node.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child);

			expect(child.parentNode).toBe(parent);
			expect(parent.childNodes).toEqual([child]);
			expect(child.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(child.isConnected).toBe(true);

			const removed = parent.removeChild(child);

			expect(child.parentNode).toBe(null);
			expect(parent.childNodes).toEqual([]);
			expect(child.isConnected).toBe(false);
			expect(removed).toEqual(child);
		});
	});

	describe('insertBefore()', () => {
		it('Inserts a Node before another reference Node.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const newNode = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.insertBefore(newNode, child2);

			expect(newNode.parentNode).toBe(parent);
			expect(parent.childNodes).toEqual([child1, newNode, child2]);
			expect(newNode.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(newNode.isConnected).toBe(true);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Insert the child nodes instead of the actual node before another reference Node if the type is DocumentFragment.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const template = document.createElement('template');
			const parent = document.createElement('div');

			template.innerHTML = '<div>Template DIV 1</div><span>Template SPAN 1</span>';

			const clone = template.content.cloneNode(true);

			parent.appendChild(child1);
			parent.appendChild(child2);

			parent.insertBefore(clone, child2);

			expect(parent.innerHTML).toEqual(
				'<span></span><div>Template DIV 1</div><span>Template SPAN 1</span><span></span>'
			);
		});

		it('Inserts a Node after all children if reference node is "null".', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const newNode = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.insertBefore(newNode, null);

			expect(parent.childNodes[0]).toBe(child1);
			expect(parent.childNodes[1]).toBe(child2);
			expect(parent.childNodes[2]).toBe(newNode);
			expect(newNode.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(newNode.isConnected).toBe(true);
		});

		it('Throws an exception if reference node is node sent.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const newNode = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child1);
			parent.appendChild(child2);

			expect(() => parent.insertBefore(newNode)).toThrow(
				"Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only 1 present."
			);
		});

		it('Throws an exception if reference node is not child of parent node.', () => {
			const referenceNode = document.createElement('span');
			const newNode = document.createElement('span');
			const parent = document.createElement('div');

			expect(() => parent.insertBefore(newNode, referenceNode)).toThrow(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
			);
		});
	});

	describe('replaceChild()', () => {
		it('Inserts a Node before another reference Node.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const newNode = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.replaceChild(newNode, child2);

			expect(newNode.parentNode).toBe(parent);
			expect(parent.childNodes).toEqual([child1, newNode]);
			expect(newNode.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(newNode.isConnected).toBe(true);
		});
	});

	describe('dispatchEvent()', () => {
		it('Dispatches an event that is set to not bubble.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: false });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', (event) => (childEvent = event));
			parent.addEventListener('click', (event) => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(true);

			expect(childEvent).toBe(event);
			expect(childEvent.target).toBe(child);
			expect(childEvent.currentTarget).toBe(child);
			expect(parentEvent).toBe(null);
		});

		it('Dispatches an event that is set to bubble.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: true });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', (event) => (childEvent = event));
			parent.addEventListener('click', (event) => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(true);

			expect(childEvent).toBe(event);
			expect(parentEvent).toBe(event);
			expect(parentEvent.target).toBe(child);
			expect(parentEvent.currentTarget).toBe(parent);
		});

		it('Does not bubble to parent if propagation is stopped.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: false });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', (event) => {
				event.stopPropagation();
				childEvent = event;
			});
			parent.addEventListener('click', (event) => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(true);

			expect(childEvent).toBe(event);
			expect(parentEvent).toBe(null);
		});

		it('Returns false if preventDefault() is called and the event is cancelable.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: true, cancelable: true });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', (event) => {
				event.preventDefault();
				childEvent = event;
			});
			parent.addEventListener('click', (event) => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(false);

			expect(childEvent).toBe(event);
			expect(parentEvent).toBe(event);
		});
	});

	describe('compareDocumentPosition()', () => {
		it('Returns 0 if b is a', () => {
			const div = document.createElement('div');
			div.id = 'element';

			document.body.appendChild(div);

			expect(
				document
					.getElementById('element')
					.compareDocumentPosition(document.getElementById('element'))
			).toEqual(0);
		});

		it('Returns 4 if b is following a', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			span1.id = 'span1';
			const span2 = document.createElement('span');
			span2.id = 'span2';

			div.appendChild(span1);
			div.appendChild(span2);
			document.body.appendChild(div);

			expect(
				document.getElementById('span1').compareDocumentPosition(document.getElementById('span2'))
			).toEqual(4);
		});

		it('Returns 2 if b is preceding a', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			span1.id = 'span1';
			const span2 = document.createElement('span');
			span2.id = 'span2';

			div.appendChild(span1);
			div.appendChild(span2);
			document.body.appendChild(div);

			expect(
				document.getElementById('span2').compareDocumentPosition(document.getElementById('span1'))
			).toEqual(2);
		});

		it('Returns 20 if b is contained by a', () => {
			const div = document.createElement('div');
			div.id = 'parent';
			const span = document.createElement('span');
			span.id = 'child';

			div.appendChild(span);
			document.body.appendChild(div);

			const position = document
				.getElementById('parent')
				.compareDocumentPosition(document.getElementById('child'));
			expect(position).toEqual(20);
		});

		it('Returns 10 if b contains a', () => {
			const div = document.createElement('div');
			div.id = 'parent';
			const span = document.createElement('span');
			span.id = 'child';

			div.appendChild(span);
			document.body.appendChild(div);

			const position = document
				.getElementById('child')
				.compareDocumentPosition(document.getElementById('parent'));
			expect(position).toEqual(10);
		});
	});
});
