import IHeaders from '../../types/IHeaders.js';

export default interface ICachableRequest {
	url: string;
	method: string;
	headers: IHeaders;
}
