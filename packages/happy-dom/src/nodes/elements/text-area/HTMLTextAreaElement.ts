import HTMLElement from '../../basic/html-element/HTMLElement';
import Node from '../../basic/node/Node';
import HTMLFormElement from '../form/HTMLFormElement';

/**
 * HTMLTextAreaElement.
 */
export default class HTMLTextAreaElement extends HTMLElement {
	public form: HTMLFormElement = null;
	public name = '';
	public readonly type = 'textarea';
	public disabled = false;
	public autofocus = false;
	public required = false;
	public _value = '';
	public autocomplete = '';
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
}
