import type { THeadersInit } from './THeadersInit.js';

/**
 * Response init.
 */
export default interface IResponseInit {
	headers?: THeadersInit | undefined;
	status?: number | undefined;
	statusText?: string | undefined;
}
