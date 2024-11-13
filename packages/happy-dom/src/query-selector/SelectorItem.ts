import DOMException from '../exception/DOMException.js';
import * as PropertySymbol from '../PropertySymbol.js';
import Element from '../nodes/element/Element.js';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import ISelectorAttribute from './ISelectorAttribute.js';
import ISelectorMatch from './ISelectorMatch.js';
import ISelectorPseudo from './ISelectorPseudo.js';

/**
 * Selector item.
 */
export default class SelectorItem {
	public tagName: string | null;
	public id: string | null;
	public classNames: string[] | null;
	public attributes: ISelectorAttribute[] | null;
	public pseudos: ISelectorPseudo[] | null;
	public isPseudoElement: boolean;
	public combinator: SelectorCombinatorEnum;
	public ignoreErrors: boolean;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.combinator] Combinator.
	 * @param [options.tagName] Tag name.
	 * @param [options.id] ID.
	 * @param [options.classNames] Class names.
	 * @param [options.attributes] Attributes.
	 * @param [options.pseudos] Pseudos.
	 * @param [options.isPseudoElement] Is pseudo element.
	 * @param [options.ignoreErrors] Ignore errors.
	 */
	constructor(options?: {
		tagName?: string;
		id?: string;
		classNames?: string[];
		attributes?: ISelectorAttribute[];
		pseudos?: ISelectorPseudo[];
		isPseudoElement?: boolean;
		combinator?: SelectorCombinatorEnum;
		ignoreErrors?: boolean;
	}) {
		this.tagName = options?.tagName || null;
		this.id = options?.id || null;
		this.classNames = options?.classNames || null;
		this.attributes = options?.attributes || null;
		this.pseudos = options?.pseudos || null;
		this.isPseudoElement = options?.isPseudoElement || false;
		this.combinator = options?.combinator || SelectorCombinatorEnum.descendant;
		this.ignoreErrors = options?.ignoreErrors || false;
	}

	/**
	 * Matches a selector against an element.
	 *
	 * @param element HTML element.
	 * @returns Result.
	 */
	public match(element: Element): ISelectorMatch | null {
		let priorityWeight = 0;

		if (this.isPseudoElement) {
			return null;
		}

		// Tag name match
		if (this.tagName) {
			if (this.tagName !== '*' && this.tagName !== element[PropertySymbol.tagName].toUpperCase()) {
				return null;
			}
			priorityWeight += 1;
		}

		// ID Match
		if (this.id) {
			if (this.id !== element.id) {
				return null;
			}
			priorityWeight += 100;
		}

		// Class match
		if (this.classNames) {
			const result = this.matchClass(element);
			if (!result) {
				return null;
			}
			priorityWeight += result.priorityWeight;
		}

		// Attribute match
		if (this.attributes) {
			const result = this.matchAttributes(element);
			if (!result) {
				return null;
			}
			priorityWeight += result.priorityWeight;
		}

		// Pseudo match
		if (this.pseudos) {
			const result = this.matchPseudo(element);
			if (!result) {
				return null;
			}
			priorityWeight += result.priorityWeight;
		}

		return { priorityWeight };
	}

	/**
	 * Matches a pseudo selector.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchPseudo(element: Element): ISelectorMatch | null {
		const parent = <Element>element[PropertySymbol.parentNode];
		const parentChildren = element[PropertySymbol.parentNode]
			? (<Element>element[PropertySymbol.parentNode])[PropertySymbol.elementArray]
			: [];

		if (!this.pseudos) {
			return { priorityWeight: 0 };
		}

		let priorityWeight = 0;

		for (const pseudo of this.pseudos) {
			// Validation
			switch (pseudo.name) {
				case 'not':
				case 'nth-child':
				case 'nth-of-type':
				case 'nth-last-child':
				case 'nth-last-of-type':
				case 'is':
				case 'where':
					if (!pseudo.arguments) {
						if (this.ignoreErrors) {
							return null;
						}
						throw new DOMException(
							`Failed to execute 'matches' on '${
								element.constructor.name
							}': '${this.getSelectorString()}' is not a valid selector.`
						);
					}
					break;
			}

			// Check if parent exists
			if (!parent) {
				switch (pseudo.name) {
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
						return null;
				}
			}

			const selectorMatch = this.matchPseudoItem(element, parentChildren, pseudo);

			if (!selectorMatch) {
				return null;
			}

			priorityWeight += selectorMatch.priorityWeight;
		}

		return { priorityWeight };
	}

	/**
	 * Matches a pseudo selector.
	 *
	 * @param element Element.
	 * @param parentChildren Parent children.
	 * @param pseudo Pseudo.
	 */
	private matchPseudoItem(
		element: Element,
		parentChildren: Element[],
		pseudo: ISelectorPseudo
	): ISelectorMatch | null {
		switch (pseudo.name) {
			case 'first-child':
				return parentChildren[0] === element ? { priorityWeight: 10 } : null;
			case 'last-child':
				return parentChildren.length && parentChildren[parentChildren.length - 1] === element
					? { priorityWeight: 10 }
					: null;
			case 'only-child':
				return parentChildren.length === 1 && parentChildren[0] === element
					? { priorityWeight: 10 }
					: null;
			case 'first-of-type':
				for (const child of parentChildren) {
					if (child[PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
						return child === element ? { priorityWeight: 10 } : null;
					}
				}
				return null;
			case 'last-of-type':
				for (let i = parentChildren.length - 1; i >= 0; i--) {
					const child = parentChildren[i];
					if (child[PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
						return child === element ? { priorityWeight: 10 } : null;
					}
				}
				return null;
			case 'only-of-type':
				let isFound = false;
				for (const child of parentChildren) {
					if (child[PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
						if (isFound || child !== element) {
							return null;
						}
						isFound = true;
					}
				}
				return isFound ? { priorityWeight: 10 } : null;
			case 'checked':
				return element[PropertySymbol.tagName] === 'INPUT' && (<HTMLInputElement>element).checked
					? { priorityWeight: 10 }
					: null;
			case 'disabled':
				return 'disabled' in element &&
					element[PropertySymbol.attributes][PropertySymbol.namedItems].has('disabled')
					? { priorityWeight: 10 }
					: null;
			case 'empty':
				return !(<Element>element)[PropertySymbol.elementArray].length
					? { priorityWeight: 10 }
					: null;
			case 'root':
				return element[PropertySymbol.tagName] === 'HTML' ? { priorityWeight: 10 } : null;
			case 'not':
				return !pseudo.selectorItems[0].match(element) ? { priorityWeight: 10 } : null;
			case 'nth-child':
				let nthChildIndex = -1;
				if (pseudo.selectorItems[0] && !pseudo.selectorItems[0].match(element)) {
					return null;
				}
				for (let i = 0, max = parentChildren.length; i < max; i++) {
					if (!pseudo.selectorItems[0] || pseudo.selectorItems[0].match(parentChildren[i])) {
						nthChildIndex++;
					}
					if (parentChildren[i] === element) {
						return nthChildIndex !== -1 && pseudo.nthFunction(nthChildIndex + 1)
							? { priorityWeight: 10 }
							: null;
					}
				}
				return null;
			case 'nth-of-type':
				let nthOfTypeIndex = -1;
				for (let i = 0, max = parentChildren.length; i < max; i++) {
					if (parentChildren[i][PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
						nthOfTypeIndex++;
					}
					if (parentChildren[i] === element) {
						return nthOfTypeIndex !== -1 && pseudo.nthFunction(nthOfTypeIndex + 1)
							? { priorityWeight: 10 }
							: null;
					}
				}
				return null;
			case 'nth-last-child':
				let nthLastChildIndex = -1;
				if (pseudo.selectorItems[0] && !pseudo.selectorItems[0].match(element)) {
					return null;
				}
				for (let i = parentChildren.length - 1; i >= 0; i--) {
					if (!pseudo.selectorItems[0] || pseudo.selectorItems[0].match(parentChildren[i])) {
						nthLastChildIndex++;
					}
					if (parentChildren[i] === element) {
						return nthLastChildIndex !== -1 && pseudo.nthFunction(nthLastChildIndex + 1)
							? { priorityWeight: 10 }
							: null;
					}
				}
				return null;
			case 'nth-last-of-type':
				let nthLastOfTypeIndex = -1;
				for (let i = parentChildren.length - 1; i >= 0; i--) {
					if (parentChildren[i][PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
						nthLastOfTypeIndex++;
					}
					if (parentChildren[i] === element) {
						return nthLastOfTypeIndex !== -1 && pseudo.nthFunction(nthLastOfTypeIndex + 1)
							? { priorityWeight: 10 }
							: null;
					}
				}
				return null;
			case 'target':
				const hash = element[PropertySymbol.ownerDocument].location.hash;
				if (!hash) {
					return null;
				}
				return element.isConnected && element.id === hash.slice(1) ? { priorityWeight: 10 } : null;
			case 'is':
				let priorityWeightForIs = 0;
				for (const selectorItem of pseudo.selectorItems) {
					const match = selectorItem.match(element);
					if (match && priorityWeightForIs < match.priorityWeight) {
						priorityWeightForIs = match.priorityWeight;
					}
				}
				return priorityWeightForIs ? { priorityWeight: priorityWeightForIs } : null;
			case 'where':
				for (const selectorItem of pseudo.selectorItems) {
					if (selectorItem.match(element)) {
						return { priorityWeight: 0 };
					}
				}
				return null;
			case 'has':
				let priorityWeightForHas = 0;
				if (pseudo.arguments[0] === '+') {
					const nextSibling = element.nextElementSibling;
					if (!nextSibling) {
						return null;
					}
					for (const selectorItem of pseudo.selectorItems) {
						const match = selectorItem.match(nextSibling);
						if (match && priorityWeightForHas < match.priorityWeight) {
							priorityWeightForHas = match.priorityWeight;
						}
					}
				} else {
					for (const selectorItem of pseudo.selectorItems) {
						const match = this.matchChildOfElement(selectorItem, element);
						if (match && priorityWeightForHas < match.priorityWeight) {
							priorityWeightForHas = match.priorityWeight;
						}
					}
				}
				return priorityWeightForHas ? { priorityWeight: priorityWeightForHas } : null;
			case 'focus':
			case 'focus-visible':
				return element[PropertySymbol.ownerDocument].activeElement === element
					? { priorityWeight: 10 }
					: null;
			default:
				return null;
		}
	}

	/**
	 * Matches attribute.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchAttributes(element: Element): ISelectorMatch | null {
		if (!this.attributes) {
			return null;
		}

		let priorityWeight = 0;

		for (const attribute of this.attributes) {
			const elementAttribute = (<Element>element)[PropertySymbol.attributes].getNamedItem(
				attribute.name
			);

			if (!elementAttribute) {
				return null;
			}

			priorityWeight += 10;

			if (
				attribute.value !== null &&
				(elementAttribute[PropertySymbol.value] === null ||
					(attribute.regExp && !attribute.regExp.test(elementAttribute[PropertySymbol.value])) ||
					(!attribute.regExp && attribute.value !== elementAttribute[PropertySymbol.value]))
			) {
				return null;
			}
		}

		return { priorityWeight };
	}

	/**
	 * Matches class.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchClass(element: Element): ISelectorMatch | null {
		if (!this.classNames) {
			return null;
		}

		const classList = element.className.split(' ');
		let priorityWeight = 0;

		for (const className of this.classNames) {
			if (!classList.includes(className)) {
				return null;
			}
			priorityWeight += 10;
		}

		return { priorityWeight };
	}

	/**
	 * Matches a selector item against children of an element.
	 *
	 * @param selectorItem Selector item.
	 * @param element Element.
	 * @returns Result.
	 */
	private matchChildOfElement(
		selectorItem: SelectorItem,
		element: Element
	): { priorityWeight: number } | null {
		for (const child of element[PropertySymbol.elementArray]) {
			const match = selectorItem.match(child);
			if (match) {
				return match;
			}
			const childMatch = this.matchChildOfElement(selectorItem, child);
			if (childMatch) {
				return childMatch;
			}
		}
	}

	/**
	 * Returns the selector string.
	 *
	 * @returns Selector string.
	 */
	private getSelectorString(): string {
		return `${this.tagName ? this.tagName.toLowerCase() : ''}${this.id ? `#${this.id}` : ''}${
			this.classNames ? `.${this.classNames.join('.')}` : ''
		}${
			this.attributes
				? this.attributes
						.map(
							(attribute) =>
								`[${attribute.name}${
									attribute.value ? `${attribute.operator || ''}="${attribute.value}"` : ''
								}]`
						)
						.join('')
				: ''
		}${
			this.pseudos
				? this.pseudos
						.map((pseudo) => `:${pseudo.name}${pseudo.arguments ? `(${pseudo.arguments})` : ''}`)
						.join('')
				: ''
		}`;
	}
}
