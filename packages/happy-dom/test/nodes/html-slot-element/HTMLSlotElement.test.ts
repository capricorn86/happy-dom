import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import IHTMLSlotElement from '../../../src/nodes/html-slot-element/IHTMLSlotElement';
import CustomElementWithNamedSlots from './CustomElementWithNamedSlots';
import CustomElementWithSlot from './CustomElementWithSlot';
import INodeList from '../../../src/nodes/node/INodeList';

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
			const slot = <IHTMLSlotElement>customElementWithSlot.shadowRoot.querySelector('slot');
			expect(slot.name).toBe('');
			slot.setAttribute('name', 'value');
			expect(slot.name).toBe('value');
		});
	});

	describe('set name()', () => {
		it('Sets attribute value.', () => {
			const slot = <IHTMLSlotElement>customElementWithSlot.shadowRoot.querySelector('slot');
			slot.name = 'value';
			expect(slot.getAttribute('name')).toBe('value');
		});
	});

	describe('assign()', () => {
		it("Sets the slot's manually assigned nodes to an ordered set of slottables.", () => {
			const slot = <IHTMLSlotElement>customElementWithSlot.shadowRoot.querySelector('slot');
			// TODO: Do nothing for now. We need to find an example of how it is expected to work before it can be implemented.
			expect(slot.assign()).toBe(undefined);
		});
	});

	describe('assignedNodes()', () => {
		it('Returns nodes appended to the custom element.', () => {
			const slot = <IHTMLSlotElement>customElementWithSlot.shadowRoot.querySelector('slot');
			const text = document.createTextNode('text');
			const comment = document.createComment('text');
			const div = document.createElement('div');
			const span = document.createElement('span');

			customElementWithSlot.appendChild(text);
			customElementWithSlot.appendChild(comment);
			customElementWithSlot.appendChild(div);
			customElementWithSlot.appendChild(span);

			expect(slot.assignedNodes()).toEqual(customElementWithSlot.childNodes);
		});

		it('Only return elements that has the proeprty "slot" set to the same value as the property "name" of the slot.', () => {
			const text = document.createTextNode('text');
			const comment = document.createComment('text');
			const div = document.createElement('div');
			const span = document.createElement('span');

			div.slot = 'slot1';

			customElementWithNamedSlots.appendChild(text);
			customElementWithNamedSlots.appendChild(comment);
			customElementWithNamedSlots.appendChild(div);
			customElementWithNamedSlots.appendChild(span);

			const slots = <INodeList<IHTMLSlotElement>>(
				customElementWithNamedSlots.shadowRoot.querySelectorAll('slot')
			);

			expect(slots[0].assignedNodes()).toEqual([div]);
			expect(slots[1].assignedNodes()).toEqual([]);
		});
	});

	describe('assignedElements()', () => {
		it('Returns elements appended to the custom element.', () => {
			const slot = <IHTMLSlotElement>customElementWithSlot.shadowRoot.querySelector('slot');
			const text = document.createTextNode('text');
			const comment = document.createComment('text');
			const div = document.createElement('div');
			const span = document.createElement('span');

			customElementWithSlot.appendChild(text);
			customElementWithSlot.appendChild(comment);
			customElementWithSlot.appendChild(div);
			customElementWithSlot.appendChild(span);

			expect(slot.assignedElements()).toEqual(customElementWithSlot.children);
		});

		it('Only return elements that has the proeprty "slot" set to the same value as the property "name" of the slot.', () => {
			const text = document.createTextNode('text');
			const comment = document.createComment('text');
			const div = document.createElement('div');
			const span1 = document.createElement('span');
			const span2 = document.createElement('span');

			div.slot = 'slot1';
			span1.slot = 'slot1';
			span2.slot = 'slot2';

			customElementWithNamedSlots.appendChild(text);
			customElementWithNamedSlots.appendChild(comment);
			customElementWithNamedSlots.appendChild(div);
			customElementWithNamedSlots.appendChild(span1);
			customElementWithNamedSlots.appendChild(span2);

			const slots = <INodeList<IHTMLSlotElement>>(
				customElementWithNamedSlots.shadowRoot.querySelectorAll('slot')
			);

			expect(slots[0].assignedElements()).toEqual([div, span1]);
			expect(slots[1].assignedElements()).toEqual([span2]);
		});
	});
});
