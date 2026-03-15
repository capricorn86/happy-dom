import type Element from '../nodes/element/Element.js';
import Node from '../nodes/node/Node.js';
import XPathResult from './XPathResult.js';

/**
 * XPath expression.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XPathExpression
 */
export default class XPathExpression {
	readonly #expression: string;

	/**
	 *
	 * @param expression
	 */
	constructor(expression: string) {
		this.#expression = expression;
	}

	/**
	 * Evaluates the expression against a context node.
	 *
	 * @param contextNode Context node.
	 * @param [type] Result type.
	 * @param [_result] Unused, for spec compatibility.
	 * @returns XPath result.
	 */
	public evaluate(
		contextNode: Node,
		type: number = XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		_result?: XPathResult | null
	): XPathResult {
		return new XPathResult(type, this.#findNodes(contextNode));
	}

	/**
	 * Finds nodes matching the XPath expression.
	 *
	 * @param contextNode Context node.
	 * @returns Matching nodes.
	 */
	#findNodes(contextNode: Node): Node[] {
		const expression = this.#expression.trim();

		if (expression === '.') {
			return [contextNode];
		}

		// Handle .//*[predicate] or .//tag[predicate] or .//*
		if (expression.startsWith('.//')) {
			return this.#parseAndFindDescendants(contextNode, expression.substring(3));
		}

		// Handle //*[predicate] or //tag[predicate] or //*
		if (expression.startsWith('//')) {
			return this.#parseAndFindDescendants(contextNode, expression.substring(2));
		}

		return [];
	}

	/**
	 * Parses a tag[predicate] expression and finds matching descendants.
	 *
	 * @param node Root node.
	 * @param rest Expression after // (e.g. "*", "div", "*[predicate]", "div[@class='a']").
	 * @returns Matching elements.
	 */
	#parseAndFindDescendants(node: Node, rest: string): Element[] {
		const match = rest.match(/^(\w+|\*)\[(.+)\]$/s);
		const tagName = match ? match[1] : rest;
		const predicate = match ? match[2] : null;
		return this.#findDescendants(node, tagName, predicate);
	}

	/**
	 * Recursively finds descendant elements matching tag and optional predicate.
	 *
	 * @param node Root node.
	 * @param tagName Tag name or '*'.
	 * @param predicate Optional predicate expression.
	 * @returns Matching elements.
	 */
	#findDescendants(node: Node, tagName: string, predicate: string | null): Element[] {
		const results: Element[] = [];
		const upperTag = tagName.toUpperCase();
		for (const child of Array.from(<Node[]>(<unknown>node.childNodes))) {
			if (child.nodeType === Node.ELEMENT_NODE) {
				const element = <Element>child;
				if (
					(tagName === '*' || element.tagName === upperTag) &&
					(!predicate || this.#matchesPredicate(element, predicate))
				) {
					results.push(element);
				}
			}
			results.push(...this.#findDescendants(<Node>child, tagName, predicate));
		}
		return results;
	}

	/**
	 * Evaluates a predicate against an element.
	 *
	 * @param element Element.
	 * @param predicate Predicate string.
	 * @returns Whether the element matches.
	 */
	#matchesPredicate(element: Element, predicate: string): boolean {
		const trimmed = predicate.trim();

		// Handle @*[ sub-predicate ] — any attribute matching sub-predicate
		const anyAttrMatch = trimmed.match(/^@\*\[\s*(.+)\s*\]$/s);
		if (anyAttrMatch) {
			return this.#matchesAnyAttribute(element, anyAttrMatch[1]);
		}

		// Handle 'or' combinator
		if (trimmed.includes(' or ')) {
			return trimmed.split(' or ').some((part) => this.#matchesPredicate(element, part));
		}

		// Handle 'and' combinator
		if (trimmed.includes(' and ')) {
			return trimmed.split(' and ').every((part) => this.#matchesPredicate(element, part));
		}

		// Handle @attr='value' or @attr="value"
		const attrEqualsMatch = trimmed.match(/^@([\w-]+)\s*=\s*['"](.*)['"]$/);
		if (attrEqualsMatch) {
			return element.getAttribute(attrEqualsMatch[1]) === attrEqualsMatch[2];
		}

		// Handle @attr (attribute exists)
		if (trimmed.startsWith('@')) {
			return element.hasAttribute(trimmed.substring(1));
		}

		return false;
	}

	/**
	 * Checks if any attribute of an element matches the sub-predicate.
	 *
	 * Supports: starts-with(name(), 'prefix') and or-combined expressions.
	 *
	 * @param element Element.
	 * @param subPredicate Sub-predicate string.
	 * @returns Whether any attribute matches.
	 */
	#matchesAnyAttribute(element: Element, subPredicate: string): boolean {
		const parts = subPredicate.includes(' or ')
			? subPredicate.split(' or ').map((s) => s.trim())
			: [subPredicate.trim()];

		for (const attr of element.attributes) {
			for (const part of parts) {
				const startsWithMatch = part.match(/^starts-with\(\s*name\(\)\s*,\s*['"](.+)['"]\s*\)$/);
				if (startsWithMatch && attr.name.startsWith(startsWithMatch[1])) {
					return true;
				}
			}
		}
		return false;
	}
}
