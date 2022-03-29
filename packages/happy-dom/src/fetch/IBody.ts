import IBlob from '../file/IBlob';

/**
 * Fetch response.
 */
export default interface IBody {
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
}
