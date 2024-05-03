import * as PropertySymbol from '../../PropertySymbol.js';
import INodeList from './INodeList.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import TNodeListListener from './TNodeListListener.js';

/**
 * NodeList.
 *
 * We are extending Array here to improve performance.
 * However, we should not expose Array methods to the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */
class NodeList<T> extends Array<T> implements INodeList<T> {
	#eventListeners: {
		add: WeakRef<TNodeListListener<T>>[];
		insert: WeakRef<TNodeListListener<T>>[];
		remove: WeakRef<TNodeListListener<T>>[];
	} = {
		add: [],
		insert: [],
		remove: []
	};

	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return 'NodeList';
	}

	/**
	 * Returns `[object NodeList]`.
	 *
	 * @returns `[object NodeList]`.
	 */
	public toLocaleString(): string {
		return '[object NodeList]';
	}

	/**
	 * Returns `[object NodeList]`.
	 *
	 * @returns `[object NodeList]`.
	 */
	public toString(): string {
		return '[object NodeList]';
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
	 * Appends item.
	 *
	 * @param item Item.
	 * @returns True if added.
	 */
	public [PropertySymbol.addItem](item: T): boolean {
		if (super.includes(item)) {
			this[PropertySymbol.removeItem](item);
		}

		super.push(item);

		this[PropertySymbol.dispatchEvent]('add', item);

		return true;
	}

	/**
	 * Inserts item before another item.
	 *
	 * @param newItem New item.
	 * @param [referenceItem] Reference item.
	 * @returns True if inserted.
	 */
	public [PropertySymbol.insertItem](newItem: T, referenceItem: T | null): boolean {
		if (!referenceItem) {
			return this[PropertySymbol.appendChild](newItem);
		}

		if (super.includes(newItem)) {
			this[PropertySymbol.removeItem](newItem);
		}

		const index = super.indexOf(referenceItem);

		if (index === -1) {
			throw new DOMException(
				"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.",
				DOMExceptionNameEnum.notFoundError
			);
		}

		super.splice(index, 0, newItem);

		this[PropertySymbol.dispatchEvent]('insert', newItem, referenceItem);

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
			throw new DOMException(
				"Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.",
				DOMExceptionNameEnum.notFoundError
			);
		}

		super.splice(index, 1);

		this[PropertySymbol.dispatchEvent]('remove', item);

		return true;
	}

	/**
	 * Adds event listener.
	 *
	 * @param type Type.
	 * @param listener Listener.
	 */
	public [PropertySymbol.addEventListener](
		type: 'add' | 'insert' | 'remove',
		listener: TNodeListListener<T>
	): void {
		this.#eventListeners[type].push(new WeakRef(listener));
	}

	/**
	 * Removes event listener.
	 *
	 * @param type Type.
	 * @param listener Listener.
	 */
	public [PropertySymbol.removeEventListener](
		type: 'add' | 'insert' | 'remove',
		listener: TNodeListListener<T>
	): void {
		const listeners = this.#eventListeners[type];
		for (let i = 0, max = listeners.length; i < max; i++) {
			if (listeners[i].deref() === listener) {
				listeners.splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Dispatches event.
	 *
	 * @param type Type.
	 * @param item Item.
	 * @param referenceItem Reference item.
	 */
	public [PropertySymbol.dispatchEvent](
		type: 'add' | 'insert' | 'remove',
		item: T,
		referenceItem?: T | null
	): void {
		const listeners = this.#eventListeners[type];
		for (let i = 0, max = listeners.length; i < max; i++) {
			const listener = listeners[i].deref();
			if (listener) {
				listener(item, referenceItem);
			} else {
				listeners.splice(i, 1);
				i--;
				max--;
			}
		}
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
}

// Removes Array methods from NodeList.
const descriptors = Object.getOwnPropertyDescriptors(Array.prototype);
for (const key of Object.keys(descriptors)) {
	const descriptor = descriptors[key];
	if (key === 'length') {
		Object.defineProperty(NodeList.prototype, key, {
			set: () => {},
			get: descriptor.get
		});
	} else if (key !== 'values' && key !== 'keys' && key !== 'entries') {
		if (typeof descriptor.value === 'function') {
			Object.defineProperty(NodeList.prototype, key, {});
		}
	}
}

// Forces the type to be an interface to hide Array methods from the outside.
export default <new <T>() => INodeList<T>>(<unknown>NodeList);
