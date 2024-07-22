import * as PropertySymbol from '../../PropertySymbol.js';
import Node from './Node.js';

/**
 * NodeList.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */
class NodeList<T extends Node> {
	[index: number]: T;
	public [PropertySymbol.items]: T[];

	/**
	 * Constructor.
	 *
	 * @param items Items.
	 */
	constructor(items: T[]) {
		this[PropertySymbol.items] = items;

		return new Proxy(this, {
			get: (target, property, reciever) => {
				if (property === 'length') {
					return items.length;
				}
				if (property in target || typeof property === 'symbol') {
					return Reflect.get(target, property, reciever);
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return items[index];
				}
			},
			set(): boolean {
				return true;
			},
			deleteProperty(): boolean {
				return true;
			},
			ownKeys(): string[] {
				return Object.keys(items);
			},
			has(target, property): boolean {
				if (property in target) {
					return true;
				}

				const index = Number(property);
				return !isNaN(index) && index >= 0 && index < items.length;
			},
			defineProperty(target, property, descriptor): boolean {
				if (property in target) {
					Reflect.defineProperty(target, property, descriptor);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor {
				if (property in target) {
					return;
				}

				const index = Number(property);

				if (!isNaN(index) && items[index]) {
					return {
						value: items[index],
						writable: false,
						enumerable: true,
						configurable: false
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
		const nodes = this[PropertySymbol.items];
		return index >= 0 && nodes[index] ? <T>nodes[index] : null;
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public [Symbol.iterator](): IterableIterator<T> {
		const items = <T[]>this[PropertySymbol.items];
		return items[Symbol.iterator]();
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public values(): IterableIterator<T> {
		return (<T[]>this[PropertySymbol.items]).values();
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public entries(): IterableIterator<[number, T]> {
		return (<T[]>this[PropertySymbol.items]).entries();
	}

	/**
	 * Executes a provided callback function once for each DOMTokenList element.
	 *
	 * @param callback Function.
	 * @param thisArg thisArg.
	 */
	public forEach(callback: (currentValue, currentIndex, listObj) => void, thisArg?: this): void {
		return (<T[]>this[PropertySymbol.items]).forEach(callback, thisArg);
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public keys(): IterableIterator<number> {
		return (<T[]>this[PropertySymbol.items]).keys();
	}
}

export default NodeList;
