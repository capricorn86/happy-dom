import File from '../../file/File';
import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import HTMLInputElementSelectionModeEnum from './HTMLInputElementSelectionModeEnum';
import ValidityState from './ValidityState';

/**
 * HTML Input Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
 */
export default interface IHTMLInputElement extends IHTMLElement {
	formAction: string;
	formMethod: string;
	formNoValidate: boolean;
	defaultChecked: boolean;
	files: File[];
	defaultValue: string;
	height: number;
	width: number;
	size: number;
	minLength: number;
	maxLength: number;
	type: string;
	name: string;
	alt: string;
	min: string;
	max: string;
	pattern: string;
	placeholder: string;
	step: string;
	inputmode: string;
	accept: string;
	allowdirs: string;
	autocomplete: string;
	src: string;
	defaultvalue: string;
	readOnly: boolean;
	disabled: boolean;
	autofocus: boolean;
	required: boolean;
	indeterminate: boolean;
	multiple: boolean;
	checked: boolean;
	value: string;
	selectionStart: number;
	selectionEnd: number;
	selectionDirection: string;
	form: IHTMLFormElement;
	validity: ValidityState;
	validationMessage: string;
	willValidate: boolean;
	valueAsDate: Date;
	valueAsNumber: number;

	/**
	 * Set selection range.
	 *
	 * @param start Start.
	 * @param end End.
	 * @param [direction="none"] Direction.
	 */
	setSelectionRange(start: number, end: number, direction: string): void;

	/**
	 * Set range text.
	 *
	 * @param replacement Replacement.
	 * @param [start] Start.
	 * @param [end] End.
	 * @param [direction] Direction.
	 */
	setRangeText(
		replacement: string,
		start: number,
		end: number,
		selectionMode: HTMLInputElementSelectionModeEnum
	): void;

	/**
	 * Checks validity.
	 *
	 * @return "true" if the field is valid.
	 */
	checkValidity(): boolean;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	cloneNode(deep: boolean): IHTMLInputElement;
}
