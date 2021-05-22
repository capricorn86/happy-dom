import File from '../file/File';

/**
 *
 */
export default class DataTransferItem {
	public readonly kind: string = '';
	public readonly type: string = '';
	private _item: string | File = null;

	/**
	 * Constructor.
	 *
	 * @param item Item.
	 */
	constructor(item: string | File) {
		this.kind = typeof item === 'string' ? 'string' : 'file';
		this._item = item;
	}

	/**
	 * Returns file.
	 */
	public getAsFile(): File {
		if (this.kind === 'string') {
			return null;
		}
		return <File>this._item;
	}

	/**
	 * Returns string.
	 */
	public getAsString(): string {
		if (this.kind === 'file') {
			return null;
		}
		return <string>this._item;
	}
}
