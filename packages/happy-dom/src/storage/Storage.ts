import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Storage.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export default class Storage {
	public [PropertySymbol.data]: { [key: string]: string } = {};

	/**
	 *
	 */
	constructor() {
		const descriptors = Object.getOwnPropertyDescriptors(Storage.prototype);

		Object.defineProperty(this, 'length', {
			enumerable: false,
			configurable: true,
			get: descriptors['length'].get.bind(this)
		});

		Object.defineProperty(this, 'key', {
			enumerable: false,
			configurable: true,
			value: descriptors['key'].value.bind(this)
		});

		Object.defineProperty(this, 'setItem', {
			enumerable: false,
			configurable: true,
			value: descriptors['setItem'].value.bind(this)
		});

		Object.defineProperty(this, 'getItem', {
			enumerable: false,
			configurable: true,
			value: descriptors['getItem'].value.bind(this)
		});

		Object.defineProperty(this, 'removeItem', {
			enumerable: false,
			configurable: true,
			value: descriptors['removeItem'].value.bind(this)
		});

		Object.defineProperty(this, 'clear', {
			enumerable: false,
			configurable: true,
			value: descriptors['clear'].value.bind(this)
		});
	}

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return Object.keys(this[PropertySymbol.data]).length;
	}

	/**
	 * Returns name of the nth key.
	 *
	 * @param index Index.
	 * @returns Name.
	 */
	public key(index: number): string | null {
		const name = Object.keys(this[PropertySymbol.data])[index];
		return name !== undefined ? name : null;
	}

	/**
	 * Sets item.
	 *
	 * @param name Name.
	 * @param item Item.
	 */
	public setItem(name: string, item: string): void {
		this[PropertySymbol.data][name] = String(item);
	}

	/**
	 * Returns item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	public getItem(name: string): string | null {
		return this[PropertySymbol.data][name] !== undefined ? this[PropertySymbol.data][name] : null;
	}

	/**
	 * Removes item.
	 *
	 * @param name Name.
	 */
	public removeItem(name: string): void {
		delete this[PropertySymbol.data][name];
	}

	/**
	 * Clears storage.
	 */
	public clear(): void {
		this[PropertySymbol.data] = {};
	}
}
