import * as PropertySymbol from '../../PropertySymbol.js';
import EventTarget from '../../event/EventTarget.js';
import MutationRecord from '../../mutation-observer/MutationRecord.js';
import Attr from '../attr/Attr.js';
import DocumentFragment from '../document-fragment/DocumentFragment.js';
import Document from '../document/Document.js';
import HTMLElement from '../html-element/HTMLElement.js';
import INodeList from '../node/INodeList.js';
import Node from '../node/Node.js';
import NodeList from '../node/NodeList.js';
import NodeTypeEnum from '../node/NodeTypeEnum.js';
import Element from './Element.js';
import IHTMLCollection from './IHTMLCollection.js';
import TNamedNodeMapListener from './TNamedNodeMapListener.js';

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
	#namedNodeMapListeners = new Map<
		T,
		{ set: TNamedNodeMapListener; remove: TNamedNodeMapListener }
	>();
	#filter: (item: T) => boolean | null;
	#synchronizedPropertiesElement: Element;

	/**
	 * Constructor.
	 *
	 * @param [options] Options.
	 * @param [options.filter] Filter.
	 * @param [options.observeNode] Observe node.
	 * @param [options.synchronizedPropertiesElement] Synchronized properties element.
	 */
	constructor(options?: {
		filter?: (item: T) => boolean;
		observeNode?: Element | DocumentFragment | Document;
		synchronizedPropertiesElement?: Element;
	}) {
		super();

		if (options) {
			if (options.filter) {
				this.#filter = options.filter;
			}

			if (options.synchronizedPropertiesElement) {
				this.#synchronizedPropertiesElement = options.synchronizedPropertiesElement;
			}

			if (options.observeNode) {
				this.#observeNode(options.observeNode);
			}
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
		const filter = this.#filter;

		if (item[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode || (filter && !filter?.(item))) {
			return false;
		}

		if (super.includes(item)) {
			this[PropertySymbol.removeItem](item);
		}

		super.push(item);

		this.#addNamedItem(item);

		if (this.#synchronizedPropertiesElement) {
			this.#synchronizedPropertiesElement[this.length - 1] = item;
		}

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
		const filter = this.#filter;

		if (
			newItem[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode ||
			(filter && !filter?.(newItem))
		) {
			return false;
		}

		if (super.includes(newItem)) {
			this[PropertySymbol.removeItem](newItem);
		}

		// We should not call addItem() here, as we don't want HTMLOptionsCollection to run updateSelectedness() twice.
		if (!referenceItem) {
			super.push(newItem);

			this.#addNamedItem(newItem);

			if (this.#synchronizedPropertiesElement) {
				this.#synchronizedPropertiesElement[this.length - 1] = newItem;
			}

			return true;
		}

		if (!referenceItem) {
			return this[PropertySymbol.addItem](newItem);
		}

		let referenceItemIndex: number = -1;

		if (referenceItem[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
			referenceItemIndex = this[PropertySymbol.indexOf](referenceItem);
		} else {
			const parentChildNodes = (<Node>referenceItem).parentNode?.[PropertySymbol.childNodes];
			for (
				let i = parentChildNodes[PropertySymbol.indexOf](<Node>referenceItem),
					max = parentChildNodes.length;
				i < max;
				i++
			) {
				if (
					parentChildNodes[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
					(!filter || filter(<T>parentChildNodes[i]))
				) {
					referenceItemIndex = this[PropertySymbol.indexOf](<T>parentChildNodes[i]);
					break;
				}
			}
		}

		if (referenceItemIndex === -1) {
			throw new Error(
				'Failed to execute "insertItem" on "HTMLCollection": The node before which the new node is to be inserted is not an item of this collection.'
			);
		}

		super.splice(referenceItemIndex, 0, newItem);

		this.#addNamedItem(newItem);

		if (this.#synchronizedPropertiesElement) {
			this.#synchronizedPropertiesElement[referenceItemIndex] = newItem;

			for (let i = referenceItemIndex + 1, max = this.length; i < max; i++) {
				this.#synchronizedPropertiesElement[i] = this[i];
			}
		}

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

		if (this.#synchronizedPropertiesElement) {
			for (let i = index, max = this.length; i < max; i++) {
				this.#synchronizedPropertiesElement[i] = this[i];
			}

			delete this.#synchronizedPropertiesElement[this.length];
		}

		return true;
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
	 * Sets named item property.
	 *
	 * @param name Name.
	 */
	protected [PropertySymbol.setNamedItemProperty](name: string): void {
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

				if (this.#synchronizedPropertiesElement) {
					Object.defineProperty(this.#synchronizedPropertiesElement, name, {
						value: namedItems[0],
						writable: false,
						enumerable: true,
						configurable: true
					});
				}
			}
		} else {
			delete this[name];
			if (this.#synchronizedPropertiesElement) {
				delete this.#synchronizedPropertiesElement[name];
			}
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
			(!this.#synchronizedPropertiesElement ||
				(!this.#synchronizedPropertiesElement.constructor.prototype.hasOwnProperty(name) &&
					!HTMLElement.constructor.prototype.hasOwnProperty(name) &&
					!Element.constructor.prototype.hasOwnProperty(name) &&
					!Node.constructor.hasOwnProperty(name) &&
					!EventTarget.constructor.hasOwnProperty(name))) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}

	/**
	 * Updates named item.
	 *
	 * @param item Item.
	 * @param attributeName Attribute name.
	 */
	#updateNamedItem(item: T, attributeName: string): void {
		const filter = this.#filter;

		if (item[PropertySymbol.nodeType] !== NodeTypeEnum.elementNode || (filter && !filter?.(item))) {
			return;
		}

		const name = item[PropertySymbol.attributes][attributeName]?.value;

		if (name) {
			const namedItems = this[PropertySymbol.namedItems].get(name);

			if (!namedItems?.[PropertySymbol.includes](item)) {
				this[PropertySymbol.namedItems].set(name, namedItems);
				this[PropertySymbol.setNamedItemProperty](name);
			}
		} else {
			const namedItems = this[PropertySymbol.namedItems].get(name);

			if (namedItems) {
				namedItems[PropertySymbol.removeItem](item);
			}

			this[PropertySymbol.setNamedItemProperty](name);
		}
	}

	/**
	 * Adds named item to collection.
	 *
	 * @param item Item.
	 */
	#addNamedItem(item: T): void {
		const listeners = {
			set: (attribute: Attr) => {
				if (NAMED_ITEM_ATTRIBUTES.includes(attribute.name)) {
					this.#updateNamedItem(item, attribute.name);
				}
			},
			remove: (attribute: Attr) => {
				if (NAMED_ITEM_ATTRIBUTES.includes(attribute.name)) {
					this.#updateNamedItem(item, attribute.name);
				}
			}
		};

		item[PropertySymbol.attributes][PropertySymbol.addEventListener]('set', listeners.set);
		item[PropertySymbol.attributes][PropertySymbol.addEventListener]('remove', listeners.remove);

		for (const attributeName of NAMED_ITEM_ATTRIBUTES) {
			const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;
			if (name) {
				const namedItems =
					this[PropertySymbol.namedItems].get(name) ||
					this[PropertySymbol.createNamedItemsNodeList]();

				if (namedItems[PropertySymbol.includes](item)) {
					return;
				}

				this[PropertySymbol.namedItems].set(name, namedItems);

				this[PropertySymbol.setNamedItemProperty](name);
			}
		}
	}

	/**
	 * Removes named item from collection.
	 *
	 * @param item Item.
	 */
	#removeNamedItem(item: T): void {
		const listeners = this.#namedNodeMapListeners.get(item);

		if (listeners) {
			item[PropertySymbol.attributes][PropertySymbol.removeEventListener]('set', listeners.set);
			item[PropertySymbol.attributes][PropertySymbol.removeEventListener](
				'remove',
				listeners.remove
			);
		}

		for (const attributeName of NAMED_ITEM_ATTRIBUTES) {
			const name = (<Element>item)[PropertySymbol.attributes][attributeName]?.value;
			if (name) {
				const namedItems = this[PropertySymbol.namedItems].get(name);

				if (!namedItems) {
					return;
				}

				namedItems[PropertySymbol.removeItem](item);

				this[PropertySymbol.setNamedItemProperty](name);
			}
		}
	}

	/**
	 * Observes node.
	 *
	 * @param parentNode Parent node.
	 */
	#observeNode(parentNode: Element | DocumentFragment | Document): void {
		const filter = this.#filter;

		this.#loadObservedItems(parentNode);

		parentNode[PropertySymbol.observeMutations]({
			options: { childList: true },
			callback: new WeakRef((record: MutationRecord) => {
				if (record.addedNodes.length) {
					// There is always only one added node.
					const addedNode = record.addedNodes[0];

					if (
						addedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
						(!filter || filter(<T>addedNode))
					) {
						const index = this.#getObservedItemIndex(parentNode, <T>addedNode);
						addedNode[PropertySymbol.isInsideObservedFormNode] = true;
						this[PropertySymbol.insertItem](<T>addedNode, this[index] || null);
					} else if (addedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode) {
						const items = this.#getItemsInNode(<Element>addedNode);
						const index = this.#getObservedItemIndex(parentNode, items[items.length - 1]);
						const referenceItem = this[index];

						for (let i = items.length - 1; i >= 0; i--) {
							items[i][PropertySymbol.isInsideObservedFormNode] = true;
							this[PropertySymbol.insertItem](items[i], referenceItem);
						}
					}
				} else {
					const removedNode = record.removedNodes[0];
					if (
						removedNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
						(!filter || filter(<T>removedNode))
					) {
						removedNode[PropertySymbol.isInsideObservedFormNode] = true;
						this[PropertySymbol.removeItem](<T>removedNode);
					} else {
						const items = this.#getItemsInNode(<Element>removedNode);
						for (let i = items.length - 1; i >= 0; i--) {
							items[i][PropertySymbol.isInsideObservedFormNode] = true;
							this[PropertySymbol.removeItem](items[i]);
						}
					}
				}
			})
		});
	}

	/**
	 * Returns items in node.
	 *
	 * @param parentNode Parent node.
	 */
	#getItemsInNode(parentNode: Element | DocumentFragment | Document): T[] {
		const filter = this.#filter;
		const items: T[] = [];

		if (
			parentNode[PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
			(!filter || filter(<T>parentNode))
		) {
			items.push(<T>parentNode);
		} else {
			const children = parentNode[PropertySymbol.children];
			for (let a = 0; a < children.length; a++) {
				const childrenOfChild = children[a][PropertySymbol.children];
				for (let b = 0; b < childrenOfChild.length; b++) {
					items.push(<T>childrenOfChild[b]);
				}
			}
		}

		return items;
	}

	/**
	 * Loads initial observed items.
	 *
	 * @param parentNode Parent node.
	 */
	#loadObservedItems(parentNode: Element | DocumentFragment | Document): void {
		const filter = this.#filter;
		const children = parentNode[PropertySymbol.children];

		for (let i = 0, max = children.length; i < max; i++) {
			if (
				children[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(!filter || filter(<T>children[i]))
			) {
				children[i][PropertySymbol.isInsideObservedFormNode] = true;
				this[PropertySymbol.addItem](<T>children[i]);
			}

			this.#loadObservedItems(children[i]);
		}
	}

	/**
	 * Returns the index for the first element matching the filter inside the parent parent element.
	 *
	 * @param parentNode Parent node.
	 * @param item Item.
	 * @param [indexContainer] Index container.
	 */
	#getObservedItemIndex(
		parentNode: Element | DocumentFragment | Document,
		item: T,
		indexContainer = { index: 0 }
	): number {
		const filter = this.#filter;
		const children = parentNode[PropertySymbol.children];

		for (let i = 0, max = children.length; i < max; i++) {
			if (
				children[i][PropertySymbol.nodeType] === NodeTypeEnum.elementNode &&
				(!filter || filter(<T>children[i]))
			) {
				if (children[i] === item) {
					return indexContainer.index;
				}

				const returnValue = this.#getObservedItemIndex(children[i], item, indexContainer);

				if (returnValue !== -1) {
					return returnValue;
				}

				indexContainer.index++;
			}
		}

		return -1;
	}
}

// Removes Array methods from HTMLCollection.
const descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
for (const key of Object.keys(descriptors)) {
	const descriptor = descriptors[key];
	if (key === 'length') {
		Object.defineProperty(HTMLCollection.prototype, key, {
			set: () => {},
			get: descriptor.get
		});
	} else {
		if (typeof descriptor.value === 'function') {
			Object.defineProperty(HTMLCollection.prototype, key, {});
		}
	}
}
