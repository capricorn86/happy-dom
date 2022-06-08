import HTMLInputElement from '../html-input-element/HTMLInputElement';
import HTMLSelectElement from '../html-select-element/HTMLSelectElement';

/**
 * Input validity state.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export default class ValidityState {
	public badInput = false;
	public customError = false;
	public patternMismatch = false;
	public rangeOverflow = false;
	public rangeUnderflow = false;
	public stepMismatch = false;
	private element: HTMLInputElement | HTMLSelectElement = null;

	/**
	 * Constructor.
	 *
	 * @param element Input element.
	 */
	constructor(element: HTMLInputElement | HTMLSelectElement) {
		this.element = element;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get tooLong(): boolean {
		if (this.element instanceof HTMLInputElement) {
			return this.element.maxLength && this.element.value.length > this.element.maxLength;
		}
		return false;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get tooShort(): boolean {
		if (this.element instanceof HTMLInputElement) {
			return this.element.minLength && this.element.value.length < this.element.minLength;
		}

		return false;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get typeMismatch(): boolean {
		return false;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get valueMissing(): boolean {
		return this.element.required && !this.element.value;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get valid(): boolean {
		for (const key of Object.keys(this)) {
			if (this[key]) {
				return false;
			}
		}

		return !this.tooLong && !this.tooShort && !this.typeMismatch && !this.valueMissing;
	}
}
