/**
 * Storage.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export default class Storage {
	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return Object.keys(this).length;
	}

	/**
	 * Returns name of the nth key.
	 *
	 * @param index Index.
	 * @returns Name.
	 */
	public key(index: number): string {
		const name = Object.keys(this)[index];
		return name === undefined ? null : name;
	}

	/**
	 * Sets item.
	 *
	 * @param name Name.
	 * @param item Item.
	 */
	public setItem(name: string, item: string): void {
		this[name] = item;
	}

	/**
	 * Returns item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	public getItem(name: string): string {
		return this[name] === undefined ? null : this[name];
	}

	/**
	 * Removes item.
	 *
	 * @param name Name.
	 */
	public removeItem(name: string): void {
		delete this[name];
	}

	/**
	 * Clears storage.
	 */
	public clear(): void {
		const keys = Object.keys(this);
		for (const key of keys) {
			delete this[key];
		}
	}
}
