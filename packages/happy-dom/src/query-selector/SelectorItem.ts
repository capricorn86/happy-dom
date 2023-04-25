import DOMException from '../exception/DOMException';
import IElement from '../nodes/element/IElement';
import Element from '../nodes/element/Element';
import IHTMLInputElement from '../nodes/html-input-element/IHTMLInputElement';
import SelectorCombinatorEnum from './SelectorCombinatorEnum';

const ATTRIBUTE_REGEXP =
	/\[([a-zA-Z0-9-_]+)\]|\[([a-zA-Z0-9-_]+)([~|^$*]{0,1})[ ]*=[ ]*["']{0,1}([^"']+)["']{0,1}\]/g;
const ATTRIBUTE_NAME_REGEXP = /[^a-zA-Z0-9-_$]/;
const PSUEDO_REGEXP =
	/(?<!\\):([a-zA-Z-]+)\(([0-9n+-]+|odd|even)\)|(?<!\\):not\(([^)]+)\)|(?<!\\):([a-zA-Z-]+)/g;
const CLASS_REGEXP = /\.(([a-zA-Z0-9-_$]|\\.)+)/g;
const TAG_NAME_REGEXP = /^[a-zA-Z0-9-]+/;
const ID_REGEXP = /(?<!\\)#[A-Za-z][-A-Za-z0-9_]*/g;
const CSS_ESCAPE_REGEXP = /(?<!\\):/g;
const CSS_ESCAPE_CHAR_REGEXP = /\\/g;

type ISelectorInfo = {
	isAll: boolean;
	isID: boolean;
	isAttribute: boolean;
	isPseudo: boolean;
	isClass: boolean;
	isTagName: boolean;
	tagName: string;
	id: string;
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

		// Is all (*)
		if (this.selectorInfo.isAll) {
			return { priorityWeight: 0, matches: true };
		}

		// ID Match
		if (this.selectorInfo.isID) {
			priorityWeight += 100;

			if (this.selectorInfo.id !== element.id) {
				return { priorityWeight: 0, matches: false };
			}
		}

		// Tag name match
		if (this.selectorInfo.isTagName) {
			priorityWeight += 1;

			if (this.selectorInfo.tagName !== element.tagName) {
				return { priorityWeight: 0, matches: false };
			}
		}

		// Class match
		if (this.selectorInfo.isClass) {
			const result = this.matchesClass(element, selector);
			priorityWeight += result.priorityWeight;
			if (!result.matches) {
				return { priorityWeight: 0, matches: false };
			}
		}

		// Pseudo match
		if (this.selectorInfo.isPseudo && !this.matchesPsuedo(element, selector)) {
			return { priorityWeight: 0, matches: false };
		}

		// Attribute match
		if (this.selectorInfo.isAttribute) {
			const result = this.matchesAttribute(element, selector);
			priorityWeight += result.priorityWeight;
			if (!result.matches) {
				return { priorityWeight: 0, matches: false };
			}
		}

		return { priorityWeight, matches: true };
	}

	/**
	 * Matches a psuedo selector.
	 *
	 * @param element Element.
	 * @param selector Selector.
	 * @returns True if it is a match.
	 */
	private matchesPsuedo(element: IElement, selector: string): boolean {
		const regexp = new RegExp(PSUEDO_REGEXP, 'g');
		let match: RegExpMatchArray;

		while ((match = regexp.exec(selector))) {
			const isNotClass = match[3] && match[3].trim()[0] === '.';
			if (match[1] && !this.matchesNthChild(element, match[1], match[2])) {
				return false;
			} else if (match[3]) {
				if (isNotClass && this.matchesClass(element, match[3]).matches) {
					return false;
				}
				if (
					!isNotClass &&
					match[3].includes('[') &&
					this.matchesAttribute(element, match[3]).matches
				) {
					return false;
				}
				if (!isNotClass && element.tagName.toLowerCase() === match[3]) {
					return false;
				}
			} else if (match[4] && !this.matchesPsuedoExpression(element, match[4])) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Matches a nth-child selector.
	 *
	 * @param element Element.
	 * @param psuedo Psuedo name.
	 * @param place Place.
	 * @returns True if it is a match.
	 */
	private matchesNthChild(element: IElement, psuedo: string, place: string): boolean {
		let children = element.parentNode ? (<IElement>element.parentNode).children : [];

		switch (psuedo.toLowerCase()) {
			case 'nth-of-type':
				children = children.filter((child) => child.tagName === element.tagName);
				break;
			case 'nth-last-child':
				children = children.reverse();
				break;
			case 'nth-last-of-type':
				children = children.filter((child) => child.tagName === element.tagName).reverse();
				break;
		}

		if (place === 'odd') {
			const index = children.indexOf(element);
			return index !== -1 && (index + 1) % 2 !== 0;
		} else if (place === 'even') {
			const index = children.indexOf(element);
			return index !== -1 && (index + 1) % 2 === 0;
		} else if (place.includes('n')) {
			const [a, b] = place.replace(/ /g, '').split('n');
			const childIndex = children.indexOf(element);
			const aNumber = a !== '' ? Number(a) : 1;
			const bNumber = b !== undefined ? Number(b) : 0;
			if (isNaN(aNumber) || isNaN(bNumber)) {
				throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
			}

			for (let i = 0, max = children.length; i <= max; i += aNumber) {
				if (childIndex === i + bNumber - 1) {
					return true;
				}
			}

			return false;
		}

		const number = Number(place);

		if (isNaN(number)) {
			throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
		}

		return children[number - 1] === element;
	}

	/**
	 * Matches a psuedo selector expression.
	 *
	 * @param element Element.
	 * @param psuedo Psuedo name.
	 * @returns True if it is a match.
	 */
	private matchesPsuedoExpression(element: IElement, psuedo: string): boolean {
		const parent = <IElement>element.parentNode;

		if (!parent) {
			return false;
		}

		switch (psuedo.toLowerCase()) {
			case 'first-child':
				return parent.children[0] === element;
			case 'last-child':
				const lastChildChildren = parent.children;
				return lastChildChildren[lastChildChildren.length - 1] === element;
			case 'only-child':
				const onlyChildChildren = parent.children;
				return onlyChildChildren.length === 1 && onlyChildChildren[0] === element;
			case 'first-of-type':
				for (const child of parent.children) {
					if (child.tagName === element.tagName) {
						return child === element;
					}
				}
				return false;
			case 'last-of-type':
				for (let i = parent.children.length - 1; i >= 0; i--) {
					const child = parent.children[i];
					if (child.tagName === element.tagName) {
						return child === element;
					}
				}
				return false;
			case 'only-of-type':
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
			case 'checked':
				return element.tagName === 'INPUT' && (<IHTMLInputElement>element).checked;
		}

		return false;
	}

	/**
	 * Matches attribute.
	 *
	 * @param element Element.
	 * @param selector Selector.
	 * @returns Result.
	 */
	private matchesAttribute(
		element: IElement,
		selector: string
	): { priorityWeight: number; matches: boolean } {
		const regexp = new RegExp(ATTRIBUTE_REGEXP, 'g');
		let match: RegExpMatchArray;
		let priorityWeight = 0;

		while ((match = regexp.exec(selector))) {
			const isPsuedo = match.index > 0 && selector[match.index - 1] === '(';

			priorityWeight += 10;

			if (
				!isPsuedo &&
				((match[1] && !this.matchesAttributeName(element, match[1])) ||
					(match[2] && !this.matchesAttributeNameAndValue(element, match[2], match[4], match[3])))
			) {
				return { priorityWeight: 0, matches: false };
			}
		}

		return { priorityWeight, matches: true };
	}

	/**
	 * Matches class.
	 *
	 * @param element Element.
	 * @param selector Selector.
	 * @returns Result.
	 */
	private matchesClass(
		element: IElement,
		selector: string
	): { priorityWeight: number; matches: boolean } {
		const regexp = new RegExp(CLASS_REGEXP, 'g');
		const classList = element.className.split(' ');
		const classSelector = selector.split(CSS_ESCAPE_REGEXP)[0];
		let priorityWeight = 0;
		let match: RegExpMatchArray;

		while ((match = regexp.exec(classSelector))) {
			priorityWeight += 10;
			if (!classList.includes(match[1].replace(CSS_ESCAPE_CHAR_REGEXP, ''))) {
				return { priorityWeight: 0, matches: false };
			}
		}

		return { priorityWeight, matches: true };
	}

	/**
	 * Matches attribute name only.
	 *
	 * @param element Element.
	 * @param attributeName Attribute name.
	 * @returns True if it is a match.
	 */
	private matchesAttributeName(element: IElement, attributeName: string): boolean {
		if (ATTRIBUTE_NAME_REGEXP.test(attributeName)) {
			throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
		}

		return !!(<Element>element)._attributes[attributeName.toLowerCase()];
	}

	/** .
	 *
	 * Matches attribute name and value.
	 *
	 * @param element Element.
	 * @param attributeName Attribute name.
	 * @param attributeValue Attribute value.
	 * @param [matchType] Match type.
	 * @returns True if it is a match.
	 */
	/**
	 *
	 * @param element
	 * @param attributeName
	 * @param attributeValue
	 * @param matchType
	 */
	private matchesAttributeNameAndValue(
		element: IElement,
		attributeName: string,
		attributeValue: string,
		matchType: string = null
	): boolean {
		const attribute = (<Element>element)._attributes[attributeName.toLowerCase()];
		const value = attributeValue;

		if (ATTRIBUTE_NAME_REGEXP.test(attributeName)) {
			throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
		}

		if (!attribute) {
			return false;
		}

		if (matchType) {
			switch (matchType) {
				// [attribute~="value"] - Contains a specified word.
				case '~':
					return attribute.value && attribute.value.split(' ').includes(value);
				// [attribute|="value"] - Starts with the specified word.
				case '|':
					return attribute && attribute.value && new RegExp(`^${value}[- ]`).test(attribute.value);
				// [attribute^="value"] - Begins with a specified value.
				case '^':
					return attribute && attribute.value && attribute.value.startsWith(value);
				// [attribute$="value"] - Ends with a specified value.
				case '$':
					return attribute && attribute.value && attribute.value.endsWith(value);
				// [attribute*="value"] - Contains a specified value.
				case '*':
					return attribute && attribute.value && attribute.value.includes(value);
			}
		}

		return attribute && attribute.value === value;
	}

	/**
	 * Returns selector info.
	 *
	 * @param selectorString Selector string.
	 * @returns Selector info.
	 */
	private getSelectorInfo(selectorString: string): ISelectorInfo {
		const baseSelector = selectorString.replace(new RegExp(PSUEDO_REGEXP, 'g'), '');
		const idMatch = selectorString.includes('#') ? baseSelector.match(ID_REGEXP) : null;

		const isAll = baseSelector === '*';
		const isID = !!idMatch;
		const isAttribute = !isAll && baseSelector.includes('[');
		// If baseSelector !== selector then some psuedo selector was replaced above
		const isPseudo = !isAll && baseSelector !== selectorString;
		const isClass = !isAll && new RegExp(CLASS_REGEXP, 'g').test(baseSelector) && !isAttribute;
		const tagNameMatch = !isAll ? baseSelector.match(TAG_NAME_REGEXP) : null;
		const tagName = tagNameMatch ? tagNameMatch[0].toUpperCase() : null;
		const isTagName = tagName !== null;
		const id = idMatch ? idMatch[0].replace('#', '') : null;

		return {
			isAll,
			isID,
			isAttribute,
			isPseudo,
			isClass,
			isTagName,
			tagName,
			id
		};
	}
}
