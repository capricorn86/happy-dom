import type AbortSignal from '../AbortSignal.js';
import type URL from '../../url/URL.js';
import type { TRequestBody } from './TRequestBody.js';
import type { THeadersInit } from './THeadersInit.js';
import type { TRequestMode } from './TRequestMode.js';
import type { TRequestCredentials } from './TRequestCredentials.js';
import type { TRequestReferrerPolicy } from './TRequestReferrerPolicy.js';
import type { TRequestRedirect } from './TRequestRedirect.js';

/**
 * Fetch request init.
 */
export default interface IRequestInit {
	body?: TRequestBody;
	headers?: THeadersInit;
	method?: string;
	mode?: TRequestMode;
	redirect?: TRequestRedirect;
	signal?: AbortSignal | null;
	referrer?: '' | 'no-referrer' | 'client' | string | URL;
	credentials?: TRequestCredentials;
	referrerPolicy?: TRequestReferrerPolicy;
}
