import * as PropertySymbol from '../../PropertySymbol.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Document from '../document/Document.js';
import Element from '../element/Element.js';
import Node from '../node/Node.js';
import NamespaceURI from '../../config/NamespaceURI.js';
import HTMLCollection from '../element/HTMLCollection.js';
import QuerySelector from '../../query-selector/QuerySelector.js';
import ICachedResult from '../node/ICachedResult.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import IMutationListener from '../../mutation-observer/IMutationListener.js';

/**
 * Parent node utility.
 */
export default class ParentNodeUtility {
	/**
	 * Inserts a set of Node objects or DOMString objects after the last child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param parentNode Parent node.
	 * @param nodes List of Node or DOMString.
	 */
	public static append(parentNode: Element | Document | DocumentFragment, ...nodes: any[]): void {
		for (const node of nodes) {
			if (node instanceof Node) {
				parentNode.appendChild(node);
			} else {
				parentNode.appendChild(
					parentNode[PropertySymbol.ownerDocument].createTextNode(String(node))
				);
			}
		}
	}

	/**
	 * Inserts a set of Node objects or DOMString objects before the first child of the ParentNode. DOMString objects are inserted as equivalent Text nodes.
	 *
	 * @param parentNode Parent node.
	 * @param nodes List of Node or DOMString.
	 */
	public static prepend(
		parentNode: Element | Document | DocumentFragment,
		...nodes: (string | Node)[]
	): void {
		const firstChild = parentNode.firstChild;
		for (const node of nodes) {
			if (node instanceof Node) {
				parentNode.insertBefore(node, firstChild);
			} else {
				parentNode.insertBefore(
					parentNode[PropertySymbol.ownerDocument].createTextNode(String(node)),
					firstChild
				);
			}
		}
	}

	/**
	 * Replaces the existing children of a ParentNode with a specified new set of children.
	 *
	 * @param parentNode Parent node.
	 * @param nodes List of Node or DOMString.
	 */
	public static replaceChildren(
		parentNode: Element | Document | DocumentFragment,
		...nodes: (string | Node)[]
	): void {
		this.clearChildren(parentNode);

		this.append(parentNode, ...nodes);
	}

	/**
	 * Removes all children from a node.
	 *
	 * This implements the "replace all" algorithm from the DOM spec, which emits a single
	 * MutationRecord containing all removed nodes, rather than one record per node.
	 *
	 * @see https://dom.spec.whatwg.org/#concept-node-replace-all
	 * @param parentNode Parent node.
	 * @returns Array of removed nodes in removal order.
	 */
	public static clearChildren(parentNode: Element | Document | DocumentFragment): Node[] {
		const nodeArray = parentNode[PropertySymbol.nodeArray];
		if (nodeArray.length === 0) {
			return [];
		}

		const removed: Node[] = nodeArray.slice();

		// Clear arrays first, matching the order in removeChild where splice happens before disconnectedFromNode
		parentNode[PropertySymbol.elementArray].length = 0;
		nodeArray.length = 0;

		// Track affected slots for shadow DOM to dispatch 'slotchange' once per slot.
		let defaultSlotAffected = false;
		const namedSlotsAffected = new Set<string>();
		const hasShadowRoot = parentNode instanceof Element && !!parentNode[PropertySymbol.shadowRoot];
		const isConnected = parentNode[PropertySymbol.isConnected];

		for (let i = 0; i < removed.length; i++) {
			const node = removed[i];

			node[PropertySymbol.parentNode] = null;
			node[PropertySymbol.clearCache]();
			if (node[PropertySymbol.assignedToSlot]) {
				const slot = node[PropertySymbol.assignedToSlot];
				const list = slot[PropertySymbol.assignedNodes];
				const idx = list.indexOf(node);
				if (idx !== -1) {
					list.splice(idx, 1);
				}
				node[PropertySymbol.assignedToSlot] = null;
			}
			node[PropertySymbol.disconnectedFromNode]();

			// Mark affected slots to align with Element.#onSlotChange behavior.
			if (hasShadowRoot && isConnected) {
				// Named slot if the removed node has a slot attribute.
				const slotName = node instanceof Element ? node.getAttribute('slot') : null;
				if (slotName) {
					namedSlotsAffected.add(slotName);
				} else if (node[PropertySymbol.nodeType] !== NodeTypeEnum.commentNode) {
					defaultSlotAffected = true;
				}
			}
		}

		// Unobserve subtree mutation listeners from removed nodes.
		const mutationListeners: IMutationListener[] = parentNode[PropertySymbol.mutationListeners];
		if (mutationListeners.length) {
			for (const node of removed) {
				for (const mutationListener of mutationListeners) {
					if (mutationListener.options?.subtree && mutationListener.callback.deref()) {
						node[PropertySymbol.unobserveMutations](mutationListener);
					}
				}
			}
		}

		// Per DOM spec "replace all" algorithm: emit a single MutationRecord with all removed nodes.
		// @see https://dom.spec.whatwg.org/#concept-node-replace-all
		parentNode[PropertySymbol.reportMutation](
			new MutationRecord({
				target: (<Element>parentNode)[PropertySymbol.proxy] || parentNode,
				type: MutationTypeEnum.childList,
				removedNodes: removed
			})
		);

		// Dispatch 'slotchange' on affected slots (once per slot).
		if (hasShadowRoot && isConnected) {
			const shadowRoot = (<Element>parentNode)[PropertySymbol.shadowRoot]!;
			for (const name of namedSlotsAffected) {
				const slot = shadowRoot.querySelector(`slot[name="${name}"]`);
				if (slot) {
					slot.dispatchEvent(
						new parentNode[PropertySymbol.window].Event('slotchange', { bubbles: true })
					);
				}
			}
			if (defaultSlotAffected) {
				const defaultSlot = shadowRoot.querySelector('slot:not([name])');
				if (defaultSlot) {
					defaultSlot.dispatchEvent(
						new parentNode[PropertySymbol.window].Event('slotchange', { bubbles: true })
					);
				}
			}
		}

		return removed;
	}

	/**
	 * Returns an elements by class name.
	 *
	 * @param parentNode Parent node.
	 * @param className Tag name.
	 * @returns Matching element.
	 */
	public static getElementsByClassName(
		parentNode: Element | DocumentFragment | Document,
		className: string
	): HTMLCollection<Element> {
		return new HTMLCollection(
			PropertySymbol.illegalConstructor,
			() =>
				QuerySelector.querySelectorAll(parentNode, `.${className.replace(/\s+/gm, '.')}`)[
					PropertySymbol.items
				]
		);
	}

	/**
	 * Returns an elements by tag name.
	 *
	 * @param parentNode Parent node.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public static getElementsByTagName<T extends Element = Element>(
		parentNode: Element | DocumentFragment | Document,
		tagName: string
	): HTMLCollection<T> {
		const upperTagName = tagName.toUpperCase();
		const includeAll = tagName === '*';

		const find = (
			parent: Element | DocumentFragment | Document,
			cachedResult: ICachedResult
		): T[] => {
			const elements: T[] = [];

			for (const element of (<DocumentFragment>parent)[PropertySymbol.elementArray]) {
				if (includeAll || element[PropertySymbol.tagName]!.toUpperCase() === upperTagName) {
					elements.push(<T>element);
				}

				element[PropertySymbol.affectsCache].push(cachedResult);

				for (const foundElement of find(<Element>element, cachedResult)) {
					elements.push(foundElement);
				}
			}

			return elements;
		};

		const query = (): T[] => {
			const cache = parentNode[PropertySymbol.cache].elementsByTagName;
			const cachedItems = cache.get(tagName);

			if (cachedItems?.result) {
				const items = cachedItems.result.deref();
				if (items) {
					return <T[]>items;
				}
			}

			const cachedResult: ICachedResult = { result: null };
			const items = find(parentNode, cachedResult);

			cachedResult.result = new WeakRef(items);
			cache.set(tagName, cachedResult);

			return items;
		};

		return new HTMLCollection<T>(PropertySymbol.illegalConstructor, query);
	}

	/**
	 * Returns an elements by tag name and namespace.
	 *
	 * @param parentNode Parent node.
	 * @param namespaceURI Namespace URI.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public static getElementsByTagNameNS(
		parentNode: Element | DocumentFragment | Document,
		namespaceURI: string,
		tagName: string
	): HTMLCollection<Element> {
		// When the namespace is HTML, the tag name is case-insensitive.
		const formattedTagName =
			namespaceURI === NamespaceURI.html &&
			parentNode[PropertySymbol.ownerDocument][PropertySymbol.contentType] === 'text/html'
				? tagName.toUpperCase()
				: tagName;
		const includeAll = tagName === '*';

		const find = (
			parent: Element | DocumentFragment | Document,
			cachedResult: ICachedResult
		): Element[] => {
			const elements: Element[] = [];

			for (const element of (<DocumentFragment>parent)[PropertySymbol.elementArray]) {
				if (
					(includeAll || element[PropertySymbol.tagName] === formattedTagName) &&
					element[PropertySymbol.namespaceURI] === namespaceURI
				) {
					elements.push(<Element>element);
				}

				element[PropertySymbol.affectsCache].push(cachedResult);

				for (const foundElement of find(<Element>element, cachedResult)) {
					elements.push(foundElement);
				}
			}

			return elements;
		};

		const query = (): Element[] => {
			const cache = parentNode[PropertySymbol.cache].elementsByTagNameNS;
			const cachedItems = cache.get(tagName);

			if (cachedItems?.result) {
				const items = cachedItems.result.deref();
				if (items) {
					return items;
				}
			}

			const cachedResult: ICachedResult = { result: null };
			const items = find(parentNode, cachedResult);

			cachedResult.result = new WeakRef(items);
			cache.set(tagName, cachedResult);

			return items;
		};

		return new HTMLCollection(PropertySymbol.illegalConstructor, query);
	}

	/**
	 * Returns the first element matching a tag name.
	 * This is not part of the browser standard and is only used internally (used in Document).
	 *
	 * @param parentNode Parent node.
	 * @param tagName Tag name.
	 * @returns Matching element.
	 */
	public static getElementByTagName(
		parentNode: Element | DocumentFragment | Document,
		tagName: string
	): Element | null {
		const upperTagName = tagName.toUpperCase();

		const find = (
			parent: Element | DocumentFragment | Document,
			cachedResult: ICachedResult
		): Element | null => {
			for (const element of (<DocumentFragment>parent)[PropertySymbol.elementArray]) {
				element[PropertySymbol.affectsCache].push(cachedResult);

				if (element[PropertySymbol.tagName] === upperTagName) {
					return <Element>element;
				}

				const foundElement = find(<Element>element, cachedResult);
				if (foundElement) {
					return foundElement;
				}
			}

			return null;
		};

		const cache = parentNode[PropertySymbol.cache].elementByTagName;
		const cachedItem = cache.get(tagName);

		if (cachedItem?.result) {
			const item = cachedItem.result.deref();
			if (item) {
				return item;
			}
		}

		const cachedResult: ICachedResult = { result: null };
		const item = find(parentNode, cachedResult);

		cachedResult.result = item ? new WeakRef(item) : { deref: () => null };
		cache.set(tagName, cachedResult);

		return item;
	}

	/**
	 * Returns an element by ID.
	 *
	 * @param parentNode Parent node.
	 * @param id ID.
	 * @returns Matching element.
	 */
	public static getElementById(
		parentNode: Element | DocumentFragment | Document,
		id: string
	): Element | null {
		id = String(id);

		if (parentNode instanceof Document) {
			const entry = parentNode[PropertySymbol.elementIdMap].get(id);
			if (entry && entry.elements.length > 0) {
				return entry.elements[0];
			}
			return null;
		}

		const find = (
			parent: Element | DocumentFragment | Document,
			cachedResult: ICachedResult
		): Element | null => {
			for (const element of (<DocumentFragment>parent)[PropertySymbol.elementArray]) {
				element[PropertySymbol.affectsCache].push(cachedResult);

				if (element.getAttribute('id') === id) {
					return <Element>element;
				}

				const foundElement = find(<Element>element, cachedResult);

				if (foundElement) {
					return foundElement;
				}
			}

			return null;
		};

		const cache = parentNode[PropertySymbol.cache].elementById;
		const cachedItem = cache.get(id);

		if (cachedItem?.result) {
			const item = cachedItem.result.deref();
			if (item) {
				return item;
			}
		}

		const cachedResult: ICachedResult = { result: null };
		const item = find(parentNode, cachedResult);

		cachedResult.result = item ? new WeakRef(item) : { deref: () => null };
		cache.set(id, cachedResult);

		return item;
	}
}
