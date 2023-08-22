import IElement from '../nodes/element/IElement.js';
import INodeList from '../nodes/node/INodeList.js';
import SelectorItem from './SelectorItem.js';
import NodeList from '../nodes/node/NodeList.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import IDocument from '../nodes/document/IDocument.js';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment.js';
import SelectorParser from './SelectorParser.js';
import ISelectorMatch from './ISelectorMatch.js';
import Element from '../nodes/element/Element.js';

type IDocumentPositionAndElement = {
	documentPosition: string;
	element: IElement;
};

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
	public static querySelectorAll(
		node: IElement | IDocument | IDocumentFragment,
		selector: string
	): INodeList<IElement> {
		if (selector === '') {
			throw new Error(
				"Failed to execute 'querySelectorAll' on 'Element': The provided selector is empty."
			);
		}

		if (selector === null || selector === undefined) {
			return new NodeList<IElement>();
		}

		const groups = SelectorParser.getSelectorGroups(selector);
		let matches: IDocumentPositionAndElement[] = [];

		for (const items of groups) {
			matches = matches.concat(
				node.nodeType === NodeTypeEnum.elementNode
					? this.findAll(<IElement>node, [<IElement>node], items)
					: this.findAll(null, (<Element>node)._children, items)
			);
		}

		const nodeList = new NodeList<IElement>();
		const matchesMap: { [position: string]: IElement } = {};

		for (let i = 0, max = matches.length; i < max; i++) {
			matchesMap[matches[i].documentPosition] = matches[i].element;
		}

		const keys = Object.keys(matchesMap).sort();
		for (let i = 0, max = keys.length; i < max; i++) {
			nodeList.push(matchesMap[keys[i]]);
		}

		return nodeList;
	}

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML element.
	 */
	public static querySelector(
		node: IElement | IDocument | IDocumentFragment,
		selector: string
	): IElement {
		if (selector === '') {
			throw new Error(
				"Failed to execute 'querySelector' on 'Element': The provided selector is empty."
			);
		}

		if (selector === null || selector === undefined) {
			return null;
		}

		for (const items of SelectorParser.getSelectorGroups(selector)) {
			const match =
				node.nodeType === NodeTypeEnum.elementNode
					? this.findFirst(<IElement>node, [<IElement>node], items)
					: this.findFirst(null, (<Element>node)._children, items);

			if (match) {
				return match;
			}
		}

		return null;
	}

	/**
	 * Checks if an element matches a selector and returns priority weight.
	 *
	 * @param element Element to match.
	 * @param selector Selector to match with.
	 * @returns Result.
	 */
	public static match(element: IElement, selector: string): ISelectorMatch | null {
		if (selector === '*') {
			return {
				priorityWeight: 1
			};
		}

		for (const items of SelectorParser.getSelectorGroups(selector)) {
			const result = this.matchSelector(element, element, items.reverse());

			if (result) {
				return result;
			}
		}

		return null;
	}

	/**
	 * Checks if a node matches a selector.
	 *
	 * @param targetElement Target element.
	 * @param currentElement Current element.
	 * @param selectorItems Selector items.
	 * @param [priorityWeight] Priority weight.
	 * @returns Result.
	 */
	private static matchSelector(
		targetElement: IElement,
		currentElement: IElement,
		selectorItems: SelectorItem[],
		priorityWeight = 0
	): ISelectorMatch | null {
		const selectorItem = selectorItems[0];
		const result = selectorItem.match(currentElement);

		if (result) {
			if (selectorItems.length === 1) {
				return {
					priorityWeight: priorityWeight + result.priorityWeight
				};
			}

			switch (selectorItem.combinator) {
				case SelectorCombinatorEnum.adjacentSibling:
					if (currentElement.previousElementSibling) {
						const match = this.matchSelector(
							targetElement,
							currentElement.previousElementSibling,
							selectorItems.slice(1),
							priorityWeight + result.priorityWeight
						);

						if (match) {
							return match;
						}
					}
					break;
				case SelectorCombinatorEnum.child:
				case SelectorCombinatorEnum.descendant:
					if (currentElement.parentElement) {
						const match = this.matchSelector(
							targetElement,
							currentElement.parentElement,
							selectorItems.slice(1),
							priorityWeight + result.priorityWeight
						);
						if (match) {
							return match;
						}
					}
					break;
			}
		}

		if (
			selectorItem.combinator === SelectorCombinatorEnum.descendant &&
			targetElement !== currentElement &&
			currentElement.parentElement
		) {
			return this.matchSelector(
				targetElement,
				currentElement.parentElement,
				selectorItems,
				priorityWeight
			);
		}

		return null;
	}

	/**
	 * Finds elements based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootElement Root element.
	 * @param children Child elements.
	 * @param selectorItems Selector items.
	 * @param [documentPosition] Document position of the element.
	 * @returns Document position and element map.
	 */
	private static findAll(
		rootElement: IElement,
		children: IElement[],
		selectorItems: SelectorItem[],
		documentPosition?: string
	): IDocumentPositionAndElement[] {
		const selectorItem = selectorItems[0];
		const nextSelectorItem = selectorItems[1];
		let matched: IDocumentPositionAndElement[] = [];

		for (let i = 0, max = children.length; i < max; i++) {
			const child = children[i];
			const position = (documentPosition ? documentPosition + '>' : '') + String.fromCharCode(i);

			if (selectorItem.match(child)) {
				if (!nextSelectorItem) {
					if (rootElement !== child) {
						matched.push({
							documentPosition: position,
							element: child
						});
					}
				} else {
					switch (nextSelectorItem.combinator) {
						case SelectorCombinatorEnum.adjacentSibling:
							if (child.nextElementSibling) {
								matched = matched.concat(
									this.findAll(
										rootElement,
										[child.nextElementSibling],
										selectorItems.slice(1),
										position
									)
								);
							}
							break;
						case SelectorCombinatorEnum.descendant:
						case SelectorCombinatorEnum.child:
							matched = matched.concat(
								this.findAll(
									rootElement,
									(<Element>child)._children,
									selectorItems.slice(1),
									position
								)
							);
							break;
					}
				}
			}

			if (
				selectorItem.combinator === SelectorCombinatorEnum.descendant &&
				(<Element>child)._children.length
			) {
				matched = matched.concat(
					this.findAll(rootElement, (<Element>child)._children, selectorItems, position)
				);
			}
		}

		return matched;
	}

	/**
	 * Finds an element based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootElement Root element.
	 * @param children Child elements.
	 * @param selectorItems Selector items.
	 * @returns HTML element.
	 */
	private static findFirst(
		rootElement: IElement,
		children: IElement[],
		selectorItems: SelectorItem[]
	): IElement {
		const selectorItem = selectorItems[0];
		const nextSelectorItem = selectorItems[1];

		for (const child of children) {
			if (selectorItem.match(child)) {
				if (!nextSelectorItem) {
					if (rootElement !== child) {
						return child;
					}
				} else {
					switch (nextSelectorItem.combinator) {
						case SelectorCombinatorEnum.adjacentSibling:
							if (child.nextElementSibling) {
								const match = this.findFirst(
									rootElement,
									[child.nextElementSibling],
									selectorItems.slice(1)
								);
								if (match) {
									return match;
								}
							}
							break;
						case SelectorCombinatorEnum.descendant:
						case SelectorCombinatorEnum.child:
							const match = this.findFirst(
								rootElement,
								(<Element>child)._children,
								selectorItems.slice(1)
							);
							if (match) {
								return match;
							}
							break;
					}
				}
			}

			if (
				selectorItem.combinator === SelectorCombinatorEnum.descendant &&
				(<Element>child)._children.length
			) {
				const match = this.findFirst(rootElement, (<Element>child)._children, selectorItems);

				if (match) {
					return match;
				}
			}
		}

		return null;
	}
}
