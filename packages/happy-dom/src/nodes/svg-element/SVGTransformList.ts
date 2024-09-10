import ClassMethodBinder from '../../ClassMethodBinder.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import BrowserWindow from '../../window/BrowserWindow.js';
import SVGTransform from './SVGTransform.js';

/**
 * SVGTransformList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransformList
 */
export default class SVGTransformList {
	[index: number]: SVGTransform;

	private [PropertySymbol.items]: SVGTransform[];
	private [PropertySymbol.window]: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 */
	constructor(illegalConstructorSymbol: symbol, window: BrowserWindow) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		const items: SVGTransform[] = [];

		this[PropertySymbol.items] = items;
		this[PropertySymbol.window] = window;

		ClassMethodBinder.bindMethods(this, [SVGTransformList], {
			bindSymbols: true,
			forwardToPrototype: true
		});

		// This only works for one level of inheritance, but it should be fine as there is no collection that goes deeper according to spec.
		ClassMethodBinder.bindMethods(this, [SVGTransformList], { bindSymbols: true });

		return new Proxy(this, {
			get: (target, property) => {
				if (property === 'length' || property === 'numberOfItems') {
					return items.length;
				}
				if (property in target || typeof property === 'symbol') {
					return target[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return items[index];
				}
			},
			set(target, property, newValue): boolean {
				if (typeof property === 'symbol') {
					target[property] = newValue;
					return true;
				}
				const index = Number(property);
				if (isNaN(index)) {
					target[property] = newValue;
				}
				return true;
			},
			deleteProperty(target, property): boolean {
				if (typeof property === 'symbol') {
					delete target[property];
					return true;
				}
				const index = Number(property);
				if (isNaN(index)) {
					delete target[property];
				}
				return true;
			},
			ownKeys(): string[] {
				return Object.keys(items);
			},
			has(target, property): boolean {
				if (property in target) {
					return true;
				}

				if (typeof property === 'symbol') {
					return false;
				}

				const index = Number(property);
				return !isNaN(index) && index >= 0 && index < items.length;
			},
			defineProperty(target, property, descriptor): boolean {
				if (property in target) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor {
				if (property in target || typeof property === 'symbol') {
					return;
				}

				const index = Number(property);

				if (!isNaN(index) && items[index]) {
					return {
						value: items[index],
						writable: false,
						enumerable: true,
						configurable: true
					};
				}
			}
		});
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return this[PropertySymbol.items].length;
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get numberOfItems(): number {
		return this[PropertySymbol.items].length;
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 */
	public [Symbol.iterator](): IterableIterator<SVGTransform> {
		return this[PropertySymbol.items].values();
	}

	/**
	 * Clears all items from the list.
	 */
	public clear(): void {
		this[PropertySymbol.items].length = 0;
	}

	/**
	 * Replace Token.
	 *
	 * @param newItem New item.
	 * @returns The item being replaced.
	 */
	public initialize(newItem: SVGTransform): SVGTransform {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'initialize' on 'SVGTransformList': 1 arguments required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGTransform)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGTransformList': parameter 1 is not of type 'SVGTransform'.`
			);
		}

		this[PropertySymbol.items].length = 0;
		this[PropertySymbol.items].push(newItem);

		return newItem;
	}

	/**
	 * Returns item at index.
	 *
	 * @param index Index.
	 * @returns The item at the index.
	 **/
	public getItem(index: number | string): SVGTransform {
		const items = this[PropertySymbol.items];
		if (typeof index === 'number') {
			return items[index] ? items[index] : null;
		}
		index = Number(index);
		index = isNaN(index) ? 0 : index;
		return items[index] ? items[index] : null;
	}

	/**
	 * Inserts a new item into the list at the specified position. The first item is number 0. If newItem is already in a list, it is removed from its previous list before it is inserted into this list. The inserted item is the item itself and not a copy. If the item is already in this list, note that the index of the item to insert before is before the removal of the item. If the index is equal to 0, then the new item is inserted at the front of the list. If the index is greater than or equal to numberOfItems, then the new item is appended to the end of the list.
	 *
	 * @param newItem The item to insert into the list.
	 * @param index Index.
	 * @returns The item being inserted.
	 */
	public insertItemBefore(newItem: SVGTransform, index: number): SVGTransform {
		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGTransformList': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGTransform)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGTransformList': parameter 1 is not of type 'SVGTransform'.`
			);
		}

		const items = this[PropertySymbol.items];
		const existingIndex = items.indexOf(newItem);

		if (existingIndex !== -1) {
			items.splice(existingIndex, 1);
		}

		if (index < 0) {
			index = 0;
		} else if (index > items.length) {
			index = items.length;
		}

		items.splice(index, 0, newItem);

		return newItem;
	}

	/**
	 * Replaces an existing item in the list with a new item. If newItem is already in a list, it is removed from its previous list before it is inserted into this list. The inserted item is the item itself and not a copy. If the item is already in this list, note that the index of the item to replace is before the removal of the item.
	 *
	 * @param newItem The item to insert into the list.
	 * @param index Index.
	 * @returns The item being replaced.
	 */
	public replaceItem(newItem: SVGTransform, index: number): SVGTransform {
		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGTransformList': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGTransform)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGTransformList': parameter 1 is not of type 'SVGTransform'.`
			);
		}

		const items = this[PropertySymbol.items];
		const existingIndex = items.indexOf(newItem);

		if (existingIndex !== -1) {
			items.splice(existingIndex, 1);
		}

		if (index < 0) {
			index = 0;
		} else if (index >= items.length) {
			index = items.length - 1;
		}

		items[index] = newItem;

		return newItem;
	}

	/**
	 * Removes an existing item from the list.
	 *
	 * @param index Index.
	 * @returns The removed item.
	 */
	public removeItem(index: number): SVGTransform {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'removeItem' on 'SVGTransformList': 1 argument required, but only ${arguments.length} present.`
			);
		}

		const items = this[PropertySymbol.items];

		index = Number(index);

		if (isNaN(index)) {
			index = 0;
		}

		if (index >= items.length) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'removeItem' on 'SVGTransformList':  The index provided (${index}) is greater than the maximum bound.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}

		if (index < 0) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'removeItem' on 'SVGTransformList':  The index provided (${index}) is negative.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}

		const removedItem = items[index];

		items.splice(index, 1);

		return removedItem;
	}

	/**
	 * Appends an item to the end of the list.
	 *
	 * @param newItem The item to add to the list.
	 * @returns The item being appended.
	 */
	public appendItem(newItem: SVGTransform): SVGTransform {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGTransformList': 1 argument required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGTransform)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGTransformList': parameter 1 is not of type 'SVGTransform'.`
			);
		}

		const items = this[PropertySymbol.items];
		const existingIndex = items.indexOf(newItem);

		if (existingIndex !== -1) {
			items.splice(existingIndex, 1);
		}

		items.push(newItem);

		return newItem;
	}
}
