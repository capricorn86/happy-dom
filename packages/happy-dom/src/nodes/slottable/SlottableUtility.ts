import * as PropertySymbol from '../../PropertySymbol.js';
import type Element from '../element/Element.js';
import type HTMLSlotElement from '../html-slot-element/HTMLSlotElement.js';
import type Text from '../text/Text.js';

/**
 * Slottable utility.
 */
export default class SlottableUtility {
	/**
	 * Returns the slot a slottable node is assigned to.
	 *
	 * A node is only assigned when its parent hosts a shadow root. Under the
	 * "manual" slot assignment mode the slot is whichever one the node was
	 * assigned to by HTMLSlotElement.assign(), otherwise it is the first slot
	 * matching the node's slot name. A Text node has no slot name, so it can
	 * only ever be assigned to a default slot.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-slotable-assignedslot
	 * @param slottable Slottable node.
	 * @returns Slot element or null.
	 */
	public static getAssignedSlot(slottable: Element | Text): HTMLSlotElement | null {
		const parentNode = slottable[PropertySymbol.parentNode];

		if (!parentNode) {
			return null;
		}

		const shadowRoot = (<Element>parentNode)[PropertySymbol.shadowRoot];

		if (!shadowRoot) {
			return null;
		}

		if (shadowRoot[PropertySymbol.slotAssignment] === 'manual') {
			return slottable[PropertySymbol.assignedToSlot];
		}

		const name = (<Element>slottable).slot || '';

		for (const slot of shadowRoot.querySelectorAll('slot')) {
			if ((<HTMLSlotElement>slot).name === name) {
				return <HTMLSlotElement>slot;
			}
		}

		return null;
	}
}
