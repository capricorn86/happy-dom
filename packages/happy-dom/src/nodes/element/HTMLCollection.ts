import IHTMLCollection from './IHTMLCollection';

const NAMED_ITEM_PROPERTIES = ['id', 'name'];

/**
 * Class list.
 */
export default class HTMLCollection<T> extends Array implements IHTMLCollection<T> {
	private _namedItems: { [k: string]: T[] } = {};

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): T {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): T {
		return this[name];
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 */
	public _appendNamedItem(node: T): void {
		for (const property of NAMED_ITEM_PROPERTIES) {
			const name = node[property];

			if (name) {
				this._namedItems[name] = this._namedItems[name] || [];

				if (!this._namedItems[name].includes(node)) {
					this._namedItems[name].push(node);
				}

				if (!this[name]) {
					this[name] = this._namedItems[name][0];
				}
			}
		}
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 */
	public _removeNamedItem(node: T): void {
		for (const property of NAMED_ITEM_PROPERTIES) {
			const name = node[property];

			if (name && this._namedItems[name]) {
				const index = this._namedItems[name].indexOf(node);

				if (index > -1) {
					this._namedItems[name].splice(index, 1);

					if (this._namedItems[name].length === 0) {
						delete this._namedItems[name];
						delete this[name];
					}
				}
			}
		}
	}
}
