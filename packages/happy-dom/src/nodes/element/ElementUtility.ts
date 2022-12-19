import NodeTypeEnum from '../node/NodeTypeEnum';
import IElement from './IElement';
import INode from '../node/INode';
import HTMLCollection from './HTMLCollection';
import IDocument from '../document/IDocument';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import IHTMLElement from '../html-element/IHTMLElement';

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
			if (node.parentNode && (<IHTMLElement>node.parentNode).children) {
				const index = (<IHTMLElement>node.parentNode).children.indexOf(<IHTMLElement>node);
				if (index !== -1) {
					(<HTMLCollection<IHTMLElement>>(<IHTMLElement>node.parentNode).children)._removeNamedItem(
						<IHTMLElement>node
					);
					(<IHTMLElement>node.parentNode).children.splice(index, 1);
				}
			}

			(<HTMLCollection<IHTMLElement>>(<IHTMLElement>node.parentNode).children)._appendNamedItem(
				<IHTMLElement>node
			);
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
				(<HTMLCollection<IHTMLElement>>(<IHTMLElement>node.parentNode).children)._removeNamedItem(
					<IHTMLElement>node
				);
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
			if (newNode.parentNode && (<IHTMLElement>newNode.parentNode).children) {
				const index = (<IHTMLElement>newNode.parentNode).children.indexOf(<IHTMLElement>newNode);
				if (index !== -1) {
					(<HTMLCollection<IHTMLElement>>(
						(<IHTMLElement>newNode.parentNode).children
					))._removeNamedItem(<IHTMLElement>newNode);
					(<IHTMLElement>newNode.parentNode).children.splice(index, 1);
				}
			}

			const index =
				referenceNode.nodeType === NodeTypeEnum.elementNode
					? parentElement.children.indexOf(<IElement>referenceNode)
					: -1;
			(<HTMLCollection<IHTMLElement>>parentElement.children)._appendNamedItem(
				<IHTMLElement>newNode
			);

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
