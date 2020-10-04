import HTMLElement from '../../basic/html-element/HTMLElement';
import HTMLFormElement from '../form/HTMLFormElement';
import ValidityState from './ValidityState';

/**
 * HTMLElement.
 */
export default class HTMLInputElement extends HTMLElement {
	// Related to parent form.
	public form: HTMLFormElement = null;
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
	public _checked = false;
	public defaultChecked = null;
	public indeterminate = false;

	// Type specific: image
	public alt = '';
	public height = 0;
	public src: string = null;
	public width = 0;

	// Type specific: file
	public accept: string = null;
	public allowdirs: string = null;

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
	 * Returns checked.
	 *
	 * @return Checked.
	 */
	public get checked(): boolean {
		return this._checked;
	}

	/**
	 * Sets checked.
	 *
	 * @param checked Checked.
	 */
	public set checked(checked: boolean) {
		this._checked = checked;
		if (this.defaultChecked === null) {
			this.defaultChecked = checked;
		}
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
	 * @override
	 */
	public _setAttributeProperty(name: string, value: string): void {
		if (name === 'type') {
			this.type = value;
		} else {
			super._setAttributeProperty(name, value);
		}
	}
}
