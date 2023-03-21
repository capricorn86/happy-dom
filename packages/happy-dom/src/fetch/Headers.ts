import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import IHeaders from './types/IHeaders';
import IHeadersInit from './types/IHeadersInit';

/**
 * Fetch headers.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
 */
export default class Headers implements IHeaders {
	public _entries: { [k: string]: { name: string; value: string } } = {};

	/**
	 * Constructor.
	 *
	 * @param init Headers init.
	 */
	constructor(init?: IHeadersInit) {
		if (init) {
			if (init instanceof Headers) {
				this._entries = JSON.parse(JSON.stringify(init._entries));
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
			this._entries[lowerName].value += `, ${value}`;
		} else {
			this._entries[lowerName] = {
				name,
				value
			};
		}
	}

	/**
	 * Removes an header.
	 *
	 * @param name Name.
	 */
	public delete(name: string): void {
		delete this._entries[name.toLowerCase()];
	}

	/**
	 * Returns header value.
	 *
	 * @param name Name.
	 * @returns Value.
	 */
	public get(name: string): string | null {
		return this._entries[name.toLowerCase()]?.value || null;
	}

	/**
	 * Sets a new value for an existing header inside a Headers object, or adds the header if it does not already exist.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public set(name: string, value: string): void {
		this._entries[name.toLowerCase()] = {
			name,
			value
		};
	}

	/**
	 * Returns whether an Headers object contains a certain key.
	 *
	 * @param name Name.
	 * @returns "true" if the Headers object contains the key.
	 */
	public has(name: string): boolean {
		return !!this._entries[name.toLowerCase()];
	}

	/**
	 * Executes a callback function once per each key/value pair in the Headers object.
	 *
	 * @param callback Callback.
	 */
	public forEach(callback: (name: string, value: string, thisArg: IHeaders) => void): void {
		for (const key of Object.keys(this._entries)) {
			callback(this._entries[key].value, this._entries[key].name, this);
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *keys(): IterableIterator<string> {
		for (const header of Object.values(this._entries)) {
			yield header.name;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *values(): IterableIterator<string> {
		for (const header of Object.values(this._entries)) {
			yield header.value;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *entries(): IterableIterator<[string, string]> {
		for (const header of Object.values(this._entries)) {
			yield [header.name, header.value];
		}
	}

	/**
	 * Iterator.
	 *
	 * @returns Iterator.
	 */
	public *[Symbol.iterator](): IterableIterator<[string, string]> {
		for (const header of Object.values(this._entries)) {
			yield [header.name, header.value];
		}
	}
}
