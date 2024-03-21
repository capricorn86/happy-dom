import Headers from '../../Headers.js';

export default interface ICachableRequest {
	url: string;
	method: string;
	headers: Headers;
}
