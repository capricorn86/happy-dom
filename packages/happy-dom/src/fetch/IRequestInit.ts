import IHeadersInit from './IHeadersInit';
import IAbortSignal from './IAbortSignal';
import { URLSearchParams } from 'url';
import IFormData from '../form-data/IFormData';

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
		| IFormData
		| null;
	headers?: IHeadersInit;
	method?: string;
	redirect?: 'error' | 'manual' | 'follow';
	signal?: IAbortSignal | null;

	// Not implemented:
	// Cache?: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
	// Credentials?: 'include' | 'omit' | 'same-origin';
	// Integrity?: string;
	// Keepalive?: boolean;
	// Mode?: 'same-origin' | 'cors' | 'navigate' | 'no-cors';
	// Referrer?: string;
	// ReferrerPolicy?:
	// 	| ''
	// 	| 'same-origin'
	// 	| 'no-referrer'
	// 	| 'no-referrer-when-downgrade'
	// 	| 'origin'
	// 	| 'origin-when-cross-origin'
	// 	| 'strict-origin'
	// 	| 'strict-origin-when-cross-origin'
	// 	| 'unsafe-url';
	// Window?: unknown;
}
