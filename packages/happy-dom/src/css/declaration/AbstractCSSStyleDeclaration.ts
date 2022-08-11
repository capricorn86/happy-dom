import IElement from '../../nodes/element/IElement';
import Attr from '../../nodes/attr/Attr';
import CSSRule from '../CSSRule';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import DOMException from '../../exception/DOMException';
import CSSStyleDeclarationStyleString from './utilities/CSSStyleDeclarationStyleString';
import CSSStyleDeclarationPropertyManager from './utilities/CSSStyleDeclarationPropertyManager';
import ICSSStyleDeclarationProperty from './ICSSStyleDeclarationProperty';
import CSSStyleDeclarationPropertyReader from './utilities/CSSStyleDeclarationPropertyReader';

/**
 * CSS Style Declaration.
 */
export default abstract class AbstractCSSStyleDeclaration {
	// Other properties
	public readonly parentRule: CSSRule = null;
	protected _styles: { [k: string]: ICSSStyleDeclarationProperty } = {};
	protected _ownerElement: IElement;
	protected _computed: boolean;

	/**
	 * Constructor.
	 *
	 * @param [ownerElement] Computed style element.
	 * @param [computed] Computed.
	 */
	constructor(ownerElement: IElement = null, computed = false) {
		this._ownerElement = ownerElement;
		this._computed = computed;
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		if (this._ownerElement) {
			return Object.keys(
				CSSStyleDeclarationStyleString.getElementStyleProperties(this._ownerElement, this._computed)
			).length;
		}

		return Object.keys(this._styles).length;
	}

	/**
	 * Returns the style decleration as a CSS text.
	 *
	 * @returns CSS text.
	 */
	public get cssText(): string {
		if (this._ownerElement) {
			if (this._computed) {
				return '';
			}

			return CSSStyleDeclarationStyleString.getStyleString(
				CSSStyleDeclarationStyleString.getElementStyleProperties(this._ownerElement, this._computed)
			);
		}

		return CSSStyleDeclarationStyleString.getStyleString(this._styles);
	}

	/**
	 * Sets CSS text.
	 *
	 * @param cssText CSS text.
	 */
	public set cssText(cssText: string) {
		if (this._computed) {
			throw new DOMException(
				`Failed to execute 'cssText' on 'CSSStyleDeclaration': These styles are computed, and the properties are therefore read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this._ownerElement) {
			const parsed = CSSStyleDeclarationStyleString.getStyleString(
				CSSStyleDeclarationStyleString.getStyleProperties(cssText)
			);
			if (!parsed) {
				delete this._ownerElement['_attributes']['style'];
			} else {
				if (!this._ownerElement['_attributes']['style']) {
					Attr._ownerDocument = this._ownerElement.ownerDocument;
					this._ownerElement['_attributes']['style'] = new Attr();
					this._ownerElement['_attributes']['style'].name = 'style';
				}

				this._ownerElement['_attributes']['style'].value = parsed;
			}
		} else {
			this._styles = CSSStyleDeclarationStyleString.getStyleProperties(cssText);
		}
	}

	/**
	 * Returns item.
	 *
	 * @param index Index.
	 * @returns Item.
	 */
	public item(index: number): string {
		if (this._ownerElement) {
			return (
				Object.keys(
					CSSStyleDeclarationStyleString.getElementStyleProperties(
						this._ownerElement,
						this._computed
					)
				)[index] || ''
			);
		}
		return Object.keys(this._styles)[index] || '';
	}

	/**
	 * Set a property.
	 *
	 * @param propertyName Property name.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public setProperty(
		propertyName: string,
		value: string,
		priority?: 'important' | '' | undefined
	): void {
		if (this._computed) {
			throw new DOMException(
				`Failed to execute 'setProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${propertyName}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (priority !== '' && priority !== undefined && priority !== 'important') {
			return;
		}

		if (!value) {
			this.removeProperty(propertyName);
		} else if (this._ownerElement) {
			if (!this._ownerElement['_attributes']['style']) {
				Attr._ownerDocument = this._ownerElement.ownerDocument;
				this._ownerElement['_attributes']['style'] = new Attr();
				this._ownerElement['_attributes']['style'].name = 'style';
			}

			const elementStyleProperties = CSSStyleDeclarationStyleString.getElementStyleProperties(
				this._ownerElement,
				this._computed
			);

			Object.assign(
				elementStyleProperties,
				CSSStyleDeclarationPropertyManager.getRelatedProperties({
					name: propertyName,
					value,
					important: !!priority
				})
			);

			this._ownerElement['_attributes']['style'].value =
				CSSStyleDeclarationStyleString.getStyleString(elementStyleProperties);
		} else {
			Object.assign(
				this._styles,
				CSSStyleDeclarationPropertyManager.getRelatedProperties({
					name: propertyName,
					value,
					important: !!priority
				})
			);
		}
	}

	/**
	 * Removes a property.
	 *
	 * @param propertyName Property name in kebab case.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public removeProperty(propertyName: string): void {
		if (this._computed) {
			throw new DOMException(
				`Failed to execute 'removeProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${propertyName}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this._ownerElement) {
			if (this._ownerElement['_attributes']['style']) {
				const elementStyleProperties = CSSStyleDeclarationStyleString.getElementStyleProperties(
					this._ownerElement,
					this._computed
				);
				const propertiesToRemove =
					CSSStyleDeclarationPropertyManager.getRelatedPropertyNames(propertyName);

				for (const property of Object.keys(propertiesToRemove)) {
					delete elementStyleProperties[property];
				}

				const styleString = CSSStyleDeclarationStyleString.getStyleString(elementStyleProperties);

				if (styleString) {
					this._ownerElement['_attributes']['style'].value = styleString;
				} else {
					delete this._ownerElement['_attributes']['style'];
				}
			}
		} else {
			const propertiesToRemove =
				CSSStyleDeclarationPropertyManager.getRelatedPropertyNames(propertyName);

			for (const property of Object.keys(propertiesToRemove)) {
				delete this._styles[property];
			}
		}
	}

	/**
	 * Returns a property.
	 *
	 * @param propertyName Property name in kebab case.
	 * @returns Property value.
	 */
	public getPropertyValue(propertyName: string): string {
		if (this._ownerElement) {
			const elementStyleProperties = CSSStyleDeclarationStyleString.getElementStyleProperties(
				this._ownerElement,
				this._computed
			);
			return CSSStyleDeclarationPropertyReader.getPropertyValue(
				elementStyleProperties,
				propertyName
			);
		}
		return CSSStyleDeclarationPropertyReader.getPropertyValue(this._styles, propertyName);
	}
}
