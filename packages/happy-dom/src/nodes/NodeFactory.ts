import type Document from '../nodes/document/Document.js';
import type Node from './node/Node.js';
import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Node factory used for setting the owner document to nodes.
 */
export default class NodeFactory {
	public static ownerDocuments: Document[] = [];

	/**
	 * When set, HTMLElement.constructor() returns this element instead of creating a new one.
	 * Used by HTMLElement.[PropertySymbol.onCustomElementConnected]() to upgrade an existing
	 * element in-place: the custom element's constructor runs with `this` = the existing
	 * element, mirroring real browser upgrade-in-place behaviour (spec §4.13.5 "upgrades").
	 * By intercepting in HTMLElement (not Node), the base-class field initialisers
	 * (Element.isValue, Node.nodeArray, etc.) run on a temporary throwaway object and
	 * never corrupt the real element's state.
	 */
	public static upgradeTarget: Node | null = null;

	/**
	 * Creates a node instance with the given owner document.
	 *
	 * @param ownerDocument Owner document.
	 * @param nodeClass Node class.
	 * @param [args] Node arguments.
	 * @returns Node instance.
	 */
	public static createNode<T extends Node>(
		ownerDocument: Document,
		nodeClass: new (...args: any[]) => T,
		...args: any[]
	): T {
		if (!nodeClass.prototype[PropertySymbol.window]) {
			this.ownerDocuments.push(ownerDocument);
		}
		return new nodeClass(...args);
	}

	/**
	 * Pulls an owner document from the queue.
	 *
	 * @returns Document.
	 */
	public static pullOwnerDocument(): Document | null {
		return this.ownerDocuments.pop() || null;
	}
}
