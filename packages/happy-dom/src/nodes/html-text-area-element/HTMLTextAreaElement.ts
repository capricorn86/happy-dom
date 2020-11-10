import HTMLElement from '../html-element/HTMLElement';
import Node from '../node/Node';
import HTMLFormElement from '../html-form-element/HTMLFormElement';
import Attr from '../../attribute/Attr';

/**
 * HTMLTextAreaElement.
 */
export default class HTMLTextAreaElement extends HTMLElement {
	public name = '';
	public readonly type = 'textarea';
	public disabled = false;
	public autofocus = false;
	public required = false;
	public _value = '';
	public autocomplete = '';
	public cols = '';
	public rows = '';
	public minLength = -1;
	public maxLength = -1;
	public placeholder = '';
	public readOnly = false;
	public selectionStart = 0;
	public selectionEnd = 0;
	public selectionDirection = 'forward';
	public defaultValue = '';
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
	 * Returns text length.
	 *
	 * @param Text length.
	 */
	public get textLength(): number {
		return this.value.length;
	}

	/**
	 * @override
	 */
	public appendChild(node: Node): Node {
		super.appendChild(node);
		this.value = this.textContent;
		return node;
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param node Node to remove
	 */
	public removeChild(node: Node): void {
		super.removeChild(node);
		this.value = this.textContent;
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @return Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode: Node): Node {
		super.insertBefore(newNode, referenceNode);
		this.value = this.textContent;
		return newNode;
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
			case 'name': // string
			case 'placeholder': // string
			case 'inputmode': // string
			case 'cols': // string
			case 'rows': // string
			case 'autocomplete': // string
				this[attribute.name] = '';
				break;
			case 'selectiondirection': // string
				this.selectionDirection = 'forward';
				break;
			case 'value': // string
				this._value = '';
				break;
			case 'readonly': //  boolean
				this.readOnly = false;
				break;
			case 'disabled': // boolean
			case 'autofocus': // boolean
			case 'required': // boolean
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
			case 'name': // string
			case 'placeholder': // string
			case 'inputmode': // string
			case 'cols': // string
			case 'rows': // string
			case 'autocomplete': // string
				this[attribute.name] = attribute.value || '';
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
	public cloneNode(deep = false): HTMLTextAreaElement {
		const clone = <HTMLTextAreaElement>super.cloneNode(deep);

		clone.name = this.name;
		clone.disabled = this.disabled;
		clone.autofocus = this.autofocus;
		clone.required = this.required;
		clone._value = this._value;
		clone.autocomplete = this.autocomplete;
		clone.cols = this.cols;
		clone.rows = this.rows;
		clone.minLength = this.minLength;
		clone.maxLength = this.maxLength;
		clone.placeholder = this.placeholder;
		clone.readOnly = this.readOnly;
		clone.selectionStart = this.selectionStart;
		clone.selectionEnd = this.selectionEnd;
		clone.selectionDirection = this.selectionDirection;
		clone.defaultValue = this.defaultValue;
		clone.inputmode = this.inputmode;

		return clone;
	}
}
