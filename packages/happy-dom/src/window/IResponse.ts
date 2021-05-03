import Blob from '../file/Blob';

/**
 * Fetch response.
 */
export default interface IResponse {
	readonly url: string;
	readonly status: number;
	readonly ok: boolean;
	readonly redirected: boolean;
	readonly statusText: string;
	readonly headers: { [k: string]: string };

	/**
	 * Returns JSON.
	 *
	 * @returns JSON.
	 */
	json(): Promise<string>;

	/**
	 * Returns Text.
	 *
	 * @returns Text.
	 */
	text(): Promise<string>;

	/**
	 * Returns blob.
	 *
	 * @returns Blob.
	 */
	blob(): Promise<Blob>;
}
