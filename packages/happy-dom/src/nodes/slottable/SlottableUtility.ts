import * as PropertySymbol from '../../PropertySymbol.js';
import type Element from '../element/Element.js';
import type HTMLSlotElement from '../html-slot-element/HTMLSlotElement.js';
import type Node from '../node/Node.js';

/**
 * Slottable utility.
 */
export default class SlottableUtility {
	/**
	 * Returns the slot a slottable node is assigned to.
	 *
	 * A node is only assigned when its parent hosts an open shadow root. A
	 * closed one resolves to null, as the slot would otherwise be a handle on a
	 * tree the caller is not allowed to reach.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-slotable-assignedslot
	 * @param slottable Slottable node.
	 * @param name Slot name the node asks for.
	 * @returns Slot element or null.
	 */
	public static getAssignedSlot(slottable: Node, name: string): HTMLSlotElement | null {
		const parentNode = slottable[PropertySymbol.parentNode];

		if (!parentNode) {
			return null;
		}

		const shadowRoot = (<Element>parentNode)[PropertySymbol.shadowRoot];

		if (!shadowRoot || shadowRoot[PropertySymbol.mode] !== 'open') {
			return null;
		}

		if (shadowRoot[PropertySymbol.slotAssignment] === 'manual') {
			const slot = slottable[PropertySymbol.assignedToSlot];
			// assignedToSlot is only cleared when the node is removed, not when
			// the slot is, so a slot detached from the tree can still be held.
			return slot && slot.getRootNode() === shadowRoot ? slot : null;
		}

		for (const slot of shadowRoot.querySelectorAll('slot')) {
			if (slot.name === name) {
				return slot;
			}
		}

		return null;
	}
}
