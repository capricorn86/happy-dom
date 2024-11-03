import ClassMethodBinder from '../ClassMethodBinder.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../PropertySymbol.js';
import BrowserWindow from '../window/BrowserWindow.js';
import SVGNumber from './SVGNumber.js';

const ATTRIBUTE_SEPARATOR_REGEXP = /[\t\f\n\r, ]+/;

/**
 * SVGNumberList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGNumberList
 */
export default class SVGNumberList {
	[index: number]: SVGNumber;

	public [PropertySymbol.window]: BrowserWindow;
	public [PropertySymbol.getAttribute]: () => string | null = null;
	public [PropertySymbol.setAttribute]: (value: string) => void | null = null;
	public [PropertySymbol.readOnly]: boolean = false;
	private [PropertySymbol.cache]: { items: SVGNumber[]; attributeValue: string } = {
		items: [],
		attributeValue: ''
	};

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol Illegal constructor symbol.
	 * @param window Window.
	 * @param options Options.
	 * @param [options.readOnly] Read only.
	 * @param options.getAttribute Get attribute.
	 * @param options.setAttribute Set attribute.
	 */
	constructor(
		illegalConstructorSymbol: symbol,
		window: BrowserWindow,
		options: {
			readOnly?: boolean;
			getAttribute: () => string | null;
			setAttribute: (value: string) => void;
		}
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		this[PropertySymbol.window] = window;
		this[PropertySymbol.readOnly] = !!options.readOnly;
		this[PropertySymbol.getAttribute] = options.getAttribute || null;
		this[PropertySymbol.setAttribute] = options.setAttribute || null;

		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		const methodBinder = new ClassMethodBinder(this, [SVGNumberList]);

		return new Proxy(this, {
			get: (target, property) => {
				if (property === 'length' || property === 'numberOfItems') {
					return target[PropertySymbol.getItemList]().length;
				}
				if (property in target || typeof property === 'symbol') {
					methodBinder.bind(property);
					return target[property];
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return target[PropertySymbol.getItemList]()[index];
				}
			},
			set(target, property, newValue): boolean {
				methodBinder.bind(property);
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
				methodBinder.preventBinding(property);

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
	public [Symbol.iterator](): IterableIterator<SVGNumber> {
		return this[PropertySymbol.getItemList]().values();
	}

	/**
	 * Clears all items from the list.
	 */
	public clear(): void {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'clear' on 'SVGNumberList': The object is read-only.`
			);
		}

		for (const item of this[PropertySymbol.cache].items) {
			item[PropertySymbol.getAttribute] = null;
			item[PropertySymbol.setAttribute] = null;
		}

		this[PropertySymbol.cache].items = [];
		this[PropertySymbol.cache].attributeValue = '';
		this[PropertySymbol.setAttribute]('');
	}

	/**
	 * Replace Token.
	 *
	 * @param newItem New item.
	 * @returns The item being replaced.
	 */
	public initialize(newItem: SVGNumber): SVGNumber {
		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'initialize' on 'SVGNumberList': 1 arguments required, but only ${arguments.length} present.`
			);
		}

		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'initialize' on 'SVGNumberList': The object is read-only.`
			);
		}

		for (const item of this[PropertySymbol.cache].items) {
			item[PropertySymbol.getAttribute] = null;
			item[PropertySymbol.setAttribute] = null;
		}

		newItem[PropertySymbol.getAttribute] = () => newItem[PropertySymbol.attributeValue];
		newItem[PropertySymbol.setAttribute] = () => {
			this[PropertySymbol.cache].attributeValue = this[PropertySymbol.getItemList]()
				.map((item) => item[PropertySymbol.attributeValue] || '0')
				.join(' ');
			this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);
		};

		this[PropertySymbol.cache].items = [newItem];
		this[PropertySymbol.cache].attributeValue = newItem[PropertySymbol.attributeValue];
		this[PropertySymbol.setAttribute](newItem[PropertySymbol.attributeValue]);

		return newItem;
	}

	/**
	 * Returns item at index.
	 *
	 * @param index Index.
	 * @returns The item at the index.
	 **/
	public getItem(index: number | string): SVGNumber {
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
	public insertItemBefore(newItem: SVGNumber, index: number): SVGNumber {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGNumberList': The object is read-only.`
			);
		}

		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGNumberList': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGNumber)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'insertItemBefore' on 'SVGNumberList': parameter 1 is not of type 'SVGNumber'.`
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

		newItem[PropertySymbol.getAttribute] = () => newItem[PropertySymbol.attributeValue];
		newItem[PropertySymbol.setAttribute] = () => {
			this[PropertySymbol.cache].attributeValue = this[PropertySymbol.getItemList]()
				.map((item) => item[PropertySymbol.attributeValue] || '0')
				.join(' ');
			this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);
		};

		this[PropertySymbol.cache].attributeValue = items
			.map((item) => item[PropertySymbol.attributeValue] || '0')
			.join(' ');
		this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);

		return newItem;
	}

	/**
	 * Replaces an existing item in the list with a new item. If newItem is already in a list, it is removed from its previous list before it is inserted into this list. The inserted item is the item itself and not a copy. If the item is already in this list, note that the index of the item to replace is before the removal of the item.
	 *
	 * @param newItem The item to insert into the list.
	 * @param index Index.
	 * @returns The item being replaced.
	 */
	public replaceItem(newItem: SVGNumber, index: number): SVGNumber {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGNumberList': The object is read-only.`
			);
		}

		if (arguments.length < 2) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGNumberList': 2 arguments required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGNumber)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'replaceItem' on 'SVGNumberList': parameter 1 is not of type 'SVGNumber'.`
			);
		}

		const items = this[PropertySymbol.getItemList]();
		const existingIndex = items.indexOf(newItem);

		if (existingIndex === index) {
			return newItem;
		}

		if (existingIndex !== -1) {
			items.splice(existingIndex, 1);
		}

		if (index < 0) {
			index = 0;
		} else if (index >= items.length) {
			index = items.length - 1;
		}

		if (items[index]) {
			items[index][PropertySymbol.getAttribute] = null;
			items[index][PropertySymbol.setAttribute] = null;
		}

		const replacedItem = items[index];

		items[index] = newItem;

		newItem[PropertySymbol.getAttribute] = () => newItem[PropertySymbol.attributeValue];
		newItem[PropertySymbol.setAttribute] = () => {
			this[PropertySymbol.cache].attributeValue = this[PropertySymbol.getItemList]()
				.map((item) => item[PropertySymbol.attributeValue] || '0')
				.join(' ');
			this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);
		};

		this[PropertySymbol.cache].attributeValue = items
			.map((item) => item[PropertySymbol.attributeValue] || '0')
			.join(' ');
		this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);

		return replacedItem;
	}

	/**
	 * Removes an existing item from the list.
	 *
	 * @param index Index.
	 * @returns The removed item.
	 */
	public removeItem(index: number): SVGNumber {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'removeItem' on 'SVGNumberList': The object is read-only.`
			);
		}

		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'removeItem' on 'SVGNumberList': 1 argument required, but only ${arguments.length} present.`
			);
		}

		const items = this[PropertySymbol.getItemList]();

		index = Number(index);

		if (isNaN(index)) {
			index = 0;
		}

		if (index >= items.length) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'removeItem' on 'SVGNumberList':  The index provided (${index}) is greater than the maximum bound.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}

		if (index < 0) {
			throw new this[PropertySymbol.window].DOMException(
				`Failed to execute 'removeItem' on 'SVGNumberList':  The index provided (${index}) is negative.`,
				DOMExceptionNameEnum.indexSizeError
			);
		}

		const removedItem = items[index];

		if (removedItem) {
			removedItem[PropertySymbol.getAttribute] = null;
			removedItem[PropertySymbol.setAttribute] = null;
		}

		items.splice(index, 1);

		this[PropertySymbol.setAttribute](
			items.map((item) => item[PropertySymbol.attributeValue] || '0').join(' ')
		);

		return removedItem;
	}

	/**
	 * Appends an item to the end of the list.
	 *
	 * @param newItem The item to add to the list.
	 * @returns The item being appended.
	 */
	public appendItem(newItem: SVGNumber): SVGNumber {
		if (this[PropertySymbol.readOnly]) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGNumberList': The object is read-only.`
			);
		}

		if (arguments.length < 1) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGNumberList': 1 argument required, but only ${arguments.length} present.`
			);
		}

		if (!(newItem instanceof SVGNumber)) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'appendItem' on 'SVGNumberList': parameter 1 is not of type 'SVGNumber'.`
			);
		}

		const items = this[PropertySymbol.getItemList]();
		const existingIndex = items.indexOf(newItem);

		if (existingIndex !== -1) {
			items.splice(existingIndex, 1);
		}

		items.push(newItem);

		newItem[PropertySymbol.getAttribute] = () => newItem[PropertySymbol.attributeValue];
		newItem[PropertySymbol.setAttribute] = () => {
			this[PropertySymbol.cache].attributeValue = this[PropertySymbol.getItemList]()
				.map((item) => item[PropertySymbol.attributeValue] || '0')
				.join(' ');
			this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);
		};

		this[PropertySymbol.cache].attributeValue = items
			.map((item) => item[PropertySymbol.attributeValue] || '0')
			.join(' ');
		this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);

		return newItem;
	}

	/**
	 * Returns item list from attribute value.
	 *
	 * @see https://infra.spec.whatwg.org/#split-on-ascii-whitespace
	 */
	public [PropertySymbol.getItemList](): SVGNumber[] {
		const attributeValue = this[PropertySymbol.getAttribute]() ?? '';

		const cache = this[PropertySymbol.cache];

		if (cache.attributeValue === attributeValue) {
			return cache.items;
		}

		if (cache.items.length) {
			for (const item of cache.items) {
				item[PropertySymbol.getAttribute] = null;
				item[PropertySymbol.setAttribute] = null;
			}
		}

		// It is possible to make this statement shorter by using Array.from() and Set, but this is faster when comparing using a bench test.
		const items: SVGNumber[] = [];
		const trimmed = attributeValue.trim();

		if (trimmed) {
			const parts = trimmed.split(ATTRIBUTE_SEPARATOR_REGEXP);
			for (let i = 0, max = parts.length; i < max; i++) {
				const item = new SVGNumber(PropertySymbol.illegalConstructor, this[PropertySymbol.window], {
					readOnly: this[PropertySymbol.readOnly],
					getAttribute: () => item[PropertySymbol.attributeValue],
					setAttribute: () => {
						this[PropertySymbol.cache].attributeValue = this[PropertySymbol.getItemList]()
							.map((item) => item[PropertySymbol.attributeValue] || '0')
							.join(' ');
						this[PropertySymbol.setAttribute](this[PropertySymbol.cache].attributeValue);
					}
				});
				item[PropertySymbol.attributeValue] = String(parseFloat(parts[i]));
				items.push(item);
			}
		}

		cache.attributeValue = attributeValue;
		cache.items = items;

		return items;
	}
}
