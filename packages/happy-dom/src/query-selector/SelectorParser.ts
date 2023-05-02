import SelectorItem from './SelectorItem';
import SelectorCombinatorEnum from './SelectorCombinatorEnum';
import DOMException from '../exception/DOMException';

/**
 * Selector RegExp.
 *
 * Group 1: All (e.g. "*")
 * Group 2: Tag name (e.g. "div")
 * Group 3: ID (e.g. "#id")
 * Group 4: Class (e.g. ".class")
 * Group 5: Attribute name when no value (e.g. "attr1")
 * Group 6: Attribute name when there is a value using apostrophe (e.g. "attr1")
 * Group 7: Attribute operator when using apostrophe (e.g. "~")
 * Group 8: Attribute value when using apostrophe (e.g. "value1")
 * Group 9: Attribute name when threre is a value not using apostrophe (e.g. "attr1")
 * Group 10: Attribute operator when not using apostrophe (e.g. "~")
 * Group 11: Attribute value when notusing apostrophe (e.g. "value1")
 * Group 12: Pseudo name when arguments (e.g. "nth-child")
 * Group 13: Arguments of pseudo (e.g. "2n + 1")
 * Group 14: Pseudo name when no arguments (e.g. "empty")
 * Group 15: Combinator.
 */
const SELECTOR_REGEXP =
	/(\*)|([a-zA-Z0-9-]+)|#((?:[a-zA-Z0-9-_]|\\.)+)|\.((?:[a-zA-Z0-9-_]|\\.)+)|\[([a-zA-Z0-9-_]+)\]|\[([a-zA-Z0-9-_]+)([~|^$*]{0,1}) *= *["']{1}([^"']*)["']{1}\]|\[([a-zA-Z0-9-_]+)([~|^$*]{0,1}) *= *([^\]]*)\]|:([a-zA-Z-]+) *\(([^)]+)\)|:([a-zA-Z-]+)|([ ,+>]*)/g;

/**
 * Escaped Character RegExp.
 */
const CLASS_ESCAPED_CHARACTER_REGEXP = /\\/g;

/**
 * Simple Selector RegExp.
 *
 * Group 1: Tag name (e.g. "div")
 * Group 2: Class (e.g. ".classA.classB")
 * Group 3: ID (e.g. "#id")
 */
const SIMPLE_SELECTOR_REGEXP = /(^[a-zA-Z0-9-]+$)|(^\.[a-zA-Z0-9-_.]+$)|(^#[a-zA-Z0-9-_]+$)/;

/**
 * Utility for parsing a selection string.
 */
export default class SelectorParser {
	/**
	 * Parses a selector string and returns an instance of SelectorItem.
	 *
	 * @param selector Selector.
	 * @returns Selector itme.
	 */
	public static getSelectorItem(selector: string): SelectorItem {
		return this.getSelectorGroups(selector)[0][0];
	}

	/**
	 * Parses a selector string and returns groups with SelectorItem instances.
	 *
	 * @param selector Selector.
	 * @returns Selector groups.
	 */
	public static getSelectorGroups(selector: string): Array<Array<SelectorItem>> {
		if (selector === '*') {
			return [[new SelectorItem({ tagName: '*' })]];
		}

		const simpleMatch = selector.match(SIMPLE_SELECTOR_REGEXP);

		if (simpleMatch) {
			if (simpleMatch[1]) {
				return [[new SelectorItem({ tagName: selector.toUpperCase() })]];
			} else if (simpleMatch[2]) {
				return [[new SelectorItem({ classNames: selector.replace('.', '').split('.') })]];
			} else if (simpleMatch[3]) {
				return [[new SelectorItem({ id: selector.replace('#', '') })]];
			}
		}

		const regexp = new RegExp(SELECTOR_REGEXP);
		let currentSelectorItem: SelectorItem = new SelectorItem({
			combinator: SelectorCombinatorEnum.descendant
		});
		let currentGroup: SelectorItem[] = [currentSelectorItem];
		const groups: Array<Array<SelectorItem>> = [currentGroup];
		let isValid = false;
		let match;

		while ((match = regexp.exec(selector))) {
			if (match[0]) {
				isValid = true;

				if (match[1]) {
					currentSelectorItem.tagName = '*';
				} else if (match[2]) {
					currentSelectorItem.tagName = match[2].toUpperCase();
				} else if (match[3]) {
					currentSelectorItem.id = match[3].replace(CLASS_ESCAPED_CHARACTER_REGEXP, '');
				} else if (match[4]) {
					currentSelectorItem.classNames = currentSelectorItem.classNames || [];
					currentSelectorItem.classNames.push(match[4].replace(CLASS_ESCAPED_CHARACTER_REGEXP, ''));
				} else if (match[5]) {
					currentSelectorItem.attributes = currentSelectorItem.attributes || [];
					currentSelectorItem.attributes.push({
						name: match[5].toLowerCase(),
						operator: null,
						value: null
					});
				} else if (match[6] && match[8] !== undefined) {
					currentSelectorItem.attributes = currentSelectorItem.attributes || [];
					currentSelectorItem.attributes.push({
						name: match[6].toLowerCase(),
						operator: match[7] || null,
						value: match[8]
					});
				} else if (match[9] && match[11] !== undefined) {
					currentSelectorItem.attributes = currentSelectorItem.attributes || [];
					currentSelectorItem.attributes.push({
						name: match[9].toLowerCase(),
						operator: match[10] || null,
						value: match[11]
					});
				} else if (match[12] && match[13]) {
					currentSelectorItem.pseudos = currentSelectorItem.pseudos || [];
					currentSelectorItem.pseudos.push({
						name: match[12].toLowerCase(),
						arguments: match[13]
					});
				} else if (match[14]) {
					currentSelectorItem.pseudos = currentSelectorItem.pseudos || [];
					currentSelectorItem.pseudos.push({
						name: match[14].toLowerCase(),
						arguments: null
					});
				} else if (match[15]) {
					switch (match[15].trim()) {
						case ',':
							currentSelectorItem = new SelectorItem({
								combinator: SelectorCombinatorEnum.descendant
							});
							currentGroup = [currentSelectorItem];
							groups.push(currentGroup);
							break;
						case '>':
							currentSelectorItem = new SelectorItem({ combinator: SelectorCombinatorEnum.child });
							currentGroup.push(currentSelectorItem);
							break;
						case '+':
							currentSelectorItem = new SelectorItem({
								combinator: SelectorCombinatorEnum.adjacentSibling
							});
							currentGroup.push(currentSelectorItem);
							break;
						case '':
							currentSelectorItem = new SelectorItem({
								combinator: SelectorCombinatorEnum.descendant
							});
							currentGroup.push(currentSelectorItem);
							break;
					}
				}
			} else {
				break;
			}
		}

		if (!isValid) {
			throw new DOMException(`Invalid selector: "${selector}"`);
		}

		return groups;
	}
}
