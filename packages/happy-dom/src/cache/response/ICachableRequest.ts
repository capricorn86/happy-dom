import IHeaders from '../../fetch/types/IHeaders.js';

export default interface ICachableRequest {
	url: string;
	method: string;
	headers: IHeaders;
}
