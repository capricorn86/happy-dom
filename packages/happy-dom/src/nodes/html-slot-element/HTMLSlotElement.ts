import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import Text from '../text/Text.js';
import Element from '../element/Element.js';
import Node from '../node/Node.js';
import Event from '../../event/Event.js';
import Attr from '../attr/Attr.js';

/**
 * HTML Slot Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement.
 */
export default class HTMLSlotElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLSlotElement;

	// Events
	public onslotchange: (event: Event) => void | null = null;

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Sets the slot's manually assigned nodes to an ordered set of slottables.
	 *
	 * @param _nodes Nodes.
	 */
	public assign(..._nodes: Array<Text | Element>): void {
		// TODO: Do nothing for now. We need to find an example of how it is expected to work before it can be implemented.
	}

	/**
	 * Returns assigned nodes.
	 *
	 * @param [options] Options.
	 * @param [options.flatten] A boolean value indicating whether to return the assigned nodes of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	public assignedNodes(options?: { flatten?: boolean }): Node[] {
		return this.#assignedNodes(this.name, options);
	}

	/**
	 * Returns assigned elements.
	 *
	 * @param [options] Options.
	 * @param [options.flatten] A boolean value indicating whether to return the assigned elements of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	public assignedElements(options?: { flatten?: boolean }): Element[] {
		return this.#assignedElements(this.name, options);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLSlotElement {
		return <HTMLSlotElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.onSetAttribute](
		attribute: Attr,
		replacedAttribute: Attr | null
	): void {
		super[PropertySymbol.onSetAttribute](attribute, replacedAttribute);
		if (
			attribute[PropertySymbol.name] === 'name' &&
			attribute[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]
		) {
			const replacedAssignedNodes = this.#assignedNodes(replacedAttribute?.[PropertySymbol.value]);
			const assignedNodes = this.#assignedNodes(attribute.value);

			if (replacedAssignedNodes.length !== assignedNodes.length) {
				this.dispatchEvent(new Event('slotchange', { bubbles: true }));
			} else {
				for (let i = 0, max = assignedNodes.length; i < max; i++) {
					if (replacedAssignedNodes[i] !== assignedNodes[i]) {
						this.dispatchEvent(new Event('slotchange', { bubbles: true }));
						break;
					}
				}
			}
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.onRemoveAttribute](removedAttribute: Attr): void {
		super[PropertySymbol.onRemoveAttribute](removedAttribute);
		if (
			removedAttribute[PropertySymbol.name] === 'name' &&
			removedAttribute[PropertySymbol.value] &&
			this.#assignedNodes(removedAttribute.value).length > 0
		) {
			this.dispatchEvent(new Event('slotchange', { bubbles: true }));
		}
	}

	/**
	 * Returns assigned nodes.
	 *
	 * @param name Name.
	 * @param [options] Options.
	 * @param [options.flatten] A boolean value indicating whether to return the assigned nodes of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	#assignedNodes(name?: string, options?: { flatten?: boolean }): Node[] {
		const host = (<ShadowRoot>this.getRootNode())?.host;
		const flatten = !!options?.flatten;

		if (!host) {
			return [];
		}

		const assigned = [];

		for (const slotNode of (<HTMLElement>host)[PropertySymbol.nodeArray]) {
			const slotName = slotNode['slot'];
			if ((name && slotName && slotName === name) || (!name && !slotName)) {
				if (flatten && slotNode instanceof HTMLSlotElement) {
					for (const slotChild of slotNode.assignedNodes(options)) {
						assigned.push(slotChild);
					}
				} else {
					assigned.push(slotNode);
				}
			}
		}

		return assigned;
	}

	/**
	 * Returns assigned elements.
	 *
	 * @param name Name.
	 * @param [options] Options.
	 * @param [options.flatten] A boolean value indicating whether to return the assigned elements of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	#assignedElements(name?: string, options?: { flatten?: boolean }): Element[] {
		const host = (<ShadowRoot>this.getRootNode())?.host;
		const flatten = !!options?.flatten;

		if (!host) {
			return [];
		}

		const assigned = [];

		for (const slotElement of (<HTMLElement>host)[PropertySymbol.elementArray]) {
			const slotName = slotElement.slot;
			if ((name && slotName === name) || (!name && !slotName)) {
				if (flatten && slotElement instanceof HTMLSlotElement) {
					for (const slotChild of slotElement.assignedElements(options)) {
						assigned.push(slotChild);
					}
				} else {
					assigned.push(slotElement);
				}
			}
		}

		return assigned;
	}
}
