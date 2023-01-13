import IHeadersInit from './IHeadersInit';

/**
 * Response init.
 */
export default interface IResponseInit {
	headers?: IHeadersInit | undefined;
	status?: number | undefined;
	statusText?: string | undefined;
}
