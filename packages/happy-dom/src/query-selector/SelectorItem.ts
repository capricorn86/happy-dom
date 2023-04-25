import DOMException from '../exception/DOMException';
import IElement from '../nodes/element/IElement';
import Element from '../nodes/element/Element';
import IHTMLInputElement from '../nodes/html-input-element/IHTMLInputElement';
import SelectorCombinatorEnum from './SelectorCombinatorEnum';

/**
 * Group 1: All (e.g. "*")
 * Group 2: Tag name (e.g. "div")
 * Group 3: ID (e.g. "#id")
 * Group 4: Class (e.g. ".class")
 * Group 5: Extra group for class escaped characters
 * Group 6: Attribute (e.g. "[attr1="value1"][attr2=value2]")
 * Group 7: Pseudo (e.g. ":first-child")
 * Group 8: Arguments of pseudo with parentheses (e.g. "(2n + 1)")
 * Group 9: Arguments of pseudo (e.g. "2n + 1")
 */
const SELECTOR_REGEXP =
	/(\*){0,1}([a-zA-Z0-9-]+){0,1}(#[a-zA-Z0-9-_]+){0,1}(\.([a-zA-Z0-9-_.]|\\.)+){0,1}(\[[^\]]+\]){0,}(:[a-zA-Z-:]+){0,1}(\(([^)]+)\)){0,1}/;

/**
 * Group 1: Attribute name when there is no value (e.g. "attr1")
 * Group 2: Attribute name when it has an operator and value (e.g. "attr1")
 * Group 3: Attribute operator (e.g. "~")
 * Group 4: Attribute value (e.g. "value1")
 */
const ATTRIBUTE_REGEXP =
	/\[([a-zA-Z0-9-_]+)\]|\[([a-zA-Z0-9-_]+)([~|^$*]{0,1})[ ]*=[ ]*["']{0,1}([^"']+)["']{0,1}\]/g;

const CLASS_ESCAPED_CHARACTER_REGEXP = /\\/g;

type ISelectorAttribute = {
	name: string;
	operator: string | null;
	value: string | null;
};

type ISelectorInfo = {
	isAll: boolean;
	tagName: string | null;
	id: string | null;
	classNames: string[] | null;
	attributes: ISelectorAttribute[] | null;
	pseudoClass: string | null;
	pseudoArguments: string | null;
};

/**
 * Selector item.
 */
export default class SelectorItem {
	public combinator: SelectorCombinatorEnum;
	private selectorString;
	private selectorInfo: ISelectorInfo | null = null;

	/**
	 * Constructor.
	 *
	 * @param selector Selector.
	 * @param [combinator] Combinator.
	 */
	constructor(selector: string, combinator = SelectorCombinatorEnum.descendant) {
		this.selectorString = selector;
		this.combinator = combinator;
	}

	/**
	 * Matches a selector against an element.
	 *
	 * @param element HTML element.
	 * @returns Result.
	 */
	public match(element: IElement): { priorityWeight: number; matches: boolean } {
		const selector = this.selectorString;

		if (!this.selectorInfo) {
			this.selectorInfo = this.getSelectorInfo(selector);
		}

		let priorityWeight = 0;

		// Tag name match
		if (this.selectorInfo.tagName) {
			if (this.selectorInfo.tagName !== element.tagName) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += 1;
		}

		// ID Match
		if (this.selectorInfo.id) {
			if (this.selectorInfo.id !== element.id) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += 100;
		}

		// Class match
		if (this.selectorInfo.classNames) {
			const result = this.matchesClass(element);
			if (!result.matches) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += result.priorityWeight;
		}

		// Attribute match
		if (this.selectorInfo.attributes) {
			const result = this.matchesAttribute(element);
			if (!result.matches) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += result.priorityWeight;
		}

		// Pseudo match
		if (this.selectorInfo.pseudoClass && !this.matchesPsuedo(element)) {
			return { priorityWeight: 0, matches: false };
		}

		return { priorityWeight, matches: true };
	}

	/**
	 * Matches a psuedo selector.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchesPsuedo(element: IElement): boolean {
		const parent = <IElement>element.parentNode;

		// Validation
		switch (this.selectorInfo.pseudoClass) {
			case ':not':
			case ':nth-child':
			case ':nth-of-type':
			case ':nth-last-child':
			case ':nth-last-of-type':
				if (!this.selectorInfo.pseudoArguments) {
					throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
				}
				break;
		}

		// Check if parent exists
		if (!parent) {
			switch (this.selectorInfo.pseudoClass) {
				case ':first-child':
				case ':last-child':
				case ':only-child':
				case ':first-of-type':
				case ':last-of-type':
				case ':only-of-type':
				case ':nth-child':
				case ':nth-of-type':
				case ':nth-last-child':
				case ':nth-last-of-type':
					return false;
			}
		}

		switch (this.selectorInfo.pseudoClass) {
			case ':first-child':
				return parent.children[0] === element;
			case ':last-child':
				return parent.children.length && parent.children[parent.children.length - 1] === element;
			case ':only-child':
				return parent.children.length === 1 && parent.children[0] === element;
			case ':first-of-type':
				for (const child of parent.children) {
					if (child.tagName === element.tagName) {
						return child === element;
					}
				}
				return false;
			case ':last-of-type':
				for (let i = parent.children.length - 1; i >= 0; i--) {
					const child = parent.children[i];
					if (child.tagName === element.tagName) {
						return child === element;
					}
				}
				return false;
			case ':only-of-type':
				let isFound = false;
				for (const child of parent.children) {
					if (child.tagName === element.tagName) {
						if (isFound || child !== element) {
							return false;
						}
						isFound = true;
					}
				}
				return isFound;
			case ':checked':
				return element.tagName === 'INPUT' && (<IHTMLInputElement>element).checked;
			case ':empty':
				return !element.children.length;
			case ':root':
				return element.tagName === 'HTML';
			case ':not':
				return !new SelectorItem(this.selectorInfo.pseudoArguments).match(element).matches;
			case ':nth-child':
				return this.matchesNthChild(element, parent.children, this.selectorInfo.pseudoArguments);
			case ':nth-of-type':
				if (!element.parentNode) {
					return false;
				}
				return this.matchesNthChild(
					element,
					parent.children.filter((child) => child.tagName === element.tagName),
					this.selectorInfo.pseudoArguments
				);
			case ':nth-last-child':
				return this.matchesNthChild(
					element,
					parent.children.reverse(),
					this.selectorInfo.pseudoArguments
				);
			case ':nth-last-of-type':
				return this.matchesNthChild(
					element,
					parent.children.filter((child) => child.tagName === element.tagName).reverse(),
					this.selectorInfo.pseudoArguments
				);
		}
	}

	/**
	 * Matches a nth-child selector.
	 *
	 * @param element Element.
	 * @param parentChildren Parent children.
	 * @param placement Placement.
	 * @returns True if it is a match.
	 */
	private matchesNthChild(
		element: IElement,
		parentChildren: IElement[],
		placement: string
	): boolean {
		if (placement === 'odd') {
			const index = parentChildren.indexOf(element);
			return index !== -1 && (index + 1) % 2 !== 0;
		} else if (placement === 'even') {
			const index = parentChildren.indexOf(element);
			return index !== -1 && (index + 1) % 2 === 0;
		} else if (placement.includes('n')) {
			const [a, b] = placement.replace(/ /g, '').split('n');
			const childIndex = parentChildren.indexOf(element);
			const aNumber = a !== '' ? Number(a) : 1;
			const bNumber = b !== undefined ? Number(b) : 0;
			if (isNaN(aNumber) || isNaN(bNumber)) {
				throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
			}

			for (let i = 0, max = parentChildren.length; i <= max; i += aNumber) {
				if (childIndex === i + bNumber - 1) {
					return true;
				}
			}

			return false;
		}

		const number = Number(placement);

		if (isNaN(number)) {
			throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
		}

		return parentChildren[number - 1] === element;
	}

	/**
	 * Matches attribute.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchesAttribute(element: IElement): { priorityWeight: number; matches: boolean } {
		if (!this.selectorInfo.attributes) {
			return { priorityWeight: 0, matches: true };
		}

		let priorityWeight = 0;

		for (const attribute of this.selectorInfo.attributes) {
			const elementAttribute = (<Element>element)._attributes[attribute.name];

			if (!elementAttribute) {
				return { priorityWeight: 0, matches: false };
			}

			priorityWeight += 10;

			if (attribute.value !== null) {
				if (!elementAttribute.value) {
					return { priorityWeight: 0, matches: false };
				}

				switch (attribute.operator) {
					// [attribute~="value"] - Contains a specified word.
					case null:
						if (attribute.value !== elementAttribute.value) {
							return { priorityWeight: 0, matches: false };
						}
						break;
					// [attribute~="value"] - Contains a specified word.
					case '~':
						if (!elementAttribute.value.split(' ').includes(attribute.value)) {
							return { priorityWeight: 0, matches: false };
						}
						break;
					// [attribute|="value"] - Starts with the specified word.
					case '|':
						if (!new RegExp(`^${attribute.value}[- ]`).test(elementAttribute.value)) {
							return { priorityWeight: 0, matches: false };
						}
						break;
					// [attribute^="value"] - Begins with a specified value.
					case '^':
						if (!elementAttribute.value.startsWith(attribute.value)) {
							return { priorityWeight: 0, matches: false };
						}
						break;
					// [attribute$="value"] - Ends with a specified value.
					case '$':
						if (!elementAttribute.value.endsWith(attribute.value)) {
							return { priorityWeight: 0, matches: false };
						}
						break;
					// [attribute*="value"] - Contains a specified value.
					case '*':
						if (!elementAttribute.value.includes(attribute.value)) {
							return { priorityWeight: 0, matches: false };
						}
						break;
				}
			}
		}

		return { priorityWeight, matches: true };
	}

	/**
	 * Matches class.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchesClass(element: IElement): { priorityWeight: number; matches: boolean } {
		if (!this.selectorInfo.classNames) {
			return { priorityWeight: 0, matches: true };
		}

		const classList = element.className.split(' ');
		let priorityWeight = 0;

		for (const className of this.selectorInfo.classNames) {
			if (!classList.includes(className)) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += 10;
		}

		return { priorityWeight, matches: true };
	}

	/**
	 * Returns selector info.
	 *
	 * @param selectorString Selector string.
	 * @returns Selector info.
	 */
	private getSelectorInfo(selectorString: string): ISelectorInfo {
		const match = selectorString.match(SELECTOR_REGEXP);

		if (!match) {
			throw new DOMException(`The selector "${selectorString}" is not valid.`);
		}

		let attributes: ISelectorAttribute[] | null = null;

		if (match[6]) {
			const regexp = new RegExp(ATTRIBUTE_REGEXP, 'g');
			let attributeMatch;
			attributes = [];

			while ((attributeMatch = regexp.exec(match[6]))) {
				if (attributeMatch[1]) {
					attributes.push({
						name: attributeMatch[1].toLowerCase(),
						value: null,
						operator: null
					});
				} else {
					attributes.push({
						name: attributeMatch[2].toLowerCase(),
						operator: attributeMatch[3] || null,
						value: attributeMatch[4] || null
					});
				}
			}
		}

		return {
			isAll: match[1] === '*',
			tagName: match[2] ? match[2].toUpperCase() : null,
			id: match[3] ? match[3].replace('#', '') : null,
			classNames: match[4]
				? match[4].replace('.', '').replace(CLASS_ESCAPED_CHARACTER_REGEXP, '').split('.')
				: null,
			attributes,
			pseudoClass: match[7] ? match[7] : null,
			pseudoArguments: match[9] ? match[9] : null
		};
	}
}
