import DOMException from '../exception/DOMException';
import IElement from '../nodes/element/IElement';
import Element from '../nodes/element/Element';
import IHTMLInputElement from '../nodes/html-input-element/IHTMLInputElement';
import SelectorCombinatorEnum from './SelectorCombinatorEnum';
import ISelectorAttribute from './ISelectorAttribute';
import SelectorParser from './SelectorParser';

/**
 * Selector item.
 */
export default class SelectorItem {
	public combinator = SelectorCombinatorEnum.descendant;
	public all: string | null = null;
	public tagName: string | null = null;
	public id: string | null = null;
	public classNames: string[] | null = null;
	public attributes: ISelectorAttribute[] | null = null;
	public pseudoClass: string | null = null;
	public pseudoArguments: string | null = null;
	public selectorString: string | null = null;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.selectorString] Selector string.
	 */
	constructor(options?: { selectorString?: string | null }) {
		this.selectorString = options?.selectorString || null;
	}

	/**
	 * Matches a selector against an element.
	 *
	 * @param element HTML element.
	 * @returns Result.
	 */
	public match(element: IElement): { priorityWeight: number; matches: boolean } {
		let priorityWeight = 0;

		// Tag name match
		if (this.tagName) {
			if (this.tagName !== element.tagName) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += 1;
		}

		// ID Match
		if (this.id) {
			if (this.id !== element.id) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += 100;
		}

		// Class match
		if (this.classNames) {
			const result = this.matchesClass(element);
			if (!result.matches) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += result.priorityWeight;
		}

		// Attribute match
		if (this.attributes) {
			const result = this.matchesAttribute(element);
			if (!result.matches) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += result.priorityWeight;
		}

		// Pseudo match
		if (this.pseudoClass && !this.matchesPsuedo(element)) {
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
		switch (this.pseudoClass) {
			case 'not':
			case 'nth-child':
			case 'nth-of-type':
			case 'nth-last-child':
			case 'nth-last-of-type':
				if (!this.pseudoArguments) {
					throw new DOMException(`The selector "${this.selectorString}" is not valid.`);
				}
				break;
		}

		// Check if parent exists
		if (!parent) {
			switch (this.pseudoClass) {
				case 'first-child':
				case 'last-child':
				case 'only-child':
				case 'first-of-type':
				case 'last-of-type':
				case 'only-of-type':
				case 'nth-child':
				case 'nth-of-type':
				case 'nth-last-child':
				case 'nth-last-of-type':
					return false;
			}
		}

		switch (this.pseudoClass) {
			case 'first-child':
				return parent.children[0] === element;
			case 'last-child':
				return parent.children.length && parent.children[parent.children.length - 1] === element;
			case 'only-child':
				return parent.children.length === 1 && parent.children[0] === element;
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
			case 'empty':
				return !element.children.length;
			case 'root':
				return element.tagName === 'HTML';
			case 'not':
				return !SelectorParser.getSelectorItem(this.pseudoArguments).match(element).matches;
			case 'nth-child':
				return this.matchesNthChild(element, parent.children, this.pseudoArguments);
			case 'nth-of-type':
				if (!element.parentNode) {
					return false;
				}
				return this.matchesNthChild(
					element,
					parent.children.filter((child) => child.tagName === element.tagName),
					this.pseudoArguments
				);
			case 'nth-last-child':
				return this.matchesNthChild(element, parent.children.reverse(), this.pseudoArguments);
			case 'nth-last-of-type':
				return this.matchesNthChild(
					element,
					parent.children.filter((child) => child.tagName === element.tagName).reverse(),
					this.pseudoArguments
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
		if (!this.attributes) {
			return { priorityWeight: 0, matches: true };
		}

		let priorityWeight = 0;

		for (const attribute of this.attributes) {
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
		if (!this.classNames) {
			return { priorityWeight: 0, matches: true };
		}

		const classList = element.className.split(' ');
		let priorityWeight = 0;

		for (const className of this.classNames) {
			if (!classList.includes(className)) {
				return { priorityWeight: 0, matches: false };
			}
			priorityWeight += 10;
		}

		return { priorityWeight, matches: true };
	}
}
