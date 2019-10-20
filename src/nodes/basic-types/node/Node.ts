import NodeType from './NodeType';
import Document from '../document/Document';
import ClassList from '../element/ClassList';
import EventTarget from '../../../event/EventTarget';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';
import MutationObserverListener from '../../../mutation-observer/MutationListener';

/**
 * Node
 */
export default class Node extends EventTarget {
	// Public properties
	public static ownerDocument: Document = null;
	public ownerDocument: Document = null;
	public parentNode: Node = null;
	public readonly nodeType: NodeType;
	public readonly childNodes: Node[] = [];

	// Protected properties
	protected _isConnected: boolean = false;

	// Custom Properties (not part of HTML standard)
	protected _observers: MutationObserverListener[] = [];

	/**
	 * Constructor.
	 */
	constructor() {
		super();
		this.ownerDocument = (<typeof Node>this.constructor).ownerDocument;
	}

	/**
	 * "true" if connected to DOM.
	 *
	 * @return {boolean} "true" if connected.
	 */
	public get isConnected(): boolean {
		return this._isConnected;
	}

	/**
	 * Sets the connected state.
	 *
	 * @param {boolean} isConnected "true" if connected.
	 */
	public set isConnected(isConnected) {
		if (this._isConnected !== isConnected) {
			this._isConnected = isConnected;

			for (const child of this.childNodes) {
				child.isConnected = isConnected;
			}

			// eslint-disable-next-line
			if ((<any>this).shadowRoot) {
				// eslint-disable-next-line
				(<any>this).shadowRoot.isConnected = isConnected;
			}

			if (isConnected && this.connectedCallback) {
				this.connectedCallback();
			} else if (!isConnected && this.disconnectedCallback) {
				this.disconnectedCallback();
			}
		}
	}

	/**
	 * Node value.
	 *
	 * @return {string} Node value.
	 */
	public get nodeValue(): string {
		return null;
	}

	/**
	 * Node name.
	 *
	 * @return {string} Node name.
	 */
	public get nodeName(): string {
		return '';
	}

	/**
	 * Previous sibling.
	 *
	 * @return {Node} Node.
	 */
	public get previousSibling(): Node {
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
	 * @return {Node} Node.
	 */
	public get nextSibling(): Node {
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
	 * @return {Node} Node.
	 */
	public get firstChild(): Node {
		if (this.childNodes.length > 0) {
			return this.childNodes[0];
		}
		return null;
	}

	/**
	 * Last child.
	 *
	 * @return {Node} Node.
	 */
	public get lastChild(): Node {
		if (this.childNodes.length > 0) {
			return this.childNodes[this.childNodes.length - 1];
		}
		return null;
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
	 * Returns "true" if the node has attributes.
	 *
	 * @return {boolean} "true" if the node has attributes.
	 */
	public hasAttributes(): boolean {
		return false;
	}

	/**
	 * Clones a node.
	 *
	 * @param {boolean} [deep=true] "false" to not clone deep.
	 * @return {Node} Cloned node.
	 */
	public cloneNode(deep = true): Node {
		const clone = new (<typeof Node>this.constructor)();
		for (const key of Object.keys(this)) {
			if (key !== '_isConnected' && key !== '_observers') {
				if (key === 'childNodes') {
					if (deep) {
						for (const childNode of this[key]) {
							const childClone = childNode.cloneNode();
							childClone.parentNode = clone;
							clone.childNodes.push(childClone);
						}
					}
				} else if (key !== 'parentNode' && key !== 'ownerDocument' && this[key] instanceof Node) {
					if (deep) {
						clone[key] = this[key].cloneNode();
						clone[key].parentNode = clone;
					}
				} else if (key === 'classList') {
					// eslint-disable-next-line
					clone[key] = new ClassList(<any>clone);
				} else if (key === '_attributesMap') {
					clone[key] = Object.assign({}, this[key]);
				} else {
					clone[key] = this[key];
				}
			}
		}
		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  {Node} node Node to append.
	 * @return {Node} Appended node.
	 */
	public appendChild(node: Node): Node {
		if (node === this) {
			throw new Error('Not possible to append self as child self.');
		}

		if (node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) {
			for (const child of node.childNodes.slice()) {
				this.appendChild(child);
			}
			return node;
		}

		if (node.parentNode) {
			const index = node.parentNode.childNodes.indexOf(node);
			if (index !== -1) {
				node.parentNode.childNodes.splice(index, 1);
			}
		}

		this.childNodes.push(node);

		node.parentNode = this;
		node.isConnected = this.isConnected;

		// MutationObserver
		if (this._observers.length > 0) {
			const record = new MutationRecord();
			record.type = MutationTypeConstant.childList;
			record.addedNodes = [node];

			for (const observer of this._observers) {
				if (observer.options.subtree) {
					node._observe(observer);
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
	 * @param {Node} node Node to remove
	 */
	public removeChild(node: Node): void {
		const index = this.childNodes.indexOf(node);
		if (index === -1) {
			throw new Error('Failed to remove node. Node is not child of parent.');
		}
		this.childNodes.splice(index, 1);
		node.parentNode = null;
		node.isConnected = false;

		// MutationObserver
		if (this._observers.length > 0) {
			const record = new MutationRecord();
			record.type = MutationTypeConstant.childList;
			record.removedNodes = [node];

			for (const observer of this._observers) {
				node._unobserve(observer);
				if (observer.options.childList) {
					observer.callback([record]);
				}
			}
		}
	}

	/**
	 * Inserts a node before another.
	 *
	 * @param {Node} newNode Node to insert.
	 * @param {Node} referenceNode Node to insert before.
	 * @return {Node} Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode: Node): Node {
		if (newNode.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE) {
			for (const child of newNode.childNodes.slice()) {
				this.insertBefore(child, referenceNode);
			}
			return newNode;
		}

		if (referenceNode === null) {
			return this.appendChild(newNode);
		}

		const index = this.childNodes.indexOf(referenceNode);

		if (index === -1) {
			throw new Error('Failed to insert node. Reference node is not child of parent.');
		}

		if (newNode.parentNode) {
			const index = newNode.parentNode.childNodes.indexOf(newNode);
			if (index !== -1) {
				newNode.parentNode.childNodes.splice(index, 1);
			}
		}

		this.childNodes.splice(index, 0, newNode);

		newNode.parentNode = this;
		newNode.isConnected = this.isConnected;

		// MutationObserver
		if (this._observers.length > 0) {
			const record = new MutationRecord();
			record.type = MutationTypeConstant.childList;
			record.addedNodes = [newNode];

			for (const observer of this._observers) {
				if (observer.options.subtree) {
					newNode._observe(observer);
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
	 * @param {Node} newChild New child.
	 * @param {Node} oldChild Old child.
	 * @return {Node} Replaced node.
	 */
	public replaceChild(newChild: Node, oldChild: Node): Node {
		this.insertBefore(newChild, oldChild);
		this.removeChild(oldChild);

		return oldChild;
	}

	/**
	 * Observeres the node.
	 * Used by MutationObserver, but it is not part of the HTML standard.
	 *
	 * @param {MutationObserverListener} listener Listener.
	 */
	public _observe(listener: MutationObserverListener): void {
		this._observers.push(listener);
		if (listener.options.subtree) {
			for (const node of this.childNodes) {
				node._observe(listener);
			}
		}
	}

	/**
	 * Stops observing the node.
	 * Used by MutationObserver, but it is not part of the HTML standard.
	 *
	 * @param {MutationObserverListener} listener Listener.
	 */
	public _unobserve(listener: MutationObserverListener): void {
		const index = this._observers.indexOf(listener);
		if (index !== -1) {
			this._observers.splice(index, 1);
		}
		if (listener.options.subtree) {
			for (const node of this.childNodes) {
				node._unobserve(listener);
			}
		}
	}
}

// Adds Note types to the Node class (part of the HTML standard)
for (const key of Object.keys(NodeType)) {
	Node[key] = NodeType[key];
}
