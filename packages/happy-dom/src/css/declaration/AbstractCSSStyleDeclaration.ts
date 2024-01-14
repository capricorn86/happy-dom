import IElement from '../../nodes/element/IElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IAttr from '../../nodes/attr/IAttr.js';
import CSSRule from '../CSSRule.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import DOMException from '../../exception/DOMException.js';
import CSSStyleDeclarationElementStyle from './element-style/CSSStyleDeclarationElementStyle.js';
import CSSStyleDeclarationPropertyManager from './property-manager/CSSStyleDeclarationPropertyManager.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';

/**
 * CSS Style Declaration.
 */
export default abstract class AbstractCSSStyleDeclaration {
	public readonly parentRule: CSSRule = null;
	#style: CSSStyleDeclarationPropertyManager = null;
	#ownerElement: IElement;
	#computed: boolean;
	#elementStyle: CSSStyleDeclarationElementStyle = null;

	/**
	 * Constructor.
	 *
	 * @param [ownerElement] Computed style element.
	 * @param [computed] Computed.
	 */
	constructor(ownerElement: IElement = null, computed = false) {
		this.#style = !ownerElement ? new CSSStyleDeclarationPropertyManager() : null;
		this.#ownerElement = ownerElement;
		this.#computed = ownerElement ? computed : false;
		this.#elementStyle = ownerElement
			? new CSSStyleDeclarationElementStyle(ownerElement, this.#computed)
			: null;
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		if (this.#ownerElement) {
			const style = this.#elementStyle.getElementStyle();
			return style.size();
		}

		return this.#style.size();
	}

	/**
	 * Returns the style decleration as a CSS text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		if (this.#ownerElement) {
			if (this.#computed) {
				return '';
			}

			return this.#elementStyle.getElementStyle().toString();
		}

		return this.#style.toString();
	}

	/**
	 * Sets CSS text.
	 *
	 * @param cssText CSS text.
	 */
	public set cssText(cssText: string) {
		if (this.#computed) {
			throw new DOMException(
				`Failed to execute 'cssText' on 'CSSStyleDeclaration': These styles are computed, and the properties are therefore read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this.#ownerElement) {
			const style = new CSSStyleDeclarationPropertyManager({ cssText });
			let styleAttribute = <IAttr>this.#ownerElement[PropertySymbol.attributes]['style'];

			if (!styleAttribute) {
				styleAttribute = this.#ownerElement[PropertySymbol.ownerDocument].createAttribute('style');
				// We use "[PropertySymbol.setNamedItemWithoutConsequences]" here to avoid triggering setting "Element.style.cssText" when setting the "style" attribute.
				(<NamedNodeMap>this.#ownerElement[PropertySymbol.attributes])[
					PropertySymbol.setNamedItemWithoutConsequences
				](styleAttribute);
			}

			if (this.#ownerElement[PropertySymbol.isConnected]) {
				this.#ownerElement[PropertySymbol.ownerDocument][PropertySymbol.cacheID]++;
			}

			styleAttribute[PropertySymbol.value] = style.toString();
		} else {
			this.#style = new CSSStyleDeclarationPropertyManager({ cssText });
		}
	}

	/**
	 * Returns item.
	 *
	 * @param index Index.
	 * @returns Item.
	 */
	public item(index: number): string {
		if (this.#ownerElement) {
			return this.#elementStyle.getElementStyle().item(index);
		}
		return this.#style.item(index);
	}

	/**
	 * Set a property.
	 *
	 * @param name Property name.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public setProperty(name: string, value: string, priority?: 'important' | '' | undefined): void {
		if (this.#computed) {
			throw new DOMException(
				`Failed to execute 'setProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${name}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (priority !== '' && priority !== undefined && priority !== 'important') {
			return;
		}

		const stringValue = String(value);

		if (!stringValue) {
			this.removeProperty(name);
		} else if (this.#ownerElement) {
			let styleAttribute = <IAttr>this.#ownerElement[PropertySymbol.attributes]['style'];

			if (!styleAttribute) {
				styleAttribute = this.#ownerElement[PropertySymbol.ownerDocument].createAttribute('style');

				// We use "[PropertySymbol.setNamedItemWithoutConsequences]" here to avoid triggering setting "Element.style.cssText" when setting the "style" attribute.
				(<NamedNodeMap>this.#ownerElement[PropertySymbol.attributes])[
					PropertySymbol.setNamedItemWithoutConsequences
				](styleAttribute);
			}

			if (this.#ownerElement[PropertySymbol.isConnected]) {
				this.#ownerElement[PropertySymbol.ownerDocument][PropertySymbol.cacheID]++;
			}

			const style = this.#elementStyle.getElementStyle();
			style.set(name, stringValue, !!priority);

			styleAttribute[PropertySymbol.value] = style.toString();
		} else {
			this.#style.set(name, stringValue, !!priority);
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
		if (this.#computed) {
			throw new DOMException(
				`Failed to execute 'removeProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${name}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this.#ownerElement) {
			const style = this.#elementStyle.getElementStyle();
			style.remove(name);
			const newCSSText = style.toString();

			if (this.#ownerElement[PropertySymbol.isConnected]) {
				this.#ownerElement[PropertySymbol.ownerDocument][PropertySymbol.cacheID]++;
			}

			if (newCSSText) {
				(<IAttr>this.#ownerElement[PropertySymbol.attributes]['style'])[PropertySymbol.value] =
					newCSSText;
			} else {
				// We use "[PropertySymbol.removeNamedItemWithoutConsequences]" here to avoid triggering setting "Element.style.cssText" when setting the "style" attribute.
				(<NamedNodeMap>this.#ownerElement[PropertySymbol.attributes])[
					PropertySymbol.removeNamedItemWithoutConsequences
				]('style');
			}
		} else {
			this.#style.remove(name);
		}
	}

	/**
	 * Returns a property.
	 *
	 * @param name Property name in kebab case.
	 * @returns Property value.
	 */
	public getPropertyValue(name: string): string {
		if (this.#ownerElement) {
			const style = this.#elementStyle.getElementStyle();
			return style.get(name)?.value || '';
		}
		return this.#style.get(name)?.value || '';
	}

	/**
	 * Returns a property.
	 *
	 * @param name Property name in kebab case.
	 * @returns "important" if set to be important.
	 */
	public getPropertyPriority(name: string): string {
		if (this.#ownerElement) {
			const style = this.#elementStyle.getElementStyle();
			return style.get(name)?.important ? 'important' : '';
		}
		return this.#style.get(name)?.important ? 'important' : '';
	}
}
