import Event from '../../event/Event';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import HTMLElement from '../html-element/HTMLElement';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import HTMLInputElementSelectionDirectionEnum from '../html-input-element/HTMLInputElementSelectionDirectionEnum';
import HTMLInputElementSelectionModeEnum from '../html-input-element/HTMLInputElementSelectionModeEnum';
import IHTMLTextAreaElement from './IHTMLTextAreaElement';

/**
 * HTML Text Area Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement.
 */
export default class HTMLTextAreaElement extends HTMLElement implements IHTMLTextAreaElement {
	public readonly type = 'textarea';
	public _value = null;
	public _selectionStart = null;
	public _selectionEnd = null;
	public _selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
	public defaultValue = '';

	/**
	 * Returns minlength.
	 *
	 * @returns Min length.
	 */
	public get minLength(): number {
		const minLength = this.getAttributeNS(null, 'minlength');
		if (minLength !== null) {
			return parseInt(minLength);
		}
		return -1;
	}

	/**
	 * Sets minlength.
	 *
	 * @param minLength Min length.
	 */
	public set minLength(minlength: number) {
		this.setAttributeNS(null, 'minlength', String(minlength));
	}

	/**
	 * Returns maxlength.
	 *
	 * @returns Max length.
	 */
	public get maxLength(): number {
		const maxLength = this.getAttributeNS(null, 'maxlength');
		if (maxLength !== null) {
			return parseInt(maxLength);
		}
		return -1;
	}

	/**
	 * Sets maxlength.
	 *
	 * @param maxlength Max length.
	 */
	public set maxLength(maxLength: number) {
		this.setAttributeNS(null, 'maxlength', String(maxLength));
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttributeNS(null, 'name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttributeNS(null, 'name', name);
	}

	/**
	 * Returns placeholder.
	 *
	 * @returns Placeholder.
	 */
	public get placeholder(): string {
		return this.getAttributeNS(null, 'placeholder') || '';
	}

	/**
	 * Sets placeholder.
	 *
	 * @param placeholder Placeholder.
	 */
	public set placeholder(placeholder: string) {
		this.setAttributeNS(null, 'placeholder', placeholder);
	}

	/**
	 * Returns inputmode.
	 *
	 * @returns Inputmode.
	 */
	public get inputmode(): string {
		return this.getAttributeNS(null, 'inputmode') || '';
	}

	/**
	 * Sets inputmode.
	 *
	 * @param inputmode Inputmode.
	 */
	public set inputmode(inputmode: string) {
		this.setAttributeNS(null, 'inputmode', inputmode);
	}

	/**
	 * Returns cols.
	 *
	 * @returns Cols.
	 */
	public get cols(): string {
		return this.getAttributeNS(null, 'cols') || '';
	}

	/**
	 * Sets cols.
	 *
	 * @param cols Cols.
	 */
	public set cols(cols: string) {
		this.setAttributeNS(null, 'cols', cols);
	}

	/**
	 * Returns rows.
	 *
	 * @returns Rows.
	 */
	public get rows(): string {
		return this.getAttributeNS(null, 'rows') || '';
	}

	/**
	 * Sets rows.
	 *
	 * @param rows Rows.
	 */
	public set rows(rows: string) {
		this.setAttributeNS(null, 'rows', rows);
	}

	/**
	 * Returns autocomplete.
	 *
	 * @returns Autocomplete.
	 */
	public get autocomplete(): string {
		return this.getAttributeNS(null, 'autocomplete') || '';
	}

	/**
	 * Sets autocomplete.
	 *
	 * @param autocomplete Autocomplete.
	 */
	public set autocomplete(autocomplete: string) {
		this.setAttributeNS(null, 'autocomplete', autocomplete);
	}

	/**
	 * Returns readOnly.
	 *
	 * @returns ReadOnly.
	 */
	public get readOnly(): boolean {
		return this.getAttributeNS(null, 'readonly') !== null;
	}

	/**
	 * Sets readOnly.
	 *
	 * @param readOnly ReadOnly.
	 */
	public set readOnly(readOnly: boolean) {
		if (!readOnly) {
			this.removeAttributeNS(null, 'readonly');
		} else {
			this.setAttributeNS(null, 'readonly', '');
		}
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttributeNS(null, 'disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttributeNS(null, 'disabled');
		} else {
			this.setAttributeNS(null, 'disabled', '');
		}
	}

	/**
	 * Returns autofocus.
	 *
	 * @returns Autofocus.
	 */
	public get autofocus(): boolean {
		return this.getAttributeNS(null, 'autofocus') !== null;
	}

	/**
	 * Sets autofocus.
	 *
	 * @param autofocus Autofocus.
	 */
	public set autofocus(autofocus: boolean) {
		if (!autofocus) {
			this.removeAttributeNS(null, 'autofocus');
		} else {
			this.setAttributeNS(null, 'autofocus', '');
		}
	}

	/**
	 * Returns required.
	 *
	 * @returns Required.
	 */
	public get required(): boolean {
		return this.getAttributeNS(null, 'required') !== null;
	}

	/**
	 * Sets required.
	 *
	 * @param required Required.
	 */
	public set required(required: boolean) {
		if (!required) {
			this.removeAttributeNS(null, 'required');
		} else {
			this.setAttributeNS(null, 'required', '');
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		if (this._value === null) {
			return this.getAttributeNS(null, 'value') || '';
		}

		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		const oldValue = this._value;
		this._value = value;

		if (oldValue !== this._value) {
			this._selectionStart = this._value.length;
			this._selectionEnd = this._value.length;
			this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
		}
	}

	/**
	 * Returns selection start.
	 *
	 * @returns Selection start.
	 */
	public get selectionStart(): number {
		if (this._selectionStart === null) {
			return this.value.length;
		}

		return this._selectionStart;
	}

	/**
	 * Sets selection start.
	 *
	 * @param start Start.
	 */
	public set selectionStart(start: number) {
		this.setSelectionRange(start, Math.max(start, this.selectionEnd), this._selectionDirection);
	}

	/**
	 * Returns selection end.
	 *
	 * @returns Selection end.
	 */
	public get selectionEnd(): number {
		if (this._selectionEnd === null) {
			return this.value.length;
		}

		return this._selectionEnd;
	}

	/**
	 * Sets selection end.
	 *
	 * @param end End.
	 */
	public set selectionEnd(end: number) {
		this.setSelectionRange(this.selectionStart, end, this._selectionDirection);
	}

	/**
	 * Returns selection direction.
	 *
	 * @returns Selection direction.
	 */
	public get selectionDirection(): string {
		return this._selectionDirection;
	}

	/**
	 * Sets selection direction.
	 *
	 * @param direction Direction.
	 */
	public set selectionDirection(direction: string) {
		this.setSelectionRange(this._selectionStart, this._selectionEnd, direction);
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		let parent = <IHTMLElement>this.parentNode;
		while (parent && parent.tagName !== 'FORM') {
			parent = <IHTMLElement>parent.parentNode;
		}
		return <IHTMLFormElement>parent;
	}

	/**
	 * Returns text length.
	 *
	 * @param Text Length.
	 */
	public get textLength(): number {
		return this.value.length;
	}

	/**
	 * Set selection range.
	 *
	 * @param start Start.
	 * @param end End.
	 * @param [direction="none"] Direction.
	 */
	public setSelectionRange(start: number, end: number, direction = 'none'): void {
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
	 * @param selectionMode
	 */
	public setRangeText(
		replacement: string,
		start: number = null,
		end: number = null,
		selectionMode = HTMLInputElementSelectionModeEnum.preserve
	): void {
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
	 * @returns "true" if validation does'nt fail.
	 */
	public checkValidity(): boolean {
		return true;
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLTextAreaElement {
		const clone = <HTMLTextAreaElement>super.cloneNode(deep);

		clone._value = this._value;
		clone._selectionStart = this._selectionStart;
		clone._selectionEnd = this._selectionEnd;
		clone._selectionDirection = this._selectionDirection;
		clone.defaultValue = this.defaultValue;

		return clone;
	}
}
