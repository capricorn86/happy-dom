import { URL } from 'url';
import WhatwgMIMEType from 'whatwg-mimetype';
import type Request from '../Request.js';

// These lists are part of the preflight decision defined by the Fetch Standard:
// https://fetch.spec.whatwg.org/#cors-safelisted-request-header
// A request must satisfy the method and header checks together, so a safelisted Content-Type alone
// does not make it a simple request.
const CORS_SAFELISTED_METHODS = new Set(['GET', 'HEAD', 'POST']);
const CORS_SAFELISTED_REQUEST_HEADER_NAMES = new Set([
	'accept',
	'accept-language',
	'content-language',
	'content-type',
	'range'
]);
const CORS_SAFELISTED_CONTENT_TYPES = new Set([
	'application/x-www-form-urlencoded',
	'multipart/form-data',
	'text/plain'
]);

/**
 * Fetch CORS utility.
 */
export default class FetchCORSUtility {
	/**
	 * Returns whether a request requires a CORS preflight request.
	 *
	 * @param request Request.
	 * @returns True if the request requires a preflight request.
	 */
	public static isPreflightRequired(request: Request): boolean {
		if (!CORS_SAFELISTED_METHODS.has(request.method)) {
			return true;
		}

		let safelistedValueSize = 0;

		for (const [name, value] of request.headers) {
			if (!this.isCORSsafelistedRequestHeader(name, value)) {
				return true;
			}

			safelistedValueSize += Buffer.byteLength(value);
		}

		return safelistedValueSize > 1024;
	}

	/**
	 * Returns whether a header is CORS-safelisted.
	 *
	 * @param name Header name.
	 * @param value Header value.
	 * @returns True if the header is CORS-safelisted.
	 */
	private static isCORSsafelistedRequestHeader(name: string, value: string): boolean {
		if (Buffer.byteLength(value) > 128) {
			return false;
		}

		const lowerName = name.toLowerCase();

		if (!CORS_SAFELISTED_REQUEST_HEADER_NAMES.has(lowerName)) {
			return false;
		}

		switch (lowerName) {
			case 'accept':
				return !this.containsCORSUnsafeRequestHeaderByte(value);
			case 'accept-language':
			case 'content-language':
				return /^[0-9a-z *,\-.;=]*$/i.test(value);
			case 'content-type': {
				if (this.containsCORSUnsafeRequestHeaderByte(value)) {
					return false;
				}

				const mimeType = WhatwgMIMEType.parse(value);

				return !!mimeType && CORS_SAFELISTED_CONTENT_TYPES.has(mimeType.essence);
			}
			case 'range':
				return /^bytes=\d+-\d*$/.test(value);
		}

		return false;
	}

	/**
	 * Returns whether a header value contains a CORS-unsafe request-header byte.
	 *
	 * @param value Header value.
	 * @returns True if the value contains a CORS-unsafe byte.
	 */
	private static containsCORSUnsafeRequestHeaderByte(value: string): boolean {
		return /[\x00-\x08\x0a-\x1f"():<>?@[\]\\{}\x7f]/.test(value);
	}

	/**
	 * Validates request headers.
	 *
	 * @param originURL Origin URL.
	 * @param targetURL Target URL.
	 */
	public static isCORS(originURL: URL | string, targetURL: URL | string): boolean {
		originURL = typeof originURL === 'string' ? new URL(<string>originURL) : <URL>originURL;
		targetURL = typeof targetURL === 'string' ? new URL(<string>targetURL) : <URL>targetURL;

		if (targetURL.protocol === 'about:' || targetURL.protocol === 'javascript:') {
			return false;
		}

		return originURL.origin !== targetURL.origin;
	}
}
