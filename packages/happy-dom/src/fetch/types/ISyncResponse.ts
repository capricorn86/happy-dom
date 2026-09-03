import type { PropertySymbol } from '../../index.js';
import type Headers from '../Headers.js';

/**
 * Fetch response.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
 */
export default interface ISyncResponse {
	status: number;
	statusText: string;
	ok: boolean;
	url: string;
	redirected: boolean;
	type?: 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
	headers: Headers;
	body: Buffer | null;
	[PropertySymbol.virtualServerFile]?: string | null;
}
