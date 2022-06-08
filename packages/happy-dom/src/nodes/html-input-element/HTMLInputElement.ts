import File from '../../file/File';
import HTMLElement from '../html-element/HTMLElement';
import ValidityState from '../validity-state/ValidityState';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import Event from '../../event/Event';
import HTMLInputElementValueSanitizer from './HTMLInputElementValueSanitizer';
import HTMLInputElementSelectionModeEnum from './HTMLInputElementSelectionModeEnum';
import HTMLInputElementSelectionDirectionEnum from './HTMLInputElementSelectionDirectionEnum';
import IHTMLInputElement from './IHTMLInputElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import IHTMLElement from '../html-element/IHTMLElement';
import HTMLInputElementValueStepping from './HTMLInputElementValueStepping';

/**
 * HTML Input Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement.
 *
 * Used as reference for some of the logic (like selection range):
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/nodes/HTMLInputElement-impl.js (MIT licensed).
 */
export default class HTMLInputElement extends HTMLElement implements IHTMLInputElement {
	// Related to parent form.
	public formAction = '';
	public formMethod = '';
	public formNoValidate = false;

	// Any type of input
	public _value = null;
	public _height = 0;
	public _width = 0;

	// Type specific: checkbox/radio
	public defaultChecked = false;

	// Type specific: file
	public files: File[] = [];

	// Type specific: text/password/search/tel/url/week/month
	private _selectionStart: number = null;
	private _selectionEnd: number = null;
	private _selectionDirection: HTMLInputElementSelectionDirectionEnum =
		HTMLInputElementSelectionDirectionEnum.none;
	private _validationMessage = '';

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): number {
		return this._height;
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: number) {
		this._height = height;
		this.setAttributeNS(null, 'height', String(height));
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): number {
		return this._width;
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: number) {
		this._width = width;
		this.setAttributeNS(null, 'width', String(width));
	}

	/**
	 * Returns size.
	 *
	 * @returns Size.
	 */
	public get size(): number {
		const size = this.getAttributeNS(null, 'size');
		if (size !== null) {
			return parseInt(size);
		}
		return 20;
	}

	/**
	 * Sets size.
	 *
	 * @param size Size.
	 */
	public set size(size: number) {
		this.setAttributeNS(null, 'size', String(size));
	}

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
	 * Returns type.
	 *
	 * @returns Type. Defaults to "text".
	 */
	public get type(): string {
		return this.getAttributeNS(null, 'type') || 'text';
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set type(type: string) {
		this.setAttributeNS(null, 'type', type.toLowerCase());
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
	 * Returns alt.
	 *
	 * @returns Alt.
	 */
	public get alt(): string {
		return this.getAttributeNS(null, 'alt') || '';
	}

	/**
	 * Sets alt.
	 *
	 * @param alt Alt.
	 */
	public set alt(alt: string) {
		this.setAttributeNS(null, 'alt', alt);
	}

	/**
	 * Returns min.
	 *
	 * @returns Min.
	 */
	public get min(): string {
		return this.getAttributeNS(null, 'min') || '';
	}

	/**
	 * Sets min.
	 *
	 * @param min Min.
	 */
	public set min(min: string) {
		this.setAttributeNS(null, 'min', min);
	}

	/**
	 * Returns max.
	 *
	 * @returns Max.
	 */
	public get max(): string {
		return this.getAttributeNS(null, 'max') || '';
	}

	/**
	 * Sets max.
	 *
	 * @param max Max.
	 */
	public set max(max: string) {
		this.setAttributeNS(null, 'max', max);
	}

	/**
	 * Returns pattern.
	 *
	 * @returns Pattern.
	 */
	public get pattern(): string {
		return this.getAttributeNS(null, 'pattern') || '';
	}

	/**
	 * Sets pattern.
	 *
	 * @param pattern Pattern.
	 */
	public set pattern(pattern: string) {
		this.setAttributeNS(null, 'pattern', pattern);
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
	 * Returns step.
	 *
	 * @returns Step.
	 */
	public get step(): string {
		return this.getAttributeNS(null, 'step') || '';
	}

	/**
	 * Sets step.
	 *
	 * @param step Step.
	 */
	public set step(step: string) {
		this.setAttributeNS(null, 'step', step);
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
	 * Returns accept.
	 *
	 * @returns Accept.
	 */
	public get accept(): string {
		return this.getAttributeNS(null, 'accept') || '';
	}

	/**
	 * Sets accept.
	 *
	 * @param accept Accept.
	 */
	public set accept(accept: string) {
		this.setAttributeNS(null, 'accept', accept);
	}

	/**
	 * Returns allowdirs.
	 *
	 * @returns Allowdirs.
	 */
	public get allowdirs(): string {
		return this.getAttributeNS(null, 'allowdirs') || '';
	}

	/**
	 * Sets allowdirs.
	 *
	 * @param allowdirs Allowdirs.
	 */
	public set allowdirs(allowdirs: string) {
		this.setAttributeNS(null, 'allowdirs', allowdirs);
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
	 * Returns src.
	 *
	 * @returns Src.
	 */
	public get src(): string {
		return this.getAttributeNS(null, 'src') || '';
	}

	/**
	 * Sets src.
	 *
	 * @param src Src.
	 */
	public set src(src: string) {
		this.setAttributeNS(null, 'src', src);
	}

	/**
	 * Returns defaultValue.
	 *
	 * @returns Defaultvalue.
	 */
	public get defaultValue(): string {
		return this.getAttributeNS(null, 'defaultvalue') || '';
	}

	/**
	 * Sets defaultValue.
	 *
	 * @param defaultValue Defaultvalue.
	 */
	public set defaultValue(defaultValue: string) {
		this.setAttributeNS(null, 'defaultvalue', defaultValue);
	}

	/**
	 * Returns read only.
	 *
	 * @returns Read only.
	 */
	public get readOnly(): boolean {
		return this.getAttributeNS(null, 'readonly') !== null;
	}

	/**
	 * Sets read only.
	 *
	 * @param readOnly Read only.
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
	 * Returns indeterminate.
	 *
	 * @returns Indeterminate.
	 */
	public get indeterminate(): boolean {
		return this.getAttributeNS(null, 'indeterminate') !== null;
	}

	/**
	 * Sets indeterminate.
	 *
	 * @param indeterminate Indeterminate.
	 */
	public set indeterminate(indeterminate: boolean) {
		if (!indeterminate) {
			this.removeAttributeNS(null, 'indeterminate');
		} else {
			this.setAttributeNS(null, 'indeterminate', '');
		}
	}

	/**
	 * Returns multiple.
	 *
	 * @returns Multiple.
	 */
	public get multiple(): boolean {
		return this.getAttributeNS(null, 'multiple') !== null;
	}

	/**
	 * Sets multiple.
	 *
	 * @param multiple Multiple.
	 */
	public set multiple(multiple: boolean) {
		if (!multiple) {
			this.removeAttributeNS(null, 'multiple');
		} else {
			this.setAttributeNS(null, 'multiple', '');
		}
	}

	/**
	 * Returns checked.
	 *
	 * @returns Checked.
	 */
	public get checked(): boolean {
		return this.getAttributeNS(null, 'checked') !== null;
	}

	/**
	 * Sets checked.
	 *
	 * @param checked Checked.
	 */
	public set checked(checked: boolean) {
		if (!checked) {
			this.removeAttributeNS(null, 'checked');
		} else {
			this.setAttributeNS(null, 'checked', '');
		}
	}

	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		switch (this.type) {
			case 'hidden':
			case 'submit':
			case 'image':
			case 'reset':
			case 'button':
				return this.getAttributeNS(null, 'value') || '';
			case 'checkbox':
			case 'radio':
				const attritube = this.getAttributeNS(null, 'value');
				return attritube !== null ? attritube : 'on';
			case 'file':
				return this.files.length > 0 ? '/fake/path/' + this.files[0].name : '';
		}

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
		switch (this.type) {
			case 'hidden':
			case 'submit':
			case 'image':
			case 'reset':
			case 'button':
			case 'checkbox':
			case 'radio':
				this.setAttributeNS(null, 'value', value);
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
					this._selectionStart = this._value.length;
					this._selectionEnd = this._value.length;
					this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;
				}

				break;
		}
	}

	/**
	 * Returns selection start.
	 *
	 * @returns Selection start.
	 */
	public get selectionStart(): number {
		if (!this._isSelectionSupported()) {
			return null;
		}

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
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.setSelectionRange(start, Math.max(start, this.selectionEnd), this._selectionDirection);
	}

	/**
	 * Returns selection end.
	 *
	 * @returns Selection end.
	 */
	public get selectionEnd(): number {
		if (!this._isSelectionSupported()) {
			return null;
		}

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
		if (!this._isSelectionSupported()) {
			throw new DOMException(
				`The input element's type (${this.type}) does not support selection.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		this.setSelectionRange(this.selectionStart, end, this._selectionDirection);
	}

	/**
	 * Returns selection direction.
	 *
	 * @returns Selection direction.
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
	 * Returns validity state.
	 *
	 * @returns Validity state.
	 */
	public get validity(): ValidityState {
		return new ValidityState(this);
	}

	/**
	 * Returns "true" if it will validate.
	 *
	 * @returns "true" if it will validate.
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
	 * @returns Number.
	 */
	public get valueAsNumber(): number {
		return this.value ? parseFloat(this.value) : NaN;
	}

	/**
	 * Returns validation message.
	 *
	 * @returns Validation message.
	 */
	public get validationMessage(): string {
		return this._validationMessage;
	}

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	public setCustomValidity(message: string): void {
		this._validationMessage = String(message);
	}

	/**
	 * Reports validity by dispatching an "invalid" event.
	 */
	public reportValidity(): void {
		if (this._validationMessage) {
			this.dispatchEvent(
				new Event('invalid', {
					bubbles: true,
					cancelable: true
				})
			);
		}
	}

	/**
	 * Selects the text.
	 */
	public select(): void {
		if (!this._isSelectionSupported()) {
			return null;
		}

		this._selectionStart = 0;
		this._selectionEnd = this.value.length;
		this._selectionDirection = HTMLInputElementSelectionDirectionEnum.none;

		this.dispatchEvent(new Event('select', { bubbles: true, cancelable: true }));
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
	 * @param selectionMode
	 */
	public setRangeText(
		replacement: string,
		start: number = null,
		end: number = null,
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
	 * @returns "true" if the field is valid.
	 */
	public checkValidity(): boolean {
		return true;
	}

	/**
	 * Steps up.
	 *
	 * @param [increment] Increment.
	 */
	public stepUp(increment?: number): void {
		const newValue = HTMLInputElementValueStepping.step(this.type, this.value, 1, increment);
		if (newValue !== null) {
			this.value = newValue;
		}
	}

	/**
	 * Steps down.
	 *
	 * @param [increment] Increment.
	 */
	public stepDown(increment?: number): void {
		const newValue = HTMLInputElementValueStepping.step(this.type, this.value, -1, increment);
		if (newValue !== null) {
			this.value = newValue;
		}
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): IHTMLInputElement {
		const clone = <HTMLInputElement>super.cloneNode(deep);
		clone.formAction = this.formAction;
		clone.formMethod = this.formMethod;
		clone.formNoValidate = this.formNoValidate;
		clone._value = this._value;
		clone._height = this._height;
		clone._width = this._width;
		clone.defaultChecked = this.defaultChecked;
		clone.files = this.files.slice();
		clone._selectionStart = this._selectionStart;
		clone._selectionEnd = this._selectionEnd;
		clone._selectionDirection = this._selectionDirection;
		return clone;
	}

	/**
	 * Checks if private value is supported.
	 *
	 * @returns "true" if private value is supported.
	 */
	// Private _isPrivateValueSupported(): boolean {
	// 	Return (
	// 		This.type !== 'hidden' &&
	// 		This.type !== 'submit' &&
	// 		This.type !== 'image' &&
	// 		This.type !== 'reset' &&
	// 		This.type !== 'button' &&
	// 		This.type !== 'checkbox' &&
	// 		This.type !== 'radio' &&
	// 		This.type !== 'file'
	// 	);
	// }

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
