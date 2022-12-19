import IHeaders from './IHeaders';
import IBlob from '../file/IBlob';
import AbortSignal from './AbortSignal';

/**
 * Fetch request.
 */
export default interface IRequest {
	readonly headers: IHeaders;
	readonly method: string;
	readonly redirect: 'error' | 'follow' | 'manual';
	readonly referrer: string;
	readonly url: string;
	readonly body: NodeJS.ReadableStream;
	readonly bodyUsed: boolean;
	readonly size: number;
	readonly timeout: number;
	readonly referrerPolicy: string;
	readonly signal: AbortSignal | null;

	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<IBlob>;
	buffer(): Promise<Buffer>;
	json(): Promise<unknown>;
	text(): Promise<string>;
	textConverted(): Promise<string>;
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
