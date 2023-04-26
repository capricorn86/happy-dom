import SelectorItem from './SelectorItem';
import SelectorCombinatorEnum from './SelectorCombinatorEnum';

/**
 * Group 1: Combinator.
 * Group 2: All (e.g. "*")
 * Group 3: Tag name (e.g. "div")
 * Group 4: ID (e.g. "#id")
 * Group 5: Class (e.g. ".class")
 * Group 6: Attribute name when no value (e.g. "attr1")
 * Group 7: Attribute name when there is a value (e.g. "attr1")
 * Group 8: Attribute operator (e.g. "~")
 * Group 9: Attribute value (e.g. "value1")
 * Group 10: Pseudo (e.g. "nth-child")
 * Group 11: Arguments of pseudo (e.g. "2n + 1")
 */
const SELECTOR_REGEXP =
	/([ ,+>]*)|(\*)|([a-zA-Z0-9-]+)|#([a-zA-Z0-9-_]+)|\.((?:[a-zA-Z0-9-_]|\\.)+)|\[([a-zA-Z0-9-_]+)\]|\[([a-zA-Z0-9-_]+)([~|^$*]{0,1}) *= *["']{0,1}([^"']+)["']{0,1}\]|:([a-zA-Z-:]+)|\(([^)]+)\)/g;

const CLASS_ESCAPED_CHARACTER_REGEXP = /\\/g;

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
		const regexp = new RegExp(SELECTOR_REGEXP);
		const groups: Array<Array<SelectorItem>> = [];
		let currentGroup: SelectorItem[] = [];
		let currentSelectorItem: SelectorItem = new SelectorItem({ selectorString: selector });
		let match;

		while ((match = regexp.exec(selector))) {
			if (match[1]) {
				switch (match[1].trim()) {
					case ',':
						groups.push(currentGroup);
						currentSelectorItem = new SelectorItem({ selectorString: selector });
						currentGroup = [currentSelectorItem];
						break;
					case '>':
						currentSelectorItem.combinator = SelectorCombinatorEnum.child;
						break;
					case '+':
						currentSelectorItem.combinator = SelectorCombinatorEnum.adjacentSibling;
						break;
					case '':
						currentSelectorItem.combinator = SelectorCombinatorEnum.descendant;
						break;
				}
			} else if (match[2]) {
				currentSelectorItem.all = '*';
			} else if (match[3]) {
				currentSelectorItem.tagName = match[3].toLowerCase();
			} else if (match[4]) {
				currentSelectorItem.id = match[4].toLowerCase();
			} else if (match[5]) {
				currentSelectorItem.classNames = currentSelectorItem.classNames || [];
				currentSelectorItem.classNames.push(match[5].replace(CLASS_ESCAPED_CHARACTER_REGEXP, ''));
			} else if (match[6]) {
				currentSelectorItem.attributes = currentSelectorItem.attributes || [];
				currentSelectorItem.attributes.push({
					name: match[6].toLowerCase(),
					operator: null,
					value: null
				});
			} else if (match[7] && match[9]) {
				currentSelectorItem.attributes = currentSelectorItem.attributes || [];
				currentSelectorItem.attributes.push({
					name: match[7].toLowerCase(),
					operator: match[8] || null,
					value: match[9]
				});
			} else if (match[10]) {
				currentSelectorItem.pseudoClass = match[10].toLowerCase();
			} else if (match[11]) {
				currentSelectorItem.pseudoArguments = match[11];
			}
		}

		if (currentGroup.length) {
			groups.push(currentGroup);
		}

		return groups;
	}
}
