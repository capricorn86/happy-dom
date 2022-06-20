import IHTMLElement from '../html-element/IHTMLElement';
import IHTMLFormElement from '../html-form-element/IHTMLFormElement';
import IHTMLLabelElement from '../html-label-element/IHTMLLabelElement';
import INodeList from '../node/INodeList';
import IHTMLOptionsCollection from '../html-option-element/IHTMLOptionsCollection';
import ValidityState from '../validity-state/ValidityState';

/**
 * HTML Select Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement.
 */
export default interface IHTMLSelectElement extends IHTMLElement {
	readonly form: IHTMLFormElement;
	readonly labels: INodeList<IHTMLLabelElement>;
	type: string;
	autofocus: boolean;
	disabled: boolean;
	options: IHTMLOptionsCollection;
	selectedIndex: number;
	validity: ValidityState;
	value: string;
	willValidate: boolean;
	name: string;
	multiple: boolean;
}
