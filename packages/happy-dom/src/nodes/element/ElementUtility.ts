import NodeTypeEnum from '../node/NodeTypeEnum';
import IElement from './IElement';
import INode from '../node/INode';
import HTMLCollection from './HTMLCollection';
import IDocument from '../document/IDocument';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import IHTMLElement from '../html-element/IHTMLElement';
import Element from './Element';
import NodeUtility from '../node/NodeUtility';
import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';

const NAMED_ITEM_ATTRIBUTES = ['id', 'name'];

/**
 * Element utility.
 */
export default class ElementUtility {
	/**
	 * Handles appending a child element to the "children" property.
	 *
	 * @param ancestorNode Ancestor node.
	 * @param node Node to append.
	 * @param [options] Options.
	 * @param [options.disableAncestorValidation] Disables validation for checking if the node is an ancestor of the ancestorNode.
	 * @returns Appended node.
	 */
	public static appendChild(
		ancestorNode: IElement | IDocument | IDocumentFragment,
		node: INode,
		options?: { disableAncestorValidation?: boolean }
	): INode {
		if (node.nodeType === NodeTypeEnum.elementNode && node !== ancestorNode) {
			if (
				!options?.disableAncestorValidation &&
				NodeUtility.isInclusiveAncestor(node, ancestorNode)
			) {
				throw new DOMException(
					"Failed to execute 'appendChild' on 'Node': The new node is a parent of the node to insert to.",
					DOMExceptionNameEnum.domException
				);
			}

			if (node.parentNode && (<IHTMLElement>node.parentNode).children) {
				const index = (<IHTMLElement>node.parentNode).children.indexOf(<IHTMLElement>node);
				if (index !== -1) {
					for (const attribute of NAMED_ITEM_ATTRIBUTES) {
						if ((<Element>node)._attributes[attribute]) {
							(<HTMLCollection<IHTMLElement>>(<IElement>node.parentNode).children)._removeNamedItem(
								<IHTMLElement>node,
								(<Element>node)._attributes[attribute].value
							);
						}
					}
					(<IHTMLElement>node.parentNode).children.splice(index, 1);
				}
			}

			for (const attribute of NAMED_ITEM_ATTRIBUTES) {
				if ((<Element>node)._attributes[attribute]) {
					(<HTMLCollection<IHTMLElement>>ancestorNode.children)._appendNamedItem(
						<IHTMLElement>node,
						(<Element>node)._attributes[attribute].value
					);
				}
			}

			ancestorNode.children.push(<IElement>node);

			NodeUtility.appendChild(ancestorNode, node, { disableAncestorValidation: true });
		} else {
			NodeUtility.appendChild(ancestorNode, node, options);
		}

		return node;
	}

	/**
	 * Handles removing a child element from the "children" property.
	 *
	 * @param ancestorNode Ancestor node.
	 * @param node Node.
	 * @returns Removed node.
	 */
	public static removeChild(
		ancestorNode: IElement | IDocument | IDocumentFragment,
		node: INode
	): INode {
		if (node.nodeType === NodeTypeEnum.elementNode) {
			const index = ancestorNode.children.indexOf(<IElement>node);
			if (index !== -1) {
				for (const attribute of NAMED_ITEM_ATTRIBUTES) {
					if ((<Element>node)._attributes[attribute]) {
						(<HTMLCollection<IHTMLElement>>ancestorNode.children)._removeNamedItem(
							<IHTMLElement>node,
							(<Element>node)._attributes[attribute].value
						);
					}
				}
				ancestorNode.children.splice(index, 1);
			}
		}

		NodeUtility.removeChild(ancestorNode, node);

		return node;
	}

	/**
	 *
	 * Handles inserting a child element to the "children" property.
	 *
	 * @param ancestorNode Ancestor node.
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @param [options] Options.
	 * @param [options.disableAncestorValidation] Disables validation for checking if the node is an ancestor of the ancestorNode.
	 * @returns Inserted node.
	 */
	public static insertBefore(
		ancestorNode: IElement | IDocument | IDocumentFragment,
		newNode: INode,
		referenceNode: INode | null,
		options?: { disableAncestorValidation?: boolean }
	): INode {
		// NodeUtility.insertBefore() will call appendChild() for the scenario where "referenceNode" is "null" or "undefined"
		if (newNode.nodeType === NodeTypeEnum.elementNode && referenceNode) {
			if (
				!options?.disableAncestorValidation &&
				NodeUtility.isInclusiveAncestor(newNode, ancestorNode)
			) {
				throw new DOMException(
					"Failed to execute 'insertBefore' on 'Node': The new node is a parent of the node to insert to.",
					DOMExceptionNameEnum.domException
				);
			}

			if (newNode.parentNode && (<IHTMLElement>newNode.parentNode).children) {
				const index = (<IHTMLElement>newNode.parentNode).children.indexOf(<IHTMLElement>newNode);
				if (index !== -1) {
					for (const attribute of NAMED_ITEM_ATTRIBUTES) {
						if ((<Element>newNode)._attributes[attribute]) {
							(<HTMLCollection<IHTMLElement>>(
								(<IElement>newNode.parentNode).children
							))._removeNamedItem(
								<IHTMLElement>newNode,
								(<Element>newNode)._attributes[attribute].value
							);
						}
					}

					(<IElement>newNode.parentNode).children.splice(index, 1);
				}
			}

			if (referenceNode.nodeType === NodeTypeEnum.elementNode) {
				const index = ancestorNode.children.indexOf(<IElement>referenceNode);
				if (index !== -1) {
					ancestorNode.children.splice(index, 0, <IElement>newNode);
				}
			} else {
				ancestorNode.children.length = 0;

				for (const node of ancestorNode.childNodes) {
					if (node === referenceNode) {
						ancestorNode.children.push(<IElement>newNode);
					}
					if (node.nodeType === NodeTypeEnum.elementNode) {
						ancestorNode.children.push(<IElement>node);
					}
				}
			}

			for (const attribute of NAMED_ITEM_ATTRIBUTES) {
				if ((<Element>newNode)._attributes[attribute]) {
					(<HTMLCollection<IHTMLElement>>ancestorNode.children)._appendNamedItem(
						<IHTMLElement>newNode,
						(<Element>newNode)._attributes[attribute].value
					);
				}
			}

			NodeUtility.insertBefore(ancestorNode, newNode, referenceNode, {
				disableAncestorValidation: true
			});
		} else {
			NodeUtility.insertBefore(ancestorNode, newNode, referenceNode, options);
		}

		return newNode;
	}
}
