import HTMLElement from '../../basic-types/html-element/HTMLElement';
import HTMLFormElement from '../form/HTMLFormElement';
import ValidityState from './ValidityState';
import * as HTMLInputPropertyAttributes from './HTMLInputPropertyAttributes.json';

/**
 * HTMLElement.
 */
export default class HTMLInputElement extends HTMLElement {
	protected static _observedPropertyAttributes = Object.assign(
		{},
		HTMLElement._observedPropertyAttributes,
		HTMLInputPropertyAttributes
	);

	// Related to parent form.
	public form: HTMLFormElement = null;
	public formAction: string = '';
	public formMethod: string = '';
	public formNoValidate: boolean = false;

	// Any type of input
	public name: string = '';
	public type: string = 'text';
	public disabled: boolean = false;
	public autofocus: boolean = false;
	public required: boolean = false;
	public _value: string = '';

	// Type specific: checkbox/radio
	public _checked: boolean = false;
	public defaultChecked: boolean = null;
	public indeterminate: boolean = false;

	// Type specific: image
	public alt: string = '';
	public height: number = 0;
	public src: string = null;
	public width: number = 0;

	// Type specific: file
	public accept: string = null;
	public allowdirs: string = null;

	// Type specific: text/number
	public autocomplete: string = '';
	public min: string = '';
	public max: string = '';
	public minLength: number = -1;
	public maxLength: number = -1;
	public pattern: string = '';
	public placeholder: string = '';
	public readOnly: boolean = false;
	public size: number = 0;

	// Type specific: text/password/search/tel/url/week/month
	public selectionStart: number = 0;
	public selectionEnd: number = 0;
	public selectionDirection: string = 'forward';

	// Not categorized
	public defaultValue: string = '';
	public multiple: boolean = false;
	public files: [] = [];
	public step: string = '';
	public inputmode: string = '';

	/**
	 * Returns value.
	 *
	 * @return {string} Value.
	 */
	public get value(): string {
		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param {string} value Value.
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
	 * @return {boolean} Checked.
	 */
	public get checked(): boolean {
		return this._checked;
	}

	/**
	 * Sets checked.
	 *
	 * @param {boolean} checked Checked.
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
	 * @return {ValidityState} Validity state.
	 */
	public get validity(): ValidityState {
		return new ValidityState(this);
	}

	/**
	 * Returns validity message.
	 *
	 * @return {string} Validation message.
	 */
	public get validationMessage(): string {
		return null;
	}

	/**
	 * Returns "true" if it will validate.
	 *
	 * @return {boolean} "true" if it will validate.
	 */
	public get willValidate(): boolean {
		return (
			this.type !== 'hidden' && this.type !== 'reset' && this.type !== 'button' && !this.disabled && !this['readOnly']
		);
	}

	/**
	 * Returns value as Date.
	 *
	 * @return {Date} Date.
	 */
	public get valueAsDate(): Date {
		return this.value ? new Date(this.value) : null;
	}

	/**
	 * Returns value as number.
	 *
	 * @return {number} Number.
	 */
	public get valueAsNumber(): number {
		return this.value ? parseFloat(this.value) : NaN;
	}
}
