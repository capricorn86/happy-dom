import IHeadersInit from './IHeadersInit';
import AbortSignal from '../AbortSignal';
import { URL } from 'url';
import IRequestReferrerPolicy from './IRequestReferrerPolicy';
import IRequestRedirect from './IRequestRedirect';
import IRequestBody from './IRequestBody';

/**
 * Fetch request init.
 */
export default interface IRequestInit {
	body?: IRequestBody;
	headers?: IHeadersInit;
	method?: string;
	redirect?: IRequestRedirect;
	signal?: AbortSignal | null;
	referrer?: '' | 'no-referrer' | 'client' | string | URL;
	referrerPolicy?: IRequestReferrerPolicy;
}
