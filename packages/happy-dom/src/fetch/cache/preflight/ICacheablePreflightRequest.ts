import type Headers from '../../Headers.js';
import type { TRequestCredentials } from '../../types/TRequestCredentials.js';

export default interface ICacheablePreflightRequest {
	url: string;
	method: string;
	origin: string;
	credentials: TRequestCredentials;
	headers: Headers;
}
