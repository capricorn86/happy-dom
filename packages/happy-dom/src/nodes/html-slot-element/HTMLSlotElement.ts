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
	 *
	 */
	constructor() {
		super();

		// Attribute listeners
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'set',
			this.#onSetAttribute.bind(this)
		);
		this[PropertySymbol.attributes][PropertySymbol.addEventListener](
			'remove',
			this.#onRemoveAttribute.bind(this)
		);
	}

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
	 * @param [_options] Options.
	 * @param [_options.flatten] A boolean value indicating whether to return the assigned nodes of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	public assignedNodes(_options?: { flatten?: boolean }): Node[] {
		return this.#assignedNodes(this.name, _options);
	}

	/**
	 * Returns assigned elements.
	 *
	 * @param [_options] Options.
	 * @param [_options.flatten] A boolean value indicating whether to return the assigned elements of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	public assignedElements(_options?: { flatten?: boolean }): Element[] {
		return this.#assignedElements(this.name, _options);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLSlotElement {
		return <HTMLSlotElement>super[PropertySymbol.cloneNode](deep);
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param attribute Attribute.
	 * @param replacedAttribute Replaced attribute.
	 */
	#onSetAttribute(attribute: Attr, replacedAttribute: Attr | null): void {
		if (
			attribute[PropertySymbol.name] === 'name' &&
			attribute[PropertySymbol.value] !== replacedAttribute?.[PropertySymbol.value]
		) {
			const replacedAssignedNodes = this.#assignedNodes(replacedAttribute?.[PropertySymbol.value]);
			const assignedNodes = this.#assignedNodes(attribute.value);

			if (replacedAssignedNodes.length !== assignedNodes.length) {
				this.dispatchEvent(new Event('slotchange'));
			}

			for (let i = 0, max = assignedNodes.length; i < max; i++) {
				if (replacedAssignedNodes[i] !== assignedNodes[i]) {
					this.dispatchEvent(new Event('slotchange'));
					break;
				}
			}
		}
	}

	/**
	 * Triggered when an attribute is set.
	 *
	 * @param removedAttribute Attribute.
	 */
	#onRemoveAttribute(removedAttribute: Attr): void {
		if (
			removedAttribute[PropertySymbol.name] === 'name' &&
			removedAttribute[PropertySymbol.value] &&
			this.#assignedNodes(removedAttribute.value).length > 0
		) {
			this.dispatchEvent(new Event('slotchange'));
		}
	}

	/**
	 * Returns assigned nodes.
	 *
	 * @param name Name.
	 * @param [_options] Options.
	 * @param [_options.flatten] A boolean value indicating whether to return the assigned nodes of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	#assignedNodes(name?: string, _options?: { flatten?: boolean }): Node[] {
		const host = (<ShadowRoot>this.getRootNode())?.host;

		// TODO: Add support for options.flatten. We need to find an example of how it expected to work before it can be implemented.

		if (!host) {
			return [];
		}

		const assignedElements = [];

		for (const slotNode of (<HTMLElement>host)[PropertySymbol.childNodes]) {
			if (name && slotNode['slot'] && slotNode['slot'] === name) {
				for (const child of slotNode[PropertySymbol.childNodes]) {
					assignedElements.push(child);
				}
			} else if (!name && !slotNode['slot']) {
				assignedElements.push(slotNode);
			}
		}

		return assignedElements;
	}

	/**
	 * Returns assigned elements.
	 *
	 * @param name Name.
	 * @param [_options] Options.
	 * @param [_options.flatten] A boolean value indicating whether to return the assigned elements of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	#assignedElements(name?: string, _options?: { flatten?: boolean }): Element[] {
		const host = (<ShadowRoot>this.getRootNode())?.host;

		// TODO: Add support for options.flatten. We need to find an example of how it expected to work before it can be implemented.

		if (!host) {
			return [];
		}

		const assignedElements = [];

		for (const slotElement of (<HTMLElement>host)[PropertySymbol.children]) {
			if (name && slotElement.slot === name) {
				for (const child of slotElement[PropertySymbol.children]) {
					assignedElements.push(child);
				}
			} else if (!name && !slotElement.slot) {
				assignedElements.push(slotElement);
			}
		}

		return assignedElements;
	}
}
