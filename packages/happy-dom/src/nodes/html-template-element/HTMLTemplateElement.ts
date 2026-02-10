import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type DocumentFragment from '../document-fragment/DocumentFragment.js';
import type Node from '../node/Node.js';
import type ShadowRoot from '../shadow-root/ShadowRoot.js';
import HTMLSerializer from '../../html-serializer/HTMLSerializer.js';
import HTMLParser from '../../html-parser/HTMLParser.js';

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

	// When true, child manipulation methods operate directly on this element
	// rather than redirecting to the content DocumentFragment.
	#directChildManipulation = false;

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
	 * Per browser behavior, public DOM methods operate directly on the template
	 * element rather than redirecting to the content DocumentFragment.
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
		this.#directChildManipulation = true;
		try {
			return this[PropertySymbol.appendChild](node);
		} finally {
			this.#directChildManipulation = false;
		}
	}

	/**
	 * Remove Child element from childNodes array.
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
		this.#directChildManipulation = true;
		try {
			return this[PropertySymbol.removeChild](node);
		} finally {
			this.#directChildManipulation = false;
		}
	}

	/**
	 * Inserts a node before another.
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
		this.#directChildManipulation = true;
		try {
			return this[PropertySymbol.insertBefore](newNode, <Node>referenceNode);
		} finally {
			this.#directChildManipulation = false;
		}
	}

	/**
	 * Replaces a node with another.
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
		this.#directChildManipulation = true;
		try {
			return this[PropertySymbol.replaceChild](newChild, oldChild);
		} finally {
			this.#directChildManipulation = false;
		}
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.appendChild](node: Node, disableValidations = false): Node {
		if (this.#directChildManipulation) {
			return super[PropertySymbol.appendChild](node, disableValidations);
		}
		return this[PropertySymbol.content][PropertySymbol.appendChild](node, disableValidations);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.removeChild](node: Node): Node {
		if (this.#directChildManipulation) {
			return super[PropertySymbol.removeChild](node);
		}
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
		if (this.#directChildManipulation) {
			return super[PropertySymbol.insertBefore](newNode, referenceNode, disableValidations);
		}
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
		if (this.#directChildManipulation) {
			return super[PropertySymbol.replaceChild](newChild, oldChild);
		}
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
