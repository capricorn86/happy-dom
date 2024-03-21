import Blob from '../file/Blob.js';
import * as PropertySymbol from '../PropertySymbol.js';
import File from '../file/File.js';
import HTMLInputElement from '../nodes/html-input-element/HTMLInputElement.js';
import HTMLFormElement from '../nodes/html-form-element/HTMLFormElement.js';
import HTMLFormControlsCollection from '../nodes/html-form-element/HTMLFormControlsCollection.js';
import RadioNodeList from '../nodes/html-form-element/RadioNodeList.js';

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
	#entries: FormDataEntry[] = [];

	/**
	 * Constructor.
	 *
	 * @param [form] Form.
	 */
	constructor(form?: HTMLFormElement) {
		if (form) {
			for (const name of Object.keys(
				(<HTMLFormControlsCollection>form[PropertySymbol.elements])[PropertySymbol.namedItems]
			)) {
				let radioNodeList = (<HTMLFormControlsCollection>form[PropertySymbol.elements])[
					PropertySymbol.namedItems
				][name];

				if (
					radioNodeList[0][PropertySymbol.tagName] === 'INPUT' &&
					(radioNodeList[0].type === 'checkbox' || radioNodeList[0].type === 'radio')
				) {
					const newRadioNodeList = new RadioNodeList();
					for (const node of radioNodeList) {
						if ((<HTMLInputElement>node).checked) {
							newRadioNodeList.push(node);
							break;
						}
					}
					radioNodeList = newRadioNodeList;
				}

				for (const node of radioNodeList) {
					if (node.name && SUBMITTABLE_ELEMENTS.includes(node[PropertySymbol.tagName])) {
						if (node[PropertySymbol.tagName] === 'INPUT' && node.type === 'file') {
							if ((<HTMLInputElement>node)[PropertySymbol.files].length === 0) {
								this.append(node.name, new File([], '', { type: 'application/octet-stream' }));
							} else {
								for (const file of (<HTMLInputElement>node)[PropertySymbol.files]) {
									this.append(node.name, file);
								}
							}
						} else if (node.value) {
							this.append(node.name, node.value);
						}
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
	public forEach(callback: (value: string | File, key: string, thisArg: FormData) => void): void {
		for (const entry of this.#entries) {
			callback.call(this, entry.value, entry.name, this);
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
		this.#entries.push({
			name,
			value: this.#parseValue(value, filename)
		});
	}

	/**
	 * Removes a value.
	 *
	 * @param name Name.
	 */
	public delete(name: string): void {
		const newEntries: FormDataEntry[] = [];
		for (const entry of this.#entries) {
			if (entry.name !== name) {
				newEntries.push(entry);
			}
		}
		this.#entries = newEntries;
	}

	/**
	 * Returns value.
	 *
	 * @param name Name.
	 * @returns Value.
	 */
	public get(name: string): string | File | null {
		for (const entry of this.#entries) {
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
		for (const entry of this.#entries) {
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
		for (const entry of this.#entries) {
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
	 * @param [filename] Filename.
	 */
	public set(name: string, value: string | Blob | File, filename?: string): void {
		for (const entry of this.#entries) {
			if (entry.name === name) {
				entry.value = this.#parseValue(value, filename);
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
		for (const entry of this.#entries) {
			yield entry.name;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all values of the key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *values(): IterableIterator<string | File> {
		for (const entry of this.#entries) {
			yield entry.value;
		}
	}

	/**
	 * Returns an iterator, allowing you to go through all key/value pairs contained in this object.
	 *
	 * @returns Iterator.
	 */
	public *entries(): IterableIterator<[string, string | File]> {
		for (const entry of this.#entries) {
			yield [entry.name, entry.value];
		}
	}

	/**
	 * Iterator.
	 *
	 * @returns Iterator.
	 */
	public *[Symbol.iterator](): IterableIterator<[string, string | File]> {
		for (const entry of this.#entries) {
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
	#parseValue(value: string | Blob | File, filename?: string): string | File {
		if (value instanceof Blob && !(value instanceof File)) {
			const file = new File([], 'blob', { type: value.type });
			file[PropertySymbol.buffer] = value[PropertySymbol.buffer];
			return file;
		}

		if (value instanceof File) {
			if (filename) {
				const file = new File([], filename, { type: value.type, lastModified: value.lastModified });
				file[PropertySymbol.buffer] = value[PropertySymbol.buffer];
				return file;
			}
			return value;
		}

		return String(value);
	}
}
