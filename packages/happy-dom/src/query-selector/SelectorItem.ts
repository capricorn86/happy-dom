import DOMException from '../exception/DOMException.js';
import * as PropertySymbol from '../PropertySymbol.js';
import IElement from '../nodes/element/IElement.js';
import Element from '../nodes/element/Element.js';
import IHTMLInputElement from '../nodes/html-input-element/IHTMLInputElement.js';
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
	 */
	constructor(options?: {
		tagName?: string;
		id?: string;
		classNames?: string[];
		attributes?: ISelectorAttribute[];
		pseudos?: ISelectorPseudo[];
		isPseudoElement?: boolean;
		combinator?: SelectorCombinatorEnum;
	}) {
		this.tagName = options?.tagName || null;
		this.id = options?.id || null;
		this.classNames = options?.classNames || null;
		this.attributes = options?.attributes || null;
		this.pseudos = options?.pseudos || null;
		this.isPseudoElement = options?.isPseudoElement || false;
		this.combinator = options?.combinator || SelectorCombinatorEnum.descendant;
	}

	/**
	 * Matches a selector against an element.
	 *
	 * @param element HTML element.
	 * @returns Result.
	 */
	public match(element: IElement): ISelectorMatch | null {
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
		if (this.pseudos && !this.matchPsuedo(element)) {
			return null;
		}

		return { priorityWeight };
	}

	/**
	 * Matches a psuedo selector.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchPsuedo(element: IElement): boolean {
		const parent = <IElement>element[PropertySymbol.parentNode];
		const parentChildren = element[PropertySymbol.parentNode]
			? (<Element>element[PropertySymbol.parentNode])[PropertySymbol.children]
			: [];

		if (!this.pseudos) {
			return true;
		}

		for (const psuedo of this.pseudos) {
			// Validation
			switch (psuedo.name) {
				case 'not':
				case 'nth-child':
				case 'nth-of-type':
				case 'nth-last-child':
				case 'nth-last-of-type':
					if (!psuedo.arguments) {
						throw new DOMException(`The selector "${this.getSelectorString()}" is not valid.`);
					}
					break;
			}

			// Check if parent exists
			if (!parent) {
				switch (psuedo.name) {
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

			switch (psuedo.name) {
				case 'first-child':
					return parentChildren[0] === element;
				case 'last-child':
					return parentChildren.length && parentChildren[parentChildren.length - 1] === element;
				case 'only-child':
					return parentChildren.length === 1 && parentChildren[0] === element;
				case 'first-of-type':
					for (const child of parentChildren) {
						if (child[PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
							return child === element;
						}
					}
					return false;
				case 'last-of-type':
					for (let i = parentChildren.length - 1; i >= 0; i--) {
						const child = parentChildren[i];
						if (child[PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
							return child === element;
						}
					}
					return false;
				case 'only-of-type':
					let isFound = false;
					for (const child of parentChildren) {
						if (child[PropertySymbol.tagName] === element[PropertySymbol.tagName]) {
							if (isFound || child !== element) {
								return false;
							}
							isFound = true;
						}
					}
					return isFound;
				case 'checked':
					return (
						element[PropertySymbol.tagName] === 'INPUT' && (<IHTMLInputElement>element).checked
					);
				case 'empty':
					return !(<Element>element)[PropertySymbol.children].length;
				case 'root':
					return element[PropertySymbol.tagName] === 'HTML';
				case 'not':
					return !psuedo.selectorItem.match(element);
				case 'nth-child':
					const nthChildIndex = psuedo.selectorItem
						? parentChildren.filter((child) => psuedo.selectorItem.match(child)).indexOf(element)
						: parentChildren.indexOf(element);
					return nthChildIndex !== -1 && psuedo.nthFunction(nthChildIndex + 1);
				case 'nth-of-type':
					if (!element[PropertySymbol.parentNode]) {
						return false;
					}
					const nthOfTypeIndex = parentChildren
						.filter((child) => child[PropertySymbol.tagName] === element[PropertySymbol.tagName])
						.indexOf(element);
					return nthOfTypeIndex !== -1 && psuedo.nthFunction(nthOfTypeIndex + 1);
				case 'nth-last-child':
					const nthLastChildIndex = psuedo.selectorItem
						? parentChildren
								.filter((child) => psuedo.selectorItem.match(child))
								.reverse()
								.indexOf(element)
						: parentChildren.reverse().indexOf(element);
					return nthLastChildIndex !== -1 && psuedo.nthFunction(nthLastChildIndex + 1);
				case 'nth-last-of-type':
					const nthLastOfTypeIndex = parentChildren
						.filter((child) => child[PropertySymbol.tagName] === element[PropertySymbol.tagName])
						.reverse()
						.indexOf(element);
					return nthLastOfTypeIndex !== -1 && psuedo.nthFunction(nthLastOfTypeIndex + 1);
				case 'target':
					const hash = element[PropertySymbol.ownerDocument].location.hash;
					if (!hash) {
						return false;
					}
					return element.isConnected && element.id === hash.slice(1);
			}
		}

		return true;
	}

	/**
	 * Matches attribute.
	 *
	 * @param element Element.
	 * @returns Result.
	 */
	private matchAttributes(element: IElement): ISelectorMatch | null {
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
	private matchClass(element: IElement): ISelectorMatch | null {
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
	 * Returns the selector string.
	 *
	 * @returns Selector string.
	 */
	private getSelectorString(): string {
		return `${this.tagName || ''}${this.id ? `#${this.id}` : ''}${
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
