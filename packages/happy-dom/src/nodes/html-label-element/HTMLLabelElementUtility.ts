import Document from '../document/Document.js';
import HTMLElement from '../html-element/HTMLElement.js';
import HTMLLabelElement from './HTMLLabelElement.js';
import NodeList from '../node/NodeList.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import INodeList from '../node/INodeList.js';

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
	public static getAssociatedLabelElements(element: HTMLElement): INodeList<HTMLLabelElement> {
		const id = element.id;
		let labels: INodeList<HTMLLabelElement>;
		if (id && element[PropertySymbol.isConnected]) {
			const rootNode =
				<Document | ShadowRoot>element[PropertySymbol.rootNode] ||
				element[PropertySymbol.ownerDocument];
			labels = <INodeList<HTMLLabelElement>>rootNode.querySelectorAll(`label[for="${id}"]`);
		} else {
			labels = new NodeList<HTMLLabelElement>();
		}

		let parent = element[PropertySymbol.parentNode];
		while (parent) {
			if (parent['tagName'] === 'LABEL') {
				labels[PropertySymbol.addItem](<HTMLLabelElement>parent);
				break;
			}
			parent = parent[PropertySymbol.parentNode];
		}

		return labels;
	}
}
