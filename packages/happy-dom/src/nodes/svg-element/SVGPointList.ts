import ClassMethodBinder from '../../ClassMethodBinder.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGElement from './SVGElement.js';
import SVGPoint from './SVGPoint.js';

const ATTRIBUTE_SEPARATOR_REGEXP = /[\t\f\n\r ]+/;

/**
 * SVGPointList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPointList
 */
export default class SVGPointList {
	[index: number]: SVGPoint;

	private [PropertySymbol.ownerElement]: SVGElement;
	private [PropertySymbol.attributeName]: string;
	private [PropertySymbol.readOnly]: boolean;
	private [PropertySymbol.cache]: { items: SVGPoint[]; attributeValue: string } = {
		items: [],
		attributeValue: ''
	};

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param ownerElement Owner element.
	 * @param attributeName Attribute name.
	 * @param readOnly Read only.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		ownerElement: SVGElement,
		attributeName: string,
		readOnly: boolean
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.ownerElement] = ownerElement;
		this[PropertySymbol.attributeName] = attributeName;
		this[PropertySymbol.readOnly] = readOnly;

		ClassMethodBinder.bindMethods(this, [SVGPointList], {
			bindSymbols: true,
			forwardToPrototype: true
		});

		// This only works for one level of inheritance, but it should be fine as there is no collection that goes deeper according to spec.
		ClassMethodBinder.bindMethods(this, [SVGPointList], { bindSymbols: true });
		return new Proxy(this, {
			get: (target, property) => {
				if (property === 'length' || property === 'numberOfItems') {
					return target[PropertySymbol.getItemList]().length;
				}
				if (property in target || typeof property === 'symbol') {
					return target[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return target[PropertySymbol.getItemList]()[index];
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
			ownKeys(target): string[] {
				return Object.keys(target[PropertySymbol.getItemList]());
			},
			has(target, property): boolean {
				if (property in target) {
					return true;
				}

				if (typeof property === 'symbol') {
					return false;
				}

				const index = Number(property);
				return !isNaN(index) && index >= 0 && index < target[PropertySymbol.getItemList]().length;
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
				const items = target[PropertySymbol.getItemList]();

				if (!isNaN(index) && items[index]) {
					return {
						value: target[PropertySymbol.getItemList]()[index],
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
		return this[PropertySymbol.getItemList]().length;
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get numberOfItems(): number {
		return this[PropertySymbol.getItemList]().length;
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 */
	public [Symbol.iterator](): IterableIterator<SVGPoint> {
		return this[PropertySymbol.getItemList]().values();
	}

	/**
	 * Clears all items from the list.
	 */
	public clear(): void {
		this[PropertySymbol.ownerElement].removeAttribute(this[PropertySymbol.attributeName]);
	}

	/**
	 * Replace Token.
	 *
	 * @param newItem New item.
	 * @returns The item being replaced.
	 */
	public initialize(newItem: SVGPoint): SVGPoint {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'initialize' on 'SVGPointList': The object is read-only.`
			);
		}

		if (arguments.length < 1) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'initialize' on 'SVGPointList': 1 arguments required, but only ${arguments.length} present.`
			);
		}
		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			`${newItem.x} ${newItem.y}`
		);
		return newItem;
	}

	/**
	 * Returns item at index.
	 *
	 * @param index Index.
	 * @returns The item at the index.
	 **/
	public getItem(index: number | string): SVGPoint {
		const items = this[PropertySymbol.getItemList]();
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
	public insertItemBefore(newItem: SVGPoint, index: number): SVGPoint {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGPointList': The object is read-only.`
			);
		}

		if (arguments.length < 2) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGPointList': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		const items = this[PropertySymbol.getItemList]();
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

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			items.map((item) => `${item.x} ${item.y}`).join(' ')
		);

		return newItem;
	}

	/**
	 * Replaces an existing item in the list with a new item. If newItem is already in a list, it is removed from its previous list before it is inserted into this list. The inserted item is the item itself and not a copy. If the item is already in this list, note that the index of the item to replace is before the removal of the item.
	 *
	 * @param newItem The item to insert into the list.
	 * @param index Index.
	 * @returns The item being replaced.
	 */
	public replaceItem(newItem: SVGPoint, index: number): SVGPoint {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGPointList': The object is read-only.`
			);
		}

		if (arguments.length < 2) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGPointList': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		const items = this[PropertySymbol.getItemList]();
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

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			items.map((item) => `${item.x} ${item.y}`).join(' ')
		);

		return newItem;
	}

	/**
	 * Removes an existing item from the list.
	 *
	 * @param index Index.
	 * @returns The removed item.
	 */
	public removeItem(index: number): SVGPoint {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'removeItem' on 'SVGPointList': The object is read-only.`
			);
		}

		if (arguments.length < 1) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'removeItem' on 'SVGPointList': 1 argument required, but only ${arguments.length} present.`
			);
		}

		const items = this[PropertySymbol.getItemList]();

		index = Number(index);

		if (isNaN(index)) {
			index = 0;
		}

		if (index >= items.length) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].DOMException(
				`Failed to execute 'removeItem' on 'SVGPointList':  The index provided (${index}) is greater than the maximum bound.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}

		if (index < 0) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].DOMException(
				`Failed to execute 'removeItem' on 'SVGPointList':  The index provided (${index}) is negative.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}

		const removedItem = items[index];

		items.splice(index, 1);

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			items.map((item) => `${item.x} ${item.y}`).join(' ')
		);

		return removedItem;
	}

	/**
	 * Appends an item to the end of the list.
	 *
	 * @param newItem The item to add to the list.
	 * @returns The item being appended.
	 */
	public appendItem(newItem: SVGPoint): SVGPoint {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGPointList': The object is read-only.`
			);
		}

		if (arguments.length < 1) {
			throw new this[PropertySymbol.ownerElement][PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGPointList': 1 argument required, but only ${arguments.length} present.`
			);
		}

		const items = this[PropertySymbol.getItemList]();
		const existingIndex = items.indexOf(newItem);

		if (existingIndex !== -1) {
			items.splice(existingIndex, 1);
		}

		items.push(newItem);

		this[PropertySymbol.ownerElement].setAttribute(
			this[PropertySymbol.attributeName],
			items.map((item) => `${item.x} ${item.y}`).join(' ')
		);

		return newItem;
	}

	/**
	 * Returns item list from attribute value.
	 *
	 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
	 */
	public [PropertySymbol.getItemList](): SVGPoint[] {
		const attributeValue =
			this[PropertySymbol.ownerElement].getAttribute(this[PropertySymbol.attributeName]) ?? '';

		const cache = this[PropertySymbol.cache];

		if (cache.attributeValue === attributeValue) {
			return cache.items;
		}

		// It is possible to make this statement shorter by using Array.from() and Set, but this is faster when comparing using a bench test.
		const items: SVGPoint[] = [];
		const trimmed = attributeValue.trim();

		if (trimmed) {
			const parts = trimmed.split(ATTRIBUTE_SEPARATOR_REGEXP);
			for (let i = 0, max = parts.length; i < max; i++) {
				const point = new SVGPoint(PropertySymbol.illegalConstructor);
				const x = parts[i];
				const y = parts[++i];
				point.x = parseFloat(x);
				point.y = y !== undefined ? parseFloat(y) : 0;
				items.push(point);
			}
		}

		cache.attributeValue = attributeValue;
		cache.items = items;

		return items;
	}
}
