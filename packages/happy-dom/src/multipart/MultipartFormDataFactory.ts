import FormData from '../form-data/FormData';
import { Readable } from 'stream';
import MultipartParser from './MultipartParser';
import DOMException from '../exception/DOMException';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum';
import MultipartEvent from './MultipartEvent';
import File from '../file/File';
import { TextDecoder } from 'util';

/**
 * Multipart form data factory.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/utils/multipart-parser.js (MIT)
 */
export default class MultipartFormDataFactory {
	/**
	 * Returns form data.
	 *
	 * @param body Body.
	 * @param contentType Content type header value.
	 * @returns Form data.
	 */
	public static async getFormData(body: Readable, contentType: string): Promise<FormData> {
		if (!/multipart/i.test(contentType)) {
			throw new DOMException(
				`Failed to build FormData object: The "content-type" header isn't of type "multipart/form-data".`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

		if (!match) {
			throw new DOMException(
				`Failed to build FormData object: The "content-type" header doesn't contain any multipart boundary.`,
				DOMExceptionNameEnum.invalidStateError
			);
		}

		const parser = new MultipartParser(match[1] || match[2]);
		const formData = new FormData();
		const entryChunks = [];

		let headerField;
		let headerValue;
		let entryValue;
		let entryName;
		let fieldContentType;
		let filename;

		const decoder = new TextDecoder('utf-8');

		decoder.decode();

		parser.addEventListener('partBegin', () => {
			parser.addEventListener('partData', (event: MultipartEvent) => {
				entryValue += decoder.decode(event.data, { stream: true });
			});
			parser.addEventListener('partEnd', () => {
				formData.append(entryName, entryValue);
			});

			headerField = '';
			headerValue = '';
			entryValue = '';
			entryName = '';
			fieldContentType = '';
			filename = null;
			entryChunks.length = 0;
		});

		parser.addEventListener('headerField', (event: MultipartEvent) => {
			headerField += decoder.decode(event.data, { stream: true });
		});

		parser.addEventListener('headerValue', (event: MultipartEvent) => {
			headerValue += decoder.decode(event.data, { stream: true });
		});

		parser.addEventListener('headerEnd', () => {
			headerValue += decoder.decode();
			headerField = headerField.toLowerCase();

			if (headerField === 'content-disposition') {
				// Matches either a quoted-string or a token (RFC 2616 section 19.5.1)
				const match = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);

				if (match) {
					entryName = match[2] || match[3] || '';
				}

				filename = this.getFileName(headerValue);

				if (filename) {
					parser.addEventListener('partData', (event: MultipartEvent) => {
						entryChunks.push(event.data);
					});
					parser.addEventListener('partEnd', () => {
						const file = new File(entryChunks, filename, { type: fieldContentType });
						formData.append(entryName, file);
					});
				}
			} else if (headerField === 'content-type') {
				fieldContentType = headerValue;
			}

			headerValue = '';
			headerField = '';
		});

		for await (const chunk of body) {
			parser.write(chunk);
		}

		parser.end();

		return formData;
	}

	/**
	 * Returns file name.
	 *
	 * @param headerValue Header value.
	 * @returns File name.
	 */
	private static getFileName(headerValue): string | null {
		// Matches either a quoted-string or a token (RFC 2616 section 19.5.1)

		const filenameMatch = headerValue.match(
			/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i
		);

		if (!filenameMatch) {
			return null;
		}

		const filename = filenameMatch[2] || filenameMatch[3] || '';

		return filename
			.slice(filename.lastIndexOf('\\') + 1)
			.replace(/%22/g, '"')
			.replace(/&#(\d{4});/g, (_match, code) => String.fromCharCode(code));
	}
}
