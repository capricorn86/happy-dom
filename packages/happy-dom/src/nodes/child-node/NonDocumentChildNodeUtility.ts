import Element from '../element/Element.js';
import IElement from '../element/IElement.js';
import INonDocumentTypeChildNode from './INonDocumentTypeChildNode.js';

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
		while (sibling && sibling.nodeType !== Element.ELEMENT_NODE) {
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
		while (sibling && sibling.nodeType !== Element.ELEMENT_NODE) {
			sibling = sibling.nextSibling;
		}
		return <IElement>sibling;
	}
}
