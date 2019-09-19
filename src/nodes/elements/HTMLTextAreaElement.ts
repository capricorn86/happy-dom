import HTMLElement from '../basic-types/HTMLElement';
import Node from '../basic-types/Node';
import * as HTMLTextAreaPropertyAttributes from './HTMLTextAreaPropertyAttributes.json';

/**
 * HTMLTextAreaElement.
 */
export default class HTMLTextAreaElement extends HTMLElement {
	protected static _observedPropertyAttributes = Object.assign({}, HTMLElement._observedPropertyAttributes, HTMLTextAreaPropertyAttributes);

	public form: HTMLFormElement = null;
    public name: string = '';
    public readonly type: string = 'textarea';
    public disabled: boolean = false;
    public autofocus: boolean = false;
    public required: boolean = false;
    public _value: string = '';
    public autocomplete: string = '';
    public minLength: number = -1;
    public maxLength: number = -1;
    public placeholder: string = '';
    public readOnly: boolean = false;
    public selectionStart: number = 0;
    public selectionEnd: number = 0;
    public selectionDirection: string = 'forward';
    public defaultValue: string = '';
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
        if(this.defaultValue === null) {
            this.defaultValue = value;
        }
    }

	/**
	 * Returns text length.
	 *
	 * @param {number} Text length.
	 */
    get textLength() {
        return this.value.length;
    }

	/**
	 * Append a child node to childNodes.
	 *
     * @override
	 * @param  {Node} node Node to append.
	 * @return {Node} Appended node.
	 */
	public appendChild(node: Node): Node {
        super.appendChild(node);
        this.value = this.textContent;
        return node;
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param {Node} node Node to remove
	 */
	public removeChild(node: Node): void {
        super.removeChild(node);
        this.value = this.textContent;
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param {Node} newNode Node to insert.
	 * @param {Node} referenceNode Node to insert before.
	 * @return {Node} Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode: Node): Node {
        super.insertBefore(newNode, referenceNode);
        this.value = this.textContent;
        return newNode;
	}
}
