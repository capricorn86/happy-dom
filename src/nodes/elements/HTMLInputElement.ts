import HTMLElement from '../basic-types/HTMLElement';
import HTMLFormElement from './HTMLFormElement';
import ValidityState from '../../html-element/ValidityState';
import * as HTMLInputPropertyAttributes from './HTMLInputPropertyAttributes.json';

/**
 * HTMLElement.
 */
export default class HTMLInputElement extends HTMLElement {
    protected static _observedPropertyAttributes = HTMLElement._observedPropertyAttributes.concat(HTMLInputPropertyAttributes);
    
    // Related to parent form.
	public form: HTMLFormElement = null;
	public formAction: string = null;
	public formEncType: string = null;
	public formMethod: string = null;
    public formNoValidate: boolean = false;
    
    // Any type of input
    public name: string = null;
    public type: string = null;
    public disabled: boolean = false;
    public autofocus: boolean = false;
    public required: boolean = false;
    public _value: string = null;

    // Type specific: checkbox/radio
    public _checked: boolean = false;
    public defaultChecked: boolean = null;
    public indeterminate: boolean = false;

    // Type specific: image
    public alt: string = null;
    public height: string = null;
    public src: string = null;
    public width: string = null;

    // Type specific: file
    public accept: string = null;
    public allowdirs: string = null;

    // Type specific: text/number
    public autocomplete: string = 'off';
    public min: string = null;
    public max: string = null;
    public minLength: number = null;
    public maxLength: number = null;
    public pattern: string = null;
    public placeholder: string = null;
    public readOnly: boolean = null;
    public size: number = null;

    // Type specific: text/password/search/tel/url/week/month
    public selectionStart: number = 0;
    public selectionEnd: number = 0;
    public selectionDirection: string = 'forward';

    // Not categorized
    public defaultValue: string = null;
    public multiple: boolean = false;
    public files: [] = [];
    public step: string = null;
    public inputmode: string = null;

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
        if(this.defaultValue === null) {
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
        if(this.defaultChecked === null) {
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
        return this.type !== 'hidden' && this.type !== 'reset' && this.type !== 'button' && !this.disabled && !this['readOnly'];
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
