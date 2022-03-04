import MimeType from './MimeType';

/**
 * Plugin.
 */
export default class Plugin {
	[n: number]: MimeType;
	public readonly _description: string;
	public readonly _filename: string;
	public readonly _name: string;
	public readonly _length: number;

	/**
	 * Constructor.
	 */
	constructor() {}

	/**
	 * Item.
	 *
	 * @param index Number.
	 * @returns IMimeType.
	 */
	public item(index: number): MimeType {
		return this[index];
	}

	/**
	 * NamedItem.
	 *
	 * @param name String.
	 * @returns IMimeType.
	 */
	public namedItem(name: string): MimeType {
		return this[name];
	}

	/**
	 *
	 */
	public get description(): string {
		return this._description ? this._description : '';
	}
	/**
	 *
	 */
	public get filename(): string {
		return this._filename ? this._filename : '';
	}
	/**
	 *
	 */
	public get length(): number {
		return this._length ? this._length : 0;
	}
	/**
	 *
	 */
	public get name(): string {
		return this._name ? this._name : '';
	}
	/**
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object Plugin]';
	}
}
