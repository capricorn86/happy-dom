const NodeVersion = process.version.replace('v', '').split('.');

export interface IXMLHttpRequestOptions {
	anon?: boolean;
}

export const MajorNodeVersion = Number.parseInt(NodeVersion[0]);
export const copyToArrayBuffer = (buffer: Buffer, offset?: number): ArrayBuffer => {
	const arrayBuffer = new ArrayBuffer(buffer.length);
	const view = new Uint8Array(arrayBuffer);
	view.set(buffer, offset || 0);
	return arrayBuffer;
};
