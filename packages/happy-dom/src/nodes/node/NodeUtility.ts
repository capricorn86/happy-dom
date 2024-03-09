import IText from '../text/IText.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import IComment from '../comment/IComment.js';
import INode from './INode.js';
import NodeTypeEnum from './NodeTypeEnum.js';
import IElement from '../element/IElement.js';
import IDocumentType from '../document-type/IDocumentType.js';
import IAttr from '../attr/IAttr.js';
import IProcessingInstruction from '../processing-instruction/IProcessingInstruction.js';
import IShadowRoot from '../shadow-root/IShadowRoot.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import Node from './Node.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';

/**
 * Node utility.
 */
export default class NodeUtility {
	/**
	 * Append a child node to childNodes.
	 *
	 * @param ancestorNode Ancestor node.
	 * @param node Node to append.
	 * @param [options] Options.
	 * @param [options.disableAncestorValidation] Disables validation for checking if the node is an ancestor of the ancestorNode.
	 * @returns Appended node.
	 */
	public static appendChild(
		ancestorNode: INode,
		node: INode,
		options?: { disableAncestorValidation?: boolean }
	): INode {
		if (node === ancestorNode) {
			throw new DOMException(
				"Failed to execute 'appendChild' on 'Node': Not possible to append a node as a child of itself."
			);
		}

		if (!options?.disableAncestorValidation && this.isInclusiveAncestor(node, ancestorNode, true)) {
			throw new DOMException(
				"Failed to execute 'appendChild' on 'Node': The new node is a parent of the node to insert to.",
				DOMExceptionNameEnum.domException
			);
		}

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			for (const child of (<Node>node)[PropertySymbol.childNodes].slice()) {
				ancestorNode.appendChild(child);
			}
			return node;
		}

		// Remove the node from its previous parent if it has any.
		if (node[PropertySymbol.parentNode]) {
			const index = (<Node>node[PropertySymbol.parentNode])[PropertySymbol.childNodes].indexOf(
				node
			);
			if (index !== -1) {
				(<Node>node[PropertySymbol.parentNode])[PropertySymbol.childNodes].splice(index, 1);
			}
		}

		if (ancestorNode[PropertySymbol.isConnected]) {
			(ancestorNode[PropertySymbol.ownerDocument] || this)[PropertySymbol.cacheID]++;
		}

		(<Node>ancestorNode)[PropertySymbol.childNodes].push(node);

		(<Node>node)[PropertySymbol.connectToNode](ancestorNode);

		// MutationObserver
		if ((<Node>ancestorNode)[PropertySymbol.observers].length > 0) {
			const record = new MutationRecord({
				target: ancestorNode,
				type: MutationTypeEnum.childList,
				addedNodes: [node]
			});

			for (const observer of (<Node>ancestorNode)[PropertySymbol.observers]) {
				if (observer.options?.subtree) {
					(<Node>node)[PropertySymbol.observe](observer);
				}
				if (observer.options?.childList) {
					observer.report(record);
				}
			}
		}

		return node;
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param ancestorNode Ancestor node.
	 * @param node Node to remove.
	 * @returns Removed node.
	 */
	public static removeChild(ancestorNode: INode, node: INode): INode {
		const index = (<Node>ancestorNode)[PropertySymbol.childNodes].indexOf(node);

		if (index === -1) {
			throw new DOMException('Failed to remove node. Node is not child of parent.');
		}

		if (ancestorNode[PropertySymbol.isConnected]) {
			(ancestorNode[PropertySymbol.ownerDocument] || this)[PropertySymbol.cacheID]++;
		}

		(<Node>ancestorNode)[PropertySymbol.childNodes].splice(index, 1);

		(<Node>node)[PropertySymbol.connectToNode](null);

		// MutationObserver
		if ((<Node>ancestorNode)[PropertySymbol.observers].length > 0) {
			const record = new MutationRecord({
				target: ancestorNode,
				type: MutationTypeEnum.childList,
				removedNodes: [node]
			});

			for (const observer of (<Node>ancestorNode)[PropertySymbol.observers]) {
				if (observer.options?.subtree) {
					(<Node>node)[PropertySymbol.unobserve](observer);
				}
				if (observer.options?.childList) {
					observer.report(record);
				}
			}
		}

		return node;
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param ancestorNode Ancestor node.
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @param [options] Options.
	 * @param [options.disableAncestorValidation] Disables validation for checking if the node is an ancestor of the ancestorNode.
	 * @returns Inserted node.
	 */
	public static insertBefore(
		ancestorNode: INode,
		newNode: INode,
		referenceNode: INode | null,
		options?: { disableAncestorValidation?: boolean }
	): INode {
		if (
			!options?.disableAncestorValidation &&
			this.isInclusiveAncestor(newNode, ancestorNode, true)
		) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The new node is a parent of the node to insert to.",
				DOMExceptionNameEnum.domException
			);
		}

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			for (const child of (<Node>newNode)[PropertySymbol.childNodes].slice()) {
				ancestorNode.insertBefore(child, referenceNode);
			}
			return newNode;
		}

		// If the referenceNode is null or undefined, then the newNode should be appended to the ancestorNode.
		// According to spec only null is valid, but browsers support undefined as well.
		if (!referenceNode) {
			ancestorNode.appendChild(newNode);
			return newNode;
		}

		if ((<Node>ancestorNode)[PropertySymbol.childNodes].indexOf(referenceNode) === -1) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		if (ancestorNode[PropertySymbol.isConnected]) {
			(ancestorNode[PropertySymbol.ownerDocument] || this)[PropertySymbol.cacheID]++;
		}

		if (newNode[PropertySymbol.parentNode]) {
			const index = (<Node>newNode[PropertySymbol.parentNode])[PropertySymbol.childNodes].indexOf(
				newNode
			);
			if (index !== -1) {
				(<Node>newNode[PropertySymbol.parentNode])[PropertySymbol.childNodes].splice(index, 1);
			}
		}

		(<Node>ancestorNode)[PropertySymbol.childNodes].splice(
			(<Node>ancestorNode)[PropertySymbol.childNodes].indexOf(referenceNode),
			0,
			newNode
		);

		(<Node>newNode)[PropertySymbol.connectToNode](ancestorNode);

		// MutationObserver
		if ((<Node>ancestorNode)[PropertySymbol.observers].length > 0) {
			const record = new MutationRecord({
				target: ancestorNode,
				type: MutationTypeEnum.childList,
				addedNodes: [newNode]
			});

			for (const observer of (<Node>ancestorNode)[PropertySymbol.observers]) {
				if (observer.options?.subtree) {
					(<Node>newNode)[PropertySymbol.observe](observer);
				}
				if (observer.options?.childList) {
					observer.report(record);
				}
			}
		}

		return newNode;
	}

	/**
	 * Returns whether the passed node is a text node, and narrows its type.
	 *
	 * @param node The node to be tested.
	 * @returns "true" if the node is a text node.
	 */
	public static isTextNode(node: INode | null): node is IText {
		return node?.[PropertySymbol.nodeType] === NodeTypeEnum.textNode;
	}

	/**
	 * Returns boolean indicating if "ancestorNode" is an inclusive ancestor of "referenceNode".
	 *
	 * Based on:
	 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/helpers/node.js
	 *
	 * @see https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
	 * @param ancestorNode Ancestor node.
	 * @param referenceNode Reference node.
	 * @param [includeShadowRoots = false] Include shadow roots.
	 * @returns "true" if inclusive ancestor.
	 */
	public static isInclusiveAncestor(
		ancestorNode: INode | null,
		referenceNode: INode | null,
		includeShadowRoots = false
	): boolean {
		if (ancestorNode === null || referenceNode === null) {
			return false;
		}

		if (ancestorNode === referenceNode) {
			return true;
		}

		if (!(<Node>ancestorNode)[PropertySymbol.childNodes].length) {
			return false;
		}

		if (
			includeShadowRoots &&
			referenceNode[PropertySymbol.isConnected] !== ancestorNode[PropertySymbol.isConnected]
		) {
			return false;
		}

		if (
			includeShadowRoots &&
			ancestorNode === referenceNode[PropertySymbol.ownerDocument] &&
			referenceNode[PropertySymbol.isConnected]
		) {
			return true;
		}

		let parent: INode = referenceNode[PropertySymbol.parentNode];

		while (parent) {
			if (ancestorNode === parent) {
				return true;
			}

			parent = parent[PropertySymbol.parentNode]
				? parent[PropertySymbol.parentNode]
				: includeShadowRoots && (<IShadowRoot>parent).host
					? (<IShadowRoot>parent).host
					: null;
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
		switch (node[PropertySymbol.nodeType]) {
			case NodeTypeEnum.documentTypeNode:
				return 0;

			case NodeTypeEnum.textNode:
			case NodeTypeEnum.processingInstructionNode:
			case NodeTypeEnum.commentNode:
				return (<IText | IComment>node).data.length;

			default:
				return (<Node>node)[PropertySymbol.childNodes].length;
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

			current = current[PropertySymbol.parentNode];
		}

		return null;
	}

	/**
	 * Returns the next sibling or parents sibling.
	 *
	 * @param node Node.
	 * @returns Next descendant node.
	 */
	public static nextDescendantNode(node: INode): INode {
		while (node && !node.nextSibling) {
			node = node[PropertySymbol.parentNode];
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
		for (let i = 0, max = elementA[PropertySymbol.attributes].length; i < max; i++) {
			const attributeA = elementA[PropertySymbol.attributes][i];
			const attributeB = elementB[PropertySymbol.attributes].getNamedItemNS(
				attributeA[PropertySymbol.namespaceURI],
				attributeA.localName
			);
			if (!attributeB || attributeB[PropertySymbol.value] !== attributeA[PropertySymbol.value]) {
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
		if (nodeA[PropertySymbol.nodeType] !== nodeB[PropertySymbol.nodeType]) {
			return false;
		}

		switch (nodeA[PropertySymbol.nodeType]) {
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
					elementA[PropertySymbol.namespaceURI] !== elementB[PropertySymbol.namespaceURI] ||
					elementA[PropertySymbol.prefix] !== elementB[PropertySymbol.prefix] ||
					elementA.localName !== elementB.localName ||
					elementA[PropertySymbol.attributes].length !== elementB[PropertySymbol.attributes].length
				) {
					return false;
				}
				break;
			case NodeTypeEnum.attributeNode:
				const attributeA = <IAttr>nodeA;
				const attributeB = <IAttr>nodeB;

				if (
					attributeA[PropertySymbol.namespaceURI] !== attributeB[PropertySymbol.namespaceURI] ||
					attributeA.localName !== attributeB.localName ||
					attributeA[PropertySymbol.value] !== attributeB[PropertySymbol.value]
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
			nodeA[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
			!NodeUtility.attributeListsEqual(<IElement>nodeA, <IElement>nodeB)
		) {
			return false;
		}

		if (
			(<Node>nodeA)[PropertySymbol.childNodes].length !==
			(<Node>nodeB)[PropertySymbol.childNodes].length
		) {
			return false;
		}

		for (let i = 0; i < (<Node>nodeA)[PropertySymbol.childNodes].length; i++) {
			const childNodeA = (<Node>nodeA)[PropertySymbol.childNodes][i];
			const childNodeB = (<Node>nodeB)[PropertySymbol.childNodes][i];

			if (!NodeUtility.isEqualNode(childNodeA, childNodeB)) {
				return false;
			}
		}

		return true;
	}
}
