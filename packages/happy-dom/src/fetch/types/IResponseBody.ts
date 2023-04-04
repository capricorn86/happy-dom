import { URLSearchParams } from 'url';
import FormData from '../../form-data/FormData';
import Blob from '../../file/Blob';

type IResponseBody =
	| ArrayBuffer
	| ArrayBufferView
	| NodeJS.ReadableStream
	| string
	| URLSearchParams
	| Blob
	| FormData
	| null;

export default IResponseBody;
