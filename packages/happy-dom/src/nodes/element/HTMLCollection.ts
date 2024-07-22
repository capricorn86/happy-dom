import * as PropertySymbol from '../../PropertySymbol.js';
import Element from './Element.js';

/**
 * HTMLCollection.
 *
 * We are extending Array here to improve performance.
 * However, we should not expose Array methods to the outside.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection
 */
export default class HTMLCollection<T extends Element, NamedItem = T> {
	[index: number]: T;
	protected [PropertySymbol.query]: () => T[];

	/**
	 * Constructor.
	 *
	 * @param query Query function.
	 */
	constructor(query: () => T[]) {
		this[PropertySymbol.query] = query;

		return new Proxy(this, {
			get: (target, property, reciever) => {
				if (property in target || typeof property === 'symbol') {
					return Reflect.get(target, property, reciever);
				}
				const index = Number(property);
				if (!isNaN(index)) {
					return query()[index];
				}
				return target.namedItem(<string>property) || undefined;
			},
			set(): boolean {
				return true;
			},
			deleteProperty(): boolean {
				return true;
			},
			ownKeys(): string[] {
				const keys: string[] = [];
				const items = query();
				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const name =
						item.attributes['id']?.[PropertySymbol.value] ||
						item.attributes['name']?.[PropertySymbol.value];
					keys.push(String(i));

					if (name) {
						keys.push(name);
					}
				}
				return keys;
			},
			has(target, property): boolean {
				if (property in target) {
					return true;
				}

				const items = query();
				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < items.length) {
					return true;
				}

				property = String(property);

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const name =
						item.attributes['id']?.[PropertySymbol.value] ||
						item.attributes['name']?.[PropertySymbol.value];

					if (name && name === property) {
						return true;
					}
				}

				return false;
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

				const items = query();
				const index = Number(property);

				if (!isNaN(index) && index >= 0 && index < items.length) {
					return {
						value: items[index],
						writable: false,
						enumerable: true,
						configurable: false
					};
				}

				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					const name =
						item.attributes['id']?.[PropertySymbol.value] ||
						item.attributes['name']?.[PropertySymbol.value];

					if (name && name === property) {
						return {
							value: item,
							writable: false,
							enumerable: true,
							configurable: false
						};
					}
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
		return this[PropertySymbol.query]().length;
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
		const items = this[PropertySymbol.query]();
		return index >= 0 && items[index] ? items[index] : null;
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public [Symbol.iterator](): IterableIterator<T> {
		const items = this[PropertySymbol.query]();
		return items[Symbol.iterator]();
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): NamedItem | null {
		const items = this[PropertySymbol.query]();
		name = String(name);
		for (const item of items) {
			if (
				item.attributes['id']?.[PropertySymbol.value] === name ||
				item.attributes['name']?.[PropertySymbol.value] === name
			) {
				return <NamedItem>(<unknown>item);
			}
		}
		return null;
	}
}
