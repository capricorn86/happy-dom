import INodeList from '../node/INodeList.js';
import THTMLFormControlElement from './THTMLFormControlElement.js';

export default interface IRadioNodeList extends INodeList<THTMLFormControlElement> {
	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	readonly value: string;
}
