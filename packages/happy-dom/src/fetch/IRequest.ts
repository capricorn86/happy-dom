import IHeaders from './IHeaders';
import IBlob from '../file/IBlob';
import AbortSignal from './AbortSignal';
import { Readable } from 'stream';

/**
 * Fetch request.
 */
export default interface IRequest {
	readonly headers: IHeaders;
	readonly method: string;
	readonly redirect: 'error' | 'follow' | 'manual';
	readonly referrer: string;
	readonly url: string;
	readonly body: Readable | null;
	readonly bodyUsed: boolean;
	readonly referrerPolicy:
		| ''
		| 'no-referrer'
		| 'no-referrer-when-downgrade'
		| 'same-origin'
		| 'origin'
		| 'strict-origin'
		| 'origin-when-cross-origin'
		| 'strict-origin-when-cross-origin'
		| 'unsafe-url';
	readonly signal: AbortSignal | null;

	/**
	 * Returns array buffer.
	 *
	 * @returns Array buffer.
	 */
	arrayBuffer(): Promise<ArrayBuffer>;

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	blob(): Promise<IBlob>;

	/**
	 * Returns buffer.
	 *
	 * @returns Buffer.
	 */
	buffer(): Promise<Buffer>;

	/**
	 * Returns text.
	 *
	 * @returns Text.
	 */
	text(): Promise<string>;

	/**
	 * Returns json.
	 *
	 * @returns JSON.
	 */
	json(): Promise<string>;

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	clone(): IRequest;
}
