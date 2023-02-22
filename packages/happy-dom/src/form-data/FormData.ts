import Blob from '../file/Blob';
import File from '../file/File';
import IHTMLInputElement from '../nodes/html-input-element/IHTMLInputElement';
import IHTMLFormElement from '../nodes/html-form-element/IHTMLFormElement';

type FormDataEntry = {
	name: string;
	value: string | File;
};

const SUBMITTABLE_ELEMENTS = ['BUTTON', 'INPUT', 'OBJECT', 'SELECT', 'TEXTAREA'];

/**
 * FormData.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
export default class FormData implements Iterable<[string, string | File]> {
	private _entries: FormDataEntry[] = [];

	/**
	 * Constructor.
	 *
	 * @param [form] Form.
	 */
	constructor(form?: IHTMLFormElement) {
		if (form) {
			for (const element of form.elements) {
				if (element.name && SUBMITTABLE_ELEMENTS.includes(element.tagName)) {
					if (element.tagName === 'INPUT' && element.type === 'file') {
						if ((<IHTMLInputElement>element).files.length === 0) {
							this.append(element.name, new File([], '', { type: 'application/octet-stream' }));
						} else {
							for (const file of (<IHTMLInputElement>element).files) {
								this.append(element.name, file);
							}
						}
					} else {
						this.append(element.name, element.value);
					}
				}
			}
		}
	}

	/**
	 * For each.
	 *
	 * @param callback Callback.
	 */
	public forEach(callback: (key: string, value: string | File, thisArg: FormData) => void): void {
		for (const entry of this._entries) {
			callback.call(this, entry.name, entry.value, this);
		}
	}

	/**
	 * Appends a new value onto an existing key.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param [filename] Filename.
	 */
	public append(name: string, value: string | Blob | File, filename?: string): void {
		this._entries.push({
			name,
			value: this._parseValue(value, filename)
		});
	}

	/**
	 * Removes a value.
	 *
	 * @param name Name.
	 */
	public delete(name: string): void {
		const newEntries: FormDataEntry[] = [];
		for (const entry of this._entries) {
			if (entry.name !== name) {
				newEntries.push(entry);
			}
		}
		this._entries = newEntries;
	}

	/**
	 * Returns value.
	 *
	 * @param name Name.
	 * @returns Value.
	 */
	public get(name: string): string | File | null {
		for (const entry of this._entries) {
			if (entry.name === name) {
				return entry.value;
			}
		}
		return null;
	}

	/**
	 * Returns all values associated with the given name.
	 *
	 * @param name Name.
	 * @returns Values.
	 */
	public getAll(name: string): Array<string | File> {
		const values: Array<string | File> = [];
		for (const entry of this._entries) {
			if (entry.name === name) {
				values.push(entry.value);
			}
		}
		return values;
	}

	/**
	 * Returns whether a FormData object contains a certain key.
	 *
	 * @param name Name.
	 * @returns "true" if the FormData object contains the key.
	 */
	public has(name: string): boolean {
		for (const entry of this._entries) {
			if (entry.name === name) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Sets a new value for an existing key inside a FormData object, or adds the key/value if it does not already exist.
	 *
	 * @param name Name.
	 * @param value Value.
	 */
	public set(name: string, value: string): void {
		for (const entry of this._entries) {
			if (entry.name === name) {
				entry.value = value;
				return;
			}
		}
		this.append(name, value);
	}

	/**
	 * Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *keys(): IterableIterator<string> {
		for (const entry of this._entries) {
			yield entry.name;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *values(): IterableIterator<string | File> {
		for (const entry of this._entries) {
			yield entry.value;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *entries(): IterableIterator<[string, string | File]> {
		for (const entry of this._entries) {
			yield [entry.name, entry.value];
		}
	}

	/**
	 * Iterator.
	 *
	 * @returns Iterator.
	 */
	public *[Symbol.iterator](): IterableIterator<[string, string | File]> {
		for (const entry of this._entries) {
			yield [entry.name, entry.value];
		}
	}

	/**
	 * Parses a value.
	 *
	 * @param value Value.
	 * @param [filename] Filename.
	 * @returns Parsed value.
	 */
	private _parseValue(value: string | Blob | File, filename?: string): string | File {
		if (value instanceof Blob && !(value instanceof File)) {
			const file = new File([], 'blob', { type: value.type });
			file._buffer = value._buffer;
			return file;
		}

		if (value instanceof File && filename) {
			const file = new File([], filename, { type: value.type, lastModified: value.lastModified });
			file._buffer = value._buffer;
			return file;
		}

		return String(value);
	}
}
