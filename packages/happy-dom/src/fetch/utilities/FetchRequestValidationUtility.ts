import DOMException from '../../exception/DOMException';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum';
import Headers from '../Headers';
import IHeaders from '../types/IHeaders';
import IRequestReferrerPolicy from '../types/IRequestReferrerPolicy';
import IRequestRedirect from '../types/IRequestRedirect';
import { URL } from 'url';
import IRequest from '../types/IRequest';

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
const VALID_REFERRER_POLICIES = [
	'',
	'no-referrer',
	'no-referrer-when-downgrade',
	'same-origin',
	'origin',
	'strict-origin',
	'origin-when-cross-origin',
	'strict-origin-when-cross-origin',
	'unsafe-url'
];

const VALID_REDIRECTS = ['error', 'manual', 'follow'];

/**
 * Fetch request validation utility.
 */
export default class FetchRequestValidationUtility {
	/**
	 * Validates request body.
	 *
	 * @throws DOMException
	 * @param request Request.
	 */
	public static validateBody(request: IRequest): void {
		if (request.body && (request.method === 'GET' || request.method === 'HEAD')) {
			throw new DOMException(
				`Request with GET/HEAD method cannot have body.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}
	}

	/**
	 * Validates request URL.
	 *
	 * @throws DOMException
	 * @param url URL.
	 */
	public static validateURL(url: URL): void {
		if (url.username !== '' || url.password !== '') {
			throw new DOMException(
				`${url} is an url with embedded credentials.`,
				DOMExceptionNameEnum.notSupportedError
			);
		}
	}

	/**
	 * Validates request headers.
	 *
	 * @throws DOMException
	 * @param headers Headers.
	 */
	public static validateHeaders(headers: IHeaders): void {
		for (const key of Object.keys((<Headers>headers)._entries)) {
			if (
				key.startsWith('proxy-') ||
				key.startsWith('sec-') ||
				FORBIDDEN_HEADER_NAMES.includes(key)
			) {
				throw new DOMException(
					`Request header ${key} is not allowed.`,
					DOMExceptionNameEnum.invalidStateError
				);
			}
		}
	}

	/**
	 * Validates request referrer policy.
	 *
	 * @throws DOMException
	 * @param referrerPolicy Referrer policy.
	 */
	public static validateReferrerPolicy(referrerPolicy: IRequestReferrerPolicy): void {
		if (!VALID_REFERRER_POLICIES.includes(referrerPolicy)) {
			throw new DOMException(
				`Invalid referrer policy "${referrerPolicy}".`,
				DOMExceptionNameEnum.syntaxError
			);
		}
	}

	/**
	 * Validates request redirect.
	 *
	 * @throws DOMException
	 * @param redirect Redirect.
	 */
	public static validateRedirect(redirect: IRequestRedirect): void {
		if (!VALID_REDIRECTS.includes(redirect)) {
			throw new DOMException(`Invalid redirect "${redirect}".`, DOMExceptionNameEnum.syntaxError);
		}
	}
}
