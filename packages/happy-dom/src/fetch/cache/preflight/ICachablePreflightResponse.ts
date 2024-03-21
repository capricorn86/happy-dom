import Headers from '../../Headers.js';

export default interface ICachablePreflightResponse {
	status: number;
	url: string;
	headers: Headers;
}
