import Headers from '../../Headers.js';

export default interface ICacheablePreflightRequest {
	url: string;
	method: string;
	headers: Headers;
}
