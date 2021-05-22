import Element from '../nodes/element/Element';
import IElement from '../nodes/element/IElement';
import INode from '../nodes/node/INode';
import Node from '../nodes/node/Node';
import INodeList from '../nodes/node/INodeList';
import SelectorItem from './SelectorItem';
import NodeListFactory from '../nodes/node/NodeListFactory';

const SELECTOR_PART_REGEXP = /(\[[^\]]+\]|[a-zA-Z0-9-_.#"*:()\]]+)|([ ,>]+)/g;

// The above one seem to work fine and is faster, but this one can be useful if more rules need to be added as it is more "correct".
// Const SELECTOR_PART_REGEXP = /([a-zA-Z0-9-$.]+|\[[a-zA-Z0-9-]+\]|\[[a-zA-Z0-9$-~|^$*]+[ ]*=[ ]*"[^"]+"\])|([ ,]+)/g;

/**
 * Utility for query selection in an HTML element.
 *
 * @class QuerySelector
 */
export default class QuerySelector {
	/**
	 * Finds elements based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML elements.
	 */
	public static querySelectorAll(node: INode, selector: string): INodeList<IElement> {
		const matches = <INodeList<IElement>>NodeListFactory.create();

		for (const parts of this.getSelectorParts(selector)) {
			for (const element of this.findAll(node, [node], parts)) {
				if (!matches.includes(element)) {
					matches.push(element);
				}
			}
		}

		return matches;
	}

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML element.
	 */
	public static querySelector(node: INode, selector: string): IElement {
		for (const parts of this.getSelectorParts(selector)) {
			const match = this.findFirst(node, [node], parts);

			if (match) {
				return match;
			}
		}

		return null;
	}

	/**
	 * Finds elements based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootNode Root node.
	 * @param nodes Nodes.
	 * @param selectorParts Selector parts.
	 * @param [selectorItem] Selector item.
	 * @returns HTML elements.
	 */
	private static findAll(
		rootNode: INode,
		nodes: INode[],
		selectorParts: string[],
		selectorItem?: SelectorItem
	): IElement[] {
		const isDirectChild = selectorParts[0] === '>';
		if (isDirectChild) {
			selectorParts = selectorParts.slice(1);
		}
		const selector = selectorItem || new SelectorItem(selectorParts[0]);
		let matched = [];

		for (const node of nodes) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				if (selector.match(<Element>node)) {
					if (selectorParts.length === 1) {
						if (rootNode !== node) {
							matched.push(node);
						}
					} else {
						matched = matched.concat(
							this.findAll(rootNode, (<Element>node).children, selectorParts.slice(1), null)
						);
					}
				}
			}

			if (!isDirectChild && node['children']) {
				matched = matched.concat(this.findAll(rootNode, node['children'], selectorParts, selector));
			}
		}

		return matched;
	}

	/**
	 * Finds an element based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootNode
	 * @param nodes Nodes.
	 * @param selector Selector.
	 * @param selectorParts
	 * @param [selectorItem] Selector item.
	 * @returns HTML element.
	 */
	private static findFirst(
		rootNode: INode,
		nodes: INode[],
		selectorParts: string[],
		selectorItem?: SelectorItem
	): IElement {
		const isDirectChild = selectorParts[0] === '>';
		if (isDirectChild) {
			selectorParts = selectorParts.slice(1);
		}
		const selector = selectorItem || new SelectorItem(selectorParts[0]);

		for (const node of nodes) {
			if (node.nodeType === Node.ELEMENT_NODE && selector.match(<Element>node)) {
				if (selectorParts.length === 1) {
					if (rootNode !== node) {
						return <Element>node;
					}
				} else {
					const childSelector = this.findFirst(
						rootNode,
						(<Element>node).children,
						selectorParts.slice(1),
						null
					);
					if (childSelector) {
						return childSelector;
					}
				}
			}

			if (!isDirectChild && node['children']) {
				const childSelector = this.findFirst(rootNode, node['children'], selectorParts, selector);

				if (childSelector) {
					return childSelector;
				}
			}
		}

		return null;
	}

	/**
	 * Splits a selector string into groups and parts.
	 *
	 * @param selector Selector.
	 * @returns HTML element.
	 */
	private static getSelectorParts(selector: string): string[][] {
		if (selector === '*' || (!selector.includes(',') && !selector.includes(' '))) {
			return [[selector]];
		}

		const regexp = new RegExp(SELECTOR_PART_REGEXP);
		const groups = [];
		let currentSelector = '';
		let parts = [];
		let match;

		while ((match = regexp.exec(selector))) {
			if (match[2]) {
				const trimmed = match[2].trim();

				parts.push(currentSelector);
				currentSelector = '';

				if (trimmed === ',') {
					groups.push(parts);
					parts = [];
				} else if (trimmed === '>') {
					parts.push('>');
				}
			} else if (match[1]) {
				currentSelector += match[1];
			}
		}

		if (currentSelector !== '') {
			parts.push(currentSelector);
		}

		if (parts.length > 0) {
			groups.push(parts);
		}

		return groups;
	}
}
