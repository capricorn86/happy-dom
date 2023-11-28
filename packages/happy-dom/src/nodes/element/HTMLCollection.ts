import IHTMLCollection from './IHTMLCollection.js';

/**
 * HTML collection.
 */
export default class HTMLCollection<T> extends Array implements IHTMLCollection<T> {
	protected __namedItems__: { [k: string]: T[] } = {};

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): T | null {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): T | null {
		return this.__namedItems__[name] && this.__namedItems__[name].length
			? this.__namedItems__[name][0]
			: null;
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public __appendNamedItem__(node: T, name: string): void {
		if (name) {
			this.__namedItems__[name] = this.__namedItems__[name] || [];

			if (!this.__namedItems__[name].includes(node)) {
				this.__namedItems__[name].push(node);
			}

			if (!this.hasOwnProperty(name) && this.__isValidPropertyName__(name)) {
				this[name] = this.__namedItems__[name][0];
			}
		}
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 * @param name Name.
	 */
	public __removeNamedItem__(node: T, name: string): void {
		if (name && this.__namedItems__[name]) {
			const index = this.__namedItems__[name].indexOf(node);

			if (index > -1) {
				this.__namedItems__[name].splice(index, 1);

				if (this.__namedItems__[name].length === 0) {
					delete this.__namedItems__[name];
					if (this.hasOwnProperty(name) && this.__isValidPropertyName__(name)) {
						delete this[name];
					}
				} else if (this.__isValidPropertyName__(name)) {
					this[name] = this.__namedItems__[name][0];
				}
			}
		}
	}

	/**
	 * Returns "true" if the property name is valid.
	 *
	 * @param name Name.
	 * @returns True if the property name is valid.
	 */
	protected __isValidPropertyName__(name: string): boolean {
		return (
			!this.constructor.prototype.hasOwnProperty(name) &&
			!Array.prototype.hasOwnProperty(name) &&
			(isNaN(Number(name)) || name.includes('.'))
		);
	}
}
