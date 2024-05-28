import EventTarget from '../../event/EventTarget.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import MutationListener from '../../mutation-observer/MutationListener.js';
import Document from '../document/Document.js';
import Element from '../element/Element.js';
import NodeTypeEnum from './NodeTypeEnum.js';
import NodeDocumentPositionEnum from './NodeDocumentPositionEnum.js';
import NodeUtility from './NodeUtility.js';
import Attr from '../attr/Attr.js';
import NodeList from './NodeList.js';
import NodeFactory from '../NodeFactory.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import INodeList from './INodeList.js';

/**
 * Node.
 */
export default class Node extends EventTarget {
	// This is used when overriding a Node class and set it in a owner document context (used in BrowserWindow.constructor()).
	public static [PropertySymbol.ownerDocument]: Document | null;

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

	// Defined on the prototype
	public readonly ELEMENT_NODE;
	public readonly ATTRIBUTE_NODE;
	public readonly TEXT_NODE;
	public readonly CDATA_SECTION_NODE;
	public readonly COMMENT_NODE;
	public readonly DOCUMENT_NODE;
	public readonly DOCUMENT_TYPE_NODE;
	public readonly DOCUMENT_FRAGMENT_NODE;
	public readonly PROCESSING_INSTRUCTION_NODE;
	public readonly DOCUMENT_POSITION_CONTAINED_BY;
	public readonly DOCUMENT_POSITION_CONTAINS;
	public readonly DOCUMENT_POSITION_DISCONNECTED;
	public readonly DOCUMENT_POSITION_FOLLOWING;
	public readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
	public readonly DOCUMENT_POSITION_PRECEDING;

	// Internal properties
	public [PropertySymbol.isConnected] = false;
	public [PropertySymbol.ownerDocument]: Document;
	public [PropertySymbol.parentNode]: Node | null = null;
	public [PropertySymbol.nodeType]: NodeTypeEnum;
	public [PropertySymbol.rootNode]: Node = null;
	public [PropertySymbol.observers]: MutationListener[] = [];
	public [PropertySymbol.childNodes]: INodeList<Node> = new NodeList<Node>();
	public [PropertySymbol.childNodesFlatten]: INodeList<Node> = new NodeList<Node>();

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		if ((<typeof Node>this.constructor)[PropertySymbol.ownerDocument] !== undefined) {
			this[PropertySymbol.ownerDocument] = (<typeof Node>this.constructor)[
				PropertySymbol.ownerDocument
			];
		} else {
			const ownerDocument = NodeFactory.pullOwnerDocument();
			if (!ownerDocument) {
				throw new Error(
					'Failed to construct "Node": No owner document in queue. Please use "NodeFactory" to create instances of a Node.'
				);
			}
			this[PropertySymbol.ownerDocument] = ownerDocument;
		}
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
	 * Returns connected state.
	 *
	 * @returns Connected state.
	 */
	public get isConnected(): boolean {
		return this[PropertySymbol.isConnected];
	}

	/**
	 * Returns owner document.
	 *
	 * @returns Owner document.
	 */
	public get ownerDocument(): Document {
		return this[PropertySymbol.ownerDocument];
	}

	/**
	 * Returns parent node.
	 *
	 * @returns Parent node.
	 */
	public get parentNode(): Node | null {
		return this[PropertySymbol.parentNode];
	}

	/**
	 * Returns node type.
	 *
	 * @returns Node type.
	 */
	public get nodeType(): number {
		return this[PropertySymbol.nodeType];
	}

	/**
	 * Get child nodes.
	 *
	 * @returns Child nodes list.
	 */
	public get childNodes(): INodeList<Node> {
		return this[PropertySymbol.childNodes];
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
	public get previousSibling(): Node {
		if (this[PropertySymbol.parentNode]) {
			const index = (<Node>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][
				PropertySymbol.indexOf
			](this);
			if (index > 0) {
				return (<Node>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][index - 1];
			}
		}
		return null;
	}

	/**
	 * Next sibling.
	 *
	 * @returns Node.
	 */
	public get nextSibling(): Node {
		if (this[PropertySymbol.parentNode]) {
			const index = (<Node>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][
				PropertySymbol.indexOf
			](this);
			if (
				index > -1 &&
				index + 1 < (<Node>this[PropertySymbol.parentNode])[PropertySymbol.childNodes].length
			) {
				return (<Node>this[PropertySymbol.parentNode])[PropertySymbol.childNodes][index + 1];
			}
		}
		return null;
	}

	/**
	 * First child.
	 *
	 * @returns Node.
	 */
	public get firstChild(): Node {
		if (this[PropertySymbol.childNodes].length > 0) {
			return this[PropertySymbol.childNodes][0];
		}
		return null;
	}

	/**
	 * Last child.
	 *
	 * @returns Node.
	 */
	public get lastChild(): Node {
		if (this[PropertySymbol.childNodes].length > 0) {
			return this[PropertySymbol.childNodes][this[PropertySymbol.childNodes].length - 1];
		}
		return null;
	}

	/**
	 * Returns parent element.
	 *
	 * @returns Element.
	 */
	public get parentElement(): Element | null {
		let parent = this[PropertySymbol.parentNode];
		while (parent && parent[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode) {
			parent = parent[PropertySymbol.parentNode];
		}
		return <Element>parent;
	}

	/**
	 * Returns base URI.
	 *
	 * @returns Base URI.
	 */
	public get baseURI(): string {
		const base = this[PropertySymbol.ownerDocument].querySelector('base');
		if (base) {
			return base.href;
		}
		return this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow].location.href;
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
		return this[PropertySymbol.childNodes].length > 0;
	}

	/**
	 * Returns "true" if this node contains the other node.
	 *
	 * @param otherNode Node to test with.
	 * @returns "true" if this node contains the other node.
	 */
	public contains(otherNode: Node): boolean {
		if (otherNode === undefined) {
			return false;
		}
		return NodeUtility.isInclusiveAncestor(this, otherNode);
	}

	/**
	 * Returns closest root node (Document or ShadowRoot).
	 *
	 * @param options Options.
	 * @param options.composed A Boolean that indicates whether the shadow root should be returned (false, the default), or a root node beyond shadow root (true).
	 * @returns Node.
	 */
	public getRootNode(options?: { composed: boolean }): Node {
		if (!this[PropertySymbol.isConnected]) {
			return this;
		}

		if (this[PropertySymbol.rootNode] && !options?.composed) {
			return this[PropertySymbol.rootNode];
		}

		return this[PropertySymbol.ownerDocument];
	}

	/**
	 * Clones a node.
	 *
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): Node {
		return this[PropertySymbol.cloneNode](deep);
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public appendChild(node: Node): Node {
		if (arguments.length < 1) {
			throw new TypeError(
				`Failed to execute 'appendChild' on 'Node': 1 argument required, but only 0 present`
			);
		}
		return this[PropertySymbol.appendChild](node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param node Node to remove.
	 * @returns Removed node.
	 */
	public removeChild(node: Node): Node {
		if (arguments.length < 1) {
			throw new TypeError(
				`Failed to execute 'removeChild' on 'Node': 1 argument required, but only 0 present`
			);
		}
		return this[PropertySymbol.removeChild](node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @returns Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode: Node | null): Node {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}
		return this[PropertySymbol.insertBefore](newNode, referenceNode);
	}

	/**
	 * Replaces a node with another.
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @returns Replaced node.
	 */
	public replaceChild(newChild: Node, oldChild: Node): Node {
		if (arguments.length < 2) {
			throw new TypeError(
				`Failed to execute 'replaceChild' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}
		return this[PropertySymbol.replaceChild](newChild, oldChild);
	}

	/**
	 * Clones a node.
	 *
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public [PropertySymbol.cloneNode](deep = false): Node {
		const clone = NodeFactory.createNode<Node>(
			this[PropertySymbol.ownerDocument],
			<typeof Node>this.constructor
		);

		// Document has childNodes directly when it is created
		if (clone[PropertySymbol.childNodes].length) {
			const childNodes = clone[PropertySymbol.childNodes];
			while (childNodes.length) {
				clone.removeChild(childNodes[0]);
			}
		}

		if (deep) {
			for (const childNode of this[PropertySymbol.childNodes]) {
				const childClone = childNode.cloneNode(true);
				childClone[PropertySymbol.parentNode] = clone;
				clone[PropertySymbol.childNodes][PropertySymbol.appendChild](childClone);
			}
		}

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @returns Appended node.
	 */
	public [PropertySymbol.appendChild](node: Node): Node {
		if (node === this) {
			throw new DOMException(
				"Failed to execute 'appendChild' on 'Node': Not possible to append a node as a child of itself."
			);
		}

		if (NodeUtility.isInclusiveAncestor(node, this, true)) {
			throw new DOMException(
				"Failed to execute 'appendChild' on 'Node': The new node is a parent of the node to insert to.",
				DOMExceptionNameEnum.domException
			);
		}

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (node[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			const childNodes = node[PropertySymbol.childNodes];
			while (childNodes.length) {
				this.appendChild(childNodes[0]);
			}
			return node;
		}

		// Remove the node from its previous parent if it has any.
		if (node[PropertySymbol.parentNode]) {
			node[PropertySymbol.parentNode][PropertySymbol.childNodes][PropertySymbol.removeChild](node);
			let parent = node[PropertySymbol.parentNode];
			while (parent) {
				node[PropertySymbol.parentNode][PropertySymbol.childNodesFlatten][
					PropertySymbol.removeChild
				](node);
				parent = node[PropertySymbol.parentNode];
			}
		}

		if (this[PropertySymbol.isConnected]) {
			(this[PropertySymbol.ownerDocument] || this)[PropertySymbol.cacheID]++;
		}

		this[PropertySymbol.childNodes][PropertySymbol.appendChild](node);

		let parent: Node = this;
		while (parent) {
			parent[PropertySymbol.childNodesFlatten][PropertySymbol.appendChild](node);
			parent = parent[PropertySymbol.parentNode];
		}

		node[PropertySymbol.parentNode] = this;

		if (this[PropertySymbol.isConnected] && !(<Node>node)[PropertySymbol.isConnected]) {
			(<Node>node)[PropertySymbol.isConnected] = true;
			(<Node>node)[PropertySymbol.connectedToDocument]();
		} else if (!this[PropertySymbol.isConnected] && (<Node>node)[PropertySymbol.isConnected]) {
			(<Node>node)[PropertySymbol.isConnected] = false;
			(<Node>node)[PropertySymbol.disconnectedFromDocument]();
		}

		// MutationObserver
		if ((<Node>this)[PropertySymbol.observers].length > 0) {
			const record = new MutationRecord({
				target: this,
				type: MutationTypeEnum.childList,
				addedNodes: [node]
			});

			for (const observer of (<Node>this)[PropertySymbol.observers]) {
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
	 * @param node Node to remove.
	 * @returns Removed node.
	 */
	public [PropertySymbol.removeChild](node: Node): Node {
		if (this[PropertySymbol.isConnected]) {
			(this[PropertySymbol.ownerDocument] || this)[PropertySymbol.cacheID]++;
		}

		this[PropertySymbol.childNodes][PropertySymbol.removeChild](node);

		let parent: Node = this;
		while (parent) {
			parent[PropertySymbol.childNodesFlatten][PropertySymbol.removeChild](node);
			parent = parent[PropertySymbol.parentNode];
		}

		if ((<Node>node)[PropertySymbol.isConnected]) {
			(<Node>node)[PropertySymbol.disconnectedFromDocument]();
		}

		// MutationObserver
		if ((<Node>this)[PropertySymbol.observers].length > 0) {
			const record = new MutationRecord({
				target: this,
				type: MutationTypeEnum.childList,
				removedNodes: [node]
			});

			for (const observer of (<Node>this)[PropertySymbol.observers]) {
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
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @returns Inserted node.
	 */
	public [PropertySymbol.insertBefore](newNode: Node, referenceNode: Node | null): Node {
		if (NodeUtility.isInclusiveAncestor(newNode, this, true)) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The new node is a parent of the node to insert to.",
				DOMExceptionNameEnum.domException
			);
		}

		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			const childNodes = (<Node>newNode)[PropertySymbol.childNodes];
			while (childNodes.length > 0) {
				this.insertBefore(childNodes[0], referenceNode);
			}
			return newNode;
		}

		// If the referenceNode is null or undefined, then the newNode should be appended to the ancestorNode.
		// According to spec only null is valid, but browsers support undefined as well.
		if (!referenceNode) {
			this.appendChild(newNode);
			return newNode;
		}

		if (!this[PropertySymbol.childNodes][PropertySymbol.includes](referenceNode)) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		if (this[PropertySymbol.isConnected]) {
			(this[PropertySymbol.ownerDocument] || this)[PropertySymbol.cacheID]++;
		}

		if (newNode[PropertySymbol.parentNode]) {
			newNode[PropertySymbol.parentNode][PropertySymbol.childNodes][PropertySymbol.removeChild](
				newNode
			);
			let parent: Node = newNode[PropertySymbol.parentNode];
			while (parent) {
				parent[PropertySymbol.childNodesFlatten][PropertySymbol.removeChild](newNode);
				parent = parent[PropertySymbol.parentNode];
			}
		}

		this[PropertySymbol.childNodes][PropertySymbol.insertBefore](newNode, referenceNode);

		let parent: Node = this;
		while (parent) {
			parent[PropertySymbol.childNodesFlatten][PropertySymbol.insertBefore](newNode, referenceNode);
			parent = parent[PropertySymbol.parentNode];
		}

		newNode[PropertySymbol.parentNode] = this;

		if (this[PropertySymbol.isConnected] && !(<Node>newNode)[PropertySymbol.isConnected]) {
			(<Node>newNode)[PropertySymbol.isConnected] = true;
			(<Node>newNode)[PropertySymbol.connectedToDocument]();
		} else if (!this[PropertySymbol.isConnected] && (<Node>newNode)[PropertySymbol.isConnected]) {
			(<Node>newNode)[PropertySymbol.isConnected] = false;
			(<Node>newNode)[PropertySymbol.disconnectedFromDocument]();
		}

		// MutationObserver
		if ((<Node>this)[PropertySymbol.observers].length > 0) {
			const record = new MutationRecord({
				target: this,
				type: MutationTypeEnum.childList,
				addedNodes: [newNode]
			});

			for (const observer of (<Node>this)[PropertySymbol.observers]) {
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
	 * Replaces a node with another.
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @returns Replaced node.
	 */
	public [PropertySymbol.replaceChild](newChild: Node, oldChild: Node): Node {
		this.insertBefore(newChild, oldChild);
		this.removeChild(oldChild);

		return oldChild;
	}

	/**
	 * Compares two nodes.
	 * Two nodes are equal if they have the same type, defining the same attributes, and so on.
	 *
	 * @param node  Node to compare.
	 * @returns boolean - `true` if two nodes are equal.
	 */
	public isEqualNode(node: Node): boolean {
		return NodeUtility.isEqualNode(this, node);
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
	public [PropertySymbol.observe](listener: MutationListener): void {
		this[PropertySymbol.observers].push(listener);
		if (listener.options.subtree) {
			for (const node of this[PropertySymbol.childNodes]) {
				(<Node>node)[PropertySymbol.observe](listener);
			}
		}
	}

	/**
	 * Stops observing the node.
	 * Used by MutationObserver, but it is not part of the HTML standard.
	 *
	 * @param listener Listener.
	 */
	public [PropertySymbol.unobserve](listener: MutationListener): void {
		const index = this[PropertySymbol.observers].indexOf(listener);
		if (index !== -1) {
			this[PropertySymbol.observers].splice(index, 1);
		}
		if (listener.options.subtree) {
			for (const node of this[PropertySymbol.childNodes]) {
				(<Node>node)[PropertySymbol.unobserve](listener);
			}
		}
	}

	/**
	 * Called when connected to document.
	 */
	public [PropertySymbol.connectedToDocument](): void {
		if (this[PropertySymbol.nodeType] !== NodeTypeEnum.documentFragmentNode) {
			this[PropertySymbol.rootNode] = this[PropertySymbol.parentNode][PropertySymbol.rootNode];
		}

		if (this.connectedCallback) {
			const result = <void | Promise<void>>this.connectedCallback();

			/**
			 * It is common to import dependencies in the connectedCallback() method of web components.
			 * As Happy DOM doesn't have support for dynamic imports yet, this is a temporary solution to wait for imports in connectedCallback().
			 *
			 * @see https://github.com/capricorn86/happy-dom/issues/1442
			 */
			if (result instanceof Promise) {
				const asyncTaskManager =
					this[PropertySymbol.ownerDocument][PropertySymbol.ownerWindow][
						PropertySymbol.asyncTaskManager
					];
				const taskID = asyncTaskManager.startTask();
				result
					.then(() => asyncTaskManager.endTask(taskID))
					.catch(() => asyncTaskManager.endTask(taskID));
			}
		}

		for (const child of this[PropertySymbol.childNodes]) {
			(<Node>child)[PropertySymbol.connectedToDocument]();
		}

		// eslint-disable-next-line
		if ((<any>this)[PropertySymbol.shadowRoot]) {
			// eslint-disable-next-line
			(<any>this)[PropertySymbol.shadowRoot][PropertySymbol.connectedToDocument]();
		}
	}

	/**
	 * Called when disconnected from document.
	 * @param e
	 */
	public [PropertySymbol.disconnectedFromDocument](): void {
		this[PropertySymbol.rootNode] = null;

		if (this[PropertySymbol.ownerDocument][PropertySymbol.activeElement] === <unknown>this) {
			this[PropertySymbol.ownerDocument][PropertySymbol.activeElement] = null;
		}

		if (this.disconnectedCallback) {
			this.disconnectedCallback();
		}

		for (const child of this[PropertySymbol.childNodes]) {
			(<Node>child)[PropertySymbol.disconnectedFromDocument]();
		}

		// eslint-disable-next-line
		if ((<any>this)[PropertySymbol.shadowRoot]) {
			// eslint-disable-next-line
			(<any>this)[PropertySymbol.shadowRoot][PropertySymbol.disconnectedFromDocument]();
		}
	}

	/**
	 * Reports the position of its argument node relative to the node on which it is called.
	 *
	 * @see https://dom.spec.whatwg.org/#dom-node-comparedocumentposition
	 * @param otherNode Other node.
	 */
	public compareDocumentPosition(otherNode: Node): number {
		/**
		 * 1. If this is other, then return zero.
		 */
		if (this === otherNode) {
			return 0;
		}

		/**
		 * 2. Let node1 be other and node2 be this.
		 */
		let node1: Node = otherNode;
		let node2: Node = this;

		/**
		 * 3. Let attr1 and attr2 be null.
		 */
		let attr1 = null;
		let attr2 = null;

		/**
		 * 4. If node1 is an attribute, then set attr1 to node1 and node1 to attr1’s element.
		 */
		if (node1[PropertySymbol.nodeType] === NodeTypeEnum.attributeNode) {
			attr1 = node1;
			node1 = (<Attr>attr1)[PropertySymbol.ownerElement];
		}

		/**
		 * 5. If node2 is an attribute, then:
		 * 5.1. Set attr2 to node2 and node2 to attr2’s element.
		 */
		if (node2[PropertySymbol.nodeType] === NodeTypeEnum.attributeNode) {
			attr2 = node2;
			node2 = (<Attr>attr2)[PropertySymbol.ownerElement];

			/**
			 * 5.2. If attr1 and node1 are non-null, and node2 is node1, then:
			 */
			if (attr1 !== null && node1 !== null && node2 === node1) {
				/**
				 * 5.2.1. For each attr in node2’s attribute list:
				 */
				for (const attr of Object.values((<Element>node2)[PropertySymbol.attributes])) {
					/**
					 * 5.2.1.1. If attr equals attr1, then return the result of adding DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and DOCUMENT_POSITION_PRECEDING.
					 */
					if (NodeUtility.isEqualNode(<Attr>attr, attr1)) {
						return (
							Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | Node.DOCUMENT_POSITION_PRECEDING
						);
					}

					/**
					 * 5.2.1.2. If attr equals attr2, then return the result of adding DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC and DOCUMENT_POSITION_FOLLOWING.
					 */
					if (NodeUtility.isEqualNode(<Attr>attr, attr2)) {
						return (
							Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | Node.DOCUMENT_POSITION_FOLLOWING
						);
					}
				}
			}
		}

		const node2Ancestors: Node[] = [];
		let node2Ancestor: Node = node2;

		while (node2Ancestor) {
			/**
			 * 7. If node1 is an ancestor of node2 […] then return the result of adding DOCUMENT_POSITION_CONTAINS to DOCUMENT_POSITION_PRECEDING.
			 */
			if (node2Ancestor === node1) {
				return Node.DOCUMENT_POSITION_CONTAINS | Node.DOCUMENT_POSITION_PRECEDING;
			}

			node2Ancestors.push(node2Ancestor);
			node2Ancestor = node2Ancestor[PropertySymbol.parentNode];
		}

		const node1Ancestors: Node[] = [];
		let node1Ancestor: Node = node1;

		while (node1Ancestor) {
			/**
			 * 8. If node1 is a descendant of node2 […] then return the result of adding DOCUMENT_POSITION_CONTAINED_BY to DOCUMENT_POSITION_FOLLOWING.
			 */
			if (node1Ancestor === node2) {
				return Node.DOCUMENT_POSITION_CONTAINED_BY | Node.DOCUMENT_POSITION_FOLLOWING;
			}

			node1Ancestors.push(node1Ancestor);
			node1Ancestor = node1Ancestor[PropertySymbol.parentNode];
		}

		const reverseArrayIndex = (array: Node[], reverseIndex: number): Node => {
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

		const computeNodeIndexes = (nodes: INodeList<Node>): void => {
			for (const childNode of nodes) {
				computeNodeIndexes(childNode[PropertySymbol.childNodes]);

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

		computeNodeIndexes(commonAncestor[PropertySymbol.childNodes]);

		/**
		 * 9. If node1 is preceding node2, then return DOCUMENT_POSITION_PRECEDING.
		 * 10. Return DOCUMENT_POSITION_FOLLOWING.
		 */
		return node1Index < node2Index
			? Node.DOCUMENT_POSITION_PRECEDING
			: Node.DOCUMENT_POSITION_FOLLOWING;
	}

	/**
	 * Normalizes the sub-tree of the node, i.e. joins adjacent text nodes, and
	 * removes all empty text nodes.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/normalize
	 */
	public normalize(): void {
		let child = this.firstChild;
		while (child) {
			if (NodeUtility.isTextNode(child)) {
				// Append text of all following text nodes, and remove them.
				while (NodeUtility.isTextNode(child.nextSibling)) {
					child.data += child.nextSibling.data;
					child.nextSibling.remove();
				}
				// Remove text node if it is still empty.
				if (!child.data.length) {
					const node = child;
					child = child.nextSibling;
					node.remove();
					continue;
				}
			} else {
				// Normalize child nodes recursively.
				child.normalize();
			}
			child = child.nextSibling;
		}
	}

	/**
	 * Determines whether the given node is equal to the current node.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/isSameNode
	 * @param node Node to check.
	 * @returns True if the given node is equal to the current node, otherwise false.
	 */
	public isSameNode(node: Node): boolean {
		return this === node;
	}
}

// According to the spec, these properties should be on the prototype.
(<NodeTypeEnum>Node.prototype.ELEMENT_NODE) = NodeTypeEnum.elementNode;
(<NodeTypeEnum>Node.prototype.ATTRIBUTE_NODE) = NodeTypeEnum.attributeNode;

(<NodeTypeEnum>Node.prototype.TEXT_NODE) = NodeTypeEnum.textNode;
(<NodeTypeEnum>Node.prototype.CDATA_SECTION_NODE) = NodeTypeEnum.cdataSectionNode;
(<NodeTypeEnum>Node.prototype.COMMENT_NODE) = NodeTypeEnum.commentNode;
(<NodeTypeEnum>Node.prototype.DOCUMENT_NODE) = NodeTypeEnum.documentNode;
(<NodeTypeEnum>Node.prototype.DOCUMENT_TYPE_NODE) = NodeTypeEnum.documentTypeNode;
(<NodeTypeEnum>Node.prototype.DOCUMENT_FRAGMENT_NODE) = NodeTypeEnum.documentFragmentNode;
(<NodeTypeEnum>Node.prototype.PROCESSING_INSTRUCTION_NODE) = NodeTypeEnum.processingInstructionNode;
(<NodeDocumentPositionEnum>Node.prototype.DOCUMENT_POSITION_CONTAINED_BY) =
	NodeDocumentPositionEnum.containedBy;
(<NodeDocumentPositionEnum>Node.prototype.DOCUMENT_POSITION_CONTAINS) =
	NodeDocumentPositionEnum.contains;
(<NodeDocumentPositionEnum>Node.prototype.DOCUMENT_POSITION_DISCONNECTED) =
	NodeDocumentPositionEnum.disconnect;
(<NodeDocumentPositionEnum>Node.prototype.DOCUMENT_POSITION_FOLLOWING) =
	NodeDocumentPositionEnum.following;
(<NodeDocumentPositionEnum>Node.prototype.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC) =
	NodeDocumentPositionEnum.implementationSpecific;
(<NodeDocumentPositionEnum>Node.prototype.DOCUMENT_POSITION_PRECEDING) =
	NodeDocumentPositionEnum.preceding;
