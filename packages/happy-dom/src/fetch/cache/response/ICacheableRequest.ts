import Headers from '../../Headers.js';

export default interface ICacheableRequest {
	url: string;
	method: string;
	headers: Headers;
}
