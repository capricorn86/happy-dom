import MimeType from './MimeType';

/**
 * MimeTypeArray.
 */
export default class MimeTypeArray {
	[n: number]: MimeType;
	public readonly _length: number;

	/**
	 * Constructor.
	 *
	 */
	constructor() {}

	/**
	 * @param index
	 */
	public item(index: number): MimeType {
		return this[index];
	}
	/**
	 * @param name
	 */
	public namedItem(name: string): MimeType {
		return this[name];
	}
	/**
	 * @returns MimeType length.
	 */
	public get length(): number {
		return this._length ? this._length : 0;
	}

	/**
	 * @returns String.
	 */
	public toString(): string {
		return '[object MimeTypeArray]';
	}
}
