import IElement from '../element/IElement';
import INodeList from '../node/INodeList';

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
