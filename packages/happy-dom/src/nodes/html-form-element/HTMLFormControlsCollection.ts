import INode from '../node/INode';
import IElement from '../element/IElement';
import IRadioNodeList from './IRadioNodeList';
import HTMLCollection from '../element/HTMLCollection';
import IHTMLFormControlsCollection from './IHTMLFormControlsCollection';
import RadioNodeList from './RadioNodeList';

/**
 * HTMLFormControlsCollection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection
 */
export default class HTMLFormControlsCollection
	extends HTMLCollection
	implements IHTMLFormControlsCollection<INode>
{
	/**
	 * Returns named item.
	 *
	 * @param name Name.
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
