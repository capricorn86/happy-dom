/**
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob.
 */
export default interface IBlob {
	readonly type: string;
	readonly size: number;
	slice(start?: number, end?: number): IBlob;
	text(): Promise<string>;
}
