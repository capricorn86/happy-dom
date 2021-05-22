import HTMLInputElement from './HTMLInputElement';

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
	private element: HTMLInputElement = null;

	/**
	 * Constructor.
	 *
	 * @param element Input element.
	 */
	constructor(element: HTMLInputElement) {
		this.element = element;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get tooLong(): boolean {
		return this.element.maxLength && this.element.value.length > this.element.maxLength;
	}

	/**
	 * Returns validity.
	 *
	 * @returns "true" if valid.
	 */
	public get tooShort(): boolean {
		return this.element.minLength && this.element.value.length < this.element.minLength;
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
