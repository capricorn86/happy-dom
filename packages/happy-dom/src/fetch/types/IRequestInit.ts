import IHeadersInit from './IHeadersInit.js';
import AbortSignal from '../AbortSignal.js';
import URL from '../../url/URL.js';
import IRequestReferrerPolicy from './IRequestReferrerPolicy.js';
import IRequestRedirect from './IRequestRedirect.js';
import IRequestBody from './IRequestBody.js';
import IRequestCredentials from './IRequestCredentials.js';
import IRequestMode from './IRequestMode.js';

/**
 * Fetch request init.
 */
export default interface IRequestInit {
	body?: IRequestBody;
	headers?: IHeadersInit;
	method?: string;
	mode?: IRequestMode;
	redirect?: IRequestRedirect;
	signal?: AbortSignal | null;
	referrer?: '' | 'no-referrer' | 'client' | string | URL;
	credentials?: IRequestCredentials;
	referrerPolicy?: IRequestReferrerPolicy;
}
