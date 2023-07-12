import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement.js';
import HTMLInputElementSelectionModeEnum from './HTMLInputElementSelectionModeEnum.js';
import ValidityState from '../../validity-state/ValidityState.js';
import Event from '../../event/Event.js';
import File from '../../file/File.js';
import IFileList from './IFileList.js';
import INodeList from '../node/INodeList.js';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement.js';

/**
 * HTML Input Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement.
 */
export default interface IHTMLInputElement extends IHTMLElement {
	readonly form: IHTMLFormElement;
	readonly labels: INodeList<IHTMLLabelElement>;
	readonly validity: ValidityState;
	formAction: string;
	formMethod: string;
	formNoValidate: boolean;
	defaultChecked: boolean;
	files: IFileList<File>;
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
	willValidate: boolean;
	valueAsDate: Date | null;
	valueAsNumber: number;
	validationMessage: string;

	// Events
	oninput: (event: Event) => void | null;
	oninvalid: (event: Event) => void | null;
	onselectionchange: (event: Event) => void | null;

	/**
	 * Sets validation message.
	 *
	 * @param message Message.
	 */
	setCustomValidity(message: string): void;

	/**
	 * Reports validity by dispatching an "invalid" event.
	 */
	reportValidity(): void;

	/**
	 * Selects the text.
	 */
	select(): void;

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
	 * @param selectionMode
	 */
	setRangeText(
		replacement: string,
		start?: number,
		end?: number,
		selectionMode?: HTMLInputElementSelectionModeEnum
	): void;

	/**
	 * Checks validity.
	 *
	 * @returns "true" if the field is valid.
	 */
	checkValidity(): boolean;

	/**
	 * Steps up.
	 *
	 * @param [increment] Increment.
	 */
	stepUp(increment?: number): void;

	/**
	 * Steps up.
	 *
	 * @param [increment] Increment.
	 */
	stepDown(increment?: number): void;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLInputElement;
}
