import Blob from '../../file/Blob';
import File from '../../file/File';
import IHTMLFormElement from './IHTMLFormElement';

/**
 * FormData.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
 */
export default class FormData {
	private _entries: { [k: string]: string | File } = {};
	private _form: IHTMLFormElement;

	/**
	 *
	 * @param form
	 */
	constructor(form: IHTMLFormElement) {
		this._form = form;

		if (form) {
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
		this._entries[name] = this._parseValue(value, filename);
	}

	/**
	 * Removes a value.
	 *
	 * @param name Name.
	 */
	public delete(name: string): void {
		delete this._entries[name];
	}

	/**
	 * Returns value.
	 *
	 * @param name Name.
	 * @returns Value.
	 */
	public get(name: string): string | File | null {
		return this._entries[name] || null;
	}

	/**
	 * Returns value.
	 *
	 * @param name Name.
	 * @returns Value.
	 */
	public getAll(name: string): string | File | null {
		return this._entries[name] || null;
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
