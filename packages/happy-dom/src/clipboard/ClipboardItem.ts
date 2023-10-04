import DOMException from '../exception/DOMException.js';
import Blob from '../file/Blob.js';

/**
 * Clipboard Item API.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem.
 */
export default class ClipboardItem {
	public readonly presentationStyle: 'unspecified' | 'inline' | 'attachment' = 'unspecified';
	#data: { [mimeType: string]: Blob };

	/**
	 * Constructor.
	 *
	 * @param data Data.
	 * @param [options] Options.
	 * @param [options.presentationStyle] Presentation style.
	 */
	constructor(
		data: { [mimeType: string]: Blob },
		options?: { presentationStyle?: 'unspecified' | 'inline' | 'attachment' }
	) {
		for (const mimeType of Object.keys(data)) {
			if (mimeType !== data[mimeType].type) {
				throw new DOMException(`Type ${mimeType} does not match the blob's type`);
			}
		}
		this.#data = data;
		if (options?.presentationStyle) {
			this.presentationStyle = options.presentationStyle;
		}
	}

	/**
	 * Returns types.
	 *
	 * @returns Types.
	 */
	public get types(): string[] {
		return Object.keys(this.#data);
	}

	/**
	 * Returns data by type.
	 *
	 * @param type Type.
	 * @returns Data.
	 */
	public async getType(type: string): Promise<Blob> {
		if (!this.#data[type]) {
			throw new DOMException(
				`Failed to execute 'getType' on 'ClipboardItem': The type '${type}' was not found`
			);
		}
		return this.#data[type];
	}
}
