import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import Node from '../../../src/nodes/node/Node.js';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import HTMLTemplateElement from '../../../src/nodes/html-template-element/HTMLTemplateElement.js';
import Event from '../../../src/event/Event.js';
import DOMException from '../../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';
import Text from '../../../src/nodes/text/Text.js';
import EventPhaseEnum from '../../../src/event/EventPhaseEnum.js';

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
	let window: Window;
	let document: Document;
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

		it('Returns "false" if match node is null.', () => {
			const div = document.createElement('div');

			expect(div.contains(null)).toBe(false);
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

			expect(Array.from(clone.children)).toEqual(
				Array.from(clone.childNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE))
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
			expect(Array.from(parent1.childNodes)).toEqual([child]);

			parent2.appendChild(child);
			expect(child.parentNode).toBe(parent2);
			expect(Array.from(parent1.childNodes)).toEqual([]);
			expect(Array.from(parent2.childNodes)).toEqual([child]);

			expect(child.isConnected).toBe(false);

			document.body.appendChild(parent2);

			expect(child.isConnected).toBe(true);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Append the child nodes instead of the actual node if the type is DocumentFragment.', () => {
			const template = <HTMLTemplateElement>document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const div = document.createElement('div');
			const clone = template.content.cloneNode(true);

			div.appendChild(clone);

			expect(Array.from(clone.childNodes)).toEqual([]);
			expect(div.innerHTML).toBe('<div>Div</div><span>Span</span>');
		});

		it('Throws an error if the node to append is the parent of the current node.', () => {
			const parent = document.createElement('div');
			const child1 = document.createElement('div');
			const child2 = document.createElement('div');
			child1.appendChild(child2);
			parent.appendChild(child1);
			try {
				child2.appendChild(parent);
			} catch (error) {
				expect(error).toEqual(
					new DOMException(
						"Failed to execute 'appendChild' on 'Node': The new node is a parent of the node to insert to.",
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
			expect(Array.from(parent.childNodes)).toEqual([child]);
			expect(child.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(child.isConnected).toBe(true);

			const removed = parent.removeChild(child);

			expect(child.parentNode).toBe(null);
			expect(Array.from(parent.childNodes)).toEqual([]);
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
			expect(Array.from(parent.childNodes)).toEqual([child1, newNode, child2]);
			expect(newNode.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(newNode.isConnected).toBe(true);
		});

		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		it('Insert the child nodes instead of the actual node before another reference Node if the type is DocumentFragment.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const template = <HTMLTemplateElement>document.createElement('template');
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

		it('If reference node is null or undefined, the newNode should be inserted at the end of the peer node.', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');
			const newNode = document.createElement('span');
			const newNode1 = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child1);
			parent.appendChild(child2);
			parent.insertBefore(newNode, null);
			parent.insertBefore(newNode1, undefined);

			expect(parent.childNodes[0]).toBe(child1);
			expect(parent.childNodes[1]).toBe(child2);
			expect(parent.childNodes[2]).toBe(newNode);
			expect(parent.childNodes[3]).toBe(newNode1);
		});

		it('Throws an exception if reference node is not child of parent node.', () => {
			const referenceNode = document.createElement('span');
			const newNode = document.createElement('span');
			const parent = document.createElement('div');

			expect(() => parent.insertBefore(newNode, referenceNode)).toThrow(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
			);
		});

		it('Throws an error if the node to insert is the parent of the current node.', () => {
			const parent = document.createElement('div');
			const child1 = document.createElement('div');
			const child2 = document.createElement('div');

			child1.appendChild(child2);
			parent.appendChild(child1);

			try {
				child2.insertBefore(parent, null);
			} catch (error) {
				expect(error).toEqual(
					new DOMException(
						"Failed to execute 'insertBefore' on 'Node': The new node is a parent of the node to insert to.",
						DOMExceptionNameEnum.domException
					)
				);
			}
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
			expect(Array.from(parent.childNodes)).toEqual([child1, newNode]);
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

		it('Supports capture events that are not bubbles.', () => {
			const parent = document.createElement('div');
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');

			child1.appendChild(child2);
			parent.appendChild(child1);

			const event = new Event('blur', { bubbles: false, cancelable: true });
			const parentEvents = [];
			const child1Events = [];
			const child2Events = [];

			parent.addEventListener(
				'blur',
				(event) => {
					expect(event.eventPhase).toBe(EventPhaseEnum.capturing);
					parentEvents.push(event);
				},
				true
			);

			child1.addEventListener('blur', (event) => {
				expect(event.eventPhase).toBe(EventPhaseEnum.bubbling);
				child1Events.push(event);
			});

			child2.addEventListener('blur', (event) => {
				expect(event.eventPhase).toBe(EventPhaseEnum.atTarget);
				child2Events.push(event);
			});

			child2.dispatchEvent(event);

			expect(child1Events.length).toBe(0);
			expect(child2Events.length).toBe(1);
			expect(child2Events[0] === event).toBe(true);
			expect(parentEvents.length).toBe(1);
			expect(parentEvents[0] === event).toBe(true);
		});

		it('Supports capture events that bubbles.', () => {
			const parent = document.createElement('div');
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');

			child1.appendChild(child2);
			parent.appendChild(child1);

			const event = new Event('blur', { bubbles: true, cancelable: true });
			const parentEvents = [];
			const child1Events = [];
			const child2Events = [];

			parent.addEventListener(
				'blur',
				(event) => {
					expect(event.eventPhase).toBe(EventPhaseEnum.capturing);
					parentEvents.push(event);
				},
				true
			);

			child1.addEventListener('blur', (event) => {
				expect(event.eventPhase).toBe(EventPhaseEnum.bubbling);
				child1Events.push(event);
			});

			child2.addEventListener('blur', (event) => {
				expect(event.eventPhase).toBe(EventPhaseEnum.atTarget);
				child2Events.push(event);
			});

			child2.dispatchEvent(event);

			expect(child1Events.length).toBe(1);
			expect(child1Events[0] === event).toBe(true);
			expect(child2Events.length).toBe(1);
			expect(child2Events[0] === event).toBe(true);
			expect(parentEvents.length).toBe(1);
			expect(parentEvents[0] === event).toBe(true);
		});

		it('Supports capture events on document simulating what Test Library is doing when listenening to "blur" and "focus".', () => {
			const child1 = document.createElement('span');
			const child2 = document.createElement('span');

			child1.appendChild(child2);
			document.body.appendChild(child1);

			const event = new Event('blur', { bubbles: false, composed: true });
			const documentEvents = [];
			const child1Events = [];
			const child2Events = [];

			document.addEventListener(
				'blur',
				(event) => {
					expect(event.eventPhase).toBe(EventPhaseEnum.capturing);
					documentEvents.push(event);
				},
				{
					capture: true,
					passive: true
				}
			);

			child1.addEventListener('blur', (event) => {
				expect(event.eventPhase).toBe(EventPhaseEnum.bubbling);
				child1Events.push(event);
			});

			child2.addEventListener('blur', (event) => {
				expect(event.eventPhase).toBe(EventPhaseEnum.atTarget);
				child2Events.push(event);
			});

			child2.dispatchEvent(event);

			expect(child1Events.length).toBe(0);
			expect(child2Events.length).toBe(1);
			expect(child2Events[0] === event).toBe(true);
			expect(documentEvents.length).toBe(1);
			expect(documentEvents[0] === event).toBe(true);
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

	describe('normalize()', () => {
		it('Normalizes an element.', () => {
			const txt = document.createTextNode.bind(document);
			const div = document.createElement('div');
			const span = document.createElement('span');
			span.append(txt('sp'), txt('an'));
			const b = document.createElement('b');
			b.append(txt(''), txt(''), txt(''));
			div.append(txt(''), txt('d'), txt(''), txt('i'), txt('v'), span, txt(''), b, txt(''));
			expect(div.childNodes).toHaveLength(9);
			div.normalize();
			expect(div.childNodes).toHaveLength(3);
			expect(div.childNodes[0]).toBeInstanceOf(Text);
			expect(div.childNodes[0].nodeValue).toBe('div');
			expect(div.childNodes[1]).toBe(span);
			expect(div.childNodes[2]).toBe(b);
			expect(span.childNodes).toHaveLength(1);
			expect(span.childNodes[0]).toBeInstanceOf(Text);
			expect(span.childNodes[0].nodeValue).toBe('span');
			expect(b.childNodes).toHaveLength(0);
		});

		it('Normalizes a document fragment.', () => {
			const txt = document.createTextNode.bind(document);
			const fragment = document.createDocumentFragment();
			const span = document.createElement('span');
			span.append(txt('sp'), txt('an'));
			const b = document.createElement('b');
			b.append(txt(''), txt(''), txt(''));
			fragment.append(txt(''), txt('d'), txt(''), txt('i'), txt('v'), span, txt(''), b, txt(''));
			expect(fragment.childNodes).toHaveLength(9);
			fragment.normalize();
			expect(fragment.childNodes).toHaveLength(3);
			expect(fragment.childNodes[0]).toBeInstanceOf(Text);
			expect(fragment.childNodes[0].nodeValue).toBe('div');
			expect(fragment.childNodes[1]).toBe(span);
			expect(fragment.childNodes[2]).toBe(b);
			expect(span.childNodes).toHaveLength(1);
			expect(span.childNodes[0]).toBeInstanceOf(Text);
			expect(span.childNodes[0].nodeValue).toBe('span');
			expect(b.childNodes).toHaveLength(0);
		});

		it('Normalizes the document.', () => {
			const count = document.childNodes.length;
			document.append(document.createTextNode(''));
			expect(document.childNodes).toHaveLength(count + 1);
			document.normalize();
			expect(document.childNodes).toHaveLength(count);
		});

		it('Does nothing on a text node.', () => {
			const div = document.createElement('div');
			const node = div.appendChild(document.createTextNode(''));
			node.normalize();
			expect(div.childNodes).toHaveLength(1);
			expect(div.childNodes[0]).toBe(node);
		});
	});
});
