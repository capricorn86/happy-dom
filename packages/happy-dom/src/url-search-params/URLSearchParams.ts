/**
 * URLSearchParams.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams.
 */
export default class URLSearchParams {
	private _params: Array<[string, string]> = [];

	/**
	 * Constructor.
	 *
	 * @param [params] Params string.
	 */
	constructor(params?: string) {
		if (params) {
			for (const entry of params.split('&')) {
				const [name, value] = entry.split('=');
				if (name) {
					this._params.push([name, value]);
				}
			}
		}
	}

	/**
	 * Appends a specified key/value pair as a new search parameter.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public append(name: string, value: string): void {
		this._params.push([name, value]);
	}

	/**
	 * Deletes the given search parameter, and its associated value, from the list of all search parameters.
	 *
	 * @param name Name.
	 */
	public delete(name: string): void {
		for (let i = 0, max = this._params.length; i < max; i++) {
			if (this._params[i][0] === name) {
				this._params.splice(i, 1);
				i--;
				max--;
			}
		}
	}

	/**
	 * Returns an iterator.
	 *
	 * @returns Entries.
	 */
	public entries(): IterableIterator<[string, string]> {
		const params = this._params;
		const Iterator = function Iterator(): void {
			let index = 0;
			this.next = () => {
				const value = params[index];
				const done = index >= params.length;
				index++;
				return { value, done: done };
			};
			this[Symbol.iterator] = () => new Iterator();
		};
		return <IterableIterator<[string, string]>>new Iterator();
	}

	/**
	 * For each.
	 *
	 * @param callback Callback.
	 */
	public forEach(callback: (value, key) => void): void {
		for (const param of this._params) {
			callback(param[0], param[1]);
		}
	}

	/**
	 * Returns value.
	 *
	 * @param name Name.
	 */
	public get(name: string): string {
		for (const param of this._params) {
			if (param[0] === name) {
				return param[1];
			}
		}
		return undefined;
	}

	/**
	 * Returns all values associated with a name.
	 *
	 * @param name Name.
	 * @returns Values.
	 */
	public getAll(name: string): string[] {
		const values = [];
		for (const param of this._params) {
			if (param[0] === name) {
				values.push(param[1]);
			}
		}
		return values;
	}

	/**
	 * Returns "true" if param exists.
	 *
	 * @param name Name.
	 * @returns "true" if param exists.
	 */
	public has(name: string): boolean {
		for (const param of this._params) {
			if (param[0] === name) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns an iterator.
	 *
	 * @returns Keys iterator.
	 */
	public keys(): IterableIterator<string> {
		const params = this._params;
		const Iterator = function Iterator(): void {
			let index = 0;
			this.next = () => {
				const value = params[index] !== undefined ? params[index][0] : undefined;
				const done = index >= params.length;
				index++;
				return { value, done: done };
			};
			this[Symbol.iterator] = () => new Iterator();
		};
		return <IterableIterator<string>>new Iterator();
	}

	/**
	 * Sets the value associated with a given search parameter to the given value. If there are several values, the others are deleted.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public set(name: string, value: string): void {
		this.delete(name);
		this.append(name, value);
	}

	/**
	 * Sorts all key/value pairs, if any, by their keys.
	 */
	public sort(): void {
		this._params.sort((a, b) => {
			if (a[0] < b[0]) {
				return -1;
			} else if (a[0] > b[0]) {
				return 1;
			}
			return 0;
		});
	}

	/**
	 * Returns a string containing a query string suitable for use in a URL.
	 */
	public toString(): string {
		return this._params.map(param => param.join('=')).join('&');
	}

	/**
	 * Returns an iterator.
	 *
	 * @returns Values iterator.
	 */
	public values(): IterableIterator<string> {
		const params = this._params;
		const Iterator = function Iterator(): void {
			let index = 0;
			this.next = () => {
				const value = params[index] !== undefined ? params[index][1] : undefined;
				const done = index >= params.length;
				index++;
				return { value, done: done };
			};
			this[Symbol.iterator] = () => new Iterator();
		};
		return <IterableIterator<string>>new Iterator();
	}
}
