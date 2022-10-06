import HTMLElement from '../html-element/HTMLElement';
import IHTMLButtonElement from './IHTMLButtonElement';

const BUTTON_TYPES = ['submit', 'reset', 'button', 'menu'];

/**
 
We can improve performance a bit if we make the types as a constant.
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default class HTMLButtonElement extends HTMLElement implements IHTMLButtonElement {
	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.getAttributeNS(null, 'value');
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.setAttributeNS(null, 'value', value);
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttributeNS(null, 'disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttributeNS(null, 'disabled');
		} else {
			this.setAttributeNS(null, 'disabled', '');
		}
	}

	/**
	 * Returns type
	 *
	 * @returns Type
	 */
	public get type(): string {
		return this._sanitizeType(this.getAttributeNS(null, 'type'));
	}

	/**
	 * Sets type
	 *
	 * @param v Type
	 */
	public set type(v: string) {
		this.setAttributeNS(null, 'type', this._sanitizeType(v));
	}

	/**
	 *
	 * @param type
	 */
	protected _sanitizeType(type: string): string {
		type = (type && type.toLowerCase()) || 'submit';

		if (!BUTTON_TYPES.includes(type)) {
			type = 'submit';
		}

		return type;
	}
}
