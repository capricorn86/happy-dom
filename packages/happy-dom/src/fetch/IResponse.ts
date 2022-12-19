import IHeaders from './IHeaders';
import IBlob from 'src/file/IBlob';

/**
 * Fetch response.
 */
export default interface IResponse {
	readonly headers: IHeaders;
	readonly ok: boolean;
	readonly redirected: boolean;
	readonly status: number;
	readonly statusText: string;
	readonly type: 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
	readonly url: string;
	readonly body: NodeJS.ReadableStream;
	readonly bodyUsed: boolean;
	readonly size: number;
	readonly timeout: number;

	arrayBuffer(): Promise<ArrayBuffer>;
	blob(): Promise<IBlob>;
	buffer(): Promise<Buffer>;
	json(): Promise<unknown>;
	text(): Promise<string>;
	textConverted(): Promise<string>;
	clone(): IResponse;
}
