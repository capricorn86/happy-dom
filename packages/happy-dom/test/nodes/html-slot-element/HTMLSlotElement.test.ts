import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLSlotElement from '../../../src/nodes/html-slot-element/HTMLSlotElement.js';
import CustomElementWithNamedSlots from './CustomElementWithNamedSlots.js';
import CustomElementWithSlot from './CustomElementWithSlot.js';
import Event from '../../../src/event/Event.js';
import { beforeEach, describe, it, expect } from 'vitest';

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
			const slot = <HTMLSlotElement>customElementWithSlot.shadowRoot?.querySelector('slot');
			// TODO: Do nothing for now. We need to find an example of how it is expected to work before it can be implemented.
			expect(slot.assign()).toBe(undefined);
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

			expect(slot1.assignedNodes()).toEqual([text1, comment1, element1]);

			expect(slot2.assignedNodes()).toEqual([text2, comment2, element2]);

			expect(slot3.assignedNodes()).toEqual([text3, comment3, element3]);
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

			expect(slot1.assignedNodes()).toEqual([element1]);

			expect(slot2.assignedNodes()).toEqual([element2]);

			expect(slot3.assignedNodes()).toEqual([element3]);
		});
	});

	describe('dispatchEvent()', () => {
		it('Doesn\'n dispatch "slotchange" event when setting "name" attribute if assigned nodes isn\'t changed.', () => {
			const slot = <HTMLSlotElement>customElementWithNamedSlots.shadowRoot?.querySelector('slot');
			let dispatchedEvent: Event | null = null;

			slot.addEventListener('slotchange', (event) => (dispatchedEvent = event));
			slot.setAttribute('name', 'new-name');

			expect(dispatchedEvent).toBe(null);
		});

		it('Doesn\'n dispatch "slotchange" event when changing "name" attribute if assigned nodes are changed, even if there is a child with matching "slot" attribute.', () => {
			const slot = <HTMLSlotElement>customElementWithNamedSlots.shadowRoot?.querySelector('slot');
			let dispatchedEvent: Event | null = null;

			const div = document.createElement('div');
			div.setAttribute('slot', 'slot1');
			customElementWithNamedSlots.appendChild(div);

			slot.addEventListener('slotchange', (event) => (dispatchedEvent = event));
			slot.setAttribute('name', 'new-name');

			expect(dispatchedEvent).toBe(null);
		});

		it('Dispatches "slotchange" event when changing "name" attribute if assigned nodes are changed.', () => {
			const slot = <HTMLSlotElement>customElementWithNamedSlots.shadowRoot?.querySelector('slot');
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
			const dispatchedEvent3: Event | null = null;

			const div = document.createElement('div');
			div.setAttribute('slot', 'slot1');
			const span = document.createElement('span');
			div.appendChild(span);
			customElementWithNamedSlots.appendChild(div);

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));

			div.setAttribute('slot', 'slot2');

			expect((<Event>(<unknown>dispatchedEvent1)).type).toBe('slotchange');
			expect((<Event>(<unknown>dispatchedEvent2)).type).toBe('slotchange');
			expect(dispatchedEvent3).toBe(null);

			dispatchedEvent1 = null;
			dispatchedEvent2 = null;

			div.removeAttribute('slot');

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect((<Event>(<unknown>dispatchedEvent3)).type).toBe('slotchange');
		});

		it('Dispatches "slotchange" event adding an element to a named slot', () => {
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

			const newNode = document.createElement('span');

			div.appendChild(newNode);

			expect((<Event>(<unknown>dispatchedEvent)).type).toBe('slotchange');
		});

		it('Dispatches "slotchange" event adding a text node to a named slot', () => {
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

			const newNode = document.createTextNode('test');

			div.appendChild(newNode);

			expect((<Event>(<unknown>dispatchedEvent)).type).toBe('slotchange');
		});

		it('Doesn\'t dispatch "slotchange" event adding a comment node to a named slot', () => {
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

			const newNode = document.createComment('test');

			div.appendChild(newNode);

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
			const dispatchedEvent3: Event | null = null;

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));

			const newNode = document.createElement('span');
			customElementWithNamedSlots.appendChild(newNode);

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect((<Event>(<unknown>dispatchedEvent3)).type).toBe('slotchange');
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
			const dispatchedEvent3: Event | null = null;

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));

			const newNode = document.createTextNode('test');
			customElementWithNamedSlots.appendChild(newNode);

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect((<Event>(<unknown>dispatchedEvent3)).type).toBe('slotchange');
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
			const dispatchedEvent3: Event | null = null;

			slot1.addEventListener('slotchange', (event) => (dispatchedEvent1 = event));
			slot2.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));
			slot3.addEventListener('slotchange', (event) => (dispatchedEvent2 = event));

			const newNode = document.createComment('test');
			customElementWithNamedSlots.appendChild(newNode);

			expect(dispatchedEvent1).toBe(null);
			expect(dispatchedEvent2).toBe(null);
			expect(dispatchedEvent3).toBe(null);
		});
	});
});
