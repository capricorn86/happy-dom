/**
 *
 */
export default class Storage {
	private _store: { [k: string]: string } = {};

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return Object.keys(this._store).length;
	}

	/**
	 * Returns name of the nth key.
	 *
	 * @param index Index.
	 * @returns Name.
	 */
	public key(index: number): string {
		const name = Object.keys(this._store)[index];
		return name === undefined ? null : name;
	}

	/**
	 * Sets item.
	 *
	 * @param name Name.
	 * @param item Item.
	 */
	public setItem(name: string, item: string): void {
		this._store[name] = item;
	}

	/**
	 * Returns item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	public getItem(name: string): string {
		return this._store[name] === undefined ? null : this._store[name];
	}

	/**
	 * Removes item.
	 *
	 * @param name Name.
	 */
	public removeItem(name: string): void {
		delete this._store[name];
	}

	/**
	 * Clears storage.
	 */
	public clear(): void {
		this._store = {};
	}
}
