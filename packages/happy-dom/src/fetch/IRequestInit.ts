import IHeadersInit from './IHeadersInit';
import AbortSignal from './AbortSignal';
import { URL, URLSearchParams } from 'url';
import FormData from '../form-data/FormData';
import Blob from '../file/Blob';

/**
 * Fetch request init.
 */
export default interface IRequestInit {
	body?:
		| ArrayBuffer
		| ArrayBufferView
		| NodeJS.ReadableStream
		| string
		| URLSearchParams
		| Blob
		| FormData
		| null;
	headers?: IHeadersInit;
	method?: string;
	redirect?: 'error' | 'manual' | 'follow';
	signal?: AbortSignal | null;
	referrer?: string | URL;
	referrerPolicy?:
		| ''
		| 'no-referrer'
		| 'no-referrer-when-downgrade'
		| 'same-origin'
		| 'origin'
		| 'strict-origin'
		| 'origin-when-cross-origin'
		| 'strict-origin-when-cross-origin'
		| 'unsafe-url';
}
