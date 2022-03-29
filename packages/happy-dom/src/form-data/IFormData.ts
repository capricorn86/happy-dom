import Stream from 'stream';
import HTTP from 'http';

interface IHeaders {
	[key: string]: unknown;
}

interface IAppendOptions {
	header?: string | IHeaders;
	knownLength?: number;
	filename?: string;
	filepath?: string;
	contentType?: string;
}

interface ISubmitOptions extends HTTP.RequestOptions {
	protocol?: 'https:' | 'http:';
}

export default interface IFormData extends Stream.Readable {
	append(key: string, value: unknown, options?: IAppendOptions | string): void;
	getHeaders(userHeaders?: IHeaders): { [key: string]: IHeaders };
	submit(
		params: string | ISubmitOptions,
		callback?: (error: Error | null, response: HTTP.IncomingMessage) => void
	): HTTP.ClientRequest;
	getBuffer(): Buffer;
	setBoundary(boundary: string): void;
	getBoundary(): string;
	getLength(callback: (err: Error | null, length: number) => void): void;
	getLengthSync(): number;
	hasKnownLength(): boolean;
}
