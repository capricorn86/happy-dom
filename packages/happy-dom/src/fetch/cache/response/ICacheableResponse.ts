import Headers from '../../Headers.js';

export default interface ICacheableResponse {
	status: number;
	statusText: string;
	url: string;
	headers: Headers;
	body: Buffer | null;
	waitingForBody: boolean;
	virtual?: boolean;
}
