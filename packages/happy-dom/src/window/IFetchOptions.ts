import { URLSearchParams } from 'url';

/**
 * Fetch options.
 */
export default interface IFetchOptions {
	method?: string;
	headers?: Map<string, string> | { [k: string]: string };
	body?: URLSearchParams | string;
	redirect?: string;
}
