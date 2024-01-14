import IElement from '../element/IElement.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import INonDocumentTypeChildNode from './INonDocumentTypeChildNode.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Non Document Child node utility.
 */
export default class NonDocumentChildNodeUtility {
	/**
	 * Previous element sibling.
	 *
	 * @param childNode Child node.
	 * @returns Element.
	 */
	public static previousElementSibling(childNode: INonDocumentTypeChildNode): IElement {
		let sibling = childNode.previousSibling;
		while (sibling && sibling[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode) {
			sibling = sibling.previousSibling;
		}
		return <IElement>sibling;
	}

	/**
	 * Next element sibling.
	 *
	 * @param childNode Child node.
	 * @returns Element.
	 */
	public static nextElementSibling(childNode: INonDocumentTypeChildNode): IElement {
		let sibling = childNode.nextSibling;
		while (sibling && sibling[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode) {
			sibling = sibling.nextSibling;
		}
		return <IElement>sibling;
	}
}
