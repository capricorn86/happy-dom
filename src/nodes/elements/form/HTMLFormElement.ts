import HTMLElement from '../../basic-types/html-element/HTMLElement';
import Element from '../../basic-types/element/Element';
import * as HTMLFormPropertyAttributes from './HTMLFormPropertyAttributes.json';

/**
 * HTMLFormElement.
 */
export default class HTMLFormElement extends HTMLElement {
	protected static _observedPropertyAttributes = Object.assign(
		{},
		HTMLElement._observedPropertyAttributes,
		HTMLFormPropertyAttributes
	);

	public name: string = null;
	public method: string = null;
	public target: string = null;
	public action: string = null;
	public encoding: string = null;
	public enctype: string = null;
	public acceptCharset: string = null;
	public autocomplete: string = 'off';
	public noValidate: string = null;

	/**
	 * Returns input elements.
	 *
	 * @return {Element[]} Elements.
	 */
	public get elements(): Element[] {
		return this.querySelectorAll('input,textarea');
	}

	/**
	 * Returns number of input elements.
	 *
	 * @return {number} Length.
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
}
