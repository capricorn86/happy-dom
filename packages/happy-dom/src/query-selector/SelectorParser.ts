import SelectorItem from './SelectorItem.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import DOMException from '../exception/DOMException.js';
import ISelectorPseudo from './ISelectorPseudo.js';
import ISelectorAttribute from './ISelectorAttribute.js';
import Element from '../nodes/element/Element.js';
import DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import { parse, type AST } from 'parsel-js';

/**
 * Escaped Character RegExp - matches backslash followed by any character.
 */
const ESCAPED_CHARACTER_REGEXP = /\\(.)/g;

/**
 * Attribute Escape RegExp.
 */
const ATTRIBUTE_ESCAPE_REGEXP = /[.*+?^${}()|[\]\\]/g;

/**
 * Nth Function.
 */
const NTH_FUNCTION = {
	odd: (n: number) => (n + 1) % 2 === 0,
	even: (n: number) => (n + 1) % 2 !== 0,
	alwaysFalse: () => false
};

/**
 * Space RegExp.
 */
const SPACE_REGEXP = / /g;

/**
 * Placeholder for escaped characters that parsel-js can't handle.
 * Using a unique string that won't appear in normal selectors.
 */
const ESCAPE_PLACEHOLDER_PREFIX = '__HDOM_ESC_';
const ESCAPE_PLACEHOLDER_SUFFIX = '__';

/**
 * RegExp to find escape sequences that need pre-processing.
 * Matches backslash followed by special characters that parsel-js can't handle.
 */
const PROBLEMATIC_ESCAPE_REGEXP = /\\([:#&\[\]])/g;

/**
 * Utility for parsing a selection string using parsel-js.
 */
export default class SelectorParser {
	/**
	 * Parses a selector string and returns an instance of SelectorItem.
	 * @param selector
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 */
	public static getSelectorItem(
		selector: string,
		options?: {
			scope?: Element | DocumentFragment;
			ignoreErrors?: boolean;
		}
	): SelectorItem {
		return this.getSelectorGroups(selector, options)[0][0];
	}

	/**
	 * Parses a selector string and returns groups with SelectorItem instances.
	 * @param selector
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 */
	public static getSelectorGroups(
		selector: string,
		options?: {
			scope?: Element | DocumentFragment;
			ignoreErrors?: boolean;
		}
	): Array<Array<SelectorItem>> {
		selector = selector.trim();
		const ignoreErrors = options?.ignoreErrors;
		const scope = options?.scope;

		if (!selector) {
			if (ignoreErrors) {
				return [];
			}
			throw new DOMException(`Invalid selector: "${selector}"`);
		}

		// Pre-process selector to handle escaped characters that parsel-js can't handle
		const { processedSelector, escapeMap } = this.preprocessSelector(selector);

		let ast: AST | undefined;
		try {
			ast = parse(processedSelector, { recursive: true, list: true });
		} catch {
			if (ignoreErrors) {
				return [];
			}
			throw new DOMException(`Invalid selector: "${selector}"`);
		}

		if (!ast) {
			if (ignoreErrors) {
				return [];
			}
			throw new DOMException(`Invalid selector: "${selector}"`);
		}

		if (ast.type === 'list') {
			const groups: Array<Array<SelectorItem>> = [];
			for (const item of ast.list) {
				groups.push(this.astToSelectorItems(item, scope, ignoreErrors, options, escapeMap));
			}
			return groups;
		}

		return [this.astToSelectorItems(ast, scope, ignoreErrors, options, escapeMap)];
	}

	/**
	 * Pre-processes a selector to handle escaped characters that parsel-js can't handle.
	 * @param selector
	 */
	private static preprocessSelector(selector: string): {
		processedSelector: string;
		escapeMap: Map<string, string>;
	} {
		const escapeMap = new Map<string, string>();
		let counter = 0;

		const processedSelector = selector.replace(PROBLEMATIC_ESCAPE_REGEXP, (_match, char) => {
			const placeholder = `${ESCAPE_PLACEHOLDER_PREFIX}${counter}${ESCAPE_PLACEHOLDER_SUFFIX}`;
			escapeMap.set(placeholder, char);
			counter++;
			return placeholder;
		});

		return { processedSelector, escapeMap };
	}

	/**
	 * Restores escaped characters from placeholders.
	 * @param value
	 * @param escapeMap
	 */
	private static restoreEscapedChars(value: string, escapeMap: Map<string, string>): string {
		let result = value;
		for (const [placeholder, char] of escapeMap) {
			result = result.split(placeholder).join(char);
		}
		return result;
	}

	/**
	 * Converts a parsel AST node to an array of SelectorItems.
	 * @param ast
	 * @param scope
	 * @param ignoreErrors
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 * @param escapeMap
	 */
	private static astToSelectorItems(
		ast: AST,
		scope: Element | DocumentFragment | undefined,
		ignoreErrors: boolean | undefined,
		options: { scope?: Element | DocumentFragment; ignoreErrors?: boolean } | undefined,
		escapeMap: Map<string, string>
	): SelectorItem[] {
		const items: SelectorItem[] = [];
		this.flattenComplexSelector(
			ast,
			items,
			SelectorCombinatorEnum.descendant,
			scope,
			ignoreErrors,
			options,
			escapeMap
		);
		return items;
	}

	/**
	 * Flattens a complex selector AST into an array of SelectorItems.
	 * @param ast
	 * @param items
	 * @param combinator
	 * @param scope
	 * @param ignoreErrors
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 * @param escapeMap
	 */
	private static flattenComplexSelector(
		ast: AST,
		items: SelectorItem[],
		combinator: SelectorCombinatorEnum,
		scope: Element | DocumentFragment | undefined,
		ignoreErrors: boolean | undefined,
		options: { scope?: Element | DocumentFragment; ignoreErrors?: boolean } | undefined,
		escapeMap: Map<string, string>
	): void {
		if (ast.type === 'complex') {
			this.flattenComplexSelector(
				ast.left,
				items,
				combinator,
				scope,
				ignoreErrors,
				options,
				escapeMap
			);
			const rightCombinator = this.parselCombinatorToEnum(ast.combinator);
			this.flattenComplexSelector(
				ast.right,
				items,
				rightCombinator,
				scope,
				ignoreErrors,
				options,
				escapeMap
			);
		} else {
			items.push(
				this.astNodeToSelectorItem(ast, combinator, scope, ignoreErrors, options, escapeMap)
			);
		}
	}

	/**
	 * Converts a parsel combinator string to SelectorCombinatorEnum.
	 * @param combinator
	 */
	private static parselCombinatorToEnum(combinator: string): SelectorCombinatorEnum {
		switch (combinator.trim()) {
			case '>':
				return SelectorCombinatorEnum.child;
			case '+':
				return SelectorCombinatorEnum.adjacentSibling;
			case '~':
				return SelectorCombinatorEnum.subsequentSibling;
			default:
				return SelectorCombinatorEnum.descendant;
		}
	}

	/**
	 * Converts a single AST node to a SelectorItem.
	 * @param ast
	 * @param combinator
	 * @param scope
	 * @param ignoreErrors
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 * @param escapeMap
	 */
	private static astNodeToSelectorItem(
		ast: AST,
		combinator: SelectorCombinatorEnum,
		scope: Element | DocumentFragment | undefined,
		ignoreErrors: boolean | undefined,
		options: { scope?: Element | DocumentFragment; ignoreErrors?: boolean } | undefined,
		escapeMap: Map<string, string>
	): SelectorItem {
		const item = new SelectorItem({ scope, combinator, ignoreErrors });

		if (ast.type === 'compound') {
			for (const token of ast.list) {
				this.applyTokenToSelectorItem(token, item, options, escapeMap);
			}
		} else {
			this.applyTokenToSelectorItem(ast, item, options, escapeMap);
		}

		return item;
	}

	/**
	 * Extracts the name from a token, handling escaped characters.
	 * parsel-js returns only the part before escaped characters in `name`,
	 * but the full content is in `content`. We need to extract the full name.
	 * @param token
	 * @param prefix The prefix to remove (e.g., '#' for id, '.' for class)
	 * @param escapeMap
	 */
	private static extractNameFromToken(
		token: AST,
		prefix: string,
		escapeMap: Map<string, string>
	): string {
		// Cast to access content and name properties
		const tokenWithContent = <{ content: string; name: string }>token;

		// Get the content and remove the prefix
		let name = tokenWithContent.content.startsWith(prefix)
			? tokenWithContent.content.slice(prefix.length)
			: tokenWithContent.name;

		// Restore any pre-processed escape placeholders
		name = this.restoreEscapedChars(name, escapeMap);

		// Remove remaining escape characters (backslash followed by any char becomes just the char)
		name = name.replace(ESCAPED_CHARACTER_REGEXP, '$1');

		return name;
	}

	/**
	 * Applies a token to a SelectorItem.
	 * @param token
	 * @param item
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 * @param escapeMap
	 */
	private static applyTokenToSelectorItem(
		token: AST,
		item: SelectorItem,
		options: { scope?: Element | DocumentFragment; ignoreErrors?: boolean } | undefined,
		escapeMap: Map<string, string>
	): void {
		switch (token.type) {
			case 'universal':
				item.tagName = '*';
				break;
			case 'type':
				item.tagName = token.name.toUpperCase();
				break;
			case 'id':
				item.id = this.extractNameFromToken(token, '#', escapeMap);
				break;
			case 'class':
				item.classNames = item.classNames || [];
				item.classNames.push(this.extractNameFromToken(token, '.', escapeMap));
				break;
			case 'attribute':
				item.attributes = item.attributes || [];
				item.attributes.push(this.parseAttribute(token, escapeMap));
				break;
			case 'pseudo-class':
				item.pseudos = item.pseudos || [];
				item.pseudos.push(this.parsePseudoClass(token, options, escapeMap));
				break;
			case 'pseudo-element':
				item.isPseudoElement = true;
				break;
		}
	}

	/**
	 * Parses an attribute token into ISelectorAttribute.
	 * @param token
	 * @param escapeMap
	 */
	private static parseAttribute(token: AST, escapeMap: Map<string, string>): ISelectorAttribute {
		const attrToken = <
			{
				name: string;
				value?: string;
				operator?: string;
				caseSensitive?: string;
				content: string;
			}
		>token;

		// Extract attribute name, handling escaped characters
		let attrName = this.restoreEscapedChars(attrToken.name, escapeMap);
		attrName = attrName.replace(ESCAPED_CHARACTER_REGEXP, '$1');

		// Extract attribute value from content if parsel-js parsed it incorrectly
		let value: string | null = null;
		if (attrToken.value !== undefined) {
			// Try to extract value from content for cases where parsel-js fails (e.g., brackets in value)
			value = this.extractAttributeValue(attrToken.content, escapeMap);
			if (value === null) {
				value = attrToken.value;
				// Restore escape placeholders
				value = this.restoreEscapedChars(value, escapeMap);
				// Strip quotes if present
				if (
					(value.startsWith('"') && value.endsWith('"')) ||
					(value.startsWith("'") && value.endsWith("'"))
				) {
					value = value.slice(1, -1);
				}
				// Remove escape characters
				value = value.replace(ESCAPED_CHARACTER_REGEXP, '$1');
			}
		}

		let operator: string | null = null;
		if (attrToken.operator) {
			operator = attrToken.operator.replace('=', '');
			if (operator === '') {
				operator = null;
			}
		}

		const modifier = <'s' | 'i'>attrToken.caseSensitive?.toLowerCase() ?? null;

		return {
			name: attrName,
			operator,
			value,
			modifier,
			regExp: this.getAttributeRegExp({ operator, value, modifier })
		};
	}

	/**
	 * Extracts attribute value from the full content string.
	 * This handles cases where parsel-js fails to parse values correctly (e.g., brackets).
	 * @param content
	 * @param escapeMap
	 */
	private static extractAttributeValue(
		content: string,
		escapeMap: Map<string, string>
	): string | null {
		// Match [name="value"] or [name='value'] or [name=value]
		// Also handles empty values like [name=""]
		const match = content.match(/\[[^\]]*?=\s*(['"])?(.*?)\1\s*(?:[iIsS]\s*)?\]$/);
		if (match) {
			let value = match[2];
			value = this.restoreEscapedChars(value, escapeMap);
			value = value.replace(ESCAPED_CHARACTER_REGEXP, '$1');
			return value;
		}
		return null;
	}

	/**
	 * Parses a pseudo-class token into ISelectorPseudo.
	 * @param token
	 * @param options
	 * @param options.scope
	 * @param options.ignoreErrors
	 * @param escapeMap
	 */
	private static parsePseudoClass(
		token: AST,
		options: { scope?: Element | DocumentFragment; ignoreErrors?: boolean } | undefined,
		escapeMap: Map<string, string>
	): ISelectorPseudo {
		const pseudoToken = <{ name: string; argument?: string }>token;
		const name = pseudoToken.name.toLowerCase();
		let args = pseudoToken.argument ?? null;

		// Restore escape placeholders in arguments
		if (args) {
			args = this.restoreEscapedChars(args, escapeMap);
		}

		if (!args) {
			return { name, arguments: null, selectorItems: null, nthFunction: null };
		}

		switch (name) {
			case 'nth-last-child':
			case 'nth-child': {
				const nthOfIndex = args.indexOf(' of ');
				const nthFunction = nthOfIndex !== -1 ? args.substring(0, nthOfIndex) : args;
				const selectorItem =
					nthOfIndex !== -1
						? this.getSelectorItem(args.substring(nthOfIndex + 4).trim(), options)
						: null;
				return {
					name,
					arguments: args,
					selectorItems: selectorItem ? [selectorItem] : null,
					nthFunction: this.getPseudoNthFunction(nthFunction)
				};
			}
			case 'nth-of-type':
			case 'nth-last-of-type':
				return {
					name,
					arguments: args,
					selectorItems: null,
					nthFunction: this.getPseudoNthFunction(args)
				};
			case 'not': {
				const notSelectorItems: SelectorItem[] = [];
				for (const group of this.getSelectorGroups(args, options)) {
					notSelectorItems.push(group[0]);
				}
				return { name, arguments: args, selectorItems: notSelectorItems, nthFunction: null };
			}
			case 'is':
			case 'where': {
				const selectorItems: SelectorItem[] = [];
				for (const group of this.getSelectorGroups(args, options)) {
					selectorItems.push(group[0]);
				}
				return { name, arguments: args, selectorItems, nthFunction: null };
			}
			case 'has': {
				const hasSelectorItems: SelectorItem[] = [];
				// Trim the arguments to handle cases like ":has( +h2)"
				const trimmedArgs = args.trim();
				if (!args.includes(':has(')) {
					let newArgs = trimmedArgs;
					// Check for combinator at the start (after trimming whitespace)
					if (newArgs.startsWith('+')) {
						newArgs = newArgs.slice(1).trim();
					} else if (newArgs.startsWith('>')) {
						newArgs = newArgs.slice(1).trim();
					}
					for (const group of this.getSelectorGroups(newArgs, options)) {
						hasSelectorItems.push(group[0]);
					}
				}
				// Store trimmed arguments so SelectorItem can check combinator correctly
				return { name, arguments: trimmedArgs, selectorItems: hasSelectorItems, nthFunction: null };
			}
			default:
				return { name, arguments: args, selectorItems: null, nthFunction: null };
		}
	}

	/**
	 * Returns attribute RegExp.
	 * @param attribute
	 * @param attribute.value
	 * @param attribute.operator
	 * @param attribute.modifier
	 */
	private static getAttributeRegExp(attribute: {
		value?: string | null;
		operator?: string | null;
		modifier?: string | null;
	}): RegExp | null {
		const modifier = attribute.modifier === 'i' ? 'i' : '';

		if (!attribute.operator || !attribute.value) {
			return null;
		}

		const escapedValue = attribute.value.replace(ATTRIBUTE_ESCAPE_REGEXP, '\\$&');

		switch (attribute.operator) {
			case '~':
				return new RegExp(`[- ]${escapedValue}|${escapedValue}[- ]|^${escapedValue}$`, modifier);
			case '|':
				return new RegExp(`^${escapedValue}[- ]|^${escapedValue}$`, modifier);
			case '^':
				return new RegExp(`^${escapedValue}`, modifier);
			case '$':
				return new RegExp(`${escapedValue}$`, modifier);
			case '*':
				return new RegExp(`${escapedValue}`, modifier);
			default:
				return null;
		}
	}

	/**
	 * Returns pseudo nth function.
	 * @param args
	 */
	private static getPseudoNthFunction(args?: string): ((n: number) => boolean) | null {
		if (!args) {
			return null;
		}

		if (args === 'odd') {
			return NTH_FUNCTION.odd;
		} else if (args === 'even') {
			return NTH_FUNCTION.even;
		}

		const parts = args.replace(SPACE_REGEXP, '').split('n');
		let partA = parseInt(parts[0], 10) || 0;

		if (parts[0] == '-') {
			partA = -1;
		}

		if (parts.length === 1) {
			return (n) => n == partA;
		}

		let partB = parseInt(parts[1], 10) || 0;

		if (parts[0] == '+') {
			partB = 1;
		}

		if (partA >= 1 || partA <= -1) {
			if (partA >= 1) {
				if (Math.abs(partA) === 1) {
					return (n: number): boolean => n > partB - 1;
				}
				return (n: number): boolean => n > partB - 1 && (n + -1 * partB) % partA === 0;
			}
			if (Math.abs(partA) === 1) {
				return (n: number): boolean => n < partB + 1;
			}
			return (n) => n < partB + 1 && (n + -1 * partB) % partA === 0;
		}

		if (parts[0]) {
			return (n) => n === partB;
		}

		return (n) => n > partB - 1;
	}
}
