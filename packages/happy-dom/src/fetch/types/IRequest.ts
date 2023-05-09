import IHeaders from './IHeaders';
import IBlob from '../../file/IBlob';
import AbortSignal from '../AbortSignal';
import Stream from 'stream';
import IRequestReferrerPolicy from './IRequestReferrerPolicy';
import IRequestRedirect from './IRequestRedirect';
import IRequestCredentials from './IRequestCredentials';
import FormData from '../../form-data/FormData';

/**
 * Fetch request.
 */
export default interface IRequest {
	readonly headers: IHeaders;
	readonly method: string;
	readonly redirect: IRequestRedirect;
	readonly referrer: string;
	readonly url: string;
	readonly body: Stream.Readable | null;
	readonly bodyUsed: boolean;
	readonly referrerPolicy: IRequestReferrerPolicy;
	readonly signal: AbortSignal | null;
	readonly credentials: IRequestCredentials;

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
	 * Returns FormData.
	 *
	 * @returns FormData.
	 */
	formData(): Promise<FormData>;

	/**
	 * Clones request.
	 *
	 * @returns Clone.
	 */
	clone(): IRequest;
}
