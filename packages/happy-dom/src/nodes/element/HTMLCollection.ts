import IHTMLCollection from './IHTMLCollection';
import INode from '../node/INode';

const NAMED_ITEM_PROPERTIES = ['id', 'name'];

/**
 * Class list.
 */
export default class HTMLCollection extends Array implements IHTMLCollection<INode> {
	private _namedItems: { [k: string]: INode[] } = {};

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): INode {
		return index >= 0 && this[index] ? this[index] : null;
	}

	/**
	 * Returns named item.
	 *
	 * @param name Name.
	 * @returns Node.
	 */
	public namedItem(name: string): INode {
		return this[name];
	}

	/**
	 * Appends named item.
	 *
	 * @param node Node.
	 */
	public _appendNamedItem(node: INode): void {
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
	public _removeNamedItem(node: INode): void {
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
