import INodeList from './INodeList';

/**
 * Class list.
 */
export default class NodeList<T> extends Array implements INodeList<T> {
	/**
	 * Returns `Symbol.toStringTag`.
	 *
	 * @returns `Symbol.toStringTag`.
	 */
	public get [Symbol.toStringTag](): string {
		return this.constructor.name;
	}

	/**
	 * Returns item by index.
	 *
	 * @param index Index.
	 */
	public item(index: number): T {
		return index >= 0 && this[index] ? this[index] : null;
	}
}
