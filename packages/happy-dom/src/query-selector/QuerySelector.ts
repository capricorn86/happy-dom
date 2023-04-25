import IElement from '../nodes/element/IElement';
import INodeList from '../nodes/node/INodeList';
import SelectorItem from './SelectorItem';
import NodeList from '../nodes/node/NodeList';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import SelectorCombinatorEnum from './SelectorCombinatorEnum';
import IDocument from '../nodes/document/IDocument';
import IDocumentFragment from '../nodes/document-fragment/IDocumentFragment';

/**
 * Group 1: Combinator (e.g. " ", "+", ">" or ",")
 * Group 2: Tag or class name (e.g. "div", ".class" or "#id")
 * Group 3: Attribute selector (e.g. "[attr=value]")
 * Group 4: Pseudo selector (e.g. ":first-child")
 * Group 5: Arguments of pseudo selector (e.g. "(2n + 1)")
 */
const SELECTOR_GROUP_REGEXP =
	/([ ,+>]*)([a-zA-Z0-9-_.#*]*)(\[[^\]]+\]){0,}(:[a-zA-Z-:]+){0,1}(\([a-zA-Z0-9-+ ]+\)){0,1}/g;

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
		const allMatches = new NodeList<IElement>();

		if (selector === '') {
			throw new Error(
				"Failed to execute 'querySelectorAll' on 'Element': The provided selector is empty."
			);
		}

		if (selector === null || selector === undefined) {
			return allMatches;
		}

		for (const items of this.getSelectorParts(selector)) {
			const matches =
				node.nodeType === NodeTypeEnum.elementNode
					? this.findAll(<IElement>node, [<IElement>node], items)
					: this.findAll(null, node.children, items);

			for (const match of matches) {
				if (!allMatches.includes(match)) {
					allMatches.push(match);
				}
			}
		}

		return allMatches;
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
		for (const items of this.getSelectorParts(selector)) {
			const match =
				node.nodeType === NodeTypeEnum.elementNode
					? this.findFirst(<IElement>node, [<IElement>node], items)
					: this.findFirst(null, node.children, items);

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
	public static match(
		element: IElement,
		selector: string
	): { priorityWeight: number; matches: boolean } {
		for (const items of this.getSelectorParts(selector)) {
			const result = this.matchesSelector(element, element, items.reverse());

			if (result.matches) {
				return result;
			}
		}

		return { priorityWeight: 0, matches: false };
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
	private static matchesSelector(
		targetElement: IElement,
		currentElement: IElement,
		selectorItems: SelectorItem[],
		priorityWeight = 0
	): {
		priorityWeight: number;
		matches: boolean;
	} {
		const selectorItem = selectorItems[0];
		const result = selectorItem.match(currentElement);

		if (result.matches) {
			if (selectorItems.length === 1) {
				return {
					priorityWeight: priorityWeight + result.priorityWeight,
					matches: true
				};
			}

			switch (selectorItem.combinator) {
				case SelectorCombinatorEnum.adjacentSibling:
					if (currentElement.previousElementSibling) {
						const match = this.matchesSelector(
							targetElement,
							currentElement.previousElementSibling,
							selectorItems.slice(1),
							priorityWeight + result.priorityWeight
						);

						if (match.matches) {
							return match;
						}
					}
					break;
				case SelectorCombinatorEnum.child:
				case SelectorCombinatorEnum.descendant:
					if (currentElement.parentElement) {
						const match = this.matchesSelector(
							targetElement,
							currentElement.parentElement,
							selectorItems.slice(1),
							priorityWeight + result.priorityWeight
						);
						if (match.matches) {
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
			return this.matchesSelector(
				targetElement,
				currentElement.parentElement,
				selectorItems,
				priorityWeight
			);
		}

		return { priorityWeight: 0, matches: false };
	}

	/**
	 * Finds elements based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootElement Root element.
	 * @param children Child elements.
	 * @param selectorItems Selector items.
	 * @returns HTML elements.
	 */
	private static findAll(
		rootElement: IElement,
		children: IElement[],
		selectorItems: SelectorItem[]
	): IElement[] {
		const selectorItem = selectorItems[0];
		const nextSelectorItem = selectorItems[1];
		let matched = [];

		for (const child of children) {
			if (selectorItem.match(child).matches) {
				if (!nextSelectorItem) {
					if (rootElement !== child) {
						matched.push(child);
					}
				} else {
					switch (nextSelectorItem.combinator) {
						case SelectorCombinatorEnum.adjacentSibling:
							if (child.nextElementSibling) {
								matched = matched.concat(
									this.findAll(rootElement, [child.nextElementSibling], selectorItems.slice(1))
								);
							}
							break;
						case SelectorCombinatorEnum.descendant:
						case SelectorCombinatorEnum.child:
							matched = matched.concat(
								this.findAll(rootElement, child.children, selectorItems.slice(1))
							);
							break;
					}
				}
			}

			if (selectorItem.combinator === SelectorCombinatorEnum.descendant && child.children.length) {
				matched = matched.concat(this.findAll(rootElement, child.children, selectorItems));
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
			if (selectorItem.match(child).matches) {
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
							const match = this.findFirst(rootElement, child.children, selectorItems.slice(1));
							if (match) {
								return match;
							}
							break;
					}
				}
			}

			if (selectorItem.combinator === SelectorCombinatorEnum.descendant && child.children.length) {
				const match = this.findFirst(rootElement, child.children, selectorItems);

				if (match) {
					return match;
				}
			}
		}

		return null;
	}

	/**
	 * Splits a selector string into parts.
	 *
	 * @param selector Selector.
	 * @returns Selector parts.
	 */
	public static getSelectorParts(selector: string): Array<Array<SelectorItem>> {
		if (
			selector === '*' ||
			(!selector.includes(',') &&
				!selector.includes(' ') &&
				!selector.includes('+') &&
				!selector.includes('>'))
		) {
			return [[new SelectorItem(selector)]];
		}

		const regexp = new RegExp(SELECTOR_GROUP_REGEXP);
		const groups: Array<Array<SelectorItem>> = [];
		let currentGroup: SelectorItem[] = [];
		let match;

		while ((match = regexp.exec(selector))) {
			const selectorPart = `${match[2] || ''}${match[3] || ''}${match[4] || ''}${match[5] || ''}`;
			const combinator = match[1] ? match[1].trim() : '';

			if (combinator && !selectorPart) {
				throw new DOMException(
					`Invalid selector: "${selector}".`,
					DOMExceptionNameEnum.invalidStateError
				);
			}

			if (!selectorPart) {
				if (currentGroup.length) {
					groups.push(currentGroup);
				}
				return groups;
			}

			switch (combinator) {
				case ',':
					groups.push(currentGroup);
					currentGroup = [new SelectorItem(selectorPart, SelectorCombinatorEnum.descendant)];
					break;
				case '>':
					currentGroup.push(new SelectorItem(selectorPart, SelectorCombinatorEnum.child));
					break;
				case '+':
					currentGroup.push(new SelectorItem(selectorPart, SelectorCombinatorEnum.adjacentSibling));
					break;
				case '':
					currentGroup.push(new SelectorItem(selectorPart, SelectorCombinatorEnum.descendant));
					break;
			}
		}

		if (currentGroup.length) {
			groups.push(currentGroup);
		}

		return groups;
	}
}
