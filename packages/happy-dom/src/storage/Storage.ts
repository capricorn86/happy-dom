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
		const data = this[PropertySymbol.data];

		return new Proxy(this, {
			get: (target, property) => {
				if (typeof property === 'symbol') {
					return (<any>target)[property];
				}

				if (property in target) {
					// A property defined directly on the store (for example by
					// `vi.spyOn(storage, 'getItem')`) wins over the prototype.
					if (Object.prototype.hasOwnProperty.call(target, property)) {
						return (<any>target)[property];
					}

					// Methods are looked up on `Storage.prototype` on every
					// read and bound to the store, so a later patch of the
					// prototype (for example by `vi.spyOn(Storage.prototype,
					// 'setItem')`) is picked up instead of a bound copy made
					// on the first read outliving it.
					if (property !== 'constructor') {
						const descriptor = Object.getOwnPropertyDescriptor(Storage.prototype, property);
						if (descriptor) {
							if (typeof descriptor.value === 'function') {
								return descriptor.value.bind(target);
							}
							if (descriptor.get !== undefined) {
								return descriptor.get.call(target);
							}
						}
					}

					return (<any>target)[property];
				}
				if (property in data) {
					return data[property];
				}
			},
			set(target, property, newValue): boolean {
				if (property in target || typeof property === 'symbol') {
					return true;
				}

				data[String(property)] = String(newValue);
				return true;
			},
			deleteProperty(target, property): boolean {
				if (typeof property === 'string') {
					if (property in data) {
						delete data[property];
						return true;
					}

					// A method (or other property) defined directly on the
					// store can be deleted, like on an ordinary object, so
					// restoring a spy on the store does not leave the mock
					// behind. The next read falls back to the prototype.
					if (Object.prototype.hasOwnProperty.call(target, property)) {
						return delete (<any>target)[property];
					}
				}

				return true;
			},
			ownKeys(): string[] {
				return Object.keys(data);
			},
			has(target, property): boolean {
				if (property in target || property in data) {
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
					data[String(property)] = String(descriptor.value);
					return true;
				}

				return false;
			},
			getOwnPropertyDescriptor(target, property): PropertyDescriptor | undefined {
				if (property in target) {
					return;
				}

				const value = data[String(property)];

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
		const data = this[PropertySymbol.data];
		for (const key of Object.keys(data)) {
			delete data[key];
		}
	}
}
