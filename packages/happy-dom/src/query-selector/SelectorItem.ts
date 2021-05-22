import DOMException from '../exception/DOMException';
import Element from '../nodes/element/Element';

const ATTRIBUTE_REGEXP = /\[([a-zA-Z0-9-_]+)\]|\[([a-zA-Z0-9-_]+)([~|^$*]{0,1})[ ]*=[ ]*["']{0,1}([^"']+)["']{0,1}\]/g;
const ATTRIBUTE_NAME_REGEXP = /[^a-zA-Z0-9-_$]/;
const PSUEDO_REGEXP = /:([a-zA-Z-]+)\(([0-9n+-]+|odd|even)\)|:([a-zA-Z-]+)/g;
const CLASS_REGEXP = /\.([a-zA-Z0-9-_$]+)/g;
const TAG_NAME_REGEXP = /^[a-zA-Z0-9-]+/;

/**
 *
 */
export default class SelectorItem {
	public isAll: boolean;
	public isID: boolean;
	public isAttribute: boolean;
	public isPseudo: boolean;
	public isClass: boolean;
	public isTagName: boolean;
	private tagName = null;
	private selector: string;
	private id: string;

	/**
	 * Constructor.
	 *
	 * @param selector Selector.
	 */
	constructor(selector: string) {
		this.isAll = selector === '*';
		this.isID = !this.isAll ? selector.startsWith('#') : false;
		this.isAttribute = !this.isAll && !this.isID && selector.includes('[');
		this.isPseudo = !this.isAll && !this.isID && selector.includes(':');
		this.isClass = !this.isAll && !this.isID && new RegExp(CLASS_REGEXP, 'g').test(selector);
		this.tagName = !this.isAll && !this.isID ? selector.match(TAG_NAME_REGEXP) : null;
		this.tagName = this.tagName ? this.tagName[0].toUpperCase() : null;
		this.isTagName = this.tagName !== null;
		this.selector = selector;
		this.id = !this.isAll && this.isID ? this.selector.replace('#', '') : null;
	}

	/**
	 * Matches a selector against an element.
	 *
	 * @param element HTML element.
	 * @returns TRUE if matching.
	 */
	public match(element: Element): boolean {
		const selector = this.selector;
		let match;

		// Is all (*)
		if (this.isAll) {
			return true;
		}

		// ID Match
		if (this.isID) {
			return this.id === element.id;
		}

		// Tag name match
		if (this.isTagName) {
			if (this.tagName !== element.tagName) {
				return false;
			}
		}

		// Class match
		if (this.isClass) {
			const regexp = new RegExp(CLASS_REGEXP, 'g');

			while ((match = regexp.exec(selector))) {
				if (!element.classList.contains(match[1])) {
					return false;
				}
			}
		}

		// Pseudo match
		if (this.isPseudo) {
			const regexp = new RegExp(PSUEDO_REGEXP, 'g');

			while ((match = regexp.exec(selector))) {
				if (match[1] && !this.matchesNthChild(element, match[1], match[2])) {
					return false;
				} else if (match[3] && !this.matchesPsuedo(element, match[3])) {
					return false;
				}
			}
		}

		// Attribute match
		if (this.isAttribute) {
			const regexp = new RegExp(ATTRIBUTE_REGEXP, 'g');

			while ((match = regexp.exec(selector))) {
				if (
					(match[1] && !this.matchesAttributeName(element, match[1])) ||
					(match[2] && !this.matchesAttributeNameAndValue(element, match[2], match[4], match[3]))
				) {
					return false;
				}
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
	private matchesNthChild(element: Element, psuedo: string, place: string): boolean {
		let children = element.parentNode ? (<Element>element.parentNode).children : [];

		switch (psuedo.toLowerCase()) {
			case 'nth-of-type':
				children = children.filter(child => child.tagName === element.tagName);
				break;
			case 'nth-last-child':
				children = children.reverse();
				break;
			case 'nth-last-of-type':
				children = children.filter(child => child.tagName === element.tagName).reverse();
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
			const aNumber = Number(a);
			const bNumber = b !== undefined ? Number(b) : 0;
			if (isNaN(aNumber) || isNaN(bNumber)) {
				throw new DOMException(`The selector "${this.selector}" is not valid.`);
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
			throw new DOMException(`The selector "${this.selector}" is not valid.`);
		}

		return children[number - 1] === element;
	}

	/**
	 * Matches a psuedo selector.
	 *
	 * @param element Element.
	 * @param psuedo Psuedo name.
	 * @returns True if it is a match.
	 */
	private matchesPsuedo(element: Element, psuedo: string): boolean {
		const parent = <Element>element.parentNode;

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
		}

		return false;
	}

	/**
	 * Matches attribute name only.
	 *
	 * @param element Element.
	 * @param attributeName Attribute name.
	 * @returns True if it is a match.
	 */
	private matchesAttributeName(element, attributeName): boolean {
		if (ATTRIBUTE_NAME_REGEXP.test(attributeName)) {
			throw new DOMException(`The selector "${this.selector}" is not valid.`);
		}

		return !!element._attributes[attributeName.toLowerCase()];
	}

	/**
	 *
	 * Matches attribute name and value.
	 *
	 * @param element Element.
	 * @param attributeName Attribute name.
	 * @param attributeValue Attribute value.
	 * @param [matchType] Match type.
	 * @returns True if it is a match.
	 */
	private matchesAttributeNameAndValue(
		element,
		attributeName,
		attributeValue,
		matchType = null
	): boolean {
		const attribute = element._attributes[attributeName.toLowerCase()];
		const value = attributeValue;

		if (ATTRIBUTE_NAME_REGEXP.test(attributeName)) {
			throw new DOMException(`The selector "${this.selector}" is not valid.`);
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
}
