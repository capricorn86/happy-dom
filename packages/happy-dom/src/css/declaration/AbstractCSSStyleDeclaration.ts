import IElement from '../../nodes/element/IElement';
import Attr from '../../nodes/attr/Attr';
import CSSRule from '../CSSRule';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import DOMException from '../../exception/DOMException';
import CSSStyleDeclarationUtility from './CSSStyleDeclarationUtility';

/**
 * CSS Style Declaration.
 */
export default abstract class AbstractCSSStyleDeclaration {
	// Other properties
	public readonly parentRule: CSSRule = null;
	public _readonly = false;
	protected _styles: { [k: string]: string } = {};
	protected _ownerElement: IElement;

	/**
	 * Constructor.
	 *
	 * @param [ownerElement] Computed style element.
	 */
	constructor(ownerElement: IElement = null) {
		this._ownerElement = ownerElement;
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		if (this._ownerElement) {
			if (
				this._ownerElement['_attributes']['style'] &&
				this._ownerElement['_attributes']['style'].value
			) {
				return Object.keys(
					CSSStyleDeclarationUtility.styleStringToObject(
						this._ownerElement['_attributes']['style'].value
					)
				).length;
			}
			return 0;
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
			if (
				this._ownerElement['_attributes']['style'] &&
				this._ownerElement['_attributes']['style'].value
			) {
				return CSSStyleDeclarationUtility.styleObjectToString(
					CSSStyleDeclarationUtility.styleStringToObject(
						this._ownerElement['_attributes']['style'].value
					)
				);
			}
			return '';
		}

		return CSSStyleDeclarationUtility.styleObjectToString(this._styles);
	}

	/**
	 * Sets CSS text.
	 *
	 * @param cssText CSS text.
	 */
	public set cssText(cssText: string) {
		if (this._readonly) {
			throw new DOMException(
				`Failed to execute 'cssText' on 'CSSStyleDeclaration': These styles are computed, and the properties are therefore read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this._ownerElement) {
			const parsed = CSSStyleDeclarationUtility.styleObjectToString(
				CSSStyleDeclarationUtility.styleStringToObject(cssText)
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
			this._styles = CSSStyleDeclarationUtility.styleStringToObject(cssText);
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
			if (
				this._ownerElement['_attributes']['style'] &&
				this._ownerElement['_attributes']['style'].value
			) {
				return (
					Object.keys(
						CSSStyleDeclarationUtility.styleStringToObject(
							this._ownerElement['_attributes']['style'].value
						)
					)[index] || ''
				);
			}
			return '';
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
		if (this._readonly) {
			throw new DOMException(
				`Failed to execute 'setProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${propertyName}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (priority !== '' && priority !== undefined && priority !== 'important') {
			return;
		}

		const important = priority ? ' !important' : '';

		if (!value) {
			this.removeProperty(propertyName);
		} else if (this._ownerElement) {
			if (!this._ownerElement['_attributes']['style']) {
				Attr._ownerDocument = this._ownerElement.ownerDocument;
				this._ownerElement['_attributes']['style'] = new Attr();
				this._ownerElement['_attributes']['style'].name = 'style';
			}

			const styleObject = CSSStyleDeclarationUtility.styleStringToObject(
				this._ownerElement['_attributes']['style'].value
			);

			styleObject[propertyName] = value + important;

			this._ownerElement['_attributes']['style'].value =
				CSSStyleDeclarationUtility.styleObjectToString(styleObject);
		} else {
			this._styles[propertyName] = value + important;
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
		if (this._readonly) {
			throw new DOMException(
				`Failed to execute 'removeProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${propertyName}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this._ownerElement) {
			if (this._ownerElement['_attributes']['style']) {
				const styleObject = CSSStyleDeclarationUtility.styleStringToObject(
					this._ownerElement['_attributes']['style'].value
				);

				delete styleObject[propertyName];

				const styleString = CSSStyleDeclarationUtility.styleObjectToString(styleObject);

				if (styleString) {
					this._ownerElement['_attributes']['style'].value = styleString;
				} else {
					delete this._ownerElement['_attributes']['style'];
				}
			}
		} else {
			delete this._styles[propertyName];
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
			if (
				!this._ownerElement['_attributes']['style'] ||
				!this._ownerElement['_attributes']['style'].value
			) {
				return '';
			}
			const value = CSSStyleDeclarationUtility.styleStringToObject(
				this._ownerElement['_attributes']['style'].value
			)[propertyName];
			return value ? value.replace(' !important', '') : '';
		}

		return this._styles[propertyName] ? this._styles[propertyName].replace(' !important', '') : '';
	}
}
