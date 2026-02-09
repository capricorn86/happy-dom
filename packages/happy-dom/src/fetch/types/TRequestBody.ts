import type { URLSearchParams } from 'url';
import type FormData from '../../form-data/FormData.js';
import type Blob from '../../file/Blob.js';
import type { ReadableStream } from 'stream/web';

export type TRequestBody =
	| ArrayBuffer
	| ArrayBufferView
	| ReadableStream
	| string
	| URLSearchParams
	| Blob
	| FormData
	| null;
