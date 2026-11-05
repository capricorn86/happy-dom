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
import type ICachedResult from '../nodes/node/ICachedResult.js';

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
	 * @param [cachedItem] Owning query cache item.
	 * @param [respectShadowBoundary] Applies shadow-host restrictions to pseudo arguments.
	 * @returns Result.
	 */
	public match(
		scope: Element | DocumentFragment | null,
		element: Element | ShadowRoot,
		ignoreErrors?: boolean,
		cachedItem?: ICachedResult,
		respectShadowBoundary = false
	): ISelectorMatch | null {
		let priorityWeight = 0;

		if (this.isPseudoElement) {
			return null;
		}

		if (element[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			const host = (<ShadowRoot>element).host;
			if (!respectShadowBoundary) {
				element = host!;
			} else {
				// Ordinary ancestor conditions must not observe the host across a shadow boundary.
				if (!host || !this.canMatchShadowHost()) {
					return null;
				}
				if (
					this.pseudos!.some((pseudo) => pseudo.name === 'host' || pseudo.name === 'host-context')
				) {
					element = host;
				}
			}
		}
		element = <Element>element;

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
			const result = this.matchPseudo(scope, element, ignoreErrors, cachedItem);
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
	 * @param [cachedItem] Owning query cache item.
	 * @returns Result.
	 */
	private matchPseudo(
		scope: Element | DocumentFragment | null,
		element: Element,
		ignoreErrors?: boolean,
		cachedItem?: ICachedResult
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
				ignoreErrors,
				cachedItem
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
	 * @param [cachedItem] Owning query cache item.
	 */
	private matchPseudoItem(
		scope: Element | DocumentFragment | null,
		element: Element,
		parentChildren: Element[],
		pseudo: ISelectorPseudo,
		ignoreErrors?: boolean,
		cachedItem?: ICachedResult
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
				return this.globalMatchFunction(element, pseudo.selectorGroups!, {
					scope,
					ignoreErrors,
					cachedItem
				})
					? null
					: { priorityWeight: 10 };
			case 'nth-child':
				let nthChildIndex = -1;
				const nthChildSelectorItem = pseudo.selectorGroups?.[0]?.[0];
				if (
					nthChildSelectorItem &&
					!nthChildSelectorItem.match(scope, element, undefined, cachedItem)
				) {
					return null;
				}
				for (let i = 0, max = parentChildren.length; i < max; i++) {
					if (
						!nthChildSelectorItem ||
						nthChildSelectorItem.match(scope, parentChildren[i], undefined, cachedItem)
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
				const nthLastChildSelectorItem = pseudo.selectorGroups?.[0]?.[0];
				if (
					nthLastChildSelectorItem &&
					!nthLastChildSelectorItem.match(scope, element, undefined, cachedItem)
				) {
					return null;
				}
				for (let i = parentChildren.length - 1; i >= 0; i--) {
					if (
						!nthLastChildSelectorItem ||
						nthLastChildSelectorItem.match(scope, parentChildren[i], undefined, cachedItem)
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
				let priorityWeightForIs = 0;
				if (!pseudo.selectorGroups) {
					return null;
				}
				for (const group of pseudo.selectorGroups) {
					const match = this.globalMatchFunction(element, [group], {
						scope,
						ignoreErrors,
						cachedItem
					});
					if (match && priorityWeightForIs < match.priorityWeight) {
						priorityWeightForIs = match.priorityWeight;
					}
				}
				return priorityWeightForIs ? { priorityWeight: priorityWeightForIs } : null;
			case 'where':
				if (!pseudo.selectorGroups) {
					return null;
				}
				for (const group of pseudo.selectorGroups) {
					if (this.globalMatchFunction(element, [group], { scope, ignoreErrors, cachedItem })) {
						return { priorityWeight: 0 };
					}
				}
				return null;
			case 'has':
				let priorityWeightForHas = 0;
				if (pseudo.arguments && pseudo.selectorGroups) {
					if (pseudo.arguments[0] === '+') {
						const nextSibling = element.nextElementSibling;
						if (!nextSibling) {
							return null;
						}
						for (const group of pseudo.selectorGroups) {
							const selectorItem = group[0];
							const match = selectorItem.match(scope, nextSibling, undefined, cachedItem);
							if (match && priorityWeightForHas < match.priorityWeight) {
								priorityWeightForHas = match.priorityWeight;
							}
						}
					} else if (pseudo.arguments[0] === '>') {
						for (const group of pseudo.selectorGroups) {
							const selectorItem = group[0];
							for (const child of element[PropertySymbol.elementArray]) {
								const match = selectorItem.match(scope, child, undefined, cachedItem);
								if (match && priorityWeightForHas < match.priorityWeight) {
									priorityWeightForHas = match.priorityWeight;
									break;
								}
							}
						}
					} else {
						for (const group of pseudo.selectorGroups) {
							const selectorItem = group[0];
							const match = this.matchChildOfElement(
								scope,
								selectorItem,
								element,
								ignoreErrors,
								cachedItem
							);
							if (match && priorityWeightForHas < match.priorityWeight) {
								priorityWeightForHas = match.priorityWeight;
							}
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
	 * Whether this compound selector is allowed to match a featureless shadow host.
	 *
	 * See https://drafts.csswg.org/selectors/#featureless.
	 *
	 * @returns Whether the selector can target the shadow host.
	 */
	private canMatchShadowHost(): boolean {
		if (this.tagName || this.id || this.classNames || this.attributes || !this.pseudos) {
			return false;
		}
		let hasHostSelector = false;
		for (const pseudo of this.pseudos) {
			if (pseudo.name === 'host' || pseudo.name === 'host-context') {
				hasHostSelector = true;
			} else if (pseudo.name === 'is' || pseudo.name === 'where' || pseudo.name === 'not') {
				if (
					!pseudo.selectorGroups?.some((group) => group[group.length - 1]?.canMatchShadowHost())
				) {
					return false;
				}
				hasHostSelector = true;
			} else if (pseudo.name !== 'has') {
				return false;
			}
		}
		return hasHostSelector;
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
	 * Matches a selector item against children of an element.
	 *
	 * @param scope Scope.
	 * @param selectorItem Selector item.
	 * @param element Element.
	 * @param [ignoreErrors] Ignores errors.
	 * @param [cachedItem] Owning query cache item.
	 * @returns Result.
	 */
	private matchChildOfElement(
		scope: Element | DocumentFragment | null,
		selectorItem: SelectorItem,
		element: Element,
		ignoreErrors?: boolean,
		cachedItem?: ICachedResult
	): { priorityWeight: number } | null {
		for (const child of element[PropertySymbol.elementArray]) {
			const match = selectorItem.match(scope, child, ignoreErrors, cachedItem);
			if (match) {
				return match;
			}
			const childMatch = this.matchChildOfElement(
				scope,
				selectorItem,
				child,
				ignoreErrors,
				cachedItem
			);
			if (childMatch) {
				return childMatch;
			}
		}
		return null;
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
