import Headers from '../Headers';
import IHeaders from '../types/IHeaders';

const FORBIDDEN_HEADER_NAMES = [
	'accept-charset',
	'accept-encoding',
	'access-control-request-headers',
	'access-control-request-method',
	'connection',
	'content-length',
	'cookie',
	'cookie2',
	'date',
	'dnt',
	'expect',
	'host',
	'keep-alive',
	'origin',
	'referer',
	'te',
	'trailer',
	'transfer-encoding',
	'upgrade',
	'via'
];

/**
 * Fetch request header utility.
 */
export default class FetchRequestHeaderUtility {
	/**
	 * Validates request headers.
	 *
	 * @param headers Headers.
	 */
	public static removeForbiddenHeaders(headers: IHeaders): void {
		for (const key of Object.keys((<Headers>headers)._entries)) {
			if (
				FORBIDDEN_HEADER_NAMES.includes(key) ||
				key.startsWith('proxy-') ||
				key.startsWith('sec-')
			) {
				delete (<Headers>headers)._entries[key];
			}
		}
	}
}
