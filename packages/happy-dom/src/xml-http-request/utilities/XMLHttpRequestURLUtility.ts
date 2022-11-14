import { URL } from 'url';

/**
 * URL utility.
 */
export default class XMLHttpRequestURLUtility {
	/**
	 * Returns "true" if SSL.
	 *
	 * @param url URL.
	 * @returns "true" if SSL.
	 */
	public static isSSL(url: URL): boolean {
		return url.protocol === 'https:';
	}

	/**
	 * Returns "true" if SSL.
	 *
	 * @param url URL.
	 * @returns "true" if SSL.
	 */
	public static isLocal(url: URL): boolean {
		return url.protocol === 'file:';
	}

	/**
	 * Returns "true" if protocol is valid.
	 *
	 * @param url URL.
	 * @returns "true" if valid.
	 */
	public static isSupportedProtocol(url: URL): boolean {
		switch (url.protocol) {
			case 'https:':
			case 'http:':
			case 'file:':
			case undefined:
			case '':
				return true;
		}

		return false;
	}

	/**
	 * Returns host.
	 *
	 * @param url URL.
	 * @returns Host.
	 */
	public static getHost(url: URL): string {
		switch (url.protocol) {
			case 'http:':
			case 'https:':
				return url.hostname;
			case undefined:
			case '':
				return 'localhost';
			default:
				return null;
		}
	}
}
