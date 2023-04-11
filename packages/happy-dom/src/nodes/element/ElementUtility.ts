import NodeTypeEnum from '../node/NodeTypeEnum';
import IElement from './IElement';
import INode from '../node/INode';
import HTMLCollection from './HTMLCollection';
import IDocument from '../document/IDocument';
import IDocumentFragment from '../document-fragment/IDocumentFragment';
import IHTMLElement from '../html-element/IHTMLElement';
import Element from './Element';

const NAMED_ITEM_ATTRIBUTES = ['id', 'name'];

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
		if (node.nodeType === NodeTypeEnum.elementNode && node !== parentElement) {
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
					(<HTMLCollection<IHTMLElement>>parentElement.children)._appendNamedItem(
						<IHTMLElement>node,
						(<Element>node)._attributes[attribute].value
					);
				}
			}

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
				for (const attribute of NAMED_ITEM_ATTRIBUTES) {
					if ((<Element>node)._attributes[attribute]) {
						(<HTMLCollection<IHTMLElement>>parentElement.children)._removeNamedItem(
							<IHTMLElement>node,
							(<Element>node)._attributes[attribute].value
						);
					}
				}
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
		if (newNode.nodeType === NodeTypeEnum.elementNode) {
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

			// Node.ts will call appendChild() for the scenario where "referenceNode" is "null"

			if (referenceNode) {
				if (referenceNode.nodeType === NodeTypeEnum.elementNode) {
					const index = parentElement.children.indexOf(<IElement>referenceNode);
					if (index !== -1) {
						parentElement.children.splice(index, 0, <IElement>newNode);
					}
				} else {
					for (const node of parentElement.childNodes) {
						if (node === referenceNode) {
							parentElement.children.push(<IElement>newNode);
						}
						if (node.nodeType === NodeTypeEnum.elementNode) {
							parentElement.children.push(<IElement>node);
						}
					}
				}
			}

			if (referenceNode || referenceNode === null) {
				for (const attribute of NAMED_ITEM_ATTRIBUTES) {
					if ((<Element>newNode)._attributes[attribute]) {
						(<HTMLCollection<IHTMLElement>>parentElement.children)._appendNamedItem(
							<IHTMLElement>newNode,
							(<Element>newNode)._attributes[attribute].value
						);
					}
				}
			}
		}
	}
}
