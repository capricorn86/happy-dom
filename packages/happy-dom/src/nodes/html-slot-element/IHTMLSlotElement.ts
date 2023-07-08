import IHTMLElement from '../html-element/IHTMLElement.js';
import IText from '../text/IText.js';
import IElement from '../element/IElement.js';
import INode from '../node/INode.js';
import Event from '../../event/Event.js';

/**
 * HTML Slot Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement.
 */
export default interface IHTMLSlotElement extends IHTMLElement {
	// Events
	onslotchange: (event: Event) => void | null;

	name: string;

	/**
	 * Sets the slot's manually assigned nodes to an ordered set of slottables.
	 *
	 * @param nodes Nodes.
	 */
	assign(...nodes: Array<IText | IElement>): void;

	/**
	 * Returns assigned nodes.
	 *
	 * @param [options] Options.
	 * @param [options.flatten] A boolean value indicating whether to return the assigned nodes of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	assignedNodes(options?: { flatten?: boolean }): INode[];

	/**
	 * Returns assigned nodes.
	 *
	 * @param [options.flatten] A boolean value indicating whether to return the assigned elements of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	assignedElements(options?: { flatten?: boolean }): IElement[];

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLSlotElement;
}
