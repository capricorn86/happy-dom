import FormDataUtility from '../form-data/FormDataUtility';
import IWindow from '../window/IWindow';
import { PassThrough, Stream } from 'stream';
import { URL, URLSearchParams } from 'url';
import FormData from '../form-data/FormData';
import Blob from '../file/Blob';

/**
 * Fetch utility.
 */
export default class FetchUtility {
	/**
	 * Parses body and returns stream and type.
	 *
	 * @param window Window.
	 * @param body Body.
	 * @returns Stream and type.
	 */
	public static bodyToStream(
		window: IWindow,
		body:
			| URLSearchParams
			| Blob
			| Buffer
			| ArrayBuffer
			| ArrayBufferView
			| Stream
			| FormData
			| string
			| null
	): { type: string; stream: NodeJS.ReadableStream } {
		let stream: NodeJS.ReadableStream | null;
		let type: string | null = null;

		if (body === null) {
			stream = null;
		} else if (body instanceof URLSearchParams) {
			stream = Stream.Readable.from(Buffer.from(body.toString()));
		} else if (body instanceof Blob) {
			stream = Stream.Readable.from((<Blob>body)._buffer);
			type = (<Blob>body).type;
		} else if (Buffer.isBuffer(body)) {
			stream = Stream.Readable.from(body);
		} else if (body instanceof ArrayBuffer) {
			stream = Stream.Readable.from(Buffer.from(body));
		} else if (ArrayBuffer.isView(body)) {
			stream = Stream.Readable.from(Buffer.from(body.buffer, body.byteOffset, body.byteLength));
		} else if (body instanceof Stream) {
			// Clones the body
			stream = new PassThrough();
			body.pipe(<PassThrough>stream);
		} else if (body instanceof FormData) {
			const result = FormDataUtility.formDataToStream(window, body);
			stream = result.stream;
			type = result.type;
		} else {
			stream = Stream.Readable.from(Buffer.from(String(body)));
		}

		return {
			type: type || 'text/plain;charset=UTF-8',
			stream
		};
	}
	/**
	 * Parses referrer.
	 *
	 * @param referrer Referrer.
	 * @returns Parsed referrer.
	 */
	public static parseReferrer(referrer: string) {
		if (referrer) {
			const parsedReferrer = new URL(referrer).toString();
			return /^about:(\/\/)?client$/.test(parsedReferrer) ? 'client' : parsedReferrer;
		}

		return '';
	}
}
