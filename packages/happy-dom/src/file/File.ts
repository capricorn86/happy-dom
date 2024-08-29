import Blob from './Blob.js';
import { Buffer } from 'buffer';

/**
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/File.
 *
 * Based on:
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/file-api/File-impl.js (MIT licensed).
 */
export default class File extends Blob {
	public readonly lastModified: number = null;
	public readonly name: string = null;

	/**
	 * Constructor.
	 *
	 * @param bits File bits.
	 * @param name File name.
	 * @param [options] Options.
	 * @param [options.type] MIME type.
	 * @param [options.lastModifier] Last modified. Defaults to Date.now().
	 * @param options.lastModified
	 */
	constructor(
		bits: (ArrayBuffer | ArrayBufferView | Blob | Buffer | string)[],
		name: string,
		options?: { type?: string; lastModified?: number }
	) {
		if (arguments.length < 2) {
			throw new TypeError(
				"Failed to construct 'File': 2 arguments required, but only " +
					arguments.length +
					' present.'
			);
		}

		super(bits, options);

		this.name = name.replace(/\//g, ':');
		this.lastModified = options && options.lastModified ? options.lastModified : Date.now();
	}
}
