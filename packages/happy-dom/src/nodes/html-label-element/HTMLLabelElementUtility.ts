import IDocument from '../document/IDocument.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLLabelElement from './IHTMLLabelElement.js';
import INodeList from '../node/INodeList.js';
import NodeList from '../node/NodeList.js';
import IShadowRoot from '../shadow-root/IShadowRoot.js';

/**
 * Utility for finding labels associated with a form element.
 */
export default class HTMLLabelElementUtility {
	/**
	 * Returns label elements for a form element.
	 *
	 * @param element Element to get labels for.
	 * @returns Label elements.
	 */
	public static getAssociatedLabelElements(element: IHTMLElement): INodeList<IHTMLLabelElement> {
		const id = element.id;
		let labels: INodeList<IHTMLLabelElement>;
		if (id) {
			const rootNode = <IDocument | IShadowRoot>element.getRootNode();
			labels = <INodeList<IHTMLLabelElement>>rootNode.querySelectorAll(`label[for="${id}"]`);
		} else {
			labels = new NodeList<IHTMLLabelElement>();
		}

		let parent = element.parentNode;
		while (parent) {
			if (parent['tagName'] === 'LABEL') {
				labels.push(<IHTMLLabelElement>parent);
				break;
			}
			parent = parent.parentNode;
		}

		return labels;
	}
}
