import IText from '../text/IText';
import IComment from '../comment/IComment';
import INode from './INode';
import NodeTypeEnum from './NodeTypeEnum';
import IElement from '../element/IElement';
import IDocumentType from '../document-type/IDocumentType';
import IAttr from '../attr/IAttr';
import IProcessingInstruction from '../processing-instruction/IProcessingInstruction';

/**
 * Node utility.
 */
export default class NodeUtility {
	/**
	 * Returns boolean indicating if nodeB is an inclusive ancestor of nodeA.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
	 * @param ancestorNode Ancestor node.
	 * @param referenceNode Reference node.
	 * @returns "true" if following.
	 */
	public static isInclusiveAncestor(ancestorNode: INode, referenceNode: INode): boolean {
		let parent: INode = referenceNode;
		while (parent) {
			if (ancestorNode === parent) {
				return true;
			}
			parent = parent.parentNode;
		}
		return false;
	}

	/**
	 * Returns boolean indicating if nodeB is following nodeA in the document tree.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-tree-following
	 * @param nodeA Node A.
	 * @param nodeB Node B.
	 * @returns "true" if following.
	 */
	public static isFollowing(nodeA: INode, nodeB: INode): boolean {
		if (nodeA === nodeB) {
			return false;
		}

		let current: INode = nodeB;

		while (current) {
			current = this.following(current);

			if (current === nodeA) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Node length.
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-node-length
	 * @param node Node.
	 * @returns Node length.
	 */
	public static getNodeLength(node: INode): number {
		switch (node.nodeType) {
			case NodeTypeEnum.documentTypeNode:
				return 0;

			case NodeTypeEnum.textNode:
			case NodeTypeEnum.processingInstructionNode:
			case NodeTypeEnum.commentNode:
				return (<IText | IComment>node).data.length;

			default:
				return node.childNodes.length;
		}
	}

	/**
	 * Returns boolean indicating if nodeB is following nodeA in the document tree.
	 *
	 * Based on:
	 * https://github.com/jsdom/js-symbol-tree/blob/master/lib/SymbolTree.js#L220
	 *
	 * @param node Node.
	 * @param [root] Root.
	 * @returns Following node.
	 */
	public static following(node: INode, root?: INode): INode {
		const firstChild = node.firstChild;

		if (firstChild) {
			return firstChild;
		}

		let current = node;

		while (current) {
			if (current === root) {
				return null;
			}

			const nextSibling = current.nextSibling;

			if (nextSibling) {
				return nextSibling;
			}

			current = current.parentNode;
		}

		return null;
	}

	/**
	 * Returns the next sibling or parents sibling.
	 *
	 * @param node Node.
	 * @returns Next decentant node.
	 */
	public static nextDecendantNode(node: INode): INode {
		while (node && !node.nextSibling) {
			node = node.parentNode;
		}

		if (!node) {
			return null;
		}

		return node.nextSibling;
	}

	/**
	 * Needed by https://dom.spec.whatwg.org/#concept-node-equals
	 *
	 * @param elementA
	 * @param elementB
	 */
	public static attributeListsEqual(elementA: IElement, elementB: IElement): boolean {
		const listA = <Array<IAttr>>Object.values(elementA['_attributes']);
		const listB = <Array<IAttr>>Object.values(elementB['_attributes']);

		const lengthA = listA.length;
		const lengthB = listB.length;

		if (lengthA !== lengthB) {
			return false;
		}

		for (let i = 0; i < lengthA; ++i) {
			const attrA = listA[i];

			if (
				!listB.some((attrB) => {
					return (
						(typeof attrA === 'number' && typeof attrB === 'number' && attrA === attrB) ||
						(typeof attrA === 'object' &&
							typeof attrB === 'object' &&
							NodeUtility.isEqualNode(attrA, attrB))
					);
				})
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if node nodeA equals node nodeB.
	 * Reference: https://dom.spec.whatwg.org/#concept-node-equals
	 *
	 * @param nodeA Node A.
	 * @param nodeB Node B.
	 */
	public static isEqualNode(nodeA: INode, nodeB: INode): boolean {
		if (nodeA.nodeType !== nodeB.nodeType) {
			return false;
		}

		switch (nodeA.nodeType) {
			case NodeTypeEnum.documentTypeNode:
				const documentTypeA = <IDocumentType>nodeA;
				const documentTypeB = <IDocumentType>nodeB;

				if (
					documentTypeA.name !== documentTypeB.name ||
					documentTypeA.publicId !== documentTypeB.publicId ||
					documentTypeA.systemId !== documentTypeB.systemId
				) {
					return false;
				}
				break;
			case NodeTypeEnum.elementNode:
				const elementA = <IElement>nodeA;
				const elementB = <IElement>nodeB;

				if (
					elementA.namespaceURI !== elementB.namespaceURI ||
					elementA.prefix !== elementB.prefix ||
					elementA.localName !== elementB.localName ||
					elementA.attributes.length !== elementB.attributes.length
				) {
					return false;
				}
				break;
			case NodeTypeEnum.attributeNode:
				const attributeA = <IAttr>nodeA;
				const attributeB = <IAttr>nodeB;

				if (
					attributeA.namespaceURI !== attributeB.namespaceURI ||
					attributeA.localName !== attributeB.localName ||
					attributeA.value !== attributeB.value
				) {
					return false;
				}
				break;
			case NodeTypeEnum.processingInstructionNode:
				const processingInstructionA = <IProcessingInstruction>nodeA;
				const processingInstructionB = <IProcessingInstruction>nodeB;

				if (
					processingInstructionA.target !== processingInstructionB.target ||
					processingInstructionA.data !== processingInstructionB.data
				) {
					return false;
				}
				break;
			case NodeTypeEnum.textNode:
			case NodeTypeEnum.commentNode:
				type TextOrComment = IText | IComment;
				const textOrCommentA = <TextOrComment>nodeA;
				const textOrCommentB = <TextOrComment>nodeB;

				if (textOrCommentA.data !== textOrCommentB.data) {
					return false;
				}
				break;
		}

		if (
			nodeA.nodeType === NodeTypeEnum.elementNode &&
			!NodeUtility.attributeListsEqual(<IElement>nodeA, <IElement>nodeB)
		) {
			return false;
		}

		if (nodeA.childNodes.length !== nodeB.childNodes.length) {
			return false;
		}

		for (let i = 0; i < nodeA.childNodes.length; i++) {
			const childNodeA = nodeA.childNodes[i];
			const childNodeB = nodeB.childNodes[i];

			if (!NodeUtility.isEqualNode(childNodeA, childNodeB)) {
				return false;
			}
		}

		return true;
	}
}
