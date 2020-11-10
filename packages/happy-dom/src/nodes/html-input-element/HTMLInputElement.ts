import File from '../../file/File';
import Attr from '../../attribute/Attr';
import HTMLElement from '../html-element/HTMLElement';
import HTMLFormElement from '../html-form-element/HTMLFormElement';
import ValidityState from './ValidityState';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import Event from '../../event/Event';
import HTMLInputElementValueSanitizer from './HTMLInputElementValueSanitizer';
import HTMLInputElementSelectionModeEnum from './HTMLInputElementSelectionModeEnum';
import HTMLInputElementSelectionDirectionEnum from './HTMLInputElementSelectionDirectionEnum';

/**
 * HTML Input Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
 *
 * Used as reference for some of the logic (like selection range):
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/nodes/HTMLInputElement-impl.js (MIT licensed)
 */
export default class HTMLInputElement extends HTMLElement {
	// Related to parent form.
	public formAction = '';
	public formMethod = '';
	public formNoValidate = false;

	// Any type of input
	public name = '';
	public _type = 'text';
	public disabled = false;
	public autofocus = false;
	public required = false;
	public _value = '';

	// Type specific: checkbox/radio
	public checked = false;
	public defaultChecked = false;
	public indeterminate = false;

	// Type specific: image
	public alt = '';
	public height = 0;
	public src = '';
	public width = 0;

	// Type specific: file
	public files: File[] = [];
	public accept = '';
	public allowdirs = '';

	// Type specific: text/number
	public autocomplete = '';
	public min = '';
	public max = '';
	public minLength = -1;
	public maxLength = -1;
	public pattern = '';
	public placeholder = '';
	public readOnly = false;
	public size = 0;

	// Type specific: text/password/search/tel/url/week/month
	private _selectionStart = 0;
	private _selectionEnd = 0;
	private _selectionDirection = HTMLInputElementSelectionDirectionEnum.none;

	// Email
	public multiple = false;

	// Not categorized
	public defaultValue = '';
	public step = '';
	public inputmode = '';

	/**
	 * Returns value.
	 *
	 * @return Value.
	 */
	public get value(): string {
		switch (this.type) {
			case 'hidden':
			case 'submit':
			case 'image':
			case 'reset':
			case 'button':
				return this.getAttribute('value') || '';
			case 'checkbox':
			case 'radio':
				const attritube = this.getAttribute('value');
				return attritube !== null ? attritube : 'on';
			case 'file':
				return this.files.length > 0 ? '/fake/path/' + this.files[0].name : '';
		}

		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		switch (this._type) {
			case 'hidden':
			case 'submit':
			case 'image':
			case 'reset':
			case 'button':
			case 'checkbox':
			case 'radio':
				this.setAttribute('value', value);
				break;
			case 'file':
				if (value !== '') {
					throw new DOMException(
						'Input elements of type "file" may only programmatically set the value to empty string.',
						DOMExceptionNameEnum.invalidStateError
					);
				}
				break;
			default:
				const oldValue = this._value;
				this._value = HTMLInputElementValueSanitizer.sanitize(this, value);

				if (oldValue !== this._value) {
					this._selectionStart = value.length;
					this._selectionEnd = value.length;
					this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
				}

				break;
		}
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set type(type: string) {
		this._type = type.toLowerCase();
	}

	/**
	 * Returns type.
	 *
	 * @param type Type.
	 */
	public get type(): string {
		return this._type;
	}

	/**
	 * Returns selection start.
	 *
	 * @return Selection start.
	 */
	public get selectionStart(): number {
		if (!this._isSelectionSupported()) {
			return null;
		}

		return this._selectionStart;
	}

	/**
	 * Sets selection start.
	 *
	 * @param start Start.
	 */
	public set selectionStart(start: number) {
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.setSelectionRange(start, Math.max(start, this._selectionEnd), this._selectionDirection);
	}

	/**
	 * Returns selection end.
	 *
	 * @return Selection end.
	 */
	public get selectionEnd(): number {
		if (!this._isSelectionSupported()) {
			return null;
		}

		return this._selectionEnd;
	}

	/**
	 * Sets selection end.
	 *
	 * @param end End.
	 */
	public set selectionEnd(end: number) {
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.setSelectionRange(this._selectionStart, end, this._selectionDirection);
	}

	/**
	 * Returns selection direction.
	 *
	 * @return Selection direction.
	 */
	public get selectionDirection(): string {
		if (!this._isSelectionSupported()) {
			return null;
		}

		return this._selectionDirection;
	}

	/**
	 * Sets selection direction.
	 *
	 * @param direction Direction.
	 */
	public set selectionDirection(direction: string) {
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.setSelectionRange(this._selectionStart, this._selectionEnd, direction);
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
	 * Returns validity state.
	 *
	 * @returns Validity state.
	 */
	public get validity(): ValidityState {
		return new ValidityState(this);
	}

	/**
	 * Returns validity message.
	 *
	 * @return Validation message.
	 */
	public get validationMessage(): string {
		return null;
	}

	/**
	 * Returns "true" if it will validate.
	 *
	 * @return "true" if it will validate.
	 */
	public get willValidate(): boolean {
		return (
			this.type !== 'hidden' &&
			this.type !== 'reset' &&
			this.type !== 'button' &&
			!this.disabled &&
			!this['readOnly']
		);
	}

	/**
	 * Returns value as Date.
	 *
	 * @returns Date.
	 */
	public get valueAsDate(): Date {
		return this.value ? new Date(this.value) : null;
	}

	/**
	 * Returns value as number.
	 *
	 * @return Number.
	 */
	public get valueAsNumber(): number {
		return this.value ? parseFloat(this.value) : NaN;
	}

	/**
	 * Set selection range.
	 *
	 * @param start Start.
	 * @param end End.
	 * @param [direction="none"] Direction.
	 */
	public setSelectionRange(start: number, end: number, direction = 'none'): void {
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this._selectionEnd = Math.min(end, this.value.length);
		this._selectionStart = Math.min(start, this._selectionEnd);
		this._selectionDirection =
			direction === HTMLInputElementSelectionDirectionEnum.forward ||
			direction === HTMLInputElementSelectionDirectionEnum.backward
				? direction
				: HTMLInputElementSelectionDirectionEnum.none;
		this.dispatchEvent(new Event('select', { bubbles: true, cancelable: true }));
	}

	/**
	 * Set range text.
	 *
	 * @param replacement Replacement.
	 * @param [start] Start.
	 * @param [end] End.
	 * @param [direction] Direction.
	 */
	public setRangeText(
		replacement,
		start = null,
		end = null,
		selectionMode = HTMLInputElementSelectionModeEnum.preserve
	): void {
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		if (start === null) {
			start = this._selectionStart;
		}
		if (end === null) {
			end = this._selectionEnd;
		}

		if (start > end) {
			throw new DOMException(
				'The index is not in the allowed range.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		start = Math.min(start, this.value.length);
		end = Math.min(end, this.value.length);

		const val = this.value;
		let selectionStart = this._selectionStart;
		let selectionEnd = this._selectionEnd;

		this.value = val.slice(0, start) + replacement + val.slice(end);

		const newEnd = start + this.value.length;

		switch (selectionMode) {
			case HTMLInputElementSelectionModeEnum.select:
				this.setSelectionRange(start, newEnd);
				break;
			case HTMLInputElementSelectionModeEnum.start:
				this.setSelectionRange(start, start);
				break;
			case HTMLInputElementSelectionModeEnum.end:
				this.setSelectionRange(newEnd, newEnd);
				break;
			default:
				const delta = replacement.length - (end - start);

				if (selectionStart > end) {
					selectionStart += delta;
				} else if (selectionStart > start) {
					selectionStart = start;
				}

				if (selectionEnd > end) {
					selectionEnd += delta;
				} else if (selectionEnd > start) {
					selectionEnd = newEnd;
				}

				this.setSelectionRange(selectionStart, selectionEnd);
				break;
		}
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
			case 'height': // number
			case 'width': // number
			case 'size': // number
				this[attribute.name] = 0;
				break;
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
			case 'type': // string
				this[attribute.name] = 'text';
				break;
			case 'name': // string
			case 'alt': // string
			case 'min': // string
			case 'max': // string
			case 'pattern': // string
			case 'placeholder': // string
			case 'step': // string
			case 'inputmode': // string
			case 'accept': // string
			case 'allowdirs': // string
			case 'autocomplete': // string
			case 'src': // string
				this[attribute.name] = '';
				break;
			case 'value': // string
				if (this._value === attribute.value && this._isPrivateValueSupported()) {
					this.value = '';
				}
				break;
			case 'defaultvalue': // string
				this.defaultValue = '';
				break;
			case 'readonly': //  boolean
				this.readOnly = false;
			case 'disabled': // boolean
			case 'autofocus': // boolean
			case 'required': // boolean
			case 'indeterminate': // boolean
			case 'multiple': // boolean
			case 'checked': // boolean
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
			case 'height': // number
			case 'width': // number
			case 'size': // number
				this[attribute.name] = !!attribute.value ? Number(attribute.value) : 0;
				break;
			case 'minlength': // number
				this.minLength = !!attribute.value ? Number(attribute.value) : -1;
				break;
			case 'maxlength': // number
				this.maxLength = !!attribute.value ? Number(attribute.value) : -1;
				break;
			case 'type': // string
			case 'name': // string
			case 'alt': // string
			case 'min': // string
			case 'max': // string
			case 'pattern': // string
			case 'placeholder': // string
			case 'step': // string
			case 'inputmode': // string
			case 'accept': // string
			case 'allowdirs': // string
			case 'autocomplete': // string
			case 'src': // string
				this[attribute.name] = attribute.value || '';
				break;
			case 'value': // string
				if (!this._value && this._isPrivateValueSupported()) {
					this.value = attribute.value || '';
				}
				break;
			case 'defaultvalue': // string
				this.defaultValue = attribute.value || '';
				break;
			case 'readonly': //  boolean
				this.readOnly = attribute.value !== null;
				break;
			case 'disabled': // boolean
			case 'autofocus': // boolean
			case 'required': // boolean
			case 'indeterminate': // boolean
			case 'multiple': // boolean
			case 'checked': // boolean
				this[attribute.name] = attribute.value !== null;
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
	public cloneNode(deep = false): HTMLInputElement {
		const clone = <HTMLInputElement>super.cloneNode(deep);
		clone.formAction = this.formAction;
		clone.formMethod = this.formMethod;
		clone.formNoValidate = this.formNoValidate;
		clone.name = this.name;
		clone.type = this.type;
		clone.disabled = this.disabled;
		clone.autofocus = this.autofocus;
		clone.required = this.required;
		clone._value = this._value;
		clone.checked = this.checked;
		clone.defaultChecked = this.defaultChecked;
		clone.indeterminate = this.indeterminate;
		clone.alt = this.alt;
		clone.height = this.height;
		clone.src = this.src;
		clone.width = this.width;
		clone.accept = this.accept;
		clone.allowdirs = this.allowdirs;
		clone.autocomplete = this.autocomplete;
		clone.min = this.min;
		clone.max = this.max;
		clone.minLength = this.minLength;
		clone.maxLength = this.maxLength;
		clone.pattern = this.pattern;
		clone.placeholder = this.placeholder;
		clone.readOnly = this.readOnly;
		clone.size = this.size;
		clone.selectionStart = this.selectionStart;
		clone.selectionEnd = this.selectionEnd;
		clone.selectionDirection = this.selectionDirection;
		clone.defaultValue = this.defaultValue;
		clone.multiple = this.multiple;
		clone.step = this.step;
		clone.inputmode = this.inputmode;
		return clone;
	}

	/**
	 * Checks if private value is supported.
	 *
	 * @returns "true" if private value is supported.
	 */
	private _isPrivateValueSupported(): boolean {
		return (
			this.type !== 'hidden' &&
			this.type !== 'submit' &&
			this.type !== 'image' &&
			this.type !== 'reset' &&
			this.type !== 'button' &&
			this.type !== 'checkbox' &&
			this.type !== 'radio' &&
			this.type !== 'file'
		);
	}

	/**
	 * Checks is selection is supported.
	 *
	 * @returns "true" if selection is supported.
	 */
	private _isSelectionSupported(): boolean {
		return (
			this.type === 'text' ||
			this.type === 'search' ||
			this.type === 'url' ||
			this.type === 'tel' ||
			this.type === 'password'
		);
	}
}
