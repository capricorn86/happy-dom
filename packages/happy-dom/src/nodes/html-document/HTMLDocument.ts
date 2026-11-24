import Document from '../document/Document.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import type Node from '../node/Node.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';

/**
 * Document.
 */
export default class HTMLDocument extends Document {
	/**
	 * Constructor.
	 */
	constructor() {
		super();

		// Default document elements
		const documentElement = this.createElement('html');
		const bodyElement = this.createElement('body');
		const headElement = this.createElement('head');

		this.appendChild(documentElement);

		documentElement.appendChild(headElement);
		documentElement.appendChild(bodyElement);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.appendChild](node: Node, disableValidations = false): Node {
		if (node[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'appendChild' on 'Node': Nodes of type '#text' may not be inserted inside nodes of type '#document'.`
			);
		}

		if (node[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			return node;
		}

		if (
			node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
			this[PropertySymbol.elementArray].length !== 0
		) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'appendChild' on 'Node': Only one element on document allowed.`
			);
		}

		return super[PropertySymbol.appendChild](node, disableValidations);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.insertBefore](
		newNode: Node,
		referenceNode: Node | null,
		disableValidations = false
	): Node {
		if (newNode[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'insertBefore' on 'Node': Nodes of type '#text' may not be inserted inside nodes of type '#document'.`
			);
		}

		if (newNode[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode) {
			return newNode;
		}

		if (
			newNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
			this[PropertySymbol.elementArray].length !== 0
		) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'insertBefore' on 'Node': Only one element on document allowed.`
			);
		}

		return super[PropertySymbol.insertBefore](newNode, referenceNode, disableValidations);
	}

	/**
	 * @override
	 */
	public override [PropertySymbol.replaceChild](newChild: Node, oldChild: Node): Node {
		const isFragment = newChild[PropertySymbol.nodeType] === NodeTypeEnum.documentFragmentNode;
		const nodes = isFragment ? Array.from(newChild[PropertySymbol.nodeArray]) : [newChild];
		let elementCount = 0;

		// The document checks run before the old child is removed, so that a failed replace leaves
		// the document as it was.
		for (const node of nodes) {
			if (node[PropertySymbol.nodeType] === NodeTypeEnum.textNode) {
				throw new this[PropertySymbol.window].Error(
					`Failed to execute 'replaceChild' on 'Node': Nodes of type '#text' may not be inserted inside nodes of type '#document'.`
				);
			}

			if (node[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				elementCount++;
			}
		}

		if (
			elementCount > 1 ||
			(elementCount === 1 &&
				this[PropertySymbol.elementArray].some((element) => element !== oldChild))
		) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'replaceChild' on 'Node': Only one element on document allowed.`
			);
		}

		if (!isFragment) {
			return super[PropertySymbol.replaceChild](newChild, oldChild);
		}

		// insertBefore() on a document ignores fragments, so their children are moved one by one.
		if (nodes.length === 0) {
			return this[PropertySymbol.removeChild](oldChild);
		}

		super[PropertySymbol.replaceChild](nodes[0], oldChild);

		const referenceChild = nodes[0].nextSibling;

		for (let i = 1; i < nodes.length; i++) {
			this[PropertySymbol.insertBefore](nodes[i], referenceChild, true);
		}

		return oldChild;
	}
}
