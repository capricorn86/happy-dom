import IAttr from '../attr/IAttr';
import HTMLElement from '../html-element/HTMLElement';
import HTMLFormElement from '../html-form-element/HTMLFormElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import INode from '../node/INode';
import IHTMLButtonElement from './IHTMLButtonElement';

const BUTTON_TYPES = ['submit', 'reset', 'button', 'menu'];

/**
 * HTML Button Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement.
 */
export default class HTMLButtonElement extends HTMLElement implements IHTMLButtonElement {
	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		return this.getAttribute('value');
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this.setAttribute('value', value);
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
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
			this.setAttribute('disabled', '');
		}
	}

	/**
	 * Returns type
	 *
	 * @returns Type
	 */
	public get type(): string {
		return this._sanitizeType(this.getAttribute('type'));
	}

	/**
	 * Sets type
	 *
	 * @param v Type
	 */
	public set type(v: string) {
		this.setAttribute('type', this._sanitizeType(v));
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		return <IHTMLFormElement>this._formNode;
	}

	/**
	 * Checks validity.
	 *
	 * @returns Validity.
	 */
	public checkValidity(): boolean {
		return true;
	}

	/**
	 * Sanitizes type.
	 * 
	 * TODO: We can improve performance a bit if we make the types as a constant.
	 * 
	 * @param type Type.
	 * @returns Type sanitized.
	 */
	protected _sanitizeType(type: string): string {
		type = (type && type.toLowerCase()) || 'submit';

		if (!BUTTON_TYPES.includes(type)) {
			type = 'submit';
		}

		return type;
	}

	/**
	 * @override
	 */
	public override setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);
		const oldValue = replacedAttribute ? replacedAttribute.value : null;

		if ((attribute.name === 'id' || attribute.name === 'name') && this._formNode) {
			if (oldValue) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, oldValue);
			}
			if (attribute.value) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, attribute.value);
			}
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public override removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if ((attribute.name === 'id' || attribute.name === 'name') && this._formNode) {
			(<HTMLFormElement>this._formNode)._removeFormControlItem(this, attribute.value);
		}

		return attribute;
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const oldFormNode = <HTMLFormElement>this._formNode;

		super._connectToNode(parentNode);

		if (oldFormNode !== this._formNode) {
			if (oldFormNode) {
				oldFormNode._removeFormControlItem(this, this.name);
				oldFormNode._removeFormControlItem(this, this.id);
			}
			if (this._formNode) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.name);
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.id);
			}
		}
	}
}
