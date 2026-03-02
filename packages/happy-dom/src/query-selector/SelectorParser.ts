import SelectorItem from './SelectorItem.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import type ISelectorPseudo from './ISelectorPseudo.js';
import type Element from '../nodes/element/Element.js';
import type DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';

/**
 * Selector group RegExp.
 *
 * Group 1: Combinator (" ", ",", "+", ">", "̣~")
 * Group 2: Parentheses or brackets.
 */
const SELECTOR_GROUP_REGEXP = /(\s*[\s,+>~]\s*)|([\[\]\(\)"'])/gm;

/**
 * Selector RegExp.
 *
 * Group 1: All (e.g. "*")
 * Group 2: Tag name (e.g. "div")
 * Group 3: ID (e.g. "#id")
 * Group 4: ID capture characters (e.g. "\:") (should be ignored)
 * Group 5: Class (e.g. ".class")
 * Group 6: Class capture characters (e.g. "r") (should be ignored)
 * Group 7: Attribute name when no value (e.g. "attr1")
 * Group 8: Attribute name capture characters (e.g. "t") (should be ignored)
 * Group 9: Attribute name when there is a value using apostrophe (e.g. "attr1")
 * Group 10: Attribute name capture characters (e.g. "t") (should be ignored)
 * Group 11: Attribute operator when using apostrophe (e.g. "~")
 * Group 12: Attribute value including apostrophes (e.g. "'value1'")
 * Group 13: Attribute value when using double apostrophes (e.g. "value1")
 * Group 14: Attribute value when using single apostrophes (e.g. "value1")
 * Group 15: Attribute modifier when using apostrophe (e.g. "i" or "s")
 * Group 16: Attribute name when there is a value not using apostrophe (e.g. "attr1")
 * Group 17: Attribute name capture characters (e.g. "t") (should be ignored)
 * Group 18: Attribute operator when not using apostrophe (e.g. "~")
 * Group 19: Attribute value when not using apostrophe (e.g. "value1")
 * Group 20: Attribute value capture characters (e.g. "s") (should be ignored)
 * Group 21: Pseudo name when arguments (e.g. "nth-child")
 * Group 22: Pseudo name when no arguments (e.g. "empty")
 * Group 23: Pseudo element (e.g. "::after", "::-webkit-inner-spin-button").
 */
const SELECTOR_REGEXP =
	/(\*)|([a-zA-Z0-9\u00A0-\uFFFF-]+)|#(([a-zA-Z0-9\u00A0-\uFFFF_-]|\\.)+)|\.(([a-zA-Z0-9\u00A0-\uFFFF_-]|\\.)+)|\[(([a-zA-Z0-9-_]|\\.)+)\]|\[(([a-zA-Z0-9-_]|\\.)+)\s*([~|^$*]{0,1})\s*=\s*("([^"]*)"|'([^']*)')\s*(s|i){0,1}\]|\[(([a-zA-Z0-9-_]|\\.)+)\s*([~|^$*]{0,1})\s*=\s*(([a-zA-Z0-9\u00A0-\uFFFF_¤£-]|\\.)+)\]|:([a-zA-Z-]+)\s*\(.+\)|:([a-zA-Z-]+)|::([a-zA-Z-]+)/gm;

/**
 * Selector pseudo RegExp.
 *
 * Group 1: Pseudo name (e.g. "nth-child")
 * Group 2: Parentheses or brackets.
 */
const SELECTOR_PSEUDO_REGEXP = /:([a-zA-Z-]+)|([()])/gm;

/**
 * Escaped Character RegExp.
 */
const ESCAPED_CHARACTER_REGEXP = /\\/g;

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
 * Utility for parsing a selection string.
 */
export default class SelectorParser {
	private window: BrowserWindow;
	private scope: Element | DocumentFragment;
	private ignoreErrors: boolean;

	/**
	 *
	 * @param options
	 * @param options.window
	 * @param options.scope
	 * @param options.ignoreErrors
	 */
	constructor(options: {
		window: BrowserWindow;
		scope: Element | DocumentFragment;
		ignoreErrors?: boolean;
	}) {
		this.window = options.window;
		this.scope = options.scope;
		this.ignoreErrors = options.ignoreErrors ?? false;
	}
	/**
	 * Parses a selector string and returns an instance of SelectorItem.
	 *
	 * @param window Window.
	 * @param selector Selector.
	 * @param options Options.
	 * @param [options.scope] Scope.
	 * @param [options.ignoreErrors] Ignores errors.
	 * @returns Selector item.
	 */
	public getSelectorItem(selector: string): SelectorItem {
		return this.getSelectorGroups(selector)[0][0];
	}

	/**
	 * Parses a selector string and returns instances of SelectorItem.
	 *
	 * @param window Window.
	 * @param selector Selector.
	 * @param options Options.
	 * @param [options.scope] Scope.
	 * @param [options.ignoreErrors] Ignores errors.
	 * @returns Selector groups.
	 */
	public getSelectorGroups(selector: string): Array<Array<SelectorItem>> {
		selector = selector.trim();
		let currentGroup: Array<SelectorItem> = [];
		const groups: Array<Array<SelectorItem>> = [currentGroup];
		const regExp = new RegExp(SELECTOR_GROUP_REGEXP);
		const depth = {
			parentheses: 0,
			brackets: 0,
			doubleApostrophe: 0,
			singleApostrophe: 0
		};
		const name = this.scope.nodeType === NodeTypeEnum.documentNode ? 'Document' : 'Element';
		const error = new this.window.SyntaxError(
			`Failed to execute 'querySelectorAll' on '${name}': '${selector}' is not a valid selector.`
		);
		let match: null | RegExpExecArray = null;
		let lastIndex = 0;
		let selectorItem: SelectorItem | null = null;
		let combinator: SelectorCombinatorEnum = SelectorCombinatorEnum.none;

		while ((match = regExp.exec(selector))) {
			if (match[1]) {
				// Matches combinator (" ", ",", "+", ">", "̣~")
				// We should ignore combinators that are inside parentheses, brackets or apostrophes

				if (
					depth.parentheses === 0 &&
					depth.brackets === 0 &&
					depth.singleApostrophe === 0 &&
					depth.doubleApostrophe === 0
				) {
					const childSelector = selector.substring(lastIndex, match.index).trim();

					switch (match[1].trim()) {
						case ',':
							selectorItem = this.getSelectorGroupItem(childSelector, combinator);
							if (!selectorItem) {
								if (this.ignoreErrors) {
									return [];
								}
								throw error;
							}
							currentGroup.push(selectorItem);
							currentGroup = [];
							groups.push(currentGroup);
							combinator = SelectorCombinatorEnum.none;
							break;
						case '>':
							selectorItem = this.getSelectorGroupItem(childSelector, combinator);
							if (!selectorItem) {
								if (this.ignoreErrors) {
									return [];
								}
								throw error;
							}
							currentGroup.push(selectorItem);
							combinator = SelectorCombinatorEnum.child;
							break;
						case '+':
							selectorItem = this.getSelectorGroupItem(childSelector, combinator);
							if (!selectorItem) {
								if (this.ignoreErrors) {
									return [];
								}
								throw error;
							}
							currentGroup.push(selectorItem);
							combinator = SelectorCombinatorEnum.adjacentSibling;
							break;
						case '~':
							selectorItem = this.getSelectorGroupItem(childSelector, combinator);
							if (!selectorItem) {
								if (this.ignoreErrors) {
									return [];
								}
								throw error;
							}
							currentGroup.push(selectorItem);
							combinator = SelectorCombinatorEnum.subsequentSibling;
							break;
						case '':
							selectorItem = this.getSelectorGroupItem(childSelector, combinator);
							if (!selectorItem) {
								if (this.ignoreErrors) {
									return [];
								}
								throw error;
							}
							currentGroup.push(selectorItem);
							combinator = SelectorCombinatorEnum.descendant;
							break;
					}
					lastIndex = regExp.lastIndex;
				}
			} else {
				// Matches parentheses or brackets.

				switch (match[2]) {
					case '(':
						if (depth.singleApostrophe === 0 && depth.doubleApostrophe === 0) {
							depth.parentheses++;
						}
						break;
					case ')':
						if (depth.singleApostrophe === 0 && depth.doubleApostrophe === 0) {
							depth.parentheses--;
						}
						break;
					case '[':
						if (depth.singleApostrophe === 0 && depth.doubleApostrophe === 0) {
							depth.brackets++;
						}
						break;
					case ']':
						if (depth.singleApostrophe === 0 && depth.doubleApostrophe === 0) {
							depth.brackets--;
						}
						break;
					case '"':
						if (depth.singleApostrophe === 0) {
							depth.doubleApostrophe = depth.doubleApostrophe === 1 ? 0 : 1;
						}
						break;
					case "'":
						if (depth.doubleApostrophe === 0) {
							depth.singleApostrophe = depth.singleApostrophe === 1 ? 0 : 1;
						}
						break;
				}
			}
		}

		selectorItem = this.getSelectorGroupItem(selector.substring(lastIndex), combinator);

		if (
			!selectorItem ||
			depth.parentheses !== 0 ||
			depth.brackets !== 0 ||
			depth.singleApostrophe !== 0 ||
			depth.doubleApostrophe !== 0
		) {
			if (this.ignoreErrors) {
				return [];
			}
			throw error;
		}

		if (combinator === SelectorCombinatorEnum.none && currentGroup.length > 0) {
			groups.push([selectorItem]);
		} else {
			currentGroup.push(selectorItem);
		}

		return groups;
	}

	/**
	 * Parses a selector string and returns an SelectorItem.
	 *
	 * @param selector Selector.
	 * @param combinator Combinator.
	 * @returns Selector item.
	 */
	private getSelectorGroupItem(
		selector: string,
		combinator: SelectorCombinatorEnum
	): SelectorItem | null {
		selector = selector.trim();
		const ignoreErrors = this.ignoreErrors;
		const scope = this.scope;

		if (!selector) {
			return null;
		}

		if (selector === '*') {
			return new SelectorItem({ scope, tagName: '*', combinator, ignoreErrors });
		}

		const regexp = new RegExp(SELECTOR_REGEXP);
		const selectorItem: SelectorItem = new SelectorItem({
			scope,
			combinator,
			ignoreErrors
		});
		let match;
		let lastIndex = 0;

		while ((match = regexp.exec(selector))) {
			if (selector.substring(lastIndex, match.index).trim() !== '') {
				return null;
			}

			if (match[1]) {
				// Matches all, e.g. "*"

				selectorItem.tagName = '*';
			} else if (match[2]) {
				// Matches tag name, e.g. "div"

				selectorItem.tagName = match[2].toUpperCase();
			} else if (match[3]) {
				// Matches ID, e.g. "#id"

				selectorItem.id = match[3].replace(ESCAPED_CHARACTER_REGEXP, '');
			} else if (match[5]) {
				// Matches class names, e.g. ".class1"

				selectorItem.classNames = selectorItem.classNames || [];
				selectorItem.classNames.push(match[5].replace(ESCAPED_CHARACTER_REGEXP, ''));
			} else if (match[7]) {
				// Matches attributes without value, e.g. [attr]

				selectorItem.attributes = selectorItem.attributes || [];
				selectorItem.attributes.push({
					name: match[7].replace(ESCAPED_CHARACTER_REGEXP, ''),
					operator: null,
					value: null,
					modifier: null,
					regExp: null
				});
			} else if (match[9] && (match[13] !== undefined || match[14] !== undefined)) {
				// Matches attributes with apostrophes, e.g. [attr='value'] or [attr="value"] or [attr='value' i]

				const value = match[13] ?? match[14];
				selectorItem.attributes = selectorItem.attributes || [];
				selectorItem.attributes.push({
					name: match[9].replace(ESCAPED_CHARACTER_REGEXP, ''),
					operator: match[11] || null,
					value: value.replace(ESCAPED_CHARACTER_REGEXP, ''),
					modifier: <'s'>match[15] || null,
					regExp: this.getAttributeRegExp({
						operator: match[11],
						value,
						modifier: match[15]
					})
				});
			} else if (match[16] && match[19] !== undefined) {
				// Matches attributes without apostrophes, e.g. [attr=value] or [attr=value i]

				selectorItem.attributes = selectorItem.attributes || [];
				selectorItem.attributes.push({
					name: match[16].replace(ESCAPED_CHARACTER_REGEXP, ''),
					operator: match[18] || null,
					value: match[19].replace(ESCAPED_CHARACTER_REGEXP, ''),
					modifier: null,
					regExp: this.getAttributeRegExp({ operator: match[18], value: match[19] })
				});
			} else if (match[21]) {
				// Matches pseudo selectors with arguments, e.g. ":nth-child(2n+1)" or ":not(.class)"

				const pseudoRegExp = new RegExp(SELECTOR_PSEUDO_REGEXP);
				let pseudoMatch: null | RegExpExecArray = null;
				let name: string | null = null;
				let depth = 0;
				let pseudoStartIndex = -1;

				while ((pseudoMatch = pseudoRegExp.exec(match[0]))) {
					if (pseudoMatch[1]) {
						if (depth === 0) {
							name = pseudoMatch[1];
						}
					} else if (pseudoMatch[2]) {
						if (pseudoMatch[2] === '(') {
							if (depth === 0) {
								pseudoStartIndex = pseudoRegExp.lastIndex;
							}
							depth++;
						} else if (pseudoMatch[2] === ')') {
							depth--;

							if (depth < 0) {
								// More closing parentheses than opening parentheses, invalid selector
								return null;
							}

							if (depth === 0) {
								// Missing start parenthesis or name for pseudo selector, invalid selector
								if (pseudoStartIndex === -1 || !name) {
									return null;
								}

								selectorItem.pseudos = selectorItem.pseudos || [];
								selectorItem.pseudos.push(
									this.getPseudo(name, match[0].substring(pseudoStartIndex, pseudoMatch.index))
								);
								name = null;
								pseudoStartIndex = -1;
							}
						}
					}
				}
			} else if (match[22]) {
				// Matches pseudo selectors without arguments, e.g. ":empty" or ":checked"

				selectorItem.pseudos = selectorItem.pseudos || [];
				selectorItem.pseudos.push(this.getPseudo(match[22], null));
			} else if (match[23]) {
				// Matches pseudo elements, e.g. "::after" or "::-webkit-inner-spin-button"

				selectorItem.isPseudoElement = true;
			}

			lastIndex = regexp.lastIndex;
		}

		// If there are any characters left in the selector that were not matched, the selector is invalid.
		if (lastIndex < selector.length) {
			return null;
		}

		return selectorItem;
	}

	/**
	 * Returns attribute RegExp.
	 *
	 * @param attribute Attribute.
	 * @param attribute.value Attribute value.
	 * @param attribute.operator Attribute operator.
	 * @param attribute.modifier Attribute modifier.
	 * @returns Attribute RegExp.
	 */
	private getAttributeRegExp(attribute: {
		value?: string;
		operator?: string;
		modifier?: string;
	}): RegExp | null {
		const modifier = attribute.modifier === 'i' ? 'i' : '';

		if (!attribute.operator || !attribute.value) {
			return null;
		}

		// Escape special regex characters in the value
		const escapedValue = attribute.value.replace(ATTRIBUTE_ESCAPE_REGEXP, '\\$&');

		switch (attribute.operator) {
			// [attribute~="value"] - Contains a specified word.
			case '~':
				return new RegExp(`[- ]${escapedValue}|${escapedValue}[- ]|^${escapedValue}$`, modifier);
			// [attribute|="value"] - Starts with the specified word.
			case '|':
				return new RegExp(`^${escapedValue}[- ]|^${escapedValue}$`, modifier);
			// [attribute^="value"] - Begins with a specified value.
			case '^':
				return new RegExp(`^${escapedValue}`, modifier);
			// [attribute$="value"] - Ends with a specified value.
			case '$':
				return new RegExp(`${escapedValue}$`, modifier);
			// [attribute*="value"] - Contains a specified value.
			case '*':
				return new RegExp(`${escapedValue}`, modifier);
			default:
				return null;
		}
	}

	/**
	 * Returns pseudo.
	 *
	 * @param name Pseudo name.
	 * @param args Pseudo arguments.
	 * @returns Pseudo.
	 */
	private getPseudo(name: string, args: string | null | undefined): ISelectorPseudo {
		const lowerName = name.toLowerCase();

		if (args) {
			args = args.trim();
		}

		if (!args) {
			return { name: lowerName, arguments: null, selectorItems: null, nthFunction: null };
		}

		switch (lowerName) {
			case 'nth-last-child':
			case 'nth-child':
				const nthOfIndex = args.indexOf(' of ');
				const nthFunction = nthOfIndex !== -1 ? args.substring(0, nthOfIndex) : args;
				const selectorItem =
					nthOfIndex !== -1 ? this.getSelectorItem(args.substring(nthOfIndex + 4).trim()) : null;
				return {
					name: lowerName,
					arguments: args,
					selectorItems: selectorItem ? [selectorItem] : null,
					nthFunction: this.getPseudoNthFunction(nthFunction)
				};
			case 'nth-of-type':
			case 'nth-last-of-type':
				return {
					name: lowerName,
					arguments: args,
					selectorItems: null,
					nthFunction: this.getPseudoNthFunction(args)
				};
			case 'not':
				const notSelectorItems = [];
				for (const group of this.getSelectorGroups(args)) {
					if (group[0]) {
						notSelectorItems.push(group[0]);
					}
				}
				return {
					name: lowerName,
					arguments: args,
					selectorItems: notSelectorItems,
					nthFunction: null
				};
			case 'is':
			case 'where':
				const selectorItems = [];
				for (const group of this.getSelectorGroups(args)) {
					if (group[0]) {
						selectorItems.push(group[0]);
					}
				}
				return {
					name: lowerName,
					arguments: args,
					selectorItems,
					nthFunction: null
				};
			case 'has':
				const hasSelectorItems = [];

				// The ":has()" pseudo selector doesn't allow for it to be nested inside another ":has()" pseudo selector, as it can lead to cyclic querying.
				if (!args.includes(':has(')) {
					let newArgs = args;
					if (args[0] === '+') {
						newArgs = args.replace('+', '');
					} else if (args[0] === '>') {
						newArgs = args.replace('>', '');
					}
					for (const group of this.getSelectorGroups(newArgs)) {
						if (group[0]) {
							hasSelectorItems.push(group[0]);
						}
					}
				}

				return {
					name: lowerName,
					arguments: args || '',
					selectorItems: hasSelectorItems,
					nthFunction: null
				};
			case 'scope':
			case 'root':
			default:
				return { name: lowerName, arguments: args, selectorItems: null, nthFunction: null };
		}
	}

	/**
	 * Returns pseudo nth function.
	 *
	 * Based on:
	 * https://github.com/dperini/nwsapi/blob/master/src/nwsapi.js
	 *
	 * @param args Pseudo arguments.
	 * @returns Pseudo nth function.
	 */
	private getPseudoNthFunction(args?: string): ((n: number) => boolean) | null {
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
