import INode from '../node/INode';
import IElement from '../element/IElement';
import IRadioNodeList from './IRadioNodeList';
import RadioNodeList from './RadioNodeList';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection
	extends Array
	implements IHTMLFormControlsCollection<INode>
{
	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): INode {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): IElement | IRadioNodeList<INode> {
		const radioNodeList: IRadioNodeList<INode> = new RadioNodeList();

		for (const node of this) {
			if (node.type === 'radio' && node.name === name) {
				radioNodeList.push(node);
			} else if (node.name === name) {
				return <IElement>node;
			}
		}

		return radioNodeList.length > 0 ? radioNodeList : null;
	}
}
