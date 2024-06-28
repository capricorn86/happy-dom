import * as PropertySymbol from '../../PropertySymbol.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import MutationTypeEnum from '../../mutation-observer/MutationTypeEnum.js';
import NodeFilter from '../../tree-walker/NodeFilter.js';
import TreeWalker from '../../tree-walker/TreeWalker.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Document from '../document/Document.js';
import INodeList from '../node/INodeList.js';
import Node from '../node/Node.js';
import NodeList from '../node/NodeList.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Element from './Element.js';
import IHTMLCollection from './IHTMLCollection.js';
import IHTMLCollectionObservedNode from './IHTMLCollectionObservedNode.js';

const NAMED_ITEM_ATTRIBUTES = ['id', 'name'];

/**
 * HTMLCollection.
 *
 * We are extending Array here to improve performance.
 * However, we should not expose Array methods to the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
 */
export default class HTMLCollection<T extends Element, NamedItem = T>
	extends Array<T>
	implements IHTMLCollection<T, NamedItem>
{
	public [PropertySymbol.namedItems] = new Map<string, INodeList<T>>();
	protected [PropertySymbol.attributeFilter]: string[] = ['id', 'name'];
	#observedNodes: IHTMLCollectionObservedNode[] = [];

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Returns `[object HTMLCollection]`.
	 *
	 * @returns `[object HTMLCollection]`.
	 */
	public toLocaleString(): string {
		return `[object ${this.constructor.name}]`;
	}

	/**
	 * Returns `[object HTMLCollection]`.
	 *
	 * @returns `[object HTMLCollection]`.
	 */
	public toString(): string {
		return `[object ${this.constructor.name}]`;
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): T {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): NamedItem | null {
		return this[PropertySymbol.namedItems][name] && this[PropertySymbol.namedItems][name].length
			? this[PropertySymbol.namedItems][name][0]
			: null;
	}

	/**
	 * Appends item.
	 *
	 * @param item Item.
	 * @returns True if the item was added.
	 */
	public [PropertySymbol.addItem](item: T): boolean {
		if (item[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode || super.includes(item)) {
			return false;
		}

		super.push(item);

		this.#addNamedItem(item);

		return true;
	}

	/**
	 * Inserts item before another item.
	 *
	 * @param newItem New item.
	 * @param [referenceItem] Reference item.
	 * @returns True if the item was added.
	 */
	public [PropertySymbol.insertItem](newItem: T, referenceItem: T | null): boolean {
		if (!referenceItem) {
			return this[PropertySymbol.addItem](newItem);
		}

		if (newItem[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode || super.includes(newItem)) {
			return false;
		}

		const referenceItemIndex = this[PropertySymbol.indexOf](referenceItem);

		if (referenceItemIndex === -1) {
			throw new Error(
				'Failed to execute "insertItem" on "HTMLCollection": The node before which the new node is to be inserted is not an item of this collection.'
			);
		}

		super.splice(referenceItemIndex, 0, newItem);

		this.#addNamedItem(newItem);

		return true;
	}

	/**
	 * Removes item.
	 *
	 * @param item Item.
	 * @returns True if removed.
	 */
	public [PropertySymbol.removeItem](item: T): boolean {
		const index = super.indexOf(item);

		if (index === -1) {
			return false;
		}

		super.splice(index, 1);

		this.#removeNamedItem(item);

		return true;
	}

	/**
	 * Destroys the collection.
	 */
	public [PropertySymbol.destroy](): void {
		const observedNodes = this.#observedNodes;

		while (observedNodes.length) {
			this[PropertySymbol.unobserve](observedNodes[observedNodes.length - 1]);
		}

		while (this.length) {
			this[PropertySymbol.removeItem](this[this.length - 1]);
		}
	}

	/**
	 * Observes node.
	 *
	 * @param node Root node.
	 * @param filter Filter.
	 * @returns Observed node.
	 */
	public [PropertySymbol.observe](
		node: Element | DocumentFragment | Document,
		filter?: (item: T) => boolean
	): IHTMLCollectionObservedNode {
		const observedNode: IHTMLCollectionObservedNode = {
			node,
			filter,
			mutationListener: null
		};

		observedNode.mutationListener = {
			options: {
				childList: true,
				subtree: true,
				attributes: true,
				attributeOldValue: true,
				attributeFilter: this[PropertySymbol.attributeFilter]
			},
			callback: new WeakRef((record: MutationRecord) => {
				switch (record.type) {
					case MutationTypeEnum.childList:
						if (record.addedNodes.length) {
							this[PropertySymbol.insertObservedItem](observedNode, <Element>record.addedNodes[0]);
						} else {
							this[PropertySymbol.removeObservedItem](observedNode, <T>record.removedNodes[0]);
						}
						break;
					case MutationTypeEnum.attributes:
						const newValue = record.target[PropertySymbol.attributes][record.attributeName]?.value;
						if (
							record.target[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
							record.oldValue !== newValue &&
							(!filter || filter(<T>record.target)) &&
							(!observedNode.mutationListener.options.subtree ||
								this.#isObservedItem(observedNode, <T>record.target))
						) {
							this[PropertySymbol.onObservedItemAttributeChange](
								<T>record.target,
								record.attributeName,
								record.oldValue,
								newValue
							);
						}
				}
			})
		};

		this.#observedNodes.push(observedNode);

		node[PropertySymbol.observeMutations](observedNode.mutationListener);

		this[PropertySymbol.loadObservedNodes](observedNode, node);

		return observedNode;
	}

	/**
	 * Unobserves node.
	 *
	 * @param observedNode Observed node.
	 */
	public [PropertySymbol.unobserve](observedNode: IHTMLCollectionObservedNode): void {
		const index = this.#observedNodes.indexOf(observedNode);

		if (index === -1) {
			return;
		}

		this.#observedNodes.splice(index, 1);

		this[PropertySymbol.unloadObservedNodes](observedNode, observedNode.node);

		observedNode.node[PropertySymbol.unobserveMutations](observedNode.mutationListener);
	}

	/**
	 * Index of item.
	 *
	 * @param item Item.
	 * @returns Index.
	 */
	public [PropertySymbol.indexOf](item: T): number {
		return super.indexOf(item);
	}

	/**
	 * Returns true if the item is in the list.
	 *
	 * @param item Item.
	 * @returns True if the item is in the list.
	 */
	public [PropertySymbol.includes](item: T): boolean {
		return super.includes(item);
	}

	/**
	 * Observes node.
	 *
	 * @param observedNode Observed node.
	 * @param parentNode Parent node.
	 */
	protected [PropertySymbol.loadObservedNodes](
		observedNode: IHTMLCollectionObservedNode,
		parentNode: Element | DocumentFragment | Document
	): void {
		const childNodes = parentNode[PropertySymbol.childNodes];

		if (observedNode.mutationListener.options.subtree) {
			for (let i = 0, max = childNodes.length; i < max; i++) {
				if (
					childNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					this.#isObservedItem(observedNode, childNodes[i])
				) {
					if (!observedNode.filter || observedNode.filter(<T>childNodes[i])) {
						this[PropertySymbol.addItem](<T>childNodes[i]);
					}

					this[PropertySymbol.loadObservedNodes](observedNode, <T>childNodes[i]);
				}
			}
			return;
		}

		for (let i = 0, max = childNodes.length; i < max; i++) {
			if (
				childNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(!observedNode.filter || observedNode.filter(<T>childNodes[i]))
			) {
				this[PropertySymbol.addItem](<T>childNodes[i]);
			}
		}
	}

	/**
	 * Unobserves node.
	 *
	 * @param observedNode Observed node.
	 * @param parentNode Parent node.
	 */
	protected [PropertySymbol.unloadObservedNodes](
		observedNode: IHTMLCollectionObservedNode,
		parentNode: Element | DocumentFragment | Document
	): void {
		const childNodes = parentNode[PropertySymbol.childNodes];

		if (observedNode.mutationListener.options.subtree) {
			for (let i = 0, max = childNodes.length; i < max; i++) {
				if (
					childNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					this.#isObservedItem(observedNode, childNodes[i])
				) {
					if (!observedNode.filter || observedNode.filter(<T>childNodes[i])) {
						this[PropertySymbol.removeItem](<T>childNodes[i]);
					}

					this[PropertySymbol.unloadObservedNodes](observedNode, <T>childNodes[i]);
				}
			}
		}

		for (let i = 0, max = childNodes.length; i < max; i++) {
			if (
				childNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(!observedNode.filter || observedNode.filter(<T>childNodes[i]))
			) {
				this[PropertySymbol.removeItem](<T>childNodes[i]);
			}
		}
	}

	/**
	 * Inserts new observed item.
	 *
	 * @param observedNode Observed node.
	 * @param newItem New item.
	 */
	protected [PropertySymbol.insertObservedItem](
		observedNode: IHTMLCollectionObservedNode,
		newItem: Element
	): void {
		// Is part of a subtree.
		if (observedNode.mutationListener.options.subtree) {
			// Check if the item is observed by this listener
			if (!this.#isObservedItem(observedNode, newItem)) {
				return;
			}

			// Find all children that pass the filter inside the new item.
			const items = this.#getItemsInElement(observedNode, newItem);

			if (!items.length) {
				return;
			}

			// As the new item is part of a subtree, we need to walk the tree to find the first item that passes the filter.
			// We start with the last item in the collection.
			const treeWalker = new TreeWalker(observedNode.node, NodeFilter.SHOW_ELEMENT, (node) =>
				!observedNode.filter || observedNode.filter(<T>node)
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_SKIP
			);
			treeWalker.currentNode = items[items.length - 1];
			const referenceItem = <T>treeWalker.nextNode() || null;

			for (const item of items) {
				this[PropertySymbol.insertItem](item, referenceItem);
			}

			return;
		}

		// Check if the new item is an element node and passes the filter.
		if (
			newItem[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode ||
			(newItem[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				observedNode.filter &&
				!observedNode.filter(newItem))
		) {
			return;
		}

		// Is not part of a subtree.
		// We can therefore find the reference item by iterating over the child nodes to find the first element node that passes the filter.
		const childNodes = newItem.parentNode[PropertySymbol.childNodes];
		let referenceItemIndex = -1;
		for (
			let i = childNodes[PropertySymbol.indexOf](newItem) + 1, max = childNodes.length;
			i < max;
			i++
		) {
			if (
				childNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(!observedNode.filter || observedNode.filter(<Element>childNodes[i]))
			) {
				referenceItemIndex = this[PropertySymbol.indexOf](<T>childNodes[i]);
				break;
			}
		}

		if (referenceItemIndex === -1) {
			this[PropertySymbol.addItem](<T>newItem);
			return;
		}

		this[PropertySymbol.insertItem](<T>newItem, this[referenceItemIndex]);
	}

	/**
	 * Removes observed item.
	 *
	 * @param observedNode Observed node.
	 * @param item Item.
	 */
	protected [PropertySymbol.removeObservedItem](
		observedNode: IHTMLCollectionObservedNode,
		item: T
	): void {
		// Is part of a subtree.
		if (observedNode.mutationListener.options.subtree) {
			// Find all children that pass the filter inside the item.
			const items = this.#getItemsInElement(observedNode, item);

			for (let i = items.length - 1; i >= 0; i--) {
				this[PropertySymbol.removeItem](items[i]);
			}

			return;
		}

		// Check if the item is an element node and passes the filter.
		if (
			item[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode ||
			(item[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				observedNode.filter &&
				!observedNode.filter(item))
		) {
			return;
		}

		this[PropertySymbol.removeItem](item);
	}

	/**
	 * Triggered when an attribute changes.
	 *
	 * @param item Item.
	 * @param name Name.
	 * @param oldValue Old value.
	 * @param value Value.
	 */
	protected [PropertySymbol.onObservedItemAttributeChange](
		item: T,
		name: string,
		oldValue: string | null,
		value: string | null
	): void {
		if (name !== 'id' && name !== 'name') {
			return;
		}
		if (oldValue) {
			const namedItems = this[PropertySymbol.namedItems].get(oldValue);

			if (namedItems) {
				namedItems[PropertySymbol.removeItem](item);
			}

			this[PropertySymbol.updateNamedItemProperty](oldValue);
		}

		if (value) {
			const namedItems =
				this[PropertySymbol.namedItems].get(value) ||
				this[PropertySymbol.createNamedItemsNodeList]();

			if (!namedItems[PropertySymbol.includes](item)) {
				namedItems[PropertySymbol.addItem](item);
				this[PropertySymbol.namedItems].set(value, namedItems);
				this[PropertySymbol.updateNamedItemProperty](value);
			}
		}
	}

	/**
	 * Updates named item property.
	 *
	 * @param name Name.
	 */
	protected [PropertySymbol.updateNamedItemProperty](name: string): void {
		if (!this[PropertySymbol.isValidPropertyName](name)) {
			return;
		}

		const namedItems = this[PropertySymbol.namedItems].get(name);

		if (namedItems?.length) {
			if (Object.getOwnPropertyDescriptor(this, name)?.value !== namedItems[0]) {
				Object.defineProperty(this, name, {
					value: namedItems[0],
					writable: false,
					enumerable: true,
					configurable: true
				});
			}
		} else {
			delete this[name];
		}
	}

	/**
	 * Creates a new NodeList to be used as a named item.
	 *
	 * @returns NodeList.
	 */
	protected [PropertySymbol.createNamedItemsNodeList](): INodeList<T> {
		return new NodeList<T>();
	}

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	protected [PropertySymbol.isValidPropertyName](name: string): boolean {
		return (
			!!name &&
			!this.constructor.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}

	/**
	 * Returns true if the item is observed by the observed node and no other observers in the collection also observe it.
	 *
	 * @param observedNode Observed node.
	 * @param node Node.
	 * @returns True if the item is observed.
	 */
	#isObservedItem(observedNode: IHTMLCollectionObservedNode, node: Node): boolean {
		// This method should not be executed when not in a subtree
		if (!observedNode.mutationListener.options.subtree) {
			return true;
		}

		if (!node[PropertySymbol.mutationListeners].includes(observedNode.mutationListener)) {
			return false;
		}

		for (const observedNodeItem of this.#observedNodes) {
			if (
				observedNodeItem !== observedNode &&
				node[PropertySymbol.mutationListeners].includes(observedNodeItem.mutationListener)
			) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Returns items in element.
	 *
	 * @param observedNode Observed node.
	 * @param element Element.
	 * @param [items] Items.
	 * @returns Items.
	 */
	#getItemsInElement(
		observedNode: IHTMLCollectionObservedNode,
		element: Node,
		items: T[] = []
	): T[] {
		if (
			element[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
			(!observedNode.filter || observedNode.filter(<T>element))
		) {
			items.push(<T>element);
		}

		for (let i = 0, max = element[PropertySymbol.childNodes].length; i < max; i++) {
			if (element[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
				this.#getItemsInElement(observedNode, element[PropertySymbol.childNodes][i], items);
			}
		}

		return items;
	}

	/**
	 * Adds named item to collection.
	 *
	 * @param item Item.
	 */
	#addNamedItem(item: T): void {
		for (const attributeName of NAMED_ITEM_ATTRIBUTES) {
			const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;
			if (name) {
				const namedItems =
					this[PropertySymbol.namedItems].get(name) ||
					this[PropertySymbol.createNamedItemsNodeList]();

				if (namedItems[PropertySymbol.includes](item)) {
					return;
				}

				namedItems[PropertySymbol.addItem](item);

				this[PropertySymbol.namedItems].set(name, namedItems);

				this[PropertySymbol.updateNamedItemProperty](name);
			}
		}
	}

	/**
	 * Removes named item from collection.
	 *
	 * @param item Item.
	 */
	#removeNamedItem(item: T): void {
		for (const attributeName of NAMED_ITEM_ATTRIBUTES) {
			const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;
			if (name) {
				const namedItems = this[PropertySymbol.namedItems].get(name);

				if (!namedItems) {
					return;
				}

				namedItems[PropertySymbol.removeItem](item);

				this[PropertySymbol.updateNamedItemProperty](name);
			}
		}
	}
}

// Removes Array methods from HTMLCollection.
const descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
for (const key of Object.keys(descriptors)) {
	if (key !== 'item' && key !== 'constructor') {
		const descriptor = descriptors[key];
		if (key === 'length') {
			Object.defineProperty(HTMLCollection.prototype, key, {
				set: () => {},
				get: descriptor.get
			});
		} else if (typeof descriptor.value === 'function') {
			Object.defineProperty(HTMLCollection.prototype, key, {});
		}
	}
}
