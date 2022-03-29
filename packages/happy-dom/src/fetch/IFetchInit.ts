import { URLSearchParams } from 'url';
import IHeaders from './IHeaders';

/**
 * Fetch init.
 */
export default interface IFetchInit {
	method?: string;
	headers?: IHeaders | { [k: string]: string };
	body?: URLSearchParams | string;
	redirect?: string;
}
