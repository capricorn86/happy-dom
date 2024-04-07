import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import Text from '../text/Text.js';
import Element from '../element/Element.js';
import Node from '../node/Node.js';
import Event from '../../event/Event.js';

/**
 * HTML Slot Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement.
 */
export default class HTMLSlotElement extends HTMLElement {
	// Public properties
	public cloneNode: (deep?: boolean) => HTMLSlotElement;

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
		const host = (<ShadowRoot>this.getRootNode())?.host;

		// TODO: Add support for options.flatten. We need to find an example of how it is expected to work before it can be implemented.

		if (host) {
			const name = this.name;

			if (name) {
				return this.assignedElements(options);
			}

			return (<HTMLElement>host)[PropertySymbol.childNodes].slice();
		}

		return [];
	}

	/**
	 * Returns assigned elements.
	 *
	 * @param [_options] Options.
	 * @param [_options.flatten] A boolean value indicating whether to return the assigned elements of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	public assignedElements(_options?: { flatten?: boolean }): Element[] {
		const host = (<ShadowRoot>this.getRootNode())?.host;

		// TODO: Add support for options.flatten. We need to find an example of how it expected to work before it can be implemented.

		if (host) {
			const name = this.name;

			if (name) {
				const assignedElements = [];

				for (const child of (<HTMLElement>host)[PropertySymbol.children]) {
					if (child.slot === name) {
						assignedElements.push(child);
					}
				}

				return assignedElements;
			}

			return (<HTMLElement>host)[PropertySymbol.children].slice();
		}

		return [];
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLSlotElement {
		return <HTMLSlotElement>super[PropertySymbol.cloneNode](deep);
	}
}
