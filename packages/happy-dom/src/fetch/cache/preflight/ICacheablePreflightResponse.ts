import Headers from '../../Headers.js';

export default interface ICacheablePreflightResponse {
	status: number;
	url: string;
	headers: Headers;
}
