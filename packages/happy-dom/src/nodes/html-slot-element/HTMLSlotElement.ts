import HTMLElement from '../html-element/HTMLElement';
import IShadowRoot from '../shadow-root/IShadowRoot';
import IHTMLSlotElement from './IHTMLSlotElement';
import IText from '../text/IText';
import IElement from '../element/IElement';
import INode from '../node/INode';

/**
 * HTML Slot Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement.
 */
export default class HTMLSlotElement extends HTMLElement implements IHTMLSlotElement {
	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttributeNS(null, 'name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttributeNS(null, 'name', name);
	}

	/**
	 * Sets the slot's manually assigned nodes to an ordered set of slottables.
	 *
	 * @param _nodes Nodes.
	 */
	public assign(..._nodes: Array<IText | IElement>): void {
		// TODO: Do nothing for now. We need to find an example of how it is expected to work before it can be implemented.
	}

	/**
	 * Returns assigned nodes.
	 *
	 * @param [options] Options.
	 * @param [options.flatten] A boolean value indicating whether to return the assigned nodes of any available child <slot> elements (true) or not (false). Defaults to false.
	 * @returns Nodes.
	 */
	public assignedNodes(options?: { flatten?: boolean }): INode[] {
		const host = (<IShadowRoot>this.getRootNode())?.host;

		// TODO: Add support for options.flatten. We need to find an example of how it is expected to work before it can be implemented.

		if (host) {
			const name = this.name;

			if (name) {
				return this.assignedElements(options);
			}

			return host.childNodes.slice();
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
	public assignedElements(_options?: { flatten?: boolean }): IElement[] {
		const host = (<IShadowRoot>this.getRootNode())?.host;

		// TODO: Add support for options.flatten. We need to find an example of how it expected to work before it can be implemented.

		if (host) {
			const name = this.name;

			if (name) {
				const assignedElements = [];

				for (const child of host.children) {
					if (child.slot === name) {
						assignedElements.push(child);
					}
				}

				return assignedElements;
			}

			return host.children.slice();
		}

		return [];
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLSlotElement {
		return <HTMLSlotElement>super.cloneNode(deep);
	}
}
