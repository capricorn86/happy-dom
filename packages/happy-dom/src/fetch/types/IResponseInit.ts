import type { THeadersInit } from './THeadersInit.js';
import type * as PropertySymbol from '../../PropertySymbol.js';

/**
 * Response init.
 */
export default interface IResponseInit {
	headers?: THeadersInit | undefined;
	status?: number | undefined;
	statusText?: string | undefined;

	// Used internally for responses from the network, which can have any status.
	[PropertySymbol.skipStatusValidation]?: boolean;
}
