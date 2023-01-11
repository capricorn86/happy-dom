import { URL } from 'url';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import Headers from './Headers';
import IResponse from './IResponse';
import IResponseInit from './IResponseInit';
import Response from './Response';

const REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308];

/**
 * Response factory.
 */
export default class ResponseFactory {
	/**
	 * Returns a redirect response.
	 *
	 * @param url URL.
	 * @param status Status code.
	 * @returns Response.
	 */
	public static getRedirectResponse(url: string, status = 302): IResponse {
		if (!REDIRECT_STATUS_CODES.includes(status)) {
			throw new DOMException(
				'Failed to create redirect response: Invalid redirect status code.',
				DOMExceptionNameEnum.invalidStateError
			);
		}

		return new Response(null, {
			headers: {
				location: new URL(url).toString()
			},
			status
		});
	}

	/**
	 * Returns an error response.
	 *
	 * @param url URL.
	 * @param status Status code.
	 * @returns Response.
	 */
	public static getErrorResponse(): IResponse {
		const response = new Response(null, { status: 0, statusText: '' });
		(<string>response.type) = 'error';
		return response;
	}

	/**
	 * Returns an JSON response.
	 *
	 * @param data Data.
	 * @param [init] Init.
	 * @returns Response.
	 */
	public static getJSONResponse(data: object, init: IResponseInit): IResponse {
		const body = JSON.stringify(data);

		if (body === undefined) {
			throw new TypeError('data is not JSON serializable');
		}

		const headers = new Headers(init && init.headers);

		if (!headers.has('content-type')) {
			headers.set('content-type', 'application/json');
		}

		return new Response(body, {
			...init,
			headers
		});
	}
}
