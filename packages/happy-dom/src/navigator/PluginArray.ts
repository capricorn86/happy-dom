import Plugin from './Plugin';

/**
 * PluginArray.
 */
export default class PluginArray {
	[n: number]: Plugin;
	public readonly _length: number;

	/**
	 * Constructor.
	 */
	constructor() {}
	/**
	 * Item.
	 *
	 * @param index Number.
	 * @returns Plugin.
	 */
	public item(index: number): Plugin {
		return this[index];
	}

	/**
	 * NamedItem.
	 *
	 * @param name String.
	 * @returns Plugin.
	 */
	public namedItem(name: string): Plugin {
		return this[name];
	}
	/**
	 * @returns Undefined.
	 */
	public refresh(): undefined {
		return undefined;
	}
	/**
	 * @returns Number.
	 */
	public get length(): number {
		return this._length ? this._length : 0;
	}

	/**
	 * @returns String.
	 */
	public toString(): string {
		return '[object PluginArray]';
	}
}
