import Document from '../document/Document';
import EventTarget from '../../../event/EventTarget';
import MutationRecord from '../../../mutation-observer/MutationRecord';
import MutationTypeConstant from '../../../mutation-observer/MutationType';
import MutationObserverListener from '../../../mutation-observer/MutationListener';
import Event from '../../../event/Event';
import HTMLParser from '../../../html-parser/HTMLParser';

/**
 * Node
 */
export default class Node extends EventTarget {
	// Public properties
	public static readonly ELEMENT_NODE = 1;
	public static readonly TEXT_NODE = 3;
	public static readonly COMMENT_NODE = 8;
	public static readonly DOCUMENT_NODE = 9;
	public static readonly DOCUMENT_TYPE_NODE = 10;
	public static readonly DOCUMENT_FRAGMENT_NODE = 11;
	public static ownerDocument: Document = null;
	public ownerDocument: Document = null;
	public parentNode: Node = null;
	public readonly nodeType: number;
	public readonly childNodes: Node[] = [];

	// Protected properties
	protected _isConnected = false;

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
	 * @return "true" if connected.
	 */
	public get isConnected(): boolean {
		return this._isConnected;
	}

	/**
	 * Sets the connected state.
	 *
	 * @param isConnected "true" if connected.
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
	 * @return Node value.
	 */
	public get nodeValue(): string {
		return null;
	}

	/**
	 * Node name.
	 *
	 * @return Node name.
	 */
	public get nodeName(): string {
		return '';
	}

	/**
	 * Previous sibling.
	 *
	 * @return Node.
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
	 * @return Node.
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
	 * Previous element sibling.
	 *
	 * @return {Node} Node.
	 */
	public get previousElementSibling(): Node {
		let sibling = this.previousSibling;
		while (sibling && sibling.nodeType !== Node.ELEMENT_NODE) {
			sibling = sibling.previousSibling;
		}
		return sibling;
	}

	/**
	 * Next element sibling.
	 *
	 * @return {Node} Node.
	 */
	public get nextElementSibling(): Node {
		let sibling = this.nextSibling;
		while (sibling && sibling.nodeType !== Node.ELEMENT_NODE) {
			sibling = sibling.nextSibling;
		}
		return sibling;
	}

	/**
	 * First child.
	 *
	 * @return Node.
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
	 * @return Node.
	 */
	public get lastChild(): Node {
		if (this.childNodes.length > 0) {
			return this.childNodes[this.childNodes.length - 1];
		}
		return null;
	}

	/**
	 * First element child.
	 *
	 * @return {Node} Node.
	 */
	public get firstElementChild(): Node {
		return this['children'] ? this['children'][0] || null : null;
	}

	/**
	 * Last element child.
	 *
	 * @return {Node} Node.
	 */
	public get lastElementChild(): Node {
		return this['children'] ? this['children'][this['children'].length - 1] || null : null;
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
	 * Clones a node.
	 *
	 * @param [deep=false] "true" to clone deep.
	 * @return Cloned node.
	 */
	public cloneNode(deep = false): Node {
		const clone = new (<typeof Node>this.constructor)();

		if (deep) {
			for (const childNode of this.childNodes) {
				const childClone = childNode.cloneNode(true);
				childClone.parentNode = clone;
				clone.childNodes.push(childClone);
			}
		}

		clone.ownerDocument = this.ownerDocument;

		return clone;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * @param  node Node to append.
	 * @return Appended node.
	 */
	public appendChild(node: Node): Node {
		if (node === this) {
			throw new Error('Not possible to append a node as a child of itself.');
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
	 * Removes the node from its parent.
	 */
	public remove(): void {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * @param node Node to remove
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
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @return Inserted node.
	 */
	public insertBefore(newNode: Node, referenceNode: Node): Node {
		// If the type is DocumentFragment, then the child nodes of if it should be moved instead of the actual node.
		// See: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
		if (newNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
			for (const child of newNode.childNodes.slice()) {
				this.insertBefore(child, referenceNode);
			}
			return newNode;
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
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @return Replaced node.
	 */
	public replaceChild(newChild: Node, oldChild: Node): Node {
		this.insertBefore(newChild, oldChild);
		this.removeChild(oldChild);

		return oldChild;
	}

	/**
	 * The Node.replaceWith() method replaces this Node in the children list of its parent with a set of Node or DOMString objects.
	 *
	 * @param nodes List of Node or DOMString.
	 */
	public replaceWith(...nodes: Node[] | string[]): void {
		const parent = this.parentNode;

		if (!parent) {
			return;
		}

		const index = parent.childNodes.indexOf(this);

		parent.removeChild(this);

		for (let i = nodes.length - 1; i >= 0; i--) {
			const node = nodes[i];

			if (typeof node === 'string') {
				parent.childNodes.splice(
					index,
					0,
					...HTMLParser.parse(this.ownerDocument, node).childNodes
				);
			} else {
				parent.childNodes.splice(index, 0, node);
			}
		}
	}

	/**
	 * @override
	 */
	public dispatchEvent(event: Event): boolean {
		const onEventName = 'on' + event.type.toLowerCase();

		if (typeof this[onEventName] === 'function') {
			this[onEventName].call(this, event);
		}

		const returnValue = super.dispatchEvent(event);

		if (event.bubbles && this.parentNode !== null && !event._propagationStopped) {
			return this.parentNode.dispatchEvent(event);
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
	 * @param listener Listener.
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
