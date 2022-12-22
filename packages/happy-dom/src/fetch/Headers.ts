import DOMException from 'src/exception/DOMException';
import DOMExceptionNameEnum from 'src/exception/DOMExceptionNameEnum';
import IHeaders from './IHeaders';
import IHeadersInit from './IHeadersInit';

/**
 * Fetch headers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
 */
export default class Headers implements IHeaders {
	public _entries: { [k: string]: string } = {};

	/**
	 * Constructor.
	 *
	 * @param init Headers init.
	 */
	constructor(init?: IHeadersInit) {
		if (init) {
			if (init instanceof Headers) {
				this._entries = Object.assign({}, init._entries);
			} else if (Array.isArray(init)) {
				for (const entry of init) {
					if (entry.length !== 2) {
						throw new DOMException(
							'Failed to construct "Headers": The provided init is not a valid array.',
							DOMExceptionNameEnum.invalidStateError
						);
					}
					this.append(entry[0], entry[1]);
				}
			} else {
				for (const name of Object.keys(init)) {
					this.set(name, init[name]);
				}
			}
		}
	}

	/**
	 * Appends a new value onto an existing header inside a Headers object, or adds the header if it does not already exist.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public append(name: string, value: string): void {
		const lowerName = name.toLowerCase();
		if (this._entries[lowerName]) {
			this._entries[lowerName] += `, ${value}`;
		} else {
			this._entries[lowerName] = value;
		}
	}

	/**
	 * Removes an header.
	 *
	 * @param name Name.
	 */
	public delete(name: string): void {
		const lowerName = name.toLowerCase();
		delete this._entries[lowerName];
	}

	/**
	 * Returns header value.
	 *
	 * @param name Name.
	 * @returns Value.
	 */
	public get(name: string): string | null {
		const lowerName = name.toLowerCase();
		return this._entries[lowerName] || null;
	}

	/**
	 * Sets a new value for an existing header inside a Headers object, or adds the header if it does not already exist.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public set(name: string, value: string): void {
		const lowerName = name.toLowerCase();
		this._entries[lowerName] = value;
	}

	/**
	 * Returns whether an Headers object contains a certain key.
	 *
	 * @param name Name.
	 * @returns "true" if the Headers object contains the key.
	 */
	public has(name: string): boolean {
		const lowerName = name.toLowerCase();
		return !!this._entries[lowerName];
	}

	/**
	 * Executes a callback function once per each key/value pair in the Headers object.
	 *
	 * @param callback Callback.
	 */
	public forEach(callback: (name: string, value: string, object: IHeaders) => void): void {
		for (const key of Object.keys(this._entries)) {
			callback(key, this._entries[key], this);
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *keys(): IterableIterator<string> {
		for (const key of Object.keys(this._entries)) {
			yield key;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *values(): IterableIterator<string> {
		for (const value of Object.values(this._entries)) {
			yield value;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *entries(): IterableIterator<[string, string]> {
		for (const key of Object.keys(this._entries)) {
			yield [key, this._entries[key]];
		}
	}

	/**
	 * Iterator.
	 *
	 * @returns Iterator.
	 */
	public *[Symbol.iterator](): IterableIterator<[string, string]> {
		for (const key of Object.keys(this._entries)) {
			yield [key, this._entries[key]];
		}
	}
}
