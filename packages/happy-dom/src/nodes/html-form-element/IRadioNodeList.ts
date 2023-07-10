import IElement from '../element/IElement.js';
import INodeList from '../node/INodeList.js';

/**
 * RadioNodeList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RadioNodeList
 */
export default interface IRadioNodeList extends INodeList<IElement> {
	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	readonly value: string;
}
