import MultipartFormDataParser from '../multipart/MultipartFormDataParser.js';
import Stream from 'stream';
import { URLSearchParams } from 'url';
import FormData from '../../form-data/FormData.js';
import Blob from '../../file/Blob.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import IRequestBody from '../types/IRequestBody.js';
import IResponseBody from '../types/IResponseBody.js';
import Request from '../Request.js';

/**
 * Fetch body utility.
 */
export default class FetchBodyUtility {
	/**
	 * Parses body and returns stream and type.
	 *
	 * Based on:
	 * https://github.com/node-fetch/node-fetch/blob/main/src/body.js (MIT)
	 *
	 * @param body Body.
	 * @returns Stream and type.
	 */
	public static getBodyStream(body: IRequestBody | IResponseBody): {
		contentType: string;
		contentLength: number | null;
		stream: Stream.Readable;
		buffer: Buffer | null;
	} {
		if (body === null || body === undefined) {
			return { stream: null, buffer: null, contentType: null, contentLength: null };
		} else if (body instanceof URLSearchParams) {
			const buffer = Buffer.from(body.toString());
			return {
				buffer,
				stream: Stream.Readable.from(Buffer.from(buffer)),
				contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
				contentLength: buffer.length
			};
		} else if (body instanceof Blob) {
			const buffer = (<Blob>body)._buffer;
			return {
				buffer,
				stream: Stream.Readable.from(buffer),
				contentType: (<Blob>body).type,
				contentLength: body.size
			};
		} else if (Buffer.isBuffer(body)) {
			return {
				buffer: body,
				stream: Stream.Readable.from(body),
				contentType: null,
				contentLength: body.length
			};
		} else if (body instanceof ArrayBuffer) {
			const buffer = Buffer.from(body);
			return {
				buffer,
				stream: Stream.Readable.from(buffer),
				contentType: null,
				contentLength: body.byteLength
			};
		} else if (ArrayBuffer.isView(body)) {
			const buffer = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
			return {
				buffer,
				stream: Stream.Readable.from(buffer),
				contentType: null,
				contentLength: body.byteLength
			};
		} else if (body instanceof Stream.Stream) {
			return {
				buffer: null,
				stream: <Stream.Readable>body,
				contentType: null,
				contentLength: null
			};
		} else if (body instanceof FormData) {
			return MultipartFormDataParser.formDataToStream(body);
		}

		const buffer = Buffer.from(String(body));
		return {
			buffer,
			stream: Stream.Readable.from(buffer),
			contentType: 'text/plain;charset=UTF-8',
			contentLength: buffer.length
		};
	}

	/**
	 * Clones a request body stream.
	 *
	 * @param request Request.
	 * @returns Stream.
	 */
	public static cloneRequestBodyStream(request: Request): Stream.Readable {
		if (request.bodyUsed) {
			throw new DOMException(
				`Failed to clone body stream of request: Request body is already used.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const p1 = new Stream.PassThrough();
		const p2 = new Stream.PassThrough();

		request.body.pipe(p1);
		request.body.pipe(p2);

		// Sets the body of the cloned request to the first pass through stream.
		(<Stream.Readable>request.body) = p1;

		// Returns the clone.
		return p2;
	}

	/**
	 * Consume and convert an entire Body to a Buffer.
	 *
	 * Based on:
	 * https://github.com/node-fetch/node-fetch/blob/main/src/body.js (MIT)
	 *
	 * @see https://fetch.spec.whatwg.org/#concept-body-consume-body
	 * @param body Body stream.
	 * @returns Promise.
	 */
	public static async consumeBodyStream(body: Stream.Readable | null): Promise<Buffer> {
		if (body === null || !(body instanceof Stream.Stream)) {
			return Buffer.alloc(0);
		}

		const chunks = [];
		let bytes = 0;

		try {
			for await (const chunk of body) {
				bytes += chunk.length;
				chunks.push(chunk);
			}
		} catch (error) {
			if (error instanceof DOMException) {
				throw error;
			}
			throw new DOMException(
				`Failed to read response body. Error: ${error.message}.`,
				DOMExceptionNameEnum.encodingError
			);
		}

		if (
			(<Stream.Readable>body).readableEnded === false ||
			(<Stream.Readable>body)['_readableState']?.ended === false
		) {
			throw new DOMException(
				`Premature close of server response.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		try {
			if (typeof chunks[0] === 'string') {
				return Buffer.from(chunks.join(''));
			}

			return Buffer.concat(chunks, bytes);
		} catch (error) {
			throw new DOMException(
				`Could not create Buffer from response body. Error: ${error.message}.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
	}
}
