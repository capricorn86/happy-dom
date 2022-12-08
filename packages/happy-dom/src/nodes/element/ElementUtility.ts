import NodeTypeEnum from '../node/NodeTypeEnum';
import IElement from './IElement';
import INode from '../node/INode';
import HTMLCollection from './HTMLCollection';
import IDocument from '../document/IDocument';
import IDocumentFragment from '../document-fragment/IDocumentFragment';

/**
 * Element utility.
 */
export default class ElementUtility {
	/**
	 * Handles appending a child element to the "children" property.
	 *
	 * @param parentElement Parent element.
	 * @param node Node.
	 */
	public static appendChild(
		parentElement: IElement | IDocument | IDocumentFragment,
		node: INode
	): void {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node.nodeType === NodeTypeEnum.elementNode && node !== parentElement) {
			if (node.parentNode && node.parentNode['children']) {
				const index = node.parentNode['children'].indexOf(node);
				if (index !== -1) {
					node.parentNode['children']._removeNamedItem(node);
					node.parentNode['children'].splice(index, 1);
				}
			}

			node.parentNode['children']._appendNamedItem(node);
			parentElement.children.push(<IElement>node);
		}
	}

	/**
	 * Handles removing a child element from the "children" property.
	 *
	 * @param parentElement Parent element.
	 * @param node Node.
	 */
	public static removeChild(
		parentElement: IElement | IDocument | IDocumentFragment,
		node: INode
	): void {
		if (node.nodeType === NodeTypeEnum.elementNode) {
			const index = parentElement.children.indexOf(<IElement>node);
			if (index !== -1) {
				node.parentNode['children']._removeNamedItem(node);
				parentElement.children.splice(index, 1);
			}
		}
	}

	/**
	 *
	 * Handles inserting a child element to the "children" property.
	 *
	 * @param parentElement Parent element.
	 * @param newNode
	 * @param referenceNode
	 */
	public static insertBefore(
		parentElement: IElement | IDocument | IDocumentFragment,
		newNode: INode,
		referenceNode: INode | null
	): void {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode.nodeType === NodeTypeEnum.elementNode) {
			if (newNode.parentNode && newNode.parentNode['children']) {
				const index = newNode.parentNode['children'].indexOf(newNode);
				if (index !== -1) {
					newNode.parentNode['children']._removeNamedItem(newNode);
					newNode.parentNode['children'].splice(index, 1);
				}
			}

			const index =
				referenceNode.nodeType === NodeTypeEnum.elementNode
					? parentElement.children.indexOf(<IElement>referenceNode)
					: -1;
			(<HTMLCollection>(<unknown>parentElement.children))._appendNamedItem(newNode);

			if (index !== -1) {
				parentElement.children.splice(index, 0, <IElement>newNode);
			} else {
				parentElement.children.length = 0;

				for (const node of parentElement.childNodes) {
					if (node.nodeType === NodeTypeEnum.elementNode) {
						parentElement.children.push(<IElement>node);
					}
				}
			}
		}
	}
}
