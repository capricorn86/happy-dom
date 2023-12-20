import IHeaders from '../fetch/types/IHeaders.js';

/**
 * Fetch response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
 */
export default interface ISyncResponse {
	status: number;
	statusText: string;
	url: string;
	redirected: boolean;
	headers: IHeaders;
	body: Buffer;
}
