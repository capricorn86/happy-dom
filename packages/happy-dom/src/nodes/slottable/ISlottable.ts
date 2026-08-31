import type HTMLSlotElement from '../html-slot-element/HTMLSlotElement.js';

/**
 * Slottable.
 *
 * @see https://dom.spec.whatwg.org/#slotable
 */
export default interface ISlottable {
	readonly assignedSlot: HTMLSlotElement | null;
}
