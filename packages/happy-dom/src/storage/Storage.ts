/**
 * Storage.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Storage
 */
export default class Storage {
	#store: { [k: string]: string } = {};

	/**
	 * Returns length.
	 *
	 * @returns Length.
	 */
	public get length(): number {
		return Object.keys(this.#store).length;
	}

	/**
	 * Returns name of the nth key.
	 *
	 * @param index Index.
	 * @returns Name.
	 */
	public key(index: number): string {
		const name = Object.keys(this.#store)[index];
		return name === undefined ? null : name;
	}

	/**
	 * Sets item.
	 *
	 * @param name Name.
	 * @param item Item.
	 */
	public setItem(name: string, item: string): void {
		this.#store[name] = item;
	}

	/**
	 * Returns item.
	 *
	 * @param name Name.
	 * @returns Item.
	 */
	public getItem(name: string): string {
		return this.#store[name] === undefined ? null : this.#store[name];
	}

	/**
	 * Removes item.
	 *
	 * @param name Name.
	 */
	public removeItem(name: string): void {
		delete this.#store[name];
	}

	/**
	 * Clears storage.
	 */
	public clear(): void {
		this.#store = {};
	}
}
