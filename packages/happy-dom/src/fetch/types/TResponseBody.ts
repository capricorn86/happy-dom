import type { ReadableStream } from 'stream/web';
import type { URLSearchParams } from 'url';
import type FormData from '../../form-data/FormData.js';
import type Blob from '../../file/Blob.js';

export type TResponseBody =
	| ArrayBuffer
	| ArrayBufferView
	| ReadableStream
	| string
	| URLSearchParams
	| Blob
	| FormData
	| null;
