import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import HTMLInputElementSelectionModeEnum from '../html-input-element/HTMLInputElementSelectionModeEnum';

/**
 * HTML Text Area Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement
 */
export default interface IHTMLTextAreaElement extends IHTMLElement {
	readonly type: string;
	defaultValue: string;
	minLength: number;
	maxLength: number;
	name: string;
	placeholder: string;
	inputmode: string;
	cols: string;
	rows: string;
	autocomplete: string;
	readOnly: boolean;
	disabled: boolean;
	autofocus: boolean;
	required: boolean;
	value: string;
	selectionStart: number;
	selectionEnd: number;
	selectionDirection: string;
	form: IHTMLFormElement;
	textLength: number;

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
	cloneNode(deep: boolean): IHTMLTextAreaElement;
}
