import type Element from '../nodes/element/Element.js';
import * as PropertySymbol from '../PropertySymbol.js';
import type SelectorItem from './SelectorItem.js';
import NodeList from '../nodes/node/NodeList.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import type Document from '../nodes/document/Document.js';
import type DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import SelectorParser from './SelectorParser.js';
import type ISelectorMatch from './ISelectorMatch.js';
import type IHTMLElementTagNameMap from '../config/IHTMLElementTagNameMap.js';
import type ISVGElementTagNameMap from '../config/ISVGElementTagNameMap.js';
import type ICachedQuerySelectorAllItem from '../nodes/node/ICachedQuerySelectorAllResult.js';
import type ICachedQuerySelectorItem from '../nodes/node/ICachedQuerySelectorResult.js';
import type ICachedMatchesItem from '../nodes/node/ICachedMatchesResult.js';

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
		const window = node[PropertySymbol.window];

		if (<string>selector === '') {
			throw new window.DOMException(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': The provided selector is empty.`
			);
		}

		if (typeof selector === 'function') {
			throw new window.DOMException(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		if (typeof selector === 'symbol') {
			throw new window.TypeError(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': Cannot convert a Symbol value to a string`
			);
		}

		selector = String(selector);

		if (INVALID_SELECTOR_REGEXP.test(selector)) {
			throw new window.DOMException(
				`Failed to execute 'querySelectorAll' on '${node.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		const cache = node[PropertySymbol.cache].querySelectorAll;
		const cachedResult = cache.get(selector);

		if (cachedResult) {
			if (cachedResult.result !== null) {
				const result = cachedResult.result.deref();
				if (result) {
					return result;
				}
			}
			cache.delete(selector);
		}

		const scope =
			node[PropertySymbol.nodeType] === NodeTypeEnum.documentNode
				? (<Document>node).documentElement
				: node;
		const groups = SelectorParser.getSelectorGroups(selector, { scope });
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
			const matches: DocumentPositionAndElement[] = [];
			if (node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				this.findAll(<Element>node, [<Element>node], items, 0, cachedItem, matches);
			} else {
				this.findAll(
					null,
					(<Element>node)[PropertySymbol.elementArray],
					items,
					0,
					cachedItem,
					matches
				);
			}
			for (const match of matches) {
				if (!matchesMap.has(match.documentPosition)) {
					matchesMap.set(match.documentPosition, match.element);
					matchedPositions.push(match.documentPosition);
				}
			}
		}

		const keys = matchedPositions.sort();

		for (let i = 0, max = keys.length; i < max; i++) {
			items.push(matchesMap.get(keys[i])!);
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
		const window = node[PropertySymbol.window];

		if (selector === '') {
			throw new window.DOMException(
				`Failed to execute 'querySelector' on '${node.constructor.name}': The provided selector is empty.`
			);
		}

		if (typeof selector === 'function') {
			throw new window.DOMException(
				`Failed to execute 'querySelector' on '${node.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		if (typeof selector === 'symbol') {
			throw new window.TypeError(
				`Failed to execute 'querySelector' on '${node.constructor.name}': Cannot convert a Symbol value to a string`
			);
		}

		selector = String(selector);

		if (INVALID_SELECTOR_REGEXP.test(selector)) {
			throw new window.DOMException(
				`Failed to execute 'querySelector' on '${node.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		const cachedResult = node[PropertySymbol.cache].querySelector.get(selector);

		if (cachedResult) {
			if (cachedResult.result !== null) {
				if (!cachedResult.result.element) {
					return null;
				}
				const result = cachedResult.result.element.deref();
				if (result) {
					return result;
				}
			}
			node[PropertySymbol.cache].querySelector.delete(selector);
		}

		const cachedItem: ICachedQuerySelectorItem = {
			result: { element: null }
		};

		node[PropertySymbol.cache].querySelector.set(selector, cachedItem);

		if (node[PropertySymbol.isConnected]) {
			// Document is affected for the ":target" selector
			(node[PropertySymbol.ownerDocument] || node)[PropertySymbol.affectsCache].push(cachedItem);
		}

		let bestMatch: DocumentPositionAndElement | null = null;
		const matchesMap: Map<string, boolean> = new Map();
		const scope =
			node[PropertySymbol.nodeType] === NodeTypeEnum.documentNode
				? (<Document>node).documentElement
				: node;

		for (const items of SelectorParser.getSelectorGroups(selector, { scope })) {
			const match =
				node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode
					? this.findFirst(<Element>node, [<Element>node], items, 0, cachedItem)
					: this.findFirst(
							null,
							(<Element>node)[PropertySymbol.elementArray],
							items,
							0,
							cachedItem
						);

			if (match && !matchesMap.has(match.documentPosition)) {
				matchesMap.set(match.documentPosition, true);
				if (!bestMatch || match.documentPosition < bestMatch.documentPosition) {
					bestMatch = match;
				}
			}
		}

		const element = bestMatch?.element || null;

		cachedItem.result = { element: element ? new WeakRef(element) : null };

		return element;
	}

	/**
	 * Checks if an element matches a selector and returns priority weight.
	 *
	 * @param element Element to match.
	 * @param selector Selector to match with.
	 * @param [options] Options.
	 * @param [options.scope] Scope.
	 * @param [options.ignoreErrors] Ignores errors.
	 * @returns Result.
	 */
	public static matches(
		element: Element,
		selector: string,
		options?: { scope?: Element | Document | DocumentFragment | null; ignoreErrors?: boolean }
	): ISelectorMatch | null {
		const ignoreErrors = options?.ignoreErrors;
		const window = element[PropertySymbol.window];

		if (selector === '*') {
			return {
				priorityWeight: 1
			};
		}

		if (<string>selector === '') {
			if (ignoreErrors) {
				return null;
			}
			throw new window.DOMException(
				`Failed to execute 'matches' on '${element.constructor.name}': The provided selector is empty.`
			);
		}

		if (typeof selector === 'function') {
			if (ignoreErrors) {
				return null;
			}
			throw new window.DOMException(
				`Failed to execute 'matches' on '${element.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		if (typeof selector === 'symbol') {
			if (ignoreErrors) {
				return null;
			}
			throw new window.TypeError(`Cannot convert a Symbol value to a string`);
		}

		selector = String(selector);

		if (INVALID_SELECTOR_REGEXP.test(selector)) {
			if (ignoreErrors) {
				return null;
			}
			throw new window.DOMException(
				`Failed to execute 'matches' on '${element.constructor.name}': '${selector}' is not a valid selector.`
			);
		}

		const cachedResult = element[PropertySymbol.cache].matches.get(selector);

		if (cachedResult) {
			if (cachedResult.result !== null) {
				return cachedResult.result.match;
			}
			element[PropertySymbol.cache].matches.delete(selector);
		}

		const cachedItem: ICachedMatchesItem = {
			result: { match: null }
		};

		element[PropertySymbol.cache].matches.set(selector, cachedItem);

		if (element[PropertySymbol.isConnected]) {
			// Document is affected for the ":target" selector
			(element[PropertySymbol.ownerDocument] || element)[PropertySymbol.affectsCache].push(
				cachedItem
			);
		}

		const scopeOrElement = options?.scope || element;
		const scope =
			scopeOrElement[PropertySymbol.nodeType] === NodeTypeEnum.documentNode
				? (<Document>scopeOrElement).documentElement
				: scopeOrElement;
		for (const items of SelectorParser.getSelectorGroups(selector, {
			...options,
			scope
		})) {
			// Traverse backwards through items to avoid array reversal
			const result = this.matchSelector(element, items, items.length - 1, cachedItem);

			if (result) {
				cachedItem.result!.match = result;
				return result;
			}
		}

		return null;
	}

	/**
	 * Checks if a node matches a selector.
	 *
	 * @param element Target element.
	 * @param selectorItems Selector items.
	 * @param selectorIndex Current index in selectorItems (traverses backwards from end to 0).
	 * @param cachedItem Cached item.
	 * @param [previousSelectorItem] Previous selector item.
	 * @param [priorityWeight] Priority weight.
	 * @returns Result.
	 */
	private static matchSelector(
		element: Element,
		selectorItems: SelectorItem[],
		selectorIndex: number,
		cachedItem: ICachedMatchesItem,
		previousSelectorItem: SelectorItem | null = null,
		priorityWeight = 0
	): ISelectorMatch | null {
		const selectorItem = selectorItems[selectorIndex];
		const result = selectorItem.match(element);

		if (result) {
			if (selectorIndex === 0) {
				return {
					priorityWeight: priorityWeight + result.priorityWeight
				};
			}

			const nextIndex = selectorIndex - 1;

			switch (selectorItem.combinator) {
				case SelectorCombinatorEnum.adjacentSibling:
					const previousElementSibling = element.previousElementSibling;
					if (previousElementSibling) {
						previousElementSibling[PropertySymbol.affectsCache].push(cachedItem);

						const match = this.matchSelector(
							previousElementSibling,
							selectorItems,
							nextIndex,
							cachedItem,
							selectorItem,
							priorityWeight + result.priorityWeight
						);

						if (match) {
							return match;
						}
					}
					break;
				case SelectorCombinatorEnum.child:
				case SelectorCombinatorEnum.descendant:
					const parentElement = element.parentElement;
					if (parentElement) {
						parentElement[PropertySymbol.affectsCache].push(cachedItem);

						const match = this.matchSelector(
							parentElement,
							selectorItems,
							nextIndex,
							cachedItem,
							selectorItem,
							priorityWeight + result.priorityWeight
						);

						if (match) {
							return match;
						}
					}
					break;
				case SelectorCombinatorEnum.subsequentSibling:
					const siblingParentElement = element.parentElement;
					if (siblingParentElement) {
						const siblings = siblingParentElement[PropertySymbol.elementArray];
						const index = siblings.indexOf(element);

						siblingParentElement[PropertySymbol.affectsCache].push(cachedItem);

						for (let i = index - 1; i >= 0; i--) {
							const sibling = siblings[i];

							sibling[PropertySymbol.affectsCache].push(cachedItem);

							const match = this.matchSelector(
								sibling,
								selectorItems,
								nextIndex,
								cachedItem,
								selectorItem,
								priorityWeight + result.priorityWeight
							);

							if (match) {
								return match;
							}
						}
					}
					break;
			}
		}

		if (previousSelectorItem?.combinator === SelectorCombinatorEnum.descendant) {
			const parentElement = element.parentElement;
			if (parentElement) {
				return this.matchSelector(
					parentElement,
					selectorItems,
					selectorIndex,
					cachedItem,
					previousSelectorItem,
					priorityWeight
				);
			}
		}

		return null;
	}

	/**
	 * Finds elements based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootElement Root element.
	 * @param children Child elements.
	 * @param selectorItems Selector items.
	 * @param selectorIndex Current index in selectorItems.
	 * @param cachedItem Cached item.
	 * @param matched Accumulator array for matched elements.
	 * @param [documentPosition] Document position of the element.
	 */
	private static findAll(
		rootElement: Element | null,
		children: Element[],
		selectorItems: SelectorItem[],
		selectorIndex: number,
		cachedItem: ICachedQuerySelectorAllItem,
		matched: DocumentPositionAndElement[],
		documentPosition?: string
	): void {
		const selectorItem = selectorItems[selectorIndex];
		const nextIndex = selectorIndex + 1;
		const hasNextSelector = nextIndex < selectorItems.length;
		const nextSelectorItem = hasNextSelector ? selectorItems[nextIndex] : null;

		for (let i = 0, max = children.length; i < max; i++) {
			const child = children[i];
			const childrenOfChild = (<Element>child)[PropertySymbol.elementArray];
			const position = (documentPosition ? documentPosition + '>' : '') + String.fromCharCode(i);

			child[PropertySymbol.affectsCache].push(cachedItem);

			if (selectorItem.match(child)) {
				if (!hasNextSelector) {
					if (rootElement !== child) {
						matched.push({
							documentPosition: position,
							element: child
						});
					}
				} else {
					switch (nextSelectorItem!.combinator) {
						case SelectorCombinatorEnum.adjacentSibling:
							const nextElementSibling = child.nextElementSibling;
							if (nextElementSibling) {
								this.findAll(
									rootElement,
									[nextElementSibling],
									selectorItems,
									nextIndex,
									cachedItem,
									matched,
									position
								);
							}
							break;
						case SelectorCombinatorEnum.descendant:
						case SelectorCombinatorEnum.child:
							this.findAll(
								rootElement,
								childrenOfChild,
								selectorItems,
								nextIndex,
								cachedItem,
								matched,
								position
							);
							break;
						case SelectorCombinatorEnum.subsequentSibling:
							for (let j = i + 1; j < children.length; j++) {
								const sibling = children[j];
								this.findAll(
									rootElement,
									[sibling],
									selectorItems,
									nextIndex,
									cachedItem,
									matched,
									position
								);
							}
							break;
					}
				}
			}

			if (selectorItem.combinator === SelectorCombinatorEnum.descendant && childrenOfChild.length) {
				this.findAll(
					rootElement,
					childrenOfChild,
					selectorItems,
					selectorIndex,
					cachedItem,
					matched,
					position
				);
			}
		}
	}

	/**
	 * Finds an element based on a query selector for a part of a list of selectors separated with comma.
	 *
	 * @param rootElement Root element.
	 * @param children Child elements.
	 * @param selectorItems Selector items.
	 * @param selectorIndex Current index in selectorItems.
	 * @param cachedItem Cached item.
	 * @param [documentPosition] Document position of the element.
	 * @returns Document position and element map.
	 */
	private static findFirst(
		rootElement: Element | null,
		children: Element[],
		selectorItems: SelectorItem[],
		selectorIndex: number,
		cachedItem: ICachedQuerySelectorItem,
		documentPosition?: string
	): DocumentPositionAndElement | null {
		const selectorItem = selectorItems[selectorIndex];
		const nextIndex = selectorIndex + 1;
		const hasNextSelector = nextIndex < selectorItems.length;
		const nextSelectorItem = hasNextSelector ? selectorItems[nextIndex] : null;

		for (let i = 0, max = children.length; i < max; i++) {
			const child = children[i];
			const childrenOfChild = (<Element>child)[PropertySymbol.elementArray];
			const position = (documentPosition ? documentPosition + '>' : '') + String.fromCharCode(i);

			child[PropertySymbol.affectsCache].push(cachedItem);

			if (selectorItem.match(child)) {
				if (!hasNextSelector) {
					if (rootElement !== child) {
						return { documentPosition: position, element: child };
					}
				} else {
					switch (nextSelectorItem!.combinator) {
						case SelectorCombinatorEnum.adjacentSibling:
							const nextElementSibling = child.nextElementSibling;
							if (nextElementSibling) {
								const match = this.findFirst(
									rootElement,
									[nextElementSibling],
									selectorItems,
									nextIndex,
									cachedItem,
									position
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
								selectorItems,
								nextIndex,
								cachedItem,
								position
							);
							if (match) {
								return match;
							}
							break;
						case SelectorCombinatorEnum.subsequentSibling:
							for (let j = i + 1; j < children.length; j++) {
								const sibling = children[j];
								const match = this.findFirst(
									rootElement,
									[sibling],
									selectorItems,
									nextIndex,
									cachedItem,
									position
								);
								if (match) {
									return match;
								}
							}
							break;
					}
				}
			}

			if (selectorItem.combinator === SelectorCombinatorEnum.descendant && childrenOfChild.length) {
				const match = this.findFirst(
					rootElement,
					childrenOfChild,
					selectorItems,
					selectorIndex,
					cachedItem,
					position
				);

				if (match) {
					return match;
				}
			}
		}

		return null;
	}
}
