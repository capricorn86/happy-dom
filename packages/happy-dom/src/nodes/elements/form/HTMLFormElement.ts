import HTMLElement from '../../basic/html-element/HTMLElement';
import Element from '../../basic/element/Element';

/**
 * HTMLFormElement.
 */
export default class HTMLFormElement extends HTMLElement {
	public name = '';
	public method = 'get';
	public target = '';
	public action = '';
	public encoding = '';
	public enctype = '';
	public acceptCharset = '';
	public autocomplete = '';
	public noValidate = '';

	/**
	 * Returns input elements.
	 *
	 * @returns Elements.
	 */
	public get elements(): Element[] {
		return this.querySelectorAll('input,textarea');
	}

	/**
	 * Returns number of input elements.
	 *
	 * @return Length.
	 */
	public get length(): number {
		return this.elements.length;
	}

	/**
	 * Submits form.
	 */
	public submit(): void {}

	/**
	 * Resets form.
	 */
	public reset(): void {}

	/**
	 * Reports validity.
	 */
	public reportValidity(): void {}

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
		if (name === 'method') {
			this.method = value;
		} else {
			super._setAttributeProperty(name, value);
		}
	}
}
