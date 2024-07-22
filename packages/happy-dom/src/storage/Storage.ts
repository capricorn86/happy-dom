import * as PropertySymbol from '../PropertySymbol.js';

/**
 * Storage.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export default class Storage {
	public [PropertySymbol.data]: { [key: string]: string } = {};

	/**
	 * Constructor.
	 */
	constructor() {
		return new Proxy(this, {
			get: (target, property) => {
				if (property in target || typeof property === 'symbol') {
					const returnValue = target[property];
					if (typeof returnValue === 'function') {
						return returnValue.bind(target);
					}
					return returnValue;
				}
				const value = target[PropertySymbol.data][String(property)];
				if (value !== undefined) {
					return value;
				}
			},
			set(target, property, newValue): boolean {
				if (property in target) {
					return false;
				}
				target[PropertySymbol.data][String(property)] = String(newValue);
			},
			deleteProperty(target, property): boolean {
				if (property in target) {
					return false;
				}

				delete target[PropertySymbol.data][String(property)];
			},
			ownKeys(target): string[] {
				return Object.keys(target[PropertySymbol.data]);
			},
			has(target, property): boolean {
				if (property in target || property in target[PropertySymbol.data]) {
					return true;
				}

				return false;
			},
			defineProperty(target, property, descriptor): boolean {
				if (property in target) {
					Object.defineProperty(target, property, descriptor);
					return true;
				}

				if (descriptor.value !== undefined) {
					target[PropertySymbol.data][String(property)] = String(descriptor.value);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor {
				if (property in target) {
					return;
				}

				const value = target[PropertySymbol.data][String(property)];

				if (value !== undefined) {
					return {
						value: value,
						writable: true,
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
