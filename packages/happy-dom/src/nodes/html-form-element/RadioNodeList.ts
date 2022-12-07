import INode from '../node/INode';
import NodeList from '../node/NodeList';
import IRadioNodeList from './IRadioNodeList';

/**
 * RadioNodeList
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/RadioNodeList
 */
export default class RadioNodeList extends NodeList implements IRadioNodeList<INode> {
	/**
	 * Returns value.
	 *
	 * @returns Value.
	 */
	public get value(): string {
		for (const node of this) {
			if (node.checked) {
				return node.value;
			}
		}
		return null;
	}
}
