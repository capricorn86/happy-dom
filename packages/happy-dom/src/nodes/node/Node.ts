import EventTarget from '../../event/EventTarget';
import MutationRecord from '../../mutation-observer/MutationRecord';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum';
import MutationListener from '../../mutation-observer/MutationListener';
import Event from '../../event/Event';
import INode from './INode';
import DOMException from '../../exception/DOMException';
import IDocument from '../document/IDocument';
import IElement from '../element/IElement';
import IHTMLBaseElement from '../html-base-element/IHTMLBaseElement';
import INodeList from './INodeList';
import NodeListFactory from './NodeListFactory';
import NodeTypeEnum from './NodeTypeEnum';
import NodeDocumentPositionEnum from './NodeDocumentPositionEnum';
import NodeUtility from './NodeUtility';
import IAttr from '../attr/IAttr';

/**
 * Node.
 */
export default class Node extends EventTarget implements INode {
	// Owner document is set when the Node is created by the Document
	public static _ownerDocument: IDocument = null;

	// Public properties
	public static readonly ELEMENT_NODE = NodeTypeEnum.elementNode;
	public static readonly ATTRIBUTE_NODE = NodeTypeEnum.attributeNode;
	public static readonly TEXT_NODE = NodeTypeEnum.textNode;
	public static readonly CDATA_SECTION_NODE = NodeTypeEnum.cdataSectionNode;
	public static readonly COMMENT_NODE = NodeTypeEnum.commentNode;
	public static readonly DOCUMENT_NODE = NodeTypeEnum.documentNode;
	public static readonly DOCUMENT_TYPE_NODE = NodeTypeEnum.documentTypeNode;
	public static readonly DOCUMENT_FRAGMENT_NODE = NodeTypeEnum.documentFragmentNode;
	public static readonly PROCESSING_INSTRUCTION_NODE = NodeTypeEnum.processingInstructionNode;
	public static readonly DOCUMENT_POSITION_CONTAINED_BY = NodeDocumentPositionEnum.containedBy;
	public static readonly DOCUMENT_POSITION_CONTAINS = NodeDocumentPositionEnum.contains;
	public static readonly DOCUMENT_POSITION_DISCONNECTED = NodeDocumentPositionEnum.disconnect;
	public static readonly DOCUMENT_POSITION_FOLLOWING = NodeDocumentPositionEnum.following;
	public static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC =
		NodeDocumentPositionEnum.implementationSpecific;
	public static readonly DOCUMENT_POSITION_PRECEDING = NodeDocumentPositionEnum.preceding;
	public readonly ELEMENT_NODE = NodeTypeEnum.elementNode;
	public readonly ATTRIBUTE_NODE = NodeTypeEnum.attributeNode;
	public readonly TEXT_NODE = NodeTypeEnum.textNode;
	public readonly CDATA_SECTION_NODE = NodeTypeEnum.cdataSectionNode;
	public readonly COMMENT_NODE = NodeTypeEnum.commentNode;
	public readonly DOCUMENT_NODE = NodeTypeEnum.documentNode;
	public readonly DOCUMENT_TYPE_NODE = NodeTypeEnum.documentTypeNode;
	public readonly DOCUMENT_FRAGMENT_NODE = NodeTypeEnum.documentFragmentNode;
	public readonly PROCESSING_INSTRUCTION_NODE = NodeTypeEnum.processingInstructionNode;
	public readonly DOCUMENT_POSITION_CONTAINED_BY = NodeDocumentPositionEnum.containedBy;
	public readonly DOCUMENT_POSITION_CONTAINS = NodeDocumentPositionEnum.contains;
	public readonly DOCUMENT_POSITION_DISCONNECTED = NodeDocumentPositionEnum.disconnect;
	public readonly DOCUMENT_POSITION_FOLLOWING = NodeDocumentPositionEnum.following;
	public readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC =
		NodeDocumentPositionEnum.implementationSpecific;
	public readonly DOCUMENT_POSITION_PRECEDING = NodeDocumentPositionEnum.preceding;
	public readonly ownerDocument: IDocument = null;
	public readonly parentNode: INode = null;
	public readonly nodeType: number;
	public readonly childNodes: INodeList<INode> = NodeListFactory.create();
	public readonly isConnected: boolean = false;

	// Custom Properties (not part of HTML standard)
	public _rootNode: INode = null;
	public _observers: MutationListener[] = [];

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.ownerDocument = (<typeof Node>this.constructor)._ownerDocument;
	}

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Get text value of children.
	 *
	 * @returns Text content.
	 */
	public get textContent(): string {
		// Sub-classes should implement this method.
		return null;
	}

	/**
	 * Sets text content.
	 *
	 * @param _textContent Text content.
	 */
	public set textContent(_textContent) {
		// Do nothing.
		// Sub-classes should implement this method.
	}

	/**
	 * Node value.
	 *
	 * @returns Node value.
	 */
	public get nodeValue(): string {
		return null;
	}

	/**
	 * Sets node value.
	 */
	public set nodeValue(_nodeValue: string) {
		// Do nothing
	}

	/**
	 * Node name.
	 *
	 * @returns Node name.
	 */
	public get nodeName(): string {
		return '';
	}

	/**
	 * Previous sibling.
	 *
	 * @returns Node.
	 */
	public get previousSibling(): INode {
		if (this.parentNode) {
			const index = this.parentNode.childNodes.indexOf(this);
			if (index > 0) {
				return this.parentNode.childNodes[index - 1];
			}
		}
		return null;
	}

	/**
	 * Next sibling.
	 *
	 * @returns Node.
	 */
	public get nextSibling(): INode {
		if (this.parentNode) {
			const index = this.parentNode.childNodes.indexOf(this);
			if (index > -1 && index + 1 < this.parentNode.childNodes.length) {
				return this.parentNode.childNodes[index + 1];
			}
		}
		return null;
	}

	/**
	 * First child.
	 *
	 * @returns Node.
	 */
	public get firstChild(): INode {
		if (this.childNodes.length > 0) {
			return this.childNodes[0];
		}
		return null;
	}

	/**
	 * Last child.
	 *
	 * @returns Node.
	 */
	public get lastChild(): INode {
		if (this.childNodes.length > 0) {
			return this.childNodes[this.childNodes.length - 1];
		}
		return null;
	}

	/**
	 * Returns parent element.
	 *
	 * @returns Element.
	 */
	public get parentElement(): IElement {
		let parent = this.parentNode;
		while (parent && parent.nodeType !== Node.ELEMENT_NODE) {
			parent = parent.parentNode;
		}
		return <IElement>parent;
	}

	/**
	 * Returns base URI.
	 *
	 * @returns Base URI.
	 */
	public get baseURI(): string {
		const base = <IHTMLBaseElement>this.ownerDocument.querySelector('base');
		if (base) {
			return base.href;
		}
		return this.ownerDocument.defaultView.location.href;
	}

	/**
	 * Connected callback.
	 */
	public connectedCallback?(): void;

	/**
	 * Disconnected callback.
	 */
	public disconnectedCallback?(): void;

	/**
	 * Returns "true" if the node has child nodes.
	 *
	 * @returns "true" if the node has child nodes.
	 */
	public hasChildNodes(): boolean {
		return this.childNodes.length > 0;
	}

	/**
	 * Returns "true" if this node contains the other node.
	 *
	 * @param otherNode Node to test with.
	 * @returns "true" if this node contains the other node.
	 */
	public contains(otherNode: INode): boolean {
		for (const childNode of this.childNodes) {
			if (childNode === otherNode || childNode.contains(otherNode)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns closest root node (Document or ShadowRoot).
	 *
	 * @param options Options.
	 * @param options.composed A Boolean that indicates whether the shadow root should be returned (false, the default), or a root node beyond shadow root (true).
	 * @returns Node.
	 */
	public getRootNode(options?: { composed: boolean }): INode {
		if (!this.isConnected) {
			return this;
		}

		if (this._rootNode && !options?.composed) {
			return this._rootNode;
		}

		return this.ownerDocument;
	}

	/**
	 * Clones a node.
	 *
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): INode {
		const clone = new (<typeof Node>this.constructor)();

		// Document has childNodes directly when it is created
		if (clone.childNodes.length) {
			for (const node of clone.childNodes.slice()) {
				node.parentNode.removeChild(node);
			}
		}

		if (deep) {
			for (const childNode of this.childNodes) {
				const childClone = childNode.cloneNode(true);
				(<Node>childClone.parentNode) = clone;
				clone.childNodes.push(childClone);
			}
		}

		(<IDocument>clone.ownerDocument) = this.ownerDocument;

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public appendChild(node: INode): INode {
		if (node === this) {
			throw new DOMException('Not possible to append a node as a child of itself.');
		}

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			for (const child of node.childNodes.slice()) {
				this.appendChild(child);
			}
			return node;
		}

		// Remove the node from its previous parent if it has any.
		if (node.parentNode) {
			const index = node.parentNode.childNodes.indexOf(node);
			if (index !== -1) {
				node.parentNode.childNodes.splice(index, 1);
			}
		}

		if (this.isConnected) {
			(this.ownerDocument || this)['_cacheID']++;
		}

		this.childNodes.push(node);

		(<Node>node)._connectToNode(this);

		// MutationObserver
		if (this._observers.length > 0) {
			const record = new MutationRecord();
			record.target = this;
			record.type = MutationTypeEnum.childList;
			record.addedNodes = [node];

			for (const observer of this._observers) {
				if (observer.options.subtree) {
					(<Node>node)._observe(observer);
				}
				if (observer.options.childList) {
					observer.callback([record]);
				}
			}
		}

		return node;
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param node Node to remove.
	 * @returns Removed node.
	 */
	public removeChild(node: INode): INode {
		const index = this.childNodes.indexOf(node);

		if (index === -1) {
			throw new DOMException('Failed to remove node. Node is not child of parent.');
		}

		if (this.isConnected) {
			(this.ownerDocument || this)['_cacheID']++;
		}

		this.childNodes.splice(index, 1);

		(<Node>node)._connectToNode(null);

		// MutationObserver
		if (this._observers.length > 0) {
			const record = new MutationRecord();
			record.target = this;
			record.type = MutationTypeEnum.childList;
			record.removedNodes = [node];

			for (const observer of this._observers) {
				(<Node>node)._unobserve(observer);
				if (observer.options.childList) {
					observer.callback([record]);
				}
			}
		}

		return node;
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @returns Inserted node.
	 */
	public insertBefore(newNode: INode, referenceNode: INode | null): INode {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			for (const child of newNode.childNodes.slice()) {
				this.insertBefore(child, referenceNode);
			}
			return newNode;
		}

		if (referenceNode === null) {
			this.appendChild(newNode);
			return newNode;
		}

		if (referenceNode === undefined) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only 1 present.",
				'TypeError'
			);
		}

		const index = referenceNode ? this.childNodes.indexOf(referenceNode) : 0;

		if (index === -1) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		if (this.isConnected) {
			(this.ownerDocument || this)['_cacheID']++;
		}

		if (newNode.parentNode) {
			const index = newNode.parentNode.childNodes.indexOf(newNode);
			if (index !== -1) {
				newNode.parentNode.childNodes.splice(index, 1);
			}
		}

		this.childNodes.splice(index, 0, newNode);

		(<Node>newNode)._connectToNode(this);

		// MutationObserver
		if (this._observers.length > 0) {
			const record = new MutationRecord();
			record.target = this;
			record.type = MutationTypeEnum.childList;
			record.addedNodes = [newNode];

			for (const observer of this._observers) {
				if (observer.options.subtree) {
					(<Node>newNode)._observe(observer);
				}
				if (observer.options.childList) {
					observer.callback([record]);
				}
			}
		}

		return newNode;
	}

	/**
	 * Replaces a node with another.
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @returns Replaced node.
	 */
	public replaceChild(newChild: INode, oldChild: INode): INode {
		this.insertBefore(newChild, oldChild);
		this.removeChild(oldChild);

		return oldChild;
	}

	/**
	 * @override
	 */
	public dispatchEvent(event: Event): boolean {
		const returnValue = super.dispatchEvent(event);

		if (event.bubbles && !event._propagationStopped) {
			if (this.parentNode) {
				return this.parentNode.dispatchEvent(event);
			}

			// eslint-disable-next-line
			if (event.composed && (<any>this).host) {
				// eslint-disable-next-line
				return (<any>this).host.dispatchEvent(event);
			}
		}

		return returnValue;
	}

	/**
	 * Converts the node to a string.
	 *
	 * @param listener Listener.
	 */
	public toString(): string {
		return `[object ${this.constructor.name}]`;
	}

	/**
	 * Observeres the node.
	 * Used by MutationObserver, but it is not part of the HTML standard.
	 *
	 * @param listener Listener.
	 */
	public _observe(listener: MutationListener): void {
		this._observers.push(listener);
		if (listener.options.subtree) {
			for (const node of this.childNodes) {
				(<Node>node)._observe(listener);
			}
		}
	}

	/**
	 * Stops observing the node.
	 * Used by MutationObserver, but it is not part of the HTML standard.
	 *
	 * @param listener Listener.
	 */
	public _unobserve(listener: MutationListener): void {
		const index = this._observers.indexOf(listener);
		if (index !== -1) {
			this._observers.splice(index, 1);
		}
		if (listener.options.subtree) {
			for (const node of this.childNodes) {
				(<Node>node)._unobserve(listener);
			}
		}
	}

	/**
	 * Connects this element to another element.
	 *
	 * @param parentNode Parent node.
	 */
	public _connectToNode(parentNode: INode = null): void {
		const isConnected = !!parentNode && parentNode.isConnected;

		if (this.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
			(<INode>this.parentNode) = parentNode;
			(<Node>this)._rootNode = isConnected && parentNode ? (<Node>parentNode)._rootNode : null;
		}

		if (this.isConnected !== isConnected) {
			(<boolean>this.isConnected) = isConnected;

			if (isConnected && this.connectedCallback) {
				this.connectedCallback();
			} else if (!isConnected && this.disconnectedCallback) {
				if (this.ownerDocument['_activeElement'] === this) {
					this.ownerDocument['_activeElement'] = null;
				}
				this.disconnectedCallback();
			}

			for (const child of this.childNodes) {
				(<Node>child)._connectToNode(this);
			}

			// eslint-disable-next-line
			if ((<any>this)._shadowRoot) {
				// eslint-disable-next-line
				(<any>this)._shadowRoot._connectToNode(this);
			}
		}
	}

	/**
	 * Reports the position of its argument node relative to the node on which it is called.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
	 * @param otherNode Other node.
	 */
	public compareDocumentPosition(otherNode: INode): number {
		/**
		 * 1. If this is other, then return zero.
		 */
		if (this === otherNode) {
			return 0;
		}

		/**
		 * 2. Let node1 be other and node2 be this.
		 */
		let node1: INode = otherNode;
		let node2: INode = this;

		/**
		 * 3. Let attr1 and attr2 be null.
		 */
		let attr1 = null;
		let attr2 = null;

		/**
		 * 4. If node1 is an attribute, then set attr1 to node1 and node1 to attr1’s element.
		 */
		if (node1.nodeType === Node.ATTRIBUTE_NODE) {
			attr1 = node1;
			node1 = (<IAttr>attr1).ownerElement;
		}

		/**
		 * 5. If node2 is an attribute, then:
		 * 5.1. Set attr2 to node2 and node2 to attr2’s element.
		 */
		if (node2.nodeType === Node.ATTRIBUTE_NODE) {
			attr2 = node2;
			node2 = (<IAttr>attr2).ownerElement;

			/**
			 * 5.2. If attr1 and node1 are non-null, and node2 is node1, then:
			 */
			if (attr1 !== null && node1 !== null && node2 === node1) {
				/**
				 * 5.2.1. For each attr in node2’s attribute list:
				 */
				for (const attr of Object.values((<IElement>node2).attributes)) {
					/**
					 * 5.2.1.1. If attr equals attr1, then return the result of adding DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and DOCUMENT_POSITION_PRECEDING.
					 */
					if (NodeUtility.nodeEquals(<IAttr>attr, attr1)) {
						return (
							Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | Node.DOCUMENT_POSITION_PRECEDING
						);
					}

					/**
					 * 5.2.1.2. If attr equals attr2, then return the result of adding DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and DOCUMENT_POSITION_FOLLOWING.
					 */
					if (NodeUtility.nodeEquals(<IAttr>attr, attr2)) {
						return (
							Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | Node.DOCUMENT_POSITION_FOLLOWING
						);
					}
				}
			}
		}

		const node2Ancestors: INode[] = [];
		let node2Ancestor: INode = node2;

		while (node2Ancestor) {
			/**
			 * 7. If node1 is an ancestor of node2 […] then return the result of adding DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
			 */
			if (node2Ancestor === node1) {
				return Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;
			}

			node2Ancestors.push(node2Ancestor);
			node2Ancestor = node2Ancestor.parentNode;
		}

		const node1Ancestors: INode[] = [];
		let node1Ancestor: INode = node1;

		while (node1Ancestor) {
			/**
			 * 8. If node1 is a descendant of node2 […] then return the result of adding DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
			 */
			if (node1Ancestor === node2) {
				return Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING;
			}

			node1Ancestors.push(node1Ancestor);
			node1Ancestor = node1Ancestor.parentNode;
		}

		const reverseArrayIndex = (array: INode[], reverseIndex: number): INode => {
			return array[array.length - 1 - reverseIndex];
		};

		const root = reverseArrayIndex(node2Ancestors, 0);

		/**
		 * 6. If node1 or node2 is null, or node1’s root is not node2’s root, then return the result of adding
		 * DOCUMENT_POSITION_DISCONNECTED, DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either
		 * DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING, with the constraint that this is to be consistent, together.
		 */
		if (!root || root !== reverseArrayIndex(node1Ancestors, 0)) {
			return (
				Node.DOCUMENT_POSITION_DISCONNECTED |
				Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
				Node.DOCUMENT_POSITION_FOLLOWING
			);
		}

		// Find the lowest common ancestor
		let commonAncestorIndex = 0;
		const ancestorsMinLength = Math.min(node2Ancestors.length, node1Ancestors.length);

		for (let i = 0; i < ancestorsMinLength; ++i) {
			const node2Ancestor = reverseArrayIndex(node2Ancestors, i);
			const node1Ancestor = reverseArrayIndex(node1Ancestors, i);

			if (node2Ancestor !== node1Ancestor) {
				break;
			}

			commonAncestorIndex = i;
		}

		const commonAncestor = reverseArrayIndex(node2Ancestors, commonAncestorIndex);

		// Indexes within the common ancestor
		let indexes = 0;
		let node2Index = -1;
		let node1Index = -1;
		const node2Node = reverseArrayIndex(node2Ancestors, commonAncestorIndex + 1);
		const node1Node = reverseArrayIndex(node1Ancestors, commonAncestorIndex + 1);

		const computeNodeIndexes = (nodes: INode[]): void => {
			for (const childNode of nodes) {
				computeNodeIndexes(childNode.childNodes);

				if (childNode === node2Node) {
					node2Index = indexes;
				} else if (childNode === node1Node) {
					node1Index = indexes;
				}

				if (node2Index !== -1 && node1Index !== -1) {
					break;
				}

				indexes++;
			}
		};

		computeNodeIndexes(commonAncestor.childNodes);

		/**
		 * 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
		 * 10. Return DOCUMENT_POSITION_FOLLOWING.
		 */
		return node1Index < node2Index
			? Node.DOCUMENT_POSITION_PRECEDING
			: Node.DOCUMENT_POSITION_FOLLOWING;
	}
}
