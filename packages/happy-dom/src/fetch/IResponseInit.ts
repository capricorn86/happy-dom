import IHeaders from './IHeaders';

/**
 * Response init.
 */
export default interface IResponseInit {
	headers?: IHeaders | string[][] | Record<string, string>;
	status?: number;
	statusText?: string;
}
