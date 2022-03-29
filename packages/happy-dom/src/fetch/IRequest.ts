import IHeaders from './IHeaders';
import IBody from './IBody';

/**
 * Fetch request.
 */
export default interface IRequest extends IBody {
	readonly headers: IHeaders;
	readonly method: string;
	readonly redirect: 'error' | 'follow' | 'manual';
	readonly referrer: string;
	readonly url: string;

	/**
	 * Returns a clone.
	 *
	 * @returns Clone.
	 */
	clone(): IRequest;

	// Not implemented:
	// Readonly cache: 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload';
	// Readonly credentials: 'include' | 'omit' | 'same-origin';
	// Readonly destination:
	// 	| ''
	// 	| 'object'
	// 	| 'audio'
	// 	| 'audioworklet'
	// 	| 'document'
	// 	| 'embed'
	// 	| 'font'
	// 	| 'frame'
	// 	| 'iframe'
	// 	| 'image'
	// 	| 'manifest'
	// 	| 'paintworklet'
	// 	| 'report'
	// 	| 'script'
	// 	| 'sharedworker'
	// 	| 'style'
	// 	| 'track'
	// 	| 'video'
	// 	| 'worker'
	// 	| 'xslt';
	// Readonly referrerPolicy:
	// 	| ''
	// 	| 'same-origin'
	// 	| 'no-referrer'
	// 	| 'no-referrer-when-downgrade'
	// 	| 'origin'
	// 	| 'origin-when-cross-origin'
	// 	| 'strict-origin'
	// 	| 'strict-origin-when-cross-origin'
	// 	| 'unsafe-url';
	// Readonly signal: AbortSignal;
	// Readonly integrity: string;
	// Readonly keepalive: boolean;
	// Readonly mode: 'same-origin' | 'cors' | 'navigate' | 'no-cors';
}
