import Window from '../../../src/window/Window';
import CustomElement from '../../CustomElement';
import Node from '../../../src/nodes/node/Node';
import Event from '../../../src/event/Event';

describe('Node', () => {
	let window, document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		window.customElements.define('custom-element', CustomElement);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get isConnected()', () => {
		test('Returns "true" if the node is connected to the document.', () => {
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

	describe('set isConnected()', () => {
		test('Sets an element and all its children to be connected.', () => {
			const div = document.createElement('div');
			const span = document.createElement('span');
			const text = document.createTextNode('text');

			div.appendChild(span);
			span.appendChild(text);

			div.isConnected = true;

			expect(div.isConnected).toBe(true);
			expect(span.isConnected).toBe(true);
			expect(text.isConnected).toBe(true);
		});
	});

	describe('get nodeValue()', () => {
		test('Returns null.', () => {
			expect(new Node().nodeValue).toBe(null);
		});
	});

	describe('get nodeName()', () => {
		test('Returns emptry string.', () => {
			expect(new Node().nodeName).toBe('');
		});
	});

	describe('get previousSibling()', () => {
		test('Returns previous sibling.', () => {
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
		test('Returns next sibling.', () => {
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
		test('Returns the first child node.', () => {
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
		test('Returns the last child node.', () => {
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
		test('Returns parent element.', () => {
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const text = document.createTextNode('text');

			span1.appendChild(text);
			div.appendChild(span1);

			expect(text.parentElement).toBe(span1);
		});

		test('Returns null if there is no parent node.', () => {
			const text = document.createTextNode('text');

			expect(text.parentElement).toBe(null);
		});
	});

	describe('connectedCallback()', () => {
		test('Calls connected callback when a custom element is connected to DOM.', () => {
			const customElement = document.createElement('custom-element');

			expect(customElement.shadowRoot.innerHTML === '').toBe(true);

			document.body.appendChild(customElement);

			expect(customElement.shadowRoot.innerHTML === '').toBe(false);
		});
	});

	describe('disconnectedCallback()', () => {
		test('Calls disconnected callback when a custom element is connected to DOM.', () => {
			const customElement = document.createElement('custom-element');
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

	describe('cloneNode()', () => {
		test('Makes a shallow clone of a node (default behavior).', () => {
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

		test('Makes a deep clone of a node.', () => {
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
				clone.childNodes.filter(node => node.nodeType === Node.ELEMENT_NODE)
			);
		});
	});

	describe('appendChild()', () => {
		test('Appends an Node to another Node.', () => {
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
		test('Append the child nodes instead of the actual node if the type is DocumentFragment.', () => {
			const template = document.createElement('template');

			template.innerHTML = '<div>Div</div><span>Span</span>';

			const div = document.createElement('div');
			const clone = template.content.cloneNode(true);

			div.appendChild(clone);

			expect(clone.childNodes).toEqual([]);
			expect(div.innerHTML).toBe('<div>Div</div><span>Span</span>');
		});
	});

	describe('removeChild()', () => {
		test('Removes a child Node from its parent.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');

			parent.appendChild(child);

			expect(child.parentNode).toBe(parent);
			expect(parent.childNodes).toEqual([child]);
			expect(child.isConnected).toBe(false);

			document.body.appendChild(parent);

			expect(child.isConnected).toBe(true);

			parent.removeChild(child);

			expect(child.parentNode).toBe(null);
			expect(parent.childNodes).toEqual([]);
			expect(child.isConnected).toBe(false);
		});
	});

	describe('insertBefore()', () => {
		test('Inserts a Node before another reference Node.', () => {
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
		test('Insert the child nodes instead of the actual node before another reference Node if the type is DocumentFragment.', () => {
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

		test('Inserts a Node after all children if no reference given.', () => {
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
	});

	describe('insertAdjacentElement()', () => {
		test('Inserts a Node right before the reference element and returns with it.', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');

			document.body.appendChild(parent);

			const insertedNode = parent.insertAdjacentElement('beforebegin', newNode);

			expect(insertedNode).toBe(newNode);
			expect(parent.childNodes).toEqual([]);
			expect(insertedNode.isConnected).toBe(true);
			expect(document.body.childNodes[0]).toBe(newNode);
		});

		test('Returns with null if cannot insert with "beforebegin".', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');
			const insertedNode = parent.insertAdjacentElement('beforebegin', newNode);

			expect(insertedNode).toBe(null);
			expect(newNode.isConnected).toBe(false);
		});

		test('Inserts a Node inside the reference element before the first child and returns with it.', () => {
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

		test('Inserts a Node inside the reference element after the last child and returns with it.', () => {
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

		test('Inserts a Node right after the reference element and returns with it.', () => {
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

		test('Inserts a Node right after the reference element and returns with it.', () => {
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

		test('Returns with null if cannot insert with "afterend".', () => {
			const parent = document.createElement('div');
			const newNode = document.createElement('span');
			const insertedNode = parent.insertAdjacentElement('afterend', newNode);

			expect(insertedNode).toBe(null);
			expect(newNode.isConnected).toBe(false);
		});
	});

	describe('insertAdjacentHTML()', () => {
		test('Inserts the given HTML right before the reference element.', () => {
			const parent = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			parent.insertAdjacentHTML('beforebegin', markup);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0].outerHTML).toEqual(markup);
		});

		test('Inserts the given HTML inside the reference element before the first child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const markup = '<span>markup</span>';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterbegin', markup);

			expect(parent.childNodes[0].outerHTML).toEqual(markup);
			expect(parent.childNodes[1]).toBe(child);
		});

		test('Inserts the given HTML inside the reference element after the last child.', () => {
			const parent = document.createElement('div');
			const child = document.createElement('span');
			const markup = '<span>markup</span>';

			parent.appendChild(child);
			document.body.appendChild(parent);
			parent.insertAdjacentHTML('beforeend', markup);

			expect(parent.childNodes[0]).toBe(child);
			expect(parent.childNodes[1].outerHTML).toEqual(markup);
		});

		test('Inserts the given HTML right after the reference element.', () => {
			const parent = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0]).toBe(parent);
			expect(document.body.childNodes[1].outerHTML).toEqual(markup);
		});

		test('Inserts the given HTML right after the reference element if it has a sibling.', () => {
			const parent = document.createElement('div');
			const sibling = document.createElement('div');
			const markup = '<span>markup</span>';

			document.body.appendChild(parent);
			document.body.appendChild(sibling);
			parent.insertAdjacentHTML('afterend', markup);

			expect(parent.childNodes).toEqual([]);
			expect(document.body.childNodes[0]).toBe(parent);
			expect(document.body.childNodes[1].outerHTML).toEqual(markup);
			expect(document.body.childNodes[2]).toBe(sibling);
		});
	});

	describe('replaceChild()', () => {
		test('Inserts a Node before another reference Node.', () => {
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
		test('Dispatches an event that is set to not bubble.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: false });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', event => (childEvent = event));
			parent.addEventListener('click', event => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(true);

			expect(childEvent).toBe(event);
			expect(childEvent.target).toBe(child);
			expect(childEvent.currentTarget).toBe(child);
			expect(parentEvent).toBe(null);
		});

		test('Dispatches an event that is set to bubble.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: true });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', event => (childEvent = event));
			parent.addEventListener('click', event => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(true);

			expect(childEvent).toBe(event);
			expect(parentEvent).toBe(event);
			expect(parentEvent.target).toBe(child);
			expect(parentEvent.currentTarget).toBe(parent);
		});

		test('Does not bubble to parent if propagation is stopped.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: false });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', event => {
				event.stopPropagation();
				childEvent = event;
			});
			parent.addEventListener('click', event => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(true);

			expect(childEvent).toBe(event);
			expect(parentEvent).toBe(null);
		});

		test('Returns false if preventDefault() is called and the event is cancelable.', () => {
			const child = document.createElement('span');
			const parent = document.createElement('div');
			const event = new Event('click', { bubbles: true, cancelable: true });
			let childEvent = null;
			let parentEvent = null;

			parent.appendChild(child);

			child.addEventListener('click', event => {
				event.preventDefault();
				childEvent = event;
			});
			parent.addEventListener('click', event => (parentEvent = event));

			expect(child.dispatchEvent(event)).toBe(false);

			expect(childEvent).toBe(event);
			expect(parentEvent).toBe(event);
		});
	});
});
