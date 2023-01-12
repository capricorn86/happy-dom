import { URL } from 'url';
import IRequest from './IRequest';
import IDocument from '../nodes/document/IDocument';
import { isIP } from 'net';

const REQUEST_REFERRER_UNSUPPORTED_PROTOCOL_REGEXP = /^(about|blob|data):$/;

/**
 * Fetch referrer utility.
 */
export default class FetchReferrerUtility {
	/**
	 * Returns the request referrer to be used as the value for the "Referer" header.
	 *
	 * Based on:
	 * https://github.com/node-fetch/node-fetch/blob/main/src/utils/referrer.js (MIT)
	 *
	 * @param document Document.
	 * @param request Request.
	 * @see https://w3c.github.io/webappsec-referrer-policy/#determine-requests-referrer
	 * @returns Request referrer.
	 */
	public static getReferrer(document: IDocument, request: IRequest): string | null {
		if (request.referrer === 'about:client' && document.defaultView.location.origin === 'null') {
			return null;
		}

		const requestURL = new URL(request.url);
		const referrerURL =
			request.referrer === 'about:client'
				? new URL(document.defaultView.location.href)
				: new URL(request.referrer);

		// Origin is "null" when the URL is set to "about:blank".
		if (referrerURL.origin === 'null') {
			return null;
		}

		if (REQUEST_REFERRER_UNSUPPORTED_PROTOCOL_REGEXP.test(referrerURL.protocol)) {
			return null;
		}

		referrerURL.username = '';
		referrerURL.password = '';
		referrerURL.hash = '';

		switch (request.referrerPolicy) {
			case 'no-referrer':
				return null;
			case 'origin':
				return referrerURL.origin;
			case 'unsafe-url':
				return url.href;
			case 'strict-origin':
				if (
					this.isURLPotentiallyTrustWorthy(referrerURL) &&
					!this.isURLPotentiallyTrustWorthy(requestURL)
				) {
					return null;
				}

				return referrerURL.origin;
			case 'origin-when-cross-origin':
				if (referrerURL.origin === requestURL.origin) {
					return referrerURL.href;
				}

				if (
					this.isURLPotentiallyTrustWorthy(referrerURL) &&
					!this.isURLPotentiallyTrustWorthy(requestURL)
				) {
					return null;
				}

				return referrerURL.origin;
		}

		return null;
	}

	/**
	 * Returns "true" if the request's referrer is potentially trustworthy.
	 *
	 * @see https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy
	 * @param url URL.
	 * @returns "true" if the request's referrer is potentially trustworthy.
	 */
	private static isURLPotentiallyTrustWorthy(url: URL): boolean {
		// 1. If url is "about:blank" or "about:srcdoc", return "Potentially Trustworthy".
		if (/^about:(blank|srcdoc)$/.test(url.href)) {
			return true;
		}

		// 2. If url's scheme is "data", return "Potentially Trustworthy".
		if (url.protocol === 'data:') {
			return true;
		}

		// Note: The origin of blob: and filesystem: URLs is the origin of the context in which they were
		// Created. Therefore, blobs created in a trustworthy origin will themselves be potentially
		// Trustworthy.
		if (/^(blob|filesystem):$/.test(url.protocol)) {
			return true;
		}

		// 3. Return the result of executing §3.2 Is origin potentially trustworthy? on url's origin.
		return this.isOriginPotentiallyTrustWorthy(url);
	}

	/**
	 * Returns "true" if the request's referrer origin is potentially trustworthy.
	 *
	 * @see https://w3c.github.io/webappsec-secure-contexts/#is-origin-trustworthy
	 * @param url URL.
	 * @returns "true" if the request's referrer origin is potentially trustworthy.
	 */
	private static isOriginPotentiallyTrustWorthy(url: URL): boolean {
		// 1. If origin is an opaque origin, return "Not Trustworthy".
		// Not applicable

		// 2. Assert: origin is a tuple origin.
		// Not for implementations

		// 3. If origin's scheme is either "https" or "wss", return "Potentially Trustworthy".
		if (/^(http|ws)s:$/.test(url.protocol)) {
			return true;
		}

		// 4. If origin's host component matches one of the CIDR notations 127.0.0.0/8 or ::1/128 [RFC4632], return "Potentially Trustworthy".
		const hostIp = url.host.replace(/(^\[)|(]$)/g, '');
		const hostIPVersion = isIP(hostIp);

		if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
			return true;
		}

		if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
			return true;
		}

		// 5. If origin's host component is "localhost" or falls within ".localhost", and the user agent conforms to the name resolution rules in [let-localhost-be-localhost], return "Potentially Trustworthy".
		// We are returning FALSE here because we cannot ensure conformance to
		// Let-localhost-be-loalhost (https://tools.ietf.org/html/draft-west-let-localhost-be-localhost)
		if (url.host === 'localhost' || url.host.endsWith('.localhost')) {
			return false;
		}

		// 6. If origin's scheme component is file, return "Potentially Trustworthy".
		if (url.protocol === 'file:') {
			return true;
		}

		// 7. If origin's scheme component is one which the user agent considers to be authenticated, return "Potentially Trustworthy".
		// Not supported

		// 8. If origin has been configured as a trustworthy origin, return "Potentially Trustworthy".
		// Not supported

		// 9. Return "Not Trustworthy".
		return false;
	}
}
