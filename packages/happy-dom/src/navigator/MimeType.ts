import Plugin from './Plugin';

/**
 * MimeType.
 */
export default class MimeType {
	private readonly _description: string;
	private readonly _enabledPlugin: Plugin;
	private readonly _suffixes: string;
	private readonly _type: string;
	/**
	 * @param description
	 * @param enabledPlugin
	 * @param suffixes
	 * @param type
	 */
	constructor(description: string, enabledPlugin: Plugin, suffixes: string, type: string) {
		this._description = description;
		this._enabledPlugin = enabledPlugin;
		this._suffixes = suffixes;
		this._type = type;
	}

	/**
	 * Description.
	 *
	 * @returns String.
	 */
	public get description(): string {
		return this._description ? this._description : '';
	}
	/**
	 * EnabledPlugin.
	 *
	 * @returns String.
	 */
	public get enabledPlugin(): Plugin {
		return this._enabledPlugin ? this._enabledPlugin : null;
	}
	/**
	 * Suffixes.
	 *
	 * @returns Suffixes.
	 */
	public get suffixes(): string {
		return this._suffixes ? this._suffixes : '';
	}

	/**
	 * @returns String.
	 */
	public get type(): string {
		return this._type ? this._type : '';
	}
	/**
	 * @returns String.
	 */
	public toString(): string {
		return '[object MimeType]';
	}
}
