import IElement from '../../nodes/element/IElement';
import Attr from '../../nodes/attr/Attr';
import CSSRule from '../CSSRule';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import DOMException from '../../exception/DOMException';
import CSSStyleDeclarationElementStyle from './element-style/CSSStyleDeclarationElementStyle';
import CSSStyleDeclarationPropertyManager from './property-manager/CSSStyleDeclarationPropertyManager';

/**
 * CSS Style Declaration.
 */
export default abstract class AbstractCSSStyleDeclaration {
	public readonly parentRule: CSSRule = null;
	protected _style: CSSStyleDeclarationPropertyManager = null;
	protected _ownerElement: IElement;
	protected _computed: boolean;
	protected _elementStyle: CSSStyleDeclarationElementStyle = null;

	/**
	 * Constructor.
	 *
	 * @param [ownerElement] Computed style element.
	 * @param [computed] Computed.
	 */
	constructor(ownerElement: IElement = null, computed = false) {
		this._style = !ownerElement ? new CSSStyleDeclarationPropertyManager() : null;
		this._ownerElement = ownerElement;
		this._computed = ownerElement ? computed : false;
		this._elementStyle = ownerElement
			? new CSSStyleDeclarationElementStyle(ownerElement, this._computed)
			: null;
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		if (this._ownerElement) {
			const style = this._elementStyle.getElementStyle();
			return style.size();
		}

		return this._style.size();
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

			return this._elementStyle.getElementStyle().toString();
		}

		return this._style.toString();
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
			const style = new CSSStyleDeclarationPropertyManager({ cssText });
			if (!this._ownerElement['_attributes']['style']) {
				Attr._ownerDocument = this._ownerElement.ownerDocument;
				this._ownerElement['_attributes']['style'] = new Attr();
				this._ownerElement['_attributes']['style'].name = 'style';
			}

			if (this._ownerElement.isConnected) {
				this._ownerElement.ownerDocument['_cacheID']++;
			}

			this._ownerElement['_attributes']['style'].value = style.toString();
		} else {
			this._style = new CSSStyleDeclarationPropertyManager({ cssText });
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
			return this._elementStyle.getElementStyle().item(index);
		}
		return this._style.item(index);
	}

	/**
	 * Set a property.
	 *
	 * @param name Property name.
	 * @param value Value. Must not contain "!important" as that should be set using the priority parameter.
	 * @param [priority] Can be "important", or an empty string.
	 */
	public setProperty(name: string, value: string, priority?: 'important' | '' | undefined): void {
		if (this._computed) {
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
		} else if (this._ownerElement) {
			if (!this._ownerElement['_attributes']['style']) {
				Attr._ownerDocument = this._ownerElement.ownerDocument;
				this._ownerElement['_attributes']['style'] = new Attr();
				this._ownerElement['_attributes']['style'].name = 'style';
			}

			const style = this._elementStyle.getElementStyle();
			style.set(name, stringValue, !!priority);

			if (this._ownerElement.isConnected) {
				this._ownerElement.ownerDocument['_cacheID']++;
			}

			this._ownerElement['_attributes']['style'].value = style.toString();
		} else {
			this._style.set(name, stringValue, !!priority);
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
		if (this._computed) {
			throw new DOMException(
				`Failed to execute 'removeProperty' on 'CSSStyleDeclaration': These styles are computed, and therefore the '${name}' property is read-only.`,
				DOMExceptionNameEnum.domException
			);
		}

		if (this._ownerElement) {
			const style = this._elementStyle.getElementStyle();
			style.remove(name);
			const newCSSText = style.toString();
			if (newCSSText) {
				if (this._ownerElement.isConnected) {
					this._ownerElement.ownerDocument['_cacheID']++;
				}

				this._ownerElement['_attributes']['style'].value = newCSSText;
			} else {
				delete this._ownerElement['_attributes']['style'];
			}
		} else {
			this._style.remove(name);
		}
	}

	/**
	 * Returns a property.
	 *
	 * @param name Property name in kebab case.
	 * @returns Property value.
	 */
	public getPropertyValue(name: string): string {
		if (this._ownerElement) {
			const style = this._elementStyle.getElementStyle();
			return style.get(name)?.value || '';
		}
		return this._style.get(name)?.value || '';
	}

	/**
	 * Returns a property.
	 *
	 * @param name Property name in kebab case.
	 * @returns "important" if set to be important.
	 */
	public getPropertyPriority(name: string): string {
		if (this._ownerElement) {
			const style = this._elementStyle.getElementStyle();
			return style.get(name)?.important ? 'important' : '';
		}
		return this._style.get(name)?.important ? 'important' : '';
	}
}
