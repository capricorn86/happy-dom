import type Element from '../../nodes/element/Element.js';
import type CSSRule from '../CSSRule.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import CSSPropertyManager from './property-manager/CSSPropertyManager.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type BrowserWindow from '../../window/BrowserWindow.js';
import CSSComputedStyle from './computed-style/CSSComputedStyle.js';
import type ICSSStyleDeclaration from './ICSSStyleDeclaration.js';
import ClassMethodBinder from '../../utilities/ClassMethodBinder.js';
import CSSPropertyList from './CSSPropertyList.js';

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/naming-convention */

export default interface CSSStyleDeclaration extends ICSSStyleDeclaration {}

/* eslint-enable @typescript-eslint/no-empty-object-type */
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * CSS Style Declaration.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
 */
export default class CSSStyleDeclaration {
	[index: number]: string | undefined;

	// Public properties
	public readonly parentRule: CSSRule | null = null;

	// Internal properties
	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.element]: Element | null;
	public [PropertySymbol.computed]: boolean;
	public [PropertySymbol.cache]: {
		attributeValue: string | null;
		propertyManager: CSSPropertyManager | null;
	} = {
		attributeValue: null,
		propertyManager: null
	};

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 * @param [options] Options.
	 * @param [options.element] Element.
	 * @param [options.computed] Computed.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		window: BrowserWindow,
		options?: {
			element?: Element;
			computed?: boolean;
		}
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}
		this[PropertySymbol.window] = window;
		this[PropertySymbol.element] = options?.element || null;
		this[PropertySymbol.computed] = options?.element ? !!options?.computed : false;

		const methodBinder = new ClassMethodBinder(this, [CSSStyleDeclaration]);

		return new Proxy(this, {
			get: (target, property) => {
				if (property in target || typeof property === 'symbol') {
					methodBinder.bind(property);
					return (<any>target)[property];
				}
				if (CSSPropertyList.kebabCase[<'color'>property]) {
					return target.getPropertyValue(property);
				}
				if (CSSPropertyList.camelCase[<'color'>property]) {
					return target.getPropertyValue(CSSPropertyList.camelCase[<'color'>property]);
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return target.item(index) || undefined;
				}
			},
			set(target, property, newValue): boolean {
				methodBinder.bind(property);
				if (property in target || typeof property === 'symbol') {
					(<any>target)[property] = newValue;
					return true;
				}
				if (CSSPropertyList.kebabCase[<'color'>property]) {
					target.setProperty(<string>property, newValue);
					return true;
				}
				if (CSSPropertyList.camelCase[<'color'>property]) {
					target.setProperty(CSSPropertyList.camelCase[<'color'>property], newValue);
					return true;
				}
				return true;
			},
			deleteProperty(target, property): boolean {
				if (property in target || typeof property === 'symbol') {
					delete (<any>target)[property];
					return true;
				}
				return true;
			},
			ownKeys(target): string[] {
				const indexKeys: string[] = [];
				for (let i = 0, max = target.length; i < max; i++) {
					indexKeys.push(String(i));
				}
				return indexKeys.concat(Object.keys(CSSPropertyList.camelCase));
			},
			has(target, property): boolean {
				if (property in target || typeof property === 'symbol') {
					return true;
				}
				if (
					CSSPropertyList.kebabCase[<'color'>property] ||
					CSSPropertyList.camelCase[<'color'>property]
				) {
					return true;
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return true;
				}
				return false;
			},
			defineProperty(target, property, descriptor): boolean {
				methodBinder.preventBinding(property);

				if (property in target) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor | undefined {
				if (property in target || typeof property === 'symbol') {
					return;
				}

				if (
					CSSPropertyList.kebabCase[<'color'>property] ||
					CSSPropertyList.camelCase[<'color'>property]
				) {
					return {
						value: target.getPropertyValue(property),
						writable: true,
						enumerable: true,
						configurable: true
					};
				}

				const index = Number(property);
				if (!isNaN(index)) {
					const propertyName = target.item(index);
					if (propertyName) {
						return {
							value: propertyName,
							writable: true,
							enumerable: true,
							configurable: true
						};
					}
				}
			}
		});
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.getPropertyManager]().size();
	}

	/**
	 * Returns the style declaration as a CSS text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		if (this[PropertySymbol.element] && this[PropertySymbol.computed]) {
			return '';
		}

		return this[PropertySymbol.getPropertyManager]().toString();
	}

	/**
	 * Sets CSS text.
	 *
	 * @param cssText CSS text.
	 */
	public set cssText(cssText: string) {
		if (this[PropertySymbol.computed]) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'cssText' on 'CSSStyleDeclaration': These styles are computed, and the properties are therefore read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this[PropertySymbol.element]) {
			this[PropertySymbol.cache].propertyManager = new CSSPropertyManager({ cssText });
			this[PropertySymbol.cache].attributeValue = cssText;
			this[PropertySymbol.element].setAttribute(
				'style',
				this[PropertySymbol.cache].propertyManager.toString()
			);
		} else {
			this[PropertySymbol.cache].propertyManager = new CSSPropertyManager({ cssText });
		}
	}

	/**
	 * Returns item.
	 *
	 * @param index Index.
	 * @returns Item.
	 */
	public item(index: number): string {
		return this[PropertySymbol.getPropertyManager]().item(index);
	}

	/**
	 * Set a property.
	 *
	 * @param name Property name.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public setProperty(name: string, value: string, priority?: 'important' | '' | undefined): void {
		if (this[PropertySymbol.computed]) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'setProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${name}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (priority !== '' && priority !== undefined && priority !== 'important') {
			return;
		}

		const stringValue = String(value).trim();
		const propertyManager = this[PropertySymbol.getPropertyManager]();

		if (stringValue) {
			propertyManager.set(name, stringValue, !!priority);
		} else {
			propertyManager.remove(name);
		}

		if (this[PropertySymbol.element]) {
			this[PropertySymbol.cache].attributeValue = propertyManager.toString();
			if (this[PropertySymbol.cache].attributeValue) {
				this[PropertySymbol.element].setAttribute(
					'style',
					this[PropertySymbol.cache].attributeValue
				);
			} else {
				this[PropertySymbol.element].removeAttribute('style');
			}
		}
	}

	/**
	 * Removes a property.
	 *
	 * @param name Property name in kebab case.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public removeProperty(name: string): void {
		if (this[PropertySymbol.computed]) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'removeProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${name}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		const propertyManager = this[PropertySymbol.getPropertyManager]();

		propertyManager.remove(name);

		if (this[PropertySymbol.element]) {
			this[PropertySymbol.cache].attributeValue = propertyManager.toString();

			if (this[PropertySymbol.cache].attributeValue) {
				this[PropertySymbol.element].setAttribute(
					'style',
					this[PropertySymbol.cache].attributeValue
				);
			} else {
				this[PropertySymbol.element].removeAttribute('style');
			}
		}
	}

	/**
	 * Returns a property.
	 *
	 * @param name Property name in kebab case.
	 * @returns Property value.
	 */
	public getPropertyValue(name: string): string {
		return this[PropertySymbol.getPropertyManager]().get(name)?.value || '';
	}

	/**
	 * Returns a property.
	 *
	 * @param name Property name in kebab case.
	 * @returns "important" if set to be important.
	 */
	public getPropertyPriority(name: string): string {
		return this[PropertySymbol.getPropertyManager]().get(name)?.important ? 'important' : '';
	}

	/**
	 * Returns property manager.
	 *
	 * @returns Property manager.
	 */
	private [PropertySymbol.getPropertyManager](): CSSPropertyManager {
		const element = this[PropertySymbol.element];
		const cache = this[PropertySymbol.cache];

		if (!element) {
			if (!cache.propertyManager) {
				cache.propertyManager = new CSSPropertyManager();
			}
			return cache.propertyManager;
		}

		if (this[PropertySymbol.computed]) {
			return new CSSComputedStyle(element).getComputedStyle();
		}

		const attributeValue = element.getAttribute('style') || '';

		if (cache.attributeValue !== attributeValue) {
			cache.propertyManager = new CSSPropertyManager({ cssText: attributeValue });
		}

		return <CSSPropertyManager>cache.propertyManager;
	}
}
