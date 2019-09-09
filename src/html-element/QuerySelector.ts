import Element from '../nodes/Element';
import Node from '../nodes/Node';
import SelectorItem from './SelectorItem';

/**
 * Utility for query selection in a Node.
 *
 * @class QuerySelector
 */
export default class QuerySelector {
	/**
	 * Finds elements based on a query selector.
	 *
	 * @param {string} node Node to search in.
	 * @param {string} selector Selector.
	 * @return {Element[]} HTML elements.
	 */
	public static querySelectorAll(node: Node, selector: string): Element[] {
		const parts = selector.split(' ');
		const current = new SelectorItem(parts[0]);
		let matched = [];

		for (const child of node.childNodes) {
			if (child instanceof Element) {
				if (current.match(child)) {
					if (parts.length === 1) {
						matched.push(child);
					} else {
						matched = matched.concat(this.querySelectorAll(child, parts.slice(1).join(' ')));
					}
				} else {
					matched = matched.concat(this.querySelectorAll(child, selector));
				}
			}
		}

		return matched;
	}

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param {string} node Node to search in.
	 * @param {string} selector Selector.
	 * @return {Element} HTML element.
	 */
	public static querySelector(node: Node, selector: string): Element {
		const parts = selector.split(' ');
		const current = new SelectorItem(parts.shift());

		for (const child of node.childNodes) {
			if (child instanceof Element) {
				if (current.match(child)) {
					if (parts.length === 0) {
						return child;
					} else {
						return this.querySelector(child, parts.join(' '));
					}
				}

				const childSelector = this.querySelector(child, selector);
				if (childSelector) {
					return childSelector;
				}
			}
		}

		return null;
	}
}
