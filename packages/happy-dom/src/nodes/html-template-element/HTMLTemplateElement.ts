import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Node from '../node/Node.js';
import ShadowRoot from '../shadow-root/ShadowRoot.js';
import HTMLSerializer from '../../html-serializer/HTMLSerializer.js';
import HTMLParser from '../../html-parser/HTMLParser.js';
import NodeUtility from '../node/NodeUtility.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Element from '../element/Element.js';

/**
 * HTML Template Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement.
 */
export default class HTMLTemplateElement extends HTMLElement {
	// Public properties
	public declare cloneNode: (deep?: boolean) => HTMLTemplateElement;

	// Internal properties
	public [PropertySymbol.content]: DocumentFragment =
		this[PropertySymbol.ownerDocument].createDocumentFragment();

	/**
	 * Returns content.
	 *
	 * @returns Content.
	 */
	public get content(): DocumentFragment {
		return this[PropertySymbol.content];
	}

	/**
	 * @override
	 */
	public override get innerHTML(): string {
		return this.getHTML();
	}

	/**
	 * @override
	 */
	public override set innerHTML(html: string) {
		const content = <DocumentFragment>this[PropertySymbol.content];
		const childNodes = content[PropertySymbol.nodeArray];

		while (childNodes.length) {
			content.removeChild(childNodes[0]);
		}

		new HTMLParser(this[PropertySymbol.window], { isTemplateDocumentFragment: true }).parse(
			html,
			this[PropertySymbol.content]
		);
	}

	/**
	 * @override
	 */
	public override get firstChild(): Node | null {
		return this[PropertySymbol.content].firstChild;
	}

	/**
	 * @override
	 */
	public override get lastChild(): Node | null {
		return this[PropertySymbol.content].lastChild;
	}

	/**
	 * @deprecated
	 * @override
	 */
	public override getInnerHTML(_options?: { includeShadowRoots?: boolean }): string {
		const serializer = new HTMLSerializer();

		// Options should be ignored as shadow roots should not be serialized for HTMLTemplateElement.

		const content = <DocumentFragment>this[PropertySymbol.content];
		let html = '';

		for (const node of content[PropertySymbol.nodeArray]) {
			html += serializer.serializeToString(node);
		}

		return html;
	}

	/**
	 * @override
	 */
	public override getHTML(_options?: {
		serializableShadowRoots?: boolean;
		shadowRoots?: ShadowRoot[];
	}): string {
		const serializer = new HTMLSerializer();

		// Options should be ignored as shadow roots should not be serialized for HTMLTemplateElement.

		const content = <DocumentFragment>this[PropertySymbol.content];
		let html = '';

		for (const node of content[PropertySymbol.nodeArray]) {
			html += serializer.serializeToString(node);
		}

		return html;
	}

	/**
	 * Append a child node to childNodes.
	 *
	 * Per browser behavior, this adds the node as a direct child of the template element,
	 * not to the content DocumentFragment.
	 *
	 * @override
	 * @param node Node to append.
	 * @returns Appended node.
	 */
	public override appendChild(node: Node): Node {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendChild' on 'Node': 1 argument required, but only 0 present`
			);
		}
		return this.#appendChildDirectly(node);
	}

	/**
	 * Remove Child element from childNodes array.
	 *
	 * Per browser behavior, this removes a direct child of the template element,
	 * not from the content DocumentFragment.
	 *
	 * @override
	 * @param node Node to remove.
	 * @returns Removed node.
	 */
	public override removeChild(node: Node): Node {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'removeChild' on 'Node': 1 argument required, but only 0 present`
			);
		}
		return this.#removeChildDirectly(node);
	}

	/**
	 * Inserts a node before another.
	 *
	 * Per browser behavior, this inserts the node as a direct child of the template element,
	 * not into the content DocumentFragment.
	 *
	 * @override
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @returns Inserted node.
	 */
	public override insertBefore(newNode: Node, referenceNode: Node | null): Node {
		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertBefore' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}
		return this.#insertBeforeDirectly(newNode, referenceNode);
	}

	/**
	 * Replaces a node with another.
	 *
	 * Per browser behavior, this replaces a direct child of the template element,
	 * not in the content DocumentFragment.
	 *
	 * @override
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @returns Replaced node.
	 */
	public override replaceChild(newChild: Node, oldChild: Node): Node {
		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'replaceChild' on 'Node': 2 arguments required, but only ${arguments.length} present.`
			);
		}
		return this.#replaceChildDirectly(newChild, oldChild);
	}

	/**
	 * Appends a child node directly to this element (not to content).
	 *
	 * @param node Node to append.
	 * @returns Appended node.
	 */
	#appendChildDirectly(node: Node): Node {
		if (node[PropertySymbol.proxy]) {
			node = node[PropertySymbol.proxy];
		}

		const self = this[PropertySymbol.proxy] || this;

		if (node === self) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'appendChild' on 'Node': Not possible to append a node as a child of itself."
			);
		}

		if (NodeUtility.isInclusiveAncestor(node, self, true)) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'appendChild' on 'Node': The new node is a parent of the node to append to.",
				DOMExceptionNameEnum.domException
			);
		}

		// Handle DocumentFragment
		if (node[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			const childNodes = node[PropertySymbol.nodeArray];
			while (childNodes.length > 0) {
				this.#appendChildDirectly(childNodes[0]);
			}
			return node;
		}

		if (node[PropertySymbol.parentNode]) {
			node[PropertySymbol.parentNode].removeChild(node);
		}

		node[PropertySymbol.parentNode] = self;
		node[PropertySymbol.clearCache]();

		this[PropertySymbol.nodeArray].push(node);

		if (node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			this[PropertySymbol.elementArray].push(<Element>node);
		}

		return node;
	}

	/**
	 * Removes a child node directly from this element (not from content).
	 *
	 * @param node Node to remove.
	 * @returns Removed node.
	 */
	#removeChildDirectly(node: Node): Node {
		if (node[PropertySymbol.proxy]) {
			node = node[PropertySymbol.proxy];
		}

		const nodeArray = this[PropertySymbol.nodeArray];
		const index = nodeArray.indexOf(node);

		if (index === -1) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
			);
		}

		nodeArray.splice(index, 1);

		if (node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			const elementArray = this[PropertySymbol.elementArray];
			const elementIndex = elementArray.indexOf(<Element>node);
			if (elementIndex !== -1) {
				elementArray.splice(elementIndex, 1);
			}
		}

		node[PropertySymbol.parentNode] = null;
		node[PropertySymbol.clearCache]();

		return node;
	}

	/**
	 * Inserts a node before another directly in this element (not in content).
	 *
	 * @param newNode Node to insert.
	 * @param referenceNode Node to insert before.
	 * @returns Inserted node.
	 */
	#insertBeforeDirectly(newNode: Node, referenceNode: Node | null): Node {
		if (newNode[PropertySymbol.proxy]) {
			newNode = newNode[PropertySymbol.proxy];
		}

		if (referenceNode && referenceNode[PropertySymbol.proxy]) {
			referenceNode = referenceNode[PropertySymbol.proxy];
		}

		if (newNode === referenceNode) {
			return newNode;
		}

		const self = this[PropertySymbol.proxy] || this;

		if (newNode === self) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'insertBefore' on 'Node': Not possible to insert a node as a child of itself."
			);
		}

		if (NodeUtility.isInclusiveAncestor(newNode, self, true)) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'insertBefore' on 'Node': The new node is a parent of the node to insert to.",
				DOMExceptionNameEnum.domException
			);
		}

		// Handle DocumentFragment
		if (newNode[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			const childNodes = newNode[PropertySymbol.nodeArray];
			while (childNodes.length > 0) {
				this.#insertBeforeDirectly(childNodes[0], referenceNode);
			}
			return newNode;
		}

		// If referenceNode is null, append
		if (!referenceNode) {
			return this.#appendChildDirectly(newNode);
		}

		const nodeArray = this[PropertySymbol.nodeArray];

		if (!nodeArray.includes(referenceNode)) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
			);
		}

		if (newNode[PropertySymbol.parentNode]) {
			newNode[PropertySymbol.parentNode].removeChild(newNode);
		}

		newNode[PropertySymbol.parentNode] = self;
		newNode[PropertySymbol.clearCache]();

		const index = nodeArray.indexOf(referenceNode);
		nodeArray.splice(index, 0, newNode);

		if (newNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			const elementArray = this[PropertySymbol.elementArray];
			if (referenceNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				elementArray.splice(elementArray.indexOf(<Element>referenceNode), 0, <Element>newNode);
			} else {
				// Find the next element after referenceNode
				let inserted = false;
				for (let i = index + 1; i < nodeArray.length; i++) {
					if (nodeArray[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
						elementArray.splice(elementArray.indexOf(<Element>nodeArray[i]), 0, <Element>newNode);
						inserted = true;
						break;
					}
				}
				if (!inserted) {
					elementArray.push(<Element>newNode);
				}
			}
		}

		return newNode;
	}

	/**
	 * Replaces a child node directly in this element (not in content).
	 *
	 * @param newChild New child.
	 * @param oldChild Old child.
	 * @returns Replaced node.
	 */
	#replaceChildDirectly(newChild: Node, oldChild: Node): Node {
		if (newChild[PropertySymbol.proxy]) {
			newChild = newChild[PropertySymbol.proxy];
		}

		if (oldChild[PropertySymbol.proxy]) {
			oldChild = oldChild[PropertySymbol.proxy];
		}

		const self = this[PropertySymbol.proxy] || this;

		if (newChild === self) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'replaceChild' on 'Node': Not possible to replace with a node as a child of itself."
			);
		}

		if (NodeUtility.isInclusiveAncestor(newChild, self, true)) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'replaceChild' on 'Node': The new node is a parent of the node to replace.",
				DOMExceptionNameEnum.domException
			);
		}

		const nodeArray = this[PropertySymbol.nodeArray];
		const index = nodeArray.indexOf(oldChild);

		if (index === -1) {
			throw new this[PropertySymbol.window].DOMException(
				"Failed to execute 'replaceChild' on 'Node': The node to be replaced is not a child of this node."
			);
		}

		// Handle DocumentFragment
		if (newChild[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			const childNodes = newChild[PropertySymbol.nodeArray];
			if (childNodes.length > 0) {
				// Insert all fragment children before oldChild, then remove oldChild
				while (childNodes.length > 0) {
					this.#insertBeforeDirectly(childNodes[0], oldChild);
				}
				this.#removeChildDirectly(oldChild);
			} else {
				this.#removeChildDirectly(oldChild);
			}
			return oldChild;
		}

		if (newChild[PropertySymbol.parentNode]) {
			newChild[PropertySymbol.parentNode].removeChild(newChild);
		}

		// Remove old child from arrays
		nodeArray.splice(index, 1, newChild);

		if (oldChild[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			const elementArray = this[PropertySymbol.elementArray];
			const elementIndex = elementArray.indexOf(<Element>oldChild);
			if (elementIndex !== -1) {
				if (newChild[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
					elementArray.splice(elementIndex, 1, <Element>newChild);
				} else {
					elementArray.splice(elementIndex, 1);
				}
			}
		} else if (newChild[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			// Old child was not an element, but new child is
			const elementArray = this[PropertySymbol.elementArray];
			// Find the right position in elementArray
			let inserted = false;
			for (let i = index + 1; i < nodeArray.length; i++) {
				if (nodeArray[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
					elementArray.splice(elementArray.indexOf(<Element>nodeArray[i]), 0, <Element>newChild);
					inserted = true;
					break;
				}
			}
			if (!inserted) {
				elementArray.push(<Element>newChild);
			}
		}

		oldChild[PropertySymbol.parentNode] = null;
		oldChild[PropertySymbol.clearCache]();

		newChild[PropertySymbol.parentNode] = self;
		newChild[PropertySymbol.clearCache]();

		return oldChild;
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.appendChild](node: Node, disableValidations = false): Node {
		return this[PropertySymbol.content][PropertySymbol.appendChild](node, disableValidations);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeChild](node: Node): Node {
		return this[PropertySymbol.content][PropertySymbol.removeChild](node);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.insertBefore](
		newNode: Node,
		referenceNode: Node,
		disableValidations = false
	): Node {
		return this[PropertySymbol.content][PropertySymbol.insertBefore](
			newNode,
			referenceNode,
			disableValidations
		);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.replaceChild](newChild: Node, oldChild: Node): Node {
		return this[PropertySymbol.content][PropertySymbol.replaceChild](newChild, oldChild);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.cloneNode](deep = false): HTMLTemplateElement {
		const clone = <HTMLTemplateElement>super[PropertySymbol.cloneNode](deep);
		clone[PropertySymbol.content] = <DocumentFragment>this[PropertySymbol.content].cloneNode(deep);
		return clone;
	}
}
