import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLSlotElement from '../../../src/nodes/html-slot-element/HTMLSlotElement.js';
import CustomElementWithNamedSlots from './CustomElementWithNamedSlots.js';
import CustomElementWithSlot from './CustomElementWithSlot.js';
import Event from '../../../src/event/Event.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLElement from '../../../src/nodes/html-element/HTMLElement.js';
import ShadowRoot from '../../../src/nodes/shadow-root/ShadowRoot.js';

describe('HTMLSlotElement', () => {
	let window: Window;
	let document: Document;
	let customElementWithNamedSlots: CustomElementWithNamedSlots;
	let customElementWithSlot: CustomElementWithSlot;

	beforeEach(() => {
		window = new Window();
		document = window.document;

		window.customElements.define('custom-element-with-named-slots', CustomElementWithNamedSlots);
		window.customElements.define('custom-element-with-slot', CustomElementWithSlot);

		customElementWithNamedSlots = <CustomElementWithNamedSlots>(
			document.createElement('custom-element-with-named-slots')
		);
		customElementWithSlot = <CustomElementWithSlot>(
			document.createElement('custom-element-with-slot')
		);

		document.body.appendChild(customElementWithNamedSlots);
		document.body.appendChild(customElementWithSlot);
	});

	for (const event of ['slotchange']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				const element = <HTMLSlotElement>customElementWithSlot.shadowRoot?.querySelector('slot');
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				const element = <HTMLSlotElement>customElementWithSlot.shadowRoot?.querySelector('slot');
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

	describe('get name()', () => {
		it('Returns attribute value.', () => {
			const slot = <HTMLSlotElement>customElementWithSlot.shadowRoot?.querySelector('slot');
			expect(slot.name).toBe('');
			slot.setAttribute('name', 'value');
			expect(slot.name).toBe('value');
		});
	});

	describe('set name()', () => {
		it('Sets attribute value.', () => {
			const slot = <HTMLSlotElement>customElementWithSlot.shadowRoot?.querySelector('slot');
			slot.name = 'value';
			expect(slot.getAttribute('name')).toBe('value');
		});
	});

	describe('assign()', () => {
		it("Sets the slot's manually assigned nodes to an ordered set of slottables.", () => {
			/* eslint-disable jsdoc/require-jsdoc */
			class CustomElement extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode: 'open', slotAssignment: 'manual' });
				}

				public connectedCallback(): void {
					(<ShadowRoot>this.shadowRoot).innerHTML = `
                        <div>
                            <span><slot name="slot1"></slot></span>
                            <span><slot name="slot2"></slot></span>
                            <span><slot></slot></span>
                        </div>
                    `;
				}
			}
			/* eslint-enable jsdoc/require-jsdoc */

			window.customElements.define('custom-element', CustomElement);

			const customElement = <CustomElement>document.createElement('custom-element');

			document.body.appendChild(customElement);

			const slot1 = <HTMLSlotElement>customElement.shadowRoot?.querySelector('slot[name="slot1"]');
			const slot2 = <HTMLSlotElement>customElement.shadowRoot?.querySelector('slot[name="slot2"]');
			const slot3 = <HTMLSlotElement>customElement.shadowRoot?.querySelector('slot:not([name])');

			const node1 = document.createElement('div');
			const node2 = document.createTextNode('text');

			slot1.assign(node1, node2);

			expect(slot1.assignedNodes()).toEqual([]);
			expect(slot1.assignedElements()).toEqual([]);

			customElement.appendChild(node1);
			customElement.appendChild(node2);

			slot1.assign(node1, node2);

			expect(slot1.assignedNodes()).toEqual([node1, node2]);
			expect(slot1.assignedElements()).toEqual([node1]);

			customElement.removeChild(node1);
			customElement.removeChild(node2);

			expect(slot1.assignedNodes()).toEqual([]);
			expect(slot1.assignedElements()).toEqual([]);

			customElement.appendChild(node1);
			customElement.appendChild(node2);

			slot1.assign(node1, node2);
			slot2.assign(node1, node2);

			expect(slot1.assignedNodes()).toEqual([]);
			expect(slot2.assignedNodes()).toEqual([node1, node2]);
			expect(slot3.assignedNodes()).toEqual([]);

			expect(slot1.assignedElements()).toEqual([]);
			expect(slot2.assignedElements()).toEqual([node1]);
			expect(slot3.assignedElements()).toEqual([]);

			slot3.assign(node1, node2);

			expect(slot1.assignedNodes()).toEqual([]);
			expect(slot2.assignedNodes()).toEqual([]);
			expect(slot3.assignedNodes()).toEqual([node1, node2]);

			expect(slot1.assignedElements()).toEqual([]);
			expect(slot2.assignedElements()).toEqual([]);
			expect(slot3.assignedElements()).toEqual([node1]);
		});
	});

	describe('assignedNodes()', () => {
		it('Returns assigned nodes.', () => {
			const slot1 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			const slot2 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot2"]')
			);
			const slot3 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot:not([name])')
			);

			const slot1Element = document.createElement('div');
			slot1Element.setAttribute('slot', 'slot1');
			const slot2Element = document.createElement('div');
			slot2Element.setAttribute('slot', 'slot2');

			const text1 = document.createTextNode('text1');
			const comment1 = document.createComment('comment1');
			const element1 = document.createElement('span');

			slot1Element.appendChild(text1);
			slot1Element.appendChild(comment1);
			slot1Element.appendChild(element1);

			const text2 = document.createTextNode('text2');
			const comment2 = document.createComment('comment2');
			const element2 = document.createElement('span');

			slot2Element.appendChild(text2);
			slot2Element.appendChild(comment2);
			slot2Element.appendChild(element2);

			const text3 = document.createTextNode('text3');
			const comment3 = document.createComment('comment3');
			const element3 = document.createElement('span');

			customElementWithNamedSlots.appendChild(slot1Element);
			customElementWithNamedSlots.appendChild(slot2Element);
			customElementWithNamedSlots.appendChild(text3);
			customElementWithNamedSlots.appendChild(comment3);
			customElementWithNamedSlots.appendChild(element3);

			expect(slot1.assignedNodes()).toEqual([slot1Element]);

			expect(slot2.assignedNodes()).toEqual([slot2Element]);

			expect(slot3.assignedNodes()).toEqual([text3, comment3, element3]);
		});

		it('Returns assigned nodes flatten when sending it in as an option.', () => {
			/* eslint-disable jsdoc/require-jsdoc */
			class CustomElementA extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode: 'open' });

					(<ShadowRoot>this.shadowRoot).innerHTML =
						`<b><slot></slot><slot name="namedSlot"></slot></b>`;
				}
			}

			window.customElements.define('custom-element-a', CustomElementA);

			class CustomElementB extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({ mode: 'open' });

					(<ShadowRoot>this.shadowRoot).innerHTML =
						`<custom-element-a><slot></slot><slot name="namedSlot" slot="namedSlot"></slot></custom-element>`;
				}
			}

			window.customElements.define('custom-element-b', CustomElementB);

			/* eslint-enable jsdoc/require-jsdoc */

			const customElement = document.createElement('custom-element-b');
			customElement.innerHTML = `<div><span>Test 1</span></div><div slot="namedSlot"><span>Test 2</span></div>`;
			document.body.appendChild(customElement);

			const slot = <HTMLSlotElement>(
				customElement.shadowRoot
					?.querySelector('custom-element-a')
					?.shadowRoot?.querySelector('slot:not([name])')
			);
			const namedSlot = <HTMLSlotElement>(
				customElement.shadowRoot
					?.querySelector('custom-element-a')
					?.shadowRoot?.querySelector('slot[name="namedSlot"]')
			);

			expect(slot?.assignedNodes()).toEqual([
				customElement.shadowRoot?.querySelector('slot:not([name])')
			]);
			expect(namedSlot?.assignedNodes()).toEqual([
				customElement.shadowRoot?.querySelector('slot[name="namedSlot"]')
			]);
			expect(slot?.assignedNodes({ flatten: true })).toEqual([customElement.children[0]]);
			expect(namedSlot?.assignedNodes({ flatten: true })).toEqual([customElement.children[1]]);
		});
	});

	describe('assignedElements()', () => {
		it('Returns assigned elements.', () => {
			const slot1 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			const slot2 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot2"]')
			);
			const slot3 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot:not([name])')
			);

			const slot1Element = document.createElement('div');
			slot1Element.setAttribute('slot', 'slot1');
			const slot2Element = document.createElement('div');
			slot2Element.setAttribute('slot', 'slot2');

			const text1 = document.createTextNode('text1');
			const comment1 = document.createComment('comment1');
			const element1 = document.createElement('span');

			slot1Element.appendChild(text1);
			slot1Element.appendChild(comment1);
			slot1Element.appendChild(element1);

			const text2 = document.createTextNode('text2');
			const comment2 = document.createComment('comment2');
			const element2 = document.createElement('span');

			slot2Element.appendChild(text2);
			slot2Element.appendChild(comment2);
			slot2Element.appendChild(element2);

			const text3 = document.createTextNode('text3');
			const comment3 = document.createComment('comment3');
			const element3 = document.createElement('span');

			customElementWithNamedSlots.appendChild(slot1Element);
			customElementWithNamedSlots.appendChild(slot2Element);
			customElementWithNamedSlots.appendChild(text3);
			customElementWithNamedSlots.appendChild(comment3);
			customElementWithNamedSlots.appendChild(element3);

			expect(slot1.assignedElements()).toEqual([slot1Element]);

			expect(slot2.assignedElements()).toEqual([slot2Element]);

			expect(slot3.assignedElements()).toEqual([element3]);
		});
	});

	describe('dispatchEvent()', () => {
		it('Doesn\'t dispatch "slotchange" event when setting "name" attribute if assigned nodes isn\'t changed.', () => {
			const slot = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			let dispatchedEvent: Event | null = null;

			slot.addEventListener('slotchange', (event) => (dispatchedEvent = event));
			slot.setAttribute('name', 'new-name');

			expect(dispatchedEvent).toBe(null);
		});

		it('Dispatches "slotchange" event when changing "name" attribute if assigned nodes are changed.', () => {
			const slot = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			let dispatchedEvent: Event | null = null;

			const div = document.createElement('div');
			div.setAttribute('slot', 'slot1');
			const span = document.createElement('span');
			div.appendChild(span);
			customElementWithNamedSlots.appendChild(div);

			slot.addEventListener('slotchange', (event) => (dispatchedEvent = event));
			slot.setAttribute('name', 'new-name');

			expect((<Event>(<unknown>dispatchedEvent)).type).toBe('slotchange');
		});

		it('Dispatches "slotchange" event when changing "slot" attribute of slotted element if assigned nodes are changed.', () => {
			const slot1 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			const slot2 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot2"]')
			);
			const slot3 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot:not([name])')
			);
			let dispatchedEvent1: Event | null = null;
			let dispatchedEvent2: Event | null = null;
			let dispatchedEvent3: Event | null = null;

			const div = document.createElement('div');
			div.setAttribute('slot', 'slot1');
			const span = document.createElement('span');
			div.appendChild(span);
			customElementWithNamedSlots.appendChild(div);

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent3 = event));

			div.setAttribute('slot', 'slot2');

			expect((<Event>(<unknown>dispatchedEvent1)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent1)).bubbles).toBe(true);
			expect((<Event>(<unknown>dispatchedEvent2)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent2)).bubbles).toBe(true);
			expect(dispatchedEvent3).toBe(null);

			dispatchedEvent1 = null;
			dispatchedEvent2 = null;
			dispatchedEvent3 = null;

			div.removeAttribute('slot');

			expect(dispatchedEvent1).toBe(null);
			expect((<Event>(<unknown>dispatchedEvent2)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent2)).bubbles).toBe(true);
			expect((<Event>(<unknown>dispatchedEvent3)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent3)).bubbles).toBe(true);
		});

		it('Dispatches "slotchange" event adding an element to a named slot', () => {
			const slot = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			let dispatchedEvent: Event | null = null;

			const div = document.createElement('div');
			div.setAttribute('slot', 'slot1');

			slot.addEventListener('slotchange', (event) => (dispatchedEvent = event));

			customElementWithNamedSlots.appendChild(div);

			expect((<Event>(<unknown>dispatchedEvent)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent)).bubbles).toBe(true);

			// Should do nothing when adding a node to the slotted element
			dispatchedEvent = null;

			div.appendChild(document.createElement('span'));

			expect(dispatchedEvent).toBe(null);
		});

		it('Dispatches "slotchange" event adding an element to a default slot', () => {
			const slot1 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			const slot2 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot2"]')
			);
			const slot3 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot:not([name])')
			);
			let dispatchedEvent1: Event | null = null;
			let dispatchedEvent2: Event | null = null;
			let dispatchedEvent3: Event | null = null;

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent3 = event));

			const newNode = document.createElement('span');
			customElementWithNamedSlots.appendChild(newNode);

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect((<Event>(<unknown>dispatchedEvent3)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent3)).bubbles).toBe(true);
		});

		it('Dispatches "slotchange" event adding a text node to a default slot', () => {
			const slot1 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			const slot2 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot2"]')
			);
			const slot3 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot:not([name])')
			);
			let dispatchedEvent1: Event | null = null;
			let dispatchedEvent2: Event | null = null;
			let dispatchedEvent3: Event | null = null;

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent3 = event));

			const newNode = document.createTextNode('test');
			customElementWithNamedSlots.appendChild(newNode);

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect((<Event>(<unknown>dispatchedEvent3)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent3)).bubbles).toBe(true);
		});

		it('Doesn\'t dispatch "slotchange" event adding a comment node to a default slot', () => {
			const slot1 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot1"]')
			);
			const slot2 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot[name="slot2"]')
			);
			const slot3 = <HTMLSlotElement>(
				customElementWithNamedSlots.shadowRoot?.querySelector('slot:not([name])')
			);
			let dispatchedEvent1: Event | null = null;
			let dispatchedEvent2: Event | null = null;
			let dispatchedEvent3: Event | null = null;

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent3 = event));

			const newNode = document.createComment('test');
			customElementWithNamedSlots.appendChild(newNode);

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect(dispatchedEvent3).toBe(null);
		});

		it('Fires slotchange after the element is connected to the document', () => {
			const lifecycle: string[] = [];
			/* eslint-disable jsdoc/require-jsdoc */
			class CustomElement extends HTMLElement {
				constructor() {
					super();
					this.attachShadow({
						mode: 'open'
					});

					(<ShadowRoot>this.shadowRoot).innerHTML = `<div><slot name="image"></slot></div>`;
					const slot = (<ShadowRoot>this.shadowRoot).children[0].children[0];
					slot.addEventListener('slotchange', () => {
						lifecycle.push('slotchange.' + this.isConnected);
					});
				}

				public connectedCallback(): void {
					lifecycle.push('connected');
				}

				public disconnectedCallback(): void {
					lifecycle.push('disconnected');
				}
			}
			/* eslint-enable jsdoc/require-jsdoc */

			window.customElements.define('custom-element', CustomElement);

			const customElement = document.createElement('custom-element');

			customElement.innerHTML = '<img slot="image" src="test.jpg" />';

			document.body.appendChild(customElement);

			expect(lifecycle).toEqual(['connected', 'slotchange.true']);
		});
	});
});
