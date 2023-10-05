import HTMLElement from '../html-element/HTMLElement.js';
import ValidityState from '../../validity-state/ValidityState.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Event from '../../event/Event.js';
import HTMLInputElementValueSanitizer from './HTMLInputElementValueSanitizer.js';
import HTMLInputElementSelectionModeEnum from './HTMLInputElementSelectionModeEnum.js';
import HTMLInputElementSelectionDirectionEnum from './HTMLInputElementSelectionDirectionEnum.js';
import IHTMLInputElement from './IHTMLInputElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import HTMLInputElementValueStepping from './HTMLInputElementValueStepping.js';
import FileList from './FileList.js';
import File from '../../file/File.js';
import IFileList from './IFileList.js';
import INode from '../node/INode.js';
import HTMLFormElement from '../html-form-element/HTMLFormElement.js';
import INodeList from '../node/INodeList.js';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement.js';
import EventPhaseEnum from '../../event/EventPhaseEnum.js';
import HTMLInputElementDateUtility from './HTMLInputElementDateUtility.js';
import HTMLLabelElementUtility from '../html-label-element/HTMLLabelElementUtility.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import HTMLInputElementNamedNodeMap from './HTMLInputElementNamedNodeMap.js';

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
	public override readonly attributes: INamedNodeMap = new HTMLInputElementNamedNodeMap(this);

	// Related to parent form.
	public formAction = '';
	public formMethod = '';

	// Any type of input
	public _value = null;
	public _height = 0;
	public _width = 0;

	// Type specific: checkbox/radio
	public defaultChecked = false;
	public _checked: boolean | null = null;

	// Type specific: file
	public files: IFileList<File> = new FileList();

	// All fields
	public readonly validationMessage = '';
	public readonly validity = new ValidityState(this);

	// Events
	public oninput: (event: Event) => void | null = null;
	public oninvalid: (event: Event) => void | null = null;
	public onselectionchange: (event: Event) => void | null = null;

	// Type specific: text/password/search/tel/url/week/month
	private _selectionStart: number = null;
	private _selectionEnd: number = null;
	private _selectionDirection: HTMLInputElementSelectionDirectionEnum =
		HTMLInputElementSelectionDirectionEnum.none;

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
		this.setAttribute('height', String(height));
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
		this.setAttribute('width', String(width));
	}

	/**
	 * Returns size.
	 *
	 * @returns Size.
	 */
	public get size(): number {
		const size = this.getAttribute('size');
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
		this.setAttribute('size', String(size));
	}

	/**
	 * Returns minlength.
	 *
	 * @returns Min length.
	 */
	public get minLength(): number {
		const minLength = this.getAttribute('minlength');
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
		this.setAttribute('minlength', String(minlength));
	}

	/**
	 * Returns maxlength.
	 *
	 * @returns Max length.
	 */
	public get maxLength(): number {
		const maxLength = this.getAttribute('maxlength');
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
		this.setAttribute('maxlength', String(maxLength));
	}

	/**
	 * Returns type.
	 *
	 * @returns Type. Defaults to "text".
	 */
	public get type(): string {
		return this.getAttribute('type') || 'text';
	}

	/**
	 * Sets type.
	 *
	 * @param type Type.
	 */
	public set type(type: string) {
		this.setAttribute('type', type.toLowerCase());
	}

	/**
	 * Returns name.
	 *
	 * @returns Name.
	 */
	public get name(): string {
		return this.getAttribute('name') || '';
	}

	/**
	 * Sets name.
	 *
	 * @param name Name.
	 */
	public set name(name: string) {
		this.setAttribute('name', name);
	}

	/**
	 * Returns alt.
	 *
	 * @returns Alt.
	 */
	public get alt(): string {
		return this.getAttribute('alt') || '';
	}

	/**
	 * Sets alt.
	 *
	 * @param alt Alt.
	 */
	public set alt(alt: string) {
		this.setAttribute('alt', alt);
	}

	/**
	 * Returns min.
	 *
	 * @returns Min.
	 */
	public get min(): string {
		return this.getAttribute('min') || '';
	}

	/**
	 * Sets min.
	 *
	 * @param min Min.
	 */
	public set min(min: string) {
		this.setAttribute('min', min);
	}

	/**
	 * Returns max.
	 *
	 * @returns Max.
	 */
	public get max(): string {
		return this.getAttribute('max') || '';
	}

	/**
	 * Sets max.
	 *
	 * @param max Max.
	 */
	public set max(max: string) {
		this.setAttribute('max', max);
	}

	/**
	 * Returns pattern.
	 *
	 * @returns Pattern.
	 */
	public get pattern(): string {
		return this.getAttribute('pattern') || '';
	}

	/**
	 * Sets pattern.
	 *
	 * @param pattern Pattern.
	 */
	public set pattern(pattern: string) {
		this.setAttribute('pattern', pattern);
	}

	/**
	 * Returns placeholder.
	 *
	 * @returns Placeholder.
	 */
	public get placeholder(): string {
		return this.getAttribute('placeholder') || '';
	}

	/**
	 * Sets placeholder.
	 *
	 * @param placeholder Placeholder.
	 */
	public set placeholder(placeholder: string) {
		this.setAttribute('placeholder', placeholder);
	}

	/**
	 * Returns step.
	 *
	 * @returns Step.
	 */
	public get step(): string {
		return this.getAttribute('step') || '';
	}

	/**
	 * Sets step.
	 *
	 * @param step Step.
	 */
	public set step(step: string) {
		this.setAttribute('step', step);
	}

	/**
	 * Returns inputmode.
	 *
	 * @returns Inputmode.
	 */
	public get inputmode(): string {
		return this.getAttribute('inputmode') || '';
	}

	/**
	 * Sets inputmode.
	 *
	 * @param inputmode Inputmode.
	 */
	public set inputmode(inputmode: string) {
		this.setAttribute('inputmode', inputmode);
	}

	/**
	 * Returns accept.
	 *
	 * @returns Accept.
	 */
	public get accept(): string {
		return this.getAttribute('accept') || '';
	}

	/**
	 * Sets accept.
	 *
	 * @param accept Accept.
	 */
	public set accept(accept: string) {
		this.setAttribute('accept', accept);
	}

	/**
	 * Returns allowdirs.
	 *
	 * @returns Allowdirs.
	 */
	public get allowdirs(): string {
		return this.getAttribute('allowdirs') || '';
	}

	/**
	 * Sets allowdirs.
	 *
	 * @param allowdirs Allowdirs.
	 */
	public set allowdirs(allowdirs: string) {
		this.setAttribute('allowdirs', allowdirs);
	}

	/**
	 * Returns autocomplete.
	 *
	 * @returns Autocomplete.
	 */
	public get autocomplete(): string {
		return this.getAttribute('autocomplete') || '';
	}

	/**
	 * Sets autocomplete.
	 *
	 * @param autocomplete Autocomplete.
	 */
	public set autocomplete(autocomplete: string) {
		this.setAttribute('autocomplete', autocomplete);
	}

	/**
	 * Returns src.
	 *
	 * @returns Src.
	 */
	public get src(): string {
		return this.getAttribute('src') || '';
	}

	/**
	 * Sets src.
	 *
	 * @param src Src.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
	}

	/**
	 * Returns defaultValue.
	 *
	 * @returns Defaultvalue.
	 */
	public get defaultValue(): string {
		return this.getAttribute('value') || '';
	}

	/**
	 * Sets defaultValue.
	 *
	 * @param defaultValue Defaultvalue.
	 */
	public set defaultValue(defaultValue: string) {
		this.setAttribute('value', defaultValue);
	}

	/**
	 * Returns read only.
	 *
	 * @returns Read only.
	 */
	public get readOnly(): boolean {
		return this.getAttribute('readonly') !== null;
	}

	/**
	 * Sets read only.
	 *
	 * @param readOnly Read only.
	 */
	public set readOnly(readOnly: boolean) {
		if (!readOnly) {
			this.removeAttribute('readonly');
		} else {
			this.setAttribute('readonly', '');
		}
	}

	/**
	 * Returns disabled.
	 *
	 * @returns Disabled.
	 */
	public get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	/**
	 * Sets disabled.
	 *
	 * @param disabled Disabled.
	 */
	public set disabled(disabled: boolean) {
		if (!disabled) {
			this.removeAttribute('disabled');
		} else {
			this.setAttribute('disabled', '');
		}
	}

	/**
	 * Returns autofocus.
	 *
	 * @returns Autofocus.
	 */
	public get autofocus(): boolean {
		return this.getAttribute('autofocus') !== null;
	}

	/**
	 * Sets autofocus.
	 *
	 * @param autofocus Autofocus.
	 */
	public set autofocus(autofocus: boolean) {
		if (!autofocus) {
			this.removeAttribute('autofocus');
		} else {
			this.setAttribute('autofocus', '');
		}
	}

	/**
	 * Returns required.
	 *
	 * @returns Required.
	 */
	public get required(): boolean {
		return this.getAttribute('required') !== null;
	}

	/**
	 * Sets required.
	 *
	 * @param required Required.
	 */
	public set required(required: boolean) {
		if (!required) {
			this.removeAttribute('required');
		} else {
			this.setAttribute('required', '');
		}
	}

	/**
	 * Returns indeterminate.
	 *
	 * @returns Indeterminate.
	 */
	public get indeterminate(): boolean {
		return this.getAttribute('indeterminate') !== null;
	}

	/**
	 * Sets indeterminate.
	 *
	 * @param indeterminate Indeterminate.
	 */
	public set indeterminate(indeterminate: boolean) {
		if (!indeterminate) {
			this.removeAttribute('indeterminate');
		} else {
			this.setAttribute('indeterminate', '');
		}
	}

	/**
	 * Returns multiple.
	 *
	 * @returns Multiple.
	 */
	public get multiple(): boolean {
		return this.getAttribute('multiple') !== null;
	}

	/**
	 * Sets multiple.
	 *
	 * @param multiple Multiple.
	 */
	public set multiple(multiple: boolean) {
		if (!multiple) {
			this.removeAttribute('multiple');
		} else {
			this.setAttribute('multiple', '');
		}
	}

	/**
	 * Returns checked.
	 *
	 * @returns Checked.
	 */
	public get checked(): boolean {
		if (this._checked !== null) {
			return this._checked;
		}
		return this.getAttribute('checked') !== null;
	}

	/**
	 * Sets checked.
	 *
	 * @param checked Checked.
	 */
	public set checked(checked: boolean) {
		this._setChecked(checked);
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
				return this.getAttribute('value') || '';
			case 'checkbox':
			case 'radio':
				const attritube = this.getAttribute('value');
				return attritube !== null ? attritube : 'on';
			case 'file':
				return this.files.length > 0 ? '/fake/path/' + this.files[0].name : '';
		}

		if (this._value === null) {
			return this.getAttribute('value') || '';
		}

		return this._value;
	}

	/**
	 * Sets value.
	 *
	 * @param value Value.
	 */
	public set value(value: string) {
		// The value maybe not string, so we need to convert it to string
		value = String(value);
		switch (this.type) {
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
	 * Returns no validate.
	 *
	 * @returns No validate.
	 */
	public get formNoValidate(): boolean {
		return this.getAttribute('formnovalidate') !== null;
	}

	/**
	 * Sets no validate.
	 *
	 * @param formNoValidate No validate.
	 */
	public set formNoValidate(formNoValidate: boolean) {
		if (!formNoValidate) {
			this.removeAttribute('formnovalidate');
		} else {
			this.setAttribute('formnovalidate', '');
		}
	}

	/**
	 * Returns the parent form element.
	 *
	 * @returns Form.
	 */
	public get form(): IHTMLFormElement {
		return <IHTMLFormElement>this._formNode;
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
		switch (this.type) {
			case 'date':
			case 'month':
				return isNaN(new Date(String(this.value)).getTime()) ? null : new Date(this.value);
			case 'week': {
				const d = HTMLInputElementDateUtility.isoWeekDate(this.value);
				return isNaN(d.getTime()) ? null : d;
			}
			case 'time': {
				const d = new Date(`1970-01-01T${this.value}Z`);
				return isNaN(d.getTime()) ? null : d;
			}
			default:
				return null;
		}
	}

	/**
	 * Sets value from a Date.
	 *
	 * @param value Date.
	 */
	public set valueAsDate(value: Date | null) {
		// Specs at https://html.spec.whatwg.org/multipage/input.html#dom-input-valueasdate
		if (!['date', 'month', 'time', 'week'].includes(this.type)) {
			throw new DOMException(
				"Failed to set the 'valueAsDate' property on 'HTMLInputElement': This input element does not support Date values.",
				DOMExceptionNameEnum.invalidStateError
			);
		}
		if (typeof value !== 'object') {
			throw new TypeError(
				"Failed to set the 'valueAsDate' property on 'HTMLInputElement': Failed to convert value to 'object'."
			);
		} else if (value && !(value instanceof Date)) {
			throw new TypeError(
				"Failed to set the 'valueAsDate' property on 'HTMLInputElement': The provided value is not a Date."
			);
		} else if (value === null || isNaN(value.getTime())) {
			this.value = '';
			return;
		}
		switch (this.type) {
			case 'date':
				this.value = value.toISOString().split('T')[0];
				break;
			case 'month':
				this.value = value.toISOString().split('T')[0].slice(0, -3);
				break;
			case 'time':
				this.value = value.toISOString().split('T')[1].slice(0, 5);
				break;
			case 'week':
				this.value = HTMLInputElementDateUtility.dateIsoWeek(value);
				break;
		}
	}

	/**
	 * Returns value as number.
	 *
	 * @returns Number.
	 */
	public get valueAsNumber(): number {
		const value = this.value;
		if (!this.type.match(/^(range|number|date|datetime-local|month|time|week)$/) || !value) {
			return NaN;
		}
		switch (this.type) {
			case 'number':
				return parseFloat(value);
			case 'range': {
				const number = parseFloat(value);
				const min = parseFloat(this.min) || 0;
				const max = parseFloat(this.max) || 100;
				if (isNaN(number)) {
					return max < min ? min : (min + max) / 2;
				} else if (number < min) {
					return min;
				} else if (number > max) {
					return max;
				}
				return number;
			}
			case 'date':
				return new Date(value).getTime();
			case 'datetime-local':
				return new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000;
			case 'month':
				return (new Date(value).getUTCFullYear() - 1970) * 12 + new Date(value).getUTCMonth();
			case 'time':
				return (
					new Date('1970-01-01T' + value).getTime() - new Date('1970-01-01T00:00:00').getTime()
				);
			case 'week': {
				// https://html.spec.whatwg.org/multipage/input.html#week-state-(type=week)
				const match = value.match(/^(\d{4})-W(\d{2})$/);
				if (!match) {
					return NaN;
				}
				const d = new Date(Date.UTC(parseInt(match[1], 10), 0));
				const day = d.getUTCDay();
				const diff = ((day === 0 ? -6 : 1) - day) * 86400000 + parseInt(match[2], 10) * 604800000;
				return d.getTime() + diff;
			}
		}
	}

	/**
	 * Sets value from a number.
	 *
	 * @param value number.
	 */
	public set valueAsNumber(value: number) {
		// Specs at https://html.spec.whatwg.org/multipage/input.html
		switch (this.type) {
			case 'number':
			case 'range':
				// We Rely on HTMLInputElementValueSanitizer
				this.value = Number(value).toString();
				break;
			case 'date':
			case 'datetime-local': {
				const d = new Date(Number(value));
				if (isNaN(d.getTime())) {
					// Reset to default value
					this.value = '';
					break;
				}
				if (this.type == 'date') {
					this.value = d.toISOString().slice(0, 10);
				} else {
					this.value = d.toISOString().slice(0, -1);
				}
				break;
			}
			case 'month':
				if (!Number.isInteger(value) || value < 0) {
					this.value = '';
				} else {
					this.value = new Date(Date.UTC(1970, Number(value))).toISOString().slice(0, 7);
				}
				break;
			case 'time':
				if (!Number.isInteger(value) || value < 0) {
					this.value = '';
				} else {
					this.value = new Date(Number(value)).toISOString().slice(11, -1);
				}
				break;
			case 'week':
			case 'week': {
				const d = new Date(Number(value));
				this.value = isNaN(d.getTime()) ? '' : HTMLInputElementDateUtility.dateIsoWeek(d);
				break;
			}
			default:
				throw new DOMException(
					"Failed to set the 'valueAsNumber' property on 'HTMLInputElement': This input element does not support Number values.",
					DOMExceptionNameEnum.invalidStateError
				);
		}
	}

	/**
	 * Returns the associated label elements.
	 *
	 * @returns Label elements.
	 */
	public get labels(): INodeList<IHTMLLabelElement> {
		return HTMLLabelElementUtility.getAssociatedLabelElements(this);
	}

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	public setCustomValidity(message: string): void {
		(<string>this.validationMessage) = String(message);
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
		const valid =
			this.disabled ||
			this.readOnly ||
			this.type === 'hidden' ||
			this.type === 'reset' ||
			this.type === 'button' ||
			this.validity.valid;
		if (!valid) {
			this.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
		}
		return valid;
	}

	/**
	 * Reports validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	public reportValidity(): boolean {
		return this.checkValidity();
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
		clone._value = this._value;
		clone._height = this._height;
		clone._width = this._width;
		clone.defaultChecked = this.defaultChecked;
		clone.files = <FileList>this.files.slice();
		clone._selectionStart = this._selectionStart;
		clone._selectionEnd = this._selectionEnd;
		clone._selectionDirection = this._selectionDirection;
		return clone;
	}

	/**
	 * @override
	 */
	public override dispatchEvent(event: Event): boolean {
		// Do nothing if the input element is disabled and the event is a click event.
		if (event.type === 'click' && event.eventPhase === EventPhaseEnum.none && this.disabled) {
			return false;
		}

		let previousCheckedValue: boolean | null = null;

		// The checkbox or radio button has to be checked before the click event is dispatched, so that event listeners can check the checked value.
		// However, the value has to be restored if preventDefault() is called on the click event.
		if (
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			event.type === 'click'
		) {
			const inputType = this.type;
			if (inputType === 'checkbox' || inputType === 'radio') {
				previousCheckedValue = this.checked;
				this._setChecked(inputType === 'checkbox' ? !previousCheckedValue : true);
			}
		}

		const returnValue = super.dispatchEvent(event);

		if (
			!event.defaultPrevented &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			event.type === 'click' &&
			this.isConnected
		) {
			const inputType = this.type;
			if (!this.readOnly || inputType === 'checkbox' || inputType === 'radio') {
				if (inputType === 'checkbox' || inputType === 'radio') {
					this.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
					this.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
				} else if (inputType === 'submit') {
					const form = <IHTMLFormElement>this._formNode;
					if (form) {
						form.requestSubmit();
					}
				} else if (inputType === 'reset' && this.isConnected) {
					const form = <IHTMLFormElement>this._formNode;
					if (form) {
						form.reset();
					}
				}
			}
		}

		// Restore checked state if preventDefault() is triggered on the click event.
		if (
			event.defaultPrevented &&
			(event.eventPhase === EventPhaseEnum.atTarget ||
				event.eventPhase === EventPhaseEnum.bubbling) &&
			event.type === 'click' &&
			previousCheckedValue !== null
		) {
			const inputType = this.type;
			if (inputType === 'checkbox' || inputType === 'radio') {
				this._setChecked(previousCheckedValue);
			}
		}

		return returnValue;
	}

	/**
	 * @override
	 */
	public override _connectToNode(parentNode: INode = null): void {
		const oldFormNode = <HTMLFormElement>this._formNode;

		super._connectToNode(parentNode);

		if (oldFormNode !== this._formNode) {
			if (oldFormNode) {
				oldFormNode._removeFormControlItem(this, this.name);
				oldFormNode._removeFormControlItem(this, this.id);
			}
			if (this._formNode) {
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.name);
				(<HTMLFormElement>this._formNode)._appendFormControlItem(this, this.id);
			}
		}
	}

	/**
	 * Checks is selection is supported.
	 *
	 * @returns "true" if selection is supported.
	 */
	private _isSelectionSupported(): boolean {
		const inputType = this.type;
		return (
			inputType === 'text' ||
			inputType === 'search' ||
			inputType === 'url' ||
			inputType === 'tel' ||
			inputType === 'password'
		);
	}

	/**
	 * Sets checked value.
	 *
	 * @param checked Checked.
	 */
	private _setChecked(checked: boolean): void {
		this._checked = checked;

		if (checked && this.type === 'radio' && this.name) {
			const root = <IHTMLElement>(<IHTMLFormElement>this._formNode || this.getRootNode());
			const radioButtons = root.querySelectorAll(`input[type="radio"][name="${this.name}"]`);

			for (const radioButton of radioButtons) {
				if (radioButton !== this) {
					radioButton['_checked'] = false;
				}
			}
		}
	}
}
