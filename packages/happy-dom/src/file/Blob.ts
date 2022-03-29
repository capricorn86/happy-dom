import IBlob from './IBlob';

/**
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob.
 *
 * Based on:
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/file-api/Blob-impl.js (MIT licensed).
 */
export default class Blob implements IBlob {
	public readonly _buffer: Buffer = null;
	public readonly type: string = '';

	/**
	 * Constructor.
	 *
	 * @param bits Bits.
	 * @param [options] Options.
	 * @param [options.type] MIME type.
	 */
	constructor(
		bits: (ArrayBuffer | ArrayBufferView | Blob | Buffer | string)[],
		options?: { type?: string }
	) {
		const buffers = [];

		if (bits) {
			for (const bit of bits) {
				let buffer: Buffer;

				if (bit instanceof ArrayBuffer) {
					buffer = Buffer.from(new Uint8Array(bit));
				} else if (bit instanceof Blob) {
					buffer = bit._buffer;
				} else if (bit instanceof Buffer) {
					buffer = bit;
				} else if (ArrayBuffer.isView(bit)) {
					buffer = Buffer.from(new Uint8Array(bit.buffer, bit.byteOffset, bit.byteLength));
				} else {
					buffer = Buffer.from(typeof bit === 'string' ? bit : String(bit));
				}

				buffers.push(buffer);
			}
		}

		this._buffer = Buffer.concat(buffers);

		if (options && options.type && options.type.match(/^[\u0020-\u007E]*$/)) {
			this.type = String(options.type).toLowerCase();
		}
	}

	/**
	 * Returns size.
	 *
	 * @returns Size.
	 */
	public get size(): number {
		return this._buffer.length;
	}

	/**
	 * Slices the blob.
	 *
	 * @param start Start.
	 * @param end End.
	 * @param contentType Content type.
	 * @returns New Blob.
	 */
	public slice(start = 0, end: number = null, contentType = ''): Blob {
		const size = this.size;

		let relativeStart;
		let relativeEnd;
		let relativeContentType;

		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === null) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}

		if (contentType === undefined) {
			relativeContentType = '';
		} else {
			// Sanitization (lower case and invalid char check) is done in the
			// Constructor
			relativeContentType = contentType;
		}

		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this._buffer;
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);

		const blob = new Blob([], { type: relativeContentType });

		(<Buffer>blob._buffer) = slicedBuffer;

		return blob;
	}

	/**
	 * Returns a Promise that resolves to a text.
	 *
	 * @returns Text.
	 */
	public async text(): Promise<string> {
		return this._buffer.toString();
	}

	/**
	 * Closes the blob.
	 *
	 * @returns String.
	 */
	public toString(): string {
		return '[object Blob]';
	}
}
