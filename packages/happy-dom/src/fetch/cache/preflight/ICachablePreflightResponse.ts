import IHeaders from '../../types/IHeaders.js';

export default interface ICachablePreflightResponse {
	status: number;
	url: string;
	headers: IHeaders;
}
