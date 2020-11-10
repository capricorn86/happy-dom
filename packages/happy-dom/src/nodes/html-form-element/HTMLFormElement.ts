import HTMLElement from '../html-element/HTMLElement';
import Element from '../element/Element';
import Attr from '../../attribute/Attr';

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
	 * Removes an Attr node.
	 *
	 * @override
	 * @param attribute Attribute.
	 */
	public removeAttributeNode(attribute: Attr): void {
		super.removeAttributeNode(attribute);

		switch (attribute.name) {
			case 'method':
				this[attribute.name] = 'get';
				break;
			case 'name':
			case 'target':
			case 'action':
			case 'encoding':
			case 'enctype':
			case 'autocomplete':
				this[attribute.name] = '';
				break;
			case 'acceptcharset':
				this.acceptCharset = '';
				break;
			case 'novalidate':
				this.noValidate = '';
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
			case 'name':
			case 'method':
			case 'target':
			case 'action':
			case 'encoding':
			case 'enctype':
			case 'autocomplete':
				this[attribute.name] = attribute.value;
				break;
			case 'acceptcharset':
				this.acceptCharset = attribute.value;
				break;
			case 'novalidate':
				this.noValidate = attribute.value;
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
	public cloneNode(deep = false): HTMLFormElement {
		const clone = <HTMLFormElement>super.cloneNode(deep);
		clone.name = this.name;
		clone.method = this.method;
		clone.target = this.target;
		clone.action = this.action;
		clone.encoding = this.encoding;
		clone.enctype = this.enctype;
		clone.acceptCharset = this.acceptCharset;
		clone.autocomplete = this.autocomplete;
		clone.noValidate = this.noValidate;
		return clone;
	}
}
