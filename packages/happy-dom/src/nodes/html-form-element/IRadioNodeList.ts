import INodeList from '../node/INodeList';

/**
 * RadioNodeList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RadioNodeList
 */
export default interface IRadioNodeList<T> extends INodeList<T> {
	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	readonly value: string;
}
