import Attr from '../../../attribute/Attr';
import HTMLElement from '../../basic/html-element/HTMLElement';
import HTMLFormElement from '../form/HTMLFormElement';
import ValidityState from './ValidityState';

/**
 * HTMLElement.
 */
export default class HTMLInputElement extends HTMLElement {
	// Related to parent form.
	public formAction = '';
	public formMethod = '';
	public formNoValidate = false;

	// Any type of input
	public name = '';
	public type = 'text';
	public disabled = false;
	public autofocus = false;
	public required = false;
	public _value = '';

	// Type specific: checkbox/radio
	public checked = false;
	public defaultChecked = false;
	public indeterminate = false;

	// Type specific: image
	public alt = '';
	public height = 0;
	public src = '';
	public width = 0;

	// Type specific: file
	public accept = '';
	public allowdirs = '';

	// Type specific: text/number
	public autocomplete = '';
	public min = '';
	public max = '';
	public minLength = -1;
	public maxLength = -1;
	public pattern = '';
	public placeholder = '';
	public readOnly = false;
	public size = 0;

	// Type specific: text/password/search/tel/url/week/month
	public selectionStart = 0;
	public selectionEnd = 0;
	public selectionDirection = 'forward';

	// Not categorized
	public defaultValue = '';
	public multiple = false;
	public files: object[] = [];
	public step = '';
	public inputmode = '';

	/**
	 * Returns value.
	 *
	 * @return Value.
	 */
	public get value(): string {
		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		this._value = value;
		if (this.defaultValue === null) {
			this.defaultValue = value;
		}
	}

	/**
	 * Returns the parent form element.
	 *
	 * @return Form.
	 */
	public get form(): HTMLFormElement {
		let parent = <HTMLElement>this.parentNode;
		while (parent && parent.tagName !== 'FORM') {
			parent = <HTMLElement>this.parentNode;
		}
		return <HTMLFormElement>parent;
	}

	/**
	 * Returns validity state.
	 *
	 * @returns Validity state.
	 */
	public get validity(): ValidityState {
		return new ValidityState(this);
	}

	/**
	 * Returns validity message.
	 *
	 * @return Validation message.
	 */
	public get validationMessage(): string {
		return null;
	}

	/**
	 * Returns "true" if it will validate.
	 *
	 * @return "true" if it will validate.
	 */
	public get willValidate(): boolean {
		return (
			this.type !== 'hidden' &&
			this.type !== 'reset' &&
			this.type !== 'button' &&
			!this.disabled &&
			!this['readOnly']
		);
	}

	/**
	 * Returns value as Date.
	 *
	 * @returns Date.
	 */
	public get valueAsDate(): Date {
		return this.value ? new Date(this.value) : null;
	}

	/**
	 * Returns value as number.
	 *
	 * @return Number.
	 */
	public get valueAsNumber(): number {
		return this.value ? parseFloat(this.value) : NaN;
	}

	/**
	 * Checks validity.
	 *
	 * @return "true" if validation does'nt fail.
	 */
	public checkValidity(): boolean {
		return true;
	}

	/**
	 * Removes an Attr node.
	 *
	 * @override
	 * @param attribute Attribute.
	 */
	public removeAttributeNode(attribute: Attr): void {
		super.removeAttributeNode(attribute);

		switch (attribute.name) {
			case 'height': // number
			case 'width': // number
			case 'size': // number
				this[attribute.name] = 0;
				break;
			case 'selectionstart': // number
				this.selectionStart = 0;
				break;
			case 'selectionend': // number
				this.selectionEnd = 0;
				break;
			case 'minlength': // number
				this.minLength = -1;
				break;
			case 'maxlength': // number
				this.maxLength = -1;
				break;
			case 'type': // string
				this[attribute.name] = 'text';
				break;
			case 'name': // string
			case 'alt': // string
			case 'min': // string
			case 'max': // string
			case 'pattern': // string
			case 'placeholder': // string
			case 'step': // string
			case 'inputmode': // string
			case 'accept': // string
			case 'allowdirs': // string
			case 'autocomplete': // string
			case 'src': // string
				this[attribute.name] = '';
				break;
			case 'defaultvalue': // string
				this.defaultValue = '';
				break;
			case 'selectiondirection': // string
				this.selectionDirection = 'forward';
				break;
			case 'value': // string
				this._value = '';
				break;
			case 'readonly': //  boolean
				this.readOnly = false;
			case 'disabled': // boolean
			case 'autofocus': // boolean
			case 'required': // boolean
			case 'indeterminate': // boolean
			case 'multiple': // boolean
			case 'checked': // boolean
				this[attribute.name] = false;
				break;
		}
	}

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @override
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: Attr): Attr {
		const replacedAttribute = super.setAttributeNode(attribute);

		switch (attribute.name) {
			case 'height': // number
			case 'width': // number
			case 'size': // number
				this[attribute.name] = !!attribute.value ? Number(attribute.value) : 0;
				break;
			case 'selectionstart': // number
				this.selectionStart = !!attribute.value ? Number(attribute.value) : 0;
				break;
			case 'selectionend': // number
				this.selectionEnd = !!attribute.value ? Number(attribute.value) : 0;
				break;
			case 'minlength': // number
				this.minLength = !!attribute.value ? Number(attribute.value) : -1;
				break;
			case 'maxlength': // number
				this.maxLength = !!attribute.value ? Number(attribute.value) : -1;
				break;
			case 'type': // string
			case 'name': // string
			case 'alt': // string
			case 'min': // string
			case 'max': // string
			case 'pattern': // string
			case 'placeholder': // string
			case 'step': // string
			case 'inputmode': // string
			case 'accept': // string
			case 'allowdirs': // string
			case 'autocomplete': // string
			case 'src': // string
				this[attribute.name] = attribute.value || '';
				break;
			case 'defaultvalue': // string
				this.defaultValue = attribute.value || '';
				break;
			case 'selectiondirection': // string
				this.selectionDirection = attribute.value || '';
				break;
			case 'value': // string
				this._value = attribute.value || '';
				break;
			case 'readonly': //  boolean
				this.readOnly = attribute.value != null;
				break;
			case 'disabled': // boolean
			case 'autofocus': // boolean
			case 'required': // boolean
			case 'indeterminate': // boolean
			case 'multiple': // boolean
			case 'checked': // boolean
				this[attribute.name] = attribute.value != null;
				break;
		}

		return replacedAttribute;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): HTMLInputElement {
		const clone = <HTMLInputElement>super.cloneNode(deep);
		clone.formAction = this.formAction;
		clone.formMethod = this.formMethod;
		clone.formNoValidate = this.formNoValidate;
		clone.name = this.name;
		clone.type = this.type;
		clone.disabled = this.disabled;
		clone.autofocus = this.autofocus;
		clone.required = this.required;
		clone._value = this._value;
		clone.checked = this.checked;
		clone.defaultChecked = this.defaultChecked;
		clone.indeterminate = this.indeterminate;
		clone.alt = this.alt;
		clone.height = this.height;
		clone.src = this.src;
		clone.width = this.width;
		clone.accept = this.accept;
		clone.allowdirs = this.allowdirs;
		clone.autocomplete = this.autocomplete;
		clone.min = this.min;
		clone.max = this.max;
		clone.minLength = this.minLength;
		clone.maxLength = this.maxLength;
		clone.pattern = this.pattern;
		clone.placeholder = this.placeholder;
		clone.readOnly = this.readOnly;
		clone.size = this.size;
		clone.selectionStart = this.selectionStart;
		clone.selectionEnd = this.selectionEnd;
		clone.selectionDirection = this.selectionDirection;
		clone.defaultValue = this.defaultValue;
		clone.multiple = this.multiple;
		clone.step = this.step;
		clone.inputmode = this.inputmode;
		return clone;
	}
}
