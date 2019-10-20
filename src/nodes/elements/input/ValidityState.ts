import HTMLInputElement from './HTMLInputElement';

/**
 * Input validity state.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export default class ValidityState {
	public badInput: boolean = false;
	public customError: boolean = false;
	public patternMismatch: boolean = false;
	public rangeOverflow: boolean = false;
	public rangeUnderflow: boolean = false;
	public stepMismatch: boolean = false;
	private element: HTMLInputElement = null;

	/**
	 * Constructor.
	 *
	 * @param {HTMLInputElement} element Input element.
	 */
	constructor(element: HTMLInputElement) {
		this.element = element;
	}

	/**
	 * Returns validity.
	 *
	 * @return {boolean} "true" if valid.
	 */
	public get tooLong(): boolean {
		return this.element.maxLength && this.element.value.length > this.element.maxLength;
	}

	/**
	 * Returns validity.
	 *
	 * @return {boolean} "true" if valid.
	 */
	public get tooShort(): boolean {
		return this.element.minLength && this.element.value.length < this.element.minLength;
	}

	/**
	 * Returns validity.
	 *
	 * @return {boolean} "true" if valid.
	 */
	public get typeMismatch(): boolean {
		return false;
	}

	/**
	 * Returns validity.
	 *
	 * @return {boolean} "true" if valid.
	 */
	public get valueMissing(): boolean {
		return this.element.required && !this.element.value;
	}

	/**
	 * Returns validity.
	 *
	 * @return {boolean} "true" if valid.
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
