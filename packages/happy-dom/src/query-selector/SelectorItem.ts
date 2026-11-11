import * as PropertySymbol from '../PropertySymbol.js';
import type Element from '../nodes/element/Element.js';
import type HTMLInputElement from '../nodes/html-input-element/HTMLInputElement.js';
import SelectorCombinatorEnum from './SelectorCombinatorEnum.js';
import type ISelectorAttribute from './ISelectorAttribute.js';
import type ISelectorMatch from './ISelectorMatch.js';
import type ISelectorPseudo from './ISelectorPseudo.js';
import type DocumentFragment from '../nodes/document-fragment/DocumentFragment.js';
import NodeTypeEnum from '../nodes/node/NodeTypeEnum.js';
import type ShadowRoot from '../nodes/shadow-root/ShadowRoot.js';
import type { TGlobalMatchFunction } from './TGlobalMatchFunction.js';

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
	public globalMatchFunction: TGlobalMatchFunction;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.globalMatchFunction Global match function.
	 * @param [options.combinator] Combinator.
	 * @param [options.tagName] Tag name.
	 * @param [options.id] ID.
	 * @param [options.classNames] Class names.
	 * @param [options.attributes] Attributes.
	 * @param [options.pseudos] Pseudos.
	 * @param [options.isPseudoElement] Is pseudo element.
	 * @param [options.ignoreErrors] Ignore errors.
	 */
	constructor(options: {
		globalMatchFunction: TGlobalMatchFunction;
		tagName?: string;
		id?: string;
		classNames?: string[];
		attributes?: ISelectorAttribute[];
		pseudos?: ISelectorPseudo[];
		isPseudoElement?: boolean;
		combinator?: SelectorCombinatorEnum;
	}) {
		this.globalMatchFunction = options!.globalMatchFunction;
		this.tagName = options?.tagName || null;
		this.id = options?.id || null;
		this.classNames = options?.classNames || null;
		this.attributes = options?.attributes || null;
		this.pseudos = options?.pseudos || null;
		this.isPseudoElement = options?.isPseudoElement || false;
		this.combinator = options?.combinator || SelectorCombinatorEnum.none;
	}

	/**
	 * Matches a selector against an element.
	 *
	 * @param scope Scope.
	 * @param element HTML element.
	 * @param [ignoreErrors] Ignores errors.
	 * @returns Result.
	 */
	public match(
		scope: Element | DocumentFragment | null,
		element: Element | ShadowRoot,
		ignoreErrors?: boolean
	): ISelectorMatch | null {
		let priorityWeight = 0;

		if (this.isPseudoElement) {
			return null;
		}

		element = <Element>(
			(element[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode
				? (<ShadowRoot>element).host!
				: element)
		);

		if (!element) {
			return null;
		}

		// Tag name match
		if (this.tagName) {
			if (this.tagName !== '*' && this.tagName !== element[PropertySymbol.tagName]!.toUpperCase()) {
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
			const result = this.matchPseudo(scope, element, ignoreErrors);
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
	 * @param scope Scope.
	 * @param element Element.
	 * @param [ignoreErrors] Ignores errors.
	 * @returns Result.
	 */
	private matchPseudo(
		scope: Element | DocumentFragment | null,
		element: Element,
		ignoreErrors?: boolean
	): ISelectorMatch | null {
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
				case 'host-context':
					if (!pseudo.arguments) {
						if (ignoreErrors) {
							return null;
						}
						throw new element[PropertySymbol.window].DOMException(
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

			const selectorMatch = this.matchPseudoItem(
				scope,
				element,
				parentChildren,
				pseudo,
				ignoreErrors
			);

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
	 * @param scope Scope.
	 * @param element Element.
	 * @param parentChildren Parent children.
	 * @param pseudo Pseudo.
	 * @param [ignoreErrors] Ignores errors.
	 */
	private matchPseudoItem(
		scope: Element | DocumentFragment | null,
		element: Element,
		parentChildren: Element[],
		pseudo: ISelectorPseudo,
		ignoreErrors?: boolean
	): ISelectorMatch | null {
		const root = this.getRootElement(scope);
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
				return 'disabled' in element && element.hasAttribute('disabled')
					? { priorityWeight: 10 }
					: null;
			case 'empty':
				return !(<Element>element)[PropertySymbol.elementArray].length
					? { priorityWeight: 10 }
					: null;
			case 'root':
				return root && element === root ? { priorityWeight: 10 } : null;
			case 'host':
				if (pseudo.arguments) {
					return element.shadowRoot &&
						this.globalMatchFunction(element, pseudo.arguments, { ignoreErrors: ignoreErrors })
						? { priorityWeight: 10 }
						: null;
				}
				return element.shadowRoot ? { priorityWeight: 10 } : null;
			case 'host-context':
				return element.shadowRoot &&
					this.globalMatchFunction(element, pseudo.arguments!, { ignoreErrors: ignoreErrors })
					? { priorityWeight: 10 }
					: null;
			case 'not':
				if (!pseudo.selectorGroups) {
					return null;
				}
				return this.matchSelectorGroups(scope, pseudo.selectorGroups, element, {}, ignoreErrors)
					? null
					: { priorityWeight: 10 };
			case 'nth-child':
				let nthChildIndex = -1;
				if (
					pseudo.selectorGroups &&
					!this.matchSelectorGroups(scope, pseudo.selectorGroups, element, {}, ignoreErrors)
				) {
					return null;
				}
				for (let i = 0, max = parentChildren.length; i < max; i++) {
					if (
						!pseudo.selectorGroups ||
						this.matchSelectorGroups(
							scope,
							pseudo.selectorGroups,
							parentChildren[i],
							{},
							ignoreErrors
						)
					) {
						nthChildIndex++;
					}
					if (parentChildren[i] === element) {
						return nthChildIndex !== -1 && pseudo.nthFunction!(nthChildIndex + 1)
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
						return nthOfTypeIndex !== -1 && pseudo.nthFunction!(nthOfTypeIndex + 1)
							? { priorityWeight: 10 }
							: null;
					}
				}
				return null;
			case 'nth-last-child':
				let nthLastChildIndex = -1;
				if (
					pseudo.selectorGroups &&
					!this.matchSelectorGroups(scope, pseudo.selectorGroups, element, {}, ignoreErrors)
				) {
					return null;
				}
				for (let i = parentChildren.length - 1; i >= 0; i--) {
					if (
						!pseudo.selectorGroups ||
						this.matchSelectorGroups(
							scope,
							pseudo.selectorGroups,
							parentChildren[i],
							{},
							ignoreErrors
						)
					) {
						nthLastChildIndex++;
					}
					if (parentChildren[i] === element) {
						return nthLastChildIndex !== -1 && pseudo.nthFunction!(nthLastChildIndex + 1)
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
						return nthLastOfTypeIndex !== -1 && pseudo.nthFunction!(nthLastOfTypeIndex + 1)
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
				if (!pseudo.selectorGroups) {
					return null;
				}
				const isMatch = this.matchSelectorGroups(
					scope,
					pseudo.selectorGroups,
					element,
					{},
					ignoreErrors
				);
				return isMatch && isMatch.priorityWeight
					? { priorityWeight: isMatch.priorityWeight }
					: null;
			case 'where':
				if (!pseudo.selectorGroups) {
					return null;
				}
				return this.matchSelectorGroups(scope, pseudo.selectorGroups, element, {}, ignoreErrors)
					? { priorityWeight: 0 }
					: null;
			case 'has':
				let priorityWeightForHas = 0;
				if (pseudo.arguments && pseudo.selectorGroups) {
					if (pseudo.arguments[0] === '+') {
						const nextSibling = element.nextElementSibling;
						if (!nextSibling) {
							return null;
						}
						const match = this.matchSelectorGroups(
							scope,
							pseudo.selectorGroups,
							nextSibling,
							{},
							ignoreErrors
						);
						if (match && priorityWeightForHas < match.priorityWeight) {
							priorityWeightForHas = match.priorityWeight;
						}
					} else if (pseudo.arguments[0] === '>') {
						// Every part of the chain must match a strict descendant of the anchor,
						// and the leftmost part must match a direct child of it.
						const match = this.matchSelectorGroupsInDescendants(
							scope,
							pseudo.selectorGroups,
							element,
							{ boundary: element, leftmostParent: element },
							ignoreErrors
						);
						if (match && priorityWeightForHas < match.priorityWeight) {
							priorityWeightForHas = match.priorityWeight;
						}
					} else {
						// Every part of the chain must match a strict descendant of the anchor.
						const match = this.matchSelectorGroupsInDescendants(
							scope,
							pseudo.selectorGroups,
							element,
							{ boundary: element },
							ignoreErrors
						);
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
			case 'scope':
				return scope && scope === element ? { priorityWeight: 10 } : null;
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

		let priorityWeight = 0;

		for (const className of this.classNames) {
			if (!element.classList.contains(className)) {
				return null;
			}
			priorityWeight += 10;
		}

		return { priorityWeight };
	}

	/**
	 * Matches a list of selector groups against an element.
	 *
	 * Each group is a full complex selector and is matched right to left from the element,
	 * like QuerySelector.matches() does. Returns the highest priority weight of the
	 * matching groups, or null if none of them matches. Used for the selector list
	 * arguments of :is(), :where(), :not(), :has() and :nth-child(An+B of S).
	 *
	 * @param scope Scope.
	 * @param selectorGroups Selector groups (ordered left to right within each group).
	 * @param element Element to match against.
	 * @param [options] Options.
	 * @param [options.boundary] Elements at or above this element must not be matched by the chain (for :has(), every part of the chain must match a strict descendant of the anchor).
	 * @param [options.leftmostParent] The element matched by the leftmost item of the chain must be a direct child of this element (for :has() with a leading ">").
	 * @param [ignoreErrors] Ignores errors.
	 * @returns Result.
	 */
	private matchSelectorGroups(
		scope: Element | DocumentFragment | null,
		selectorGroups: Array<Array<SelectorItem>>,
		element: Element,
		options: {
			boundary?: Element | null;
			leftmostParent?: Element | null;
		} = {},
		ignoreErrors?: boolean
	): ISelectorMatch | null {
		let priorityWeight = 0;
		let matched = false;

		for (const selectorItems of selectorGroups) {
			const match = this.matchSelectorGroup(
				scope,
				selectorItems.slice().reverse(),
				element,
				options,
				ignoreErrors,
				0
			);
			if (match) {
				matched = true;
				if (priorityWeight < match.priorityWeight) {
					priorityWeight = match.priorityWeight;
				}
			}
		}

		return matched ? { priorityWeight } : null;
	}

	/**
	 * Matches a single selector group against an element.
	 *
	 * The items are ordered right to left: the first item matches the element itself and
	 * each following item is matched against an element related to it by the combinator
	 * stored on the item, mirroring QuerySelector.matchSelector().
	 *
	 * @param scope Scope.
	 * @param selectorItems Selector items ordered right to left.
	 * @param element Element to match against.
	 * @param [options] Options.
	 * @param [options.boundary] Elements at or above this element must not be matched by the chain (for :has(), every part of the chain must match a strict descendant of the anchor).
	 * @param [options.leftmostParent] The element matched by the leftmost item of the chain must be a direct child of this element (for :has() with a leading ">").
	 * @param [ignoreErrors] Ignores errors.
	 * @param [priorityWeight] Accumulated priority weight.
	 * @returns Result.
	 */
	private matchSelectorGroup(
		scope: Element | DocumentFragment | null,
		selectorItems: SelectorItem[],
		element: Element,
		options: {
			boundary?: Element | null;
			leftmostParent?: Element | null;
		} = {},
		ignoreErrors?: boolean,
		priorityWeight = 0
	): ISelectorMatch | null {
		const selectorItem = selectorItems[0];

		if (!selectorItem) {
			return null;
		}

		// The chain must not match the boundary element itself (for :has()).
		if (options.boundary && element === options.boundary) {
			return null;
		}

		const result = selectorItem.match(scope, element, ignoreErrors);

		if (!result) {
			return null;
		}

		const weight = priorityWeight + result.priorityWeight;

		if (selectorItems.length === 1) {
			// The leftmost item must be a direct child of the anchor for :has(> ...).
			if (options.leftmostParent && element.parentNode !== options.leftmostParent) {
				return null;
			}
			return { priorityWeight: weight };
		}

		const rest = selectorItems.slice(1);

		switch (selectorItem.combinator) {
			case SelectorCombinatorEnum.adjacentSibling:
				const previousElementSibling = element.previousElementSibling;
				if (!previousElementSibling) {
					return null;
				}
				return this.matchSelectorGroup(
					scope,
					rest,
					previousElementSibling,
					options,
					ignoreErrors,
					weight
				);
			case SelectorCombinatorEnum.child:
			case SelectorCombinatorEnum.none:
				const parentElement = element.parentNode;
				if (!parentElement || parentElement === element[PropertySymbol.ownerDocument]) {
					return null;
				}
				return this.matchSelectorGroup(
					scope,
					rest,
					<Element>parentElement,
					options,
					ignoreErrors,
					weight
				);
			case SelectorCombinatorEnum.descendant:
				let ancestor = element.parentNode;
				while (ancestor && ancestor !== element[PropertySymbol.ownerDocument]) {
					if (options.boundary && ancestor === options.boundary) {
						break;
					}
					const match = this.matchSelectorGroup(
						scope,
						rest,
						<Element>ancestor,
						options,
						ignoreErrors,
						weight
					);
					if (match) {
						return match;
					}
					ancestor = ancestor.parentNode;
				}
				return null;
			case SelectorCombinatorEnum.subsequentSibling:
				const siblingParentElement = <Element>element.parentNode;
				if (!siblingParentElement) {
					return null;
				}
				const siblings = siblingParentElement[PropertySymbol.elementArray];
				const index = siblings.indexOf(element);
				for (let i = index - 1; i >= 0; i--) {
					const match = this.matchSelectorGroup(
						scope,
						rest,
						siblings[i],
						options,
						ignoreErrors,
						weight
					);
					if (match) {
						return match;
					}
				}
				return null;
		}
	}

	/**
	 * Matches a list of selector groups against the descendants of an element.
	 *
	 * @param scope Scope.
	 * @param selectorGroups Selector groups (ordered left to right within each group).
	 * @param element Element whose descendants are matched against.
	 * @param [options] Options.
	 * @param [options.boundary] Elements at or above this element must not be matched by the chain (for :has(), every part of the chain must match a strict descendant of the anchor).
	 * @param [options.leftmostParent] The element matched by the leftmost item of the chain must be a direct child of this element (for :has() with a leading ">").
	 * @param [ignoreErrors] Ignores errors.
	 * @returns Result.
	 */
	private matchSelectorGroupsInDescendants(
		scope: Element | DocumentFragment | null,
		selectorGroups: Array<Array<SelectorItem>>,
		element: Element,
		options: {
			boundary?: Element | null;
			leftmostParent?: Element | null;
		} = {},
		ignoreErrors?: boolean
	): ISelectorMatch | null {
		let priorityWeight = 0;
		let matched = false;

		for (const child of element[PropertySymbol.elementArray]) {
			const match = this.matchSelectorGroups(scope, selectorGroups, child, options, ignoreErrors);
			if (match) {
				matched = true;
				if (priorityWeight < match.priorityWeight) {
					priorityWeight = match.priorityWeight;
				}
			}
			const childMatch = this.matchSelectorGroupsInDescendants(
				scope,
				selectorGroups,
				child,
				options,
				ignoreErrors
			);
			if (childMatch) {
				matched = true;
				if (priorityWeight < childMatch.priorityWeight) {
					priorityWeight = childMatch.priorityWeight;
				}
			}
		}

		return matched ? { priorityWeight } : null;
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

	/**
	 * Returns the root element.
	 *
	 * @param scope Scope.
	 * @returns Root element.
	 */
	private getRootElement(
		scope: Element | DocumentFragment | null
	): Element | DocumentFragment | null {
		return (
			scope?.[PropertySymbol.ownerDocument]?.documentElement ||
			scope?.[PropertySymbol.window].document?.documentElement ||
			null
		);
	}
}
