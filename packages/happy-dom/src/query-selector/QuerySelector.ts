import Element from '../nodes/element/Element.js';
import * as PropertySymbol from '../PropertySymbol.js';
import SelectorItem from './SelectorItem.js';
import NodeList from '../nodes/node/NodeList.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import Document from '../nodes/document/Document.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import SelectorParser from './SelectorParser.js';
import ISelectorMatch from './ISelectorMatch.js';
import IHTMLElementTagNameMap from '../config/IHTMLElementTagNameMap.js';
import ISVGElementTagNameMap from '../config/ISVGElementTagNameMap.js';
import ICachedQuerySelectorAllItem from '../nodes/node/ICachedQuerySelectorAllResult.js';
import ICachedQuerySelectorItem from '../nodes/node/ICachedQuerySelectorResult.js';
import ICachedMatchesItem from '../nodes/node/ICachedMatchesResult.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

type DocumentPositionAndElement = {
	documentPosition: string;
	element: Element;
};

/**
 * Invalid Selector RegExp.
 */
const INVALID_SELECTOR_REGEXP = /^[.#\[]?\d|[.#]$/;

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
	public static querySelectorAll<K extends keyof IHTMLElementTagNameMap>(
		node: Element | Document | DocumentFragment,
		selector: K
	): NodeList<IHTMLElementTagNameMap[K]>;

	/**
	 * Finds elements based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML elements.
	 */
	public static querySelectorAll<K extends keyof ISVGElementTagNameMap>(
		node: Element | Document | DocumentFragment,
		selector: K
	): NodeList<ISVGElementTagNameMap[K]>;

	/**
	 * Finds elements based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML elements.
	 */
	public static querySelectorAll(
		node: Element | Document | DocumentFragment,
		selector: string
	): NodeList<Element>;

	/**
	 * Finds elements based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML elements.
	 */
	public static querySelectorAll(
		node: Element | Document | DocumentFragment,
		selector: string
	): NodeList<Element> {
		if (selector === null || selector === undefined) {
			return new NodeList<Element>(PropertySymbol.illegalConstructor, []);
		}

		const window = node[PropertySymbol.window];

		if (<string>selector === '') {
			throw new window.Error(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': The provided selector is empty.`
			);
		}

		if (typeof selector !== 'string' && typeof selector !== 'boolean') {
			throw new window.DOMException(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': '${selector}' is not a valid selector.`,
				'SyntaxError'
			);
		}

		selector = String(selector);

		const cache = node[PropertySymbol.cache].querySelectorAll;
		const cachedResult = cache.get(selector);

		if (cachedResult?.result) {
			const result = cachedResult.result.deref();
			if (result) {
				return result;
			}
		}

		if (INVALID_SELECTOR_REGEXP.test(selector)) {
			throw new window.Error(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		const groups = SelectorParser.getSelectorGroups(selector);
		const items: Element[] = [];
		const nodeList = new NodeList<Element>(PropertySymbol.illegalConstructor, items);
		const matchesMap: Map<string, Element> = new Map();
		const matchedPositions: string[] = [];
		const cachedItem = {
			result: new WeakRef(nodeList)
		};
		node[PropertySymbol.cache].querySelectorAll.set(selector, cachedItem);

		if (node[PropertySymbol.isConnected]) {
			// Document is affected for the ":target" selector
			(node[PropertySymbol.ownerDocument] || node)[PropertySymbol.affectsCache].push(cachedItem);
		}

		for (const items of groups) {
			const matches =
				node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode
					? this.findAll(<Element>node, [<Element>node], items, cachedItem)
					: this.findAll(null, (<Element>node)[PropertySymbol.elementArray], items, cachedItem);
			for (const match of matches) {
				if (!matchesMap.has(match.documentPosition)) {
					matchesMap.set(match.documentPosition, match.element);
					matchedPositions.push(match.documentPosition);
				}
			}
		}

		const keys = matchedPositions.sort();

		for (let i = 0, max = keys.length; i < max; i++) {
			items.push(matchesMap.get(keys[i]));
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
	public static querySelector<K extends keyof IHTMLElementTagNameMap>(
		node: Element | Document | DocumentFragment,
		selector: K
	): IHTMLElementTagNameMap[K] | null;

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML element.
	 */
	public static querySelector<K extends keyof ISVGElementTagNameMap>(
		node: Element | Document | DocumentFragment,
		selector: K
	): ISVGElementTagNameMap[K] | null;

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML element.
	 */
	public static querySelector(
		node: Element | Document | DocumentFragment,
		selector: string
	): Element | null;

	/**
	 * Finds an element based on a query selector.
	 *
	 * @param node Node to search in.
	 * @param selector Selector.
	 * @returns HTML element.
	 */
	public static querySelector(
		node: Element | Document | DocumentFragment,
		selector: string
	): Element | null {
		if (selector === null || selector === undefined) {
			return null;
		}

		const window = node[PropertySymbol.window];

		if (selector === '') {
			throw new window.Error(
				`Failed to execute 'querySelector' on '${node.constructor.name}': The provided selector is empty.`
			);
		}

		if (typeof selector !== 'string' && typeof selector !== 'boolean') {
			throw new window.DOMException(
				`Failed to execute 'querySelector' on '${node.constructor.name}': '${selector}' is not a valid selector.`,
				'SyntaxError'
			);
		}

		selector = String(selector);

		const cachedResult = node[PropertySymbol.cache].querySelector.get(selector);

		if (cachedResult?.result) {
			const result = cachedResult.result.deref();
			if (result) {
				return result;
			}
		}

		if (INVALID_SELECTOR_REGEXP.test(selector)) {
			throw new window.Error(
				`Failed to execute 'querySelector' on '${node.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		const cachedItem: ICachedQuerySelectorItem = {
			result: <WeakRef<Element | null>>{
				deref: () => null
			}
		};

		node[PropertySymbol.cache].querySelector.set(selector, cachedItem);

		if (node[PropertySymbol.isConnected]) {
			// Document is affected for the ":target" selector
			(node[PropertySymbol.ownerDocument] || node)[PropertySymbol.affectsCache].push(cachedItem);
		}

		for (const items of SelectorParser.getSelectorGroups(selector)) {
			const match =
				node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode
					? this.findFirst(<Element>node, [<Element>node], items, cachedItem)
					: this.findFirst(null, (<Element>node)[PropertySymbol.elementArray], items, cachedItem);

			if (match) {
				cachedItem.result = new WeakRef(match);
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
	 * @param [options] Options.
	 * @param [options.ignoreErrors] Ignores errors.
	 * @returns Result.
	 */
	public static matches(
		element: Element,
		selector: string,
		options?: { ignoreErrors?: boolean }
	): ISelectorMatch | null {
		if (!selector) {
			return null;
		}

		if (selector === null || selector === undefined) {
			return {
				priorityWeight: 0
			};
		}

		const window = element[PropertySymbol.window];

		if (<string>selector === '') {
			throw new window.Error(
				`Failed to execute 'matches' on '${element.constructor.name}': The provided selector is empty.`
			);
		}

		if (typeof selector !== 'string' && typeof selector !== 'boolean') {
			throw new window.DOMException(
				`Failed to execute 'matches' on '${element.constructor.name}': '${selector}' is not a valid selector.`,
				DOMExceptionNameEnum.syntaxError
			);
		}

		selector = String(selector);

		if (selector === '*') {
			return {
				priorityWeight: 1
			};
		}

		const ignoreErrors = options?.ignoreErrors;
		const cachedResult = element[PropertySymbol.cache].matches.get(selector);

		if (cachedResult?.result) {
			return cachedResult.result.match;
		}

		if (INVALID_SELECTOR_REGEXP.test(selector)) {
			if (ignoreErrors) {
				return null;
			}
			throw new window.Error(
				`Failed to execute 'matches' on '${element.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		const cachedItem: ICachedMatchesItem = {
			result: { match: null }
		};

		element[PropertySymbol.cache].matches.set(selector, cachedItem);

		for (const items of SelectorParser.getSelectorGroups(selector, options)) {
			const result = this.matchSelector(element, element, items.reverse(), cachedItem);

			if (result) {
				cachedItem.result.match = result;
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
	 * @param cachedItem Cached item.
	 * @param [priorityWeight] Priority weight.
	 * @returns Result.
	 */
	private static matchSelector(
		targetElement: Element,
		currentElement: Element,
		selectorItems: SelectorItem[],
		cachedItem: ICachedMatchesItem,
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
					const previousElementSibling = currentElement.previousElementSibling;
					if (previousElementSibling) {
						previousElementSibling[PropertySymbol.affectsCache].push(cachedItem);
						const match = this.matchSelector(
							targetElement,
							previousElementSibling,
							selectorItems.slice(1),
							cachedItem,
							priorityWeight + result.priorityWeight
						);

						if (match) {
							return match;
						}
					}
					break;
				case SelectorCombinatorEnum.child:
					if (currentElement.parentElement) {
						const match = this.matchSelector(
							currentElement.parentElement,
							currentElement.parentElement,
							selectorItems.slice(1),
							priorityWeight + result.priorityWeight
						);
						if (match) {
							return match;
						}
					}
					break;
				case SelectorCombinatorEnum.descendant:
					const parentElement = currentElement.parentElement;
					if (parentElement) {
						parentElement[PropertySymbol.affectsCache].push(cachedItem);
						const match = this.matchSelector(
							targetElement,
							parentElement,
							selectorItems.slice(1),
							cachedItem,
							priorityWeight + result.priorityWeight
						);
						if (match) {
							return match;
						}
					}
					break;
			}
		}

		const parentElement = currentElement.parentElement;
		if (
			selectorItem.combinator === SelectorCombinatorEnum.descendant &&
			targetElement !== currentElement &&
			parentElement
		) {
			return this.matchSelector(
				targetElement,
				parentElement,
				selectorItems,
				cachedItem,
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
	 * @param cachedItem Cached item.
	 * @param [documentPosition] Document position of the element.
	 * @returns Document position and element map.
	 */
	private static findAll(
		rootElement: Element,
		children: Element[],
		selectorItems: SelectorItem[],
		cachedItem: ICachedQuerySelectorAllItem,
		documentPosition?: string
	): DocumentPositionAndElement[] {
		const selectorItem = selectorItems[0];
		const nextSelectorItem = selectorItems[1];
		let matched: DocumentPositionAndElement[] = [];

		for (let i = 0, max = children.length; i < max; i++) {
			const child = children[i];
			const childrenOfChild = (<Element>child)[PropertySymbol.elementArray];
			const position = (documentPosition ? documentPosition + '>' : '') + String.fromCharCode(i);

			child[PropertySymbol.affectsCache].push(cachedItem);

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
										cachedItem,
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
									childrenOfChild,
									selectorItems.slice(1),
									cachedItem,
									position
								)
							);
							break;
					}
				}
			}

			if (selectorItem.combinator === SelectorCombinatorEnum.descendant && childrenOfChild.length) {
				matched = matched.concat(
					this.findAll(rootElement, childrenOfChild, selectorItems, cachedItem, position)
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
	 * @param cachedItem Cached item.
	 * @returns HTML element.
	 */
	private static findFirst(
		rootElement: Element,
		children: Element[],
		selectorItems: SelectorItem[],
		cachedItem: ICachedQuerySelectorItem
	): Element {
		const selectorItem = selectorItems[0];
		const nextSelectorItem = selectorItems[1];

		for (const child of children) {
			const childrenOfChild = (<Element>child)[PropertySymbol.elementArray];

			child[PropertySymbol.affectsCache].push(cachedItem);

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
									selectorItems.slice(1),
									cachedItem
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
								childrenOfChild,
								selectorItems.slice(1),
								cachedItem
							);
							if (match) {
								return match;
							}
							break;
					}
				}
			}

			if (selectorItem.combinator === SelectorCombinatorEnum.descendant && childrenOfChild.length) {
				const match = this.findFirst(rootElement, childrenOfChild, selectorItems, cachedItem);

				if (match) {
					return match;
				}
			}
		}

		return null;
	}
}
