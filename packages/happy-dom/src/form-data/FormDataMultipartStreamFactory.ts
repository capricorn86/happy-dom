import { Readable } from 'stream';
import IWindow from '../window/IWindow';
import FormData from './FormData';

/**
 * FormData utility.
 */
export default class FormDataMultipartStreamFactory {
	/**
	 * Converts a FormData object to a ReadableStream.
	 *
	 * @param window Window.
	 * @param formData FormData.
	 * @returns Stream and type.
	 */
	public static getStream(
		window: IWindow,
		formData: FormData
	): { contentType: string; contentLength: number; stream: Readable } {
		const boundary = '----HappyDOMFormDataBoundary' + Math.random().toString(36);
		const chunks: Buffer[] = [];
		const prefix = `--${boundary}\r\nContent-Disposition: form-data; name="`;

		for (const [name, value] of formData) {
			if (typeof value === 'string') {
				chunks.push(
					Buffer.from(
						`${prefix}${this.escapeName(name)}"\r\n\r\n${value.replace(
							/\r(?!\n)|(?<!\r)\n/g,
							'\r\n'
						)}\r\n`
					)
				);
			} else {
				chunks.push(
					Buffer.from(
						`${prefix}${this.escapeName(name)}"; filename="${this.escapeName(
							value.name,
							true
						)}"\r\nContent-Type: ${value.type || 'application/octet-stream'}\r\n\r\n`
					)
				);
				chunks.push(value._buffer);
				chunks.push(Buffer.from('\r\n'));
			}
		}

		const buffer = Buffer.concat(chunks);
		const bufferIterator = buffer.entries();

		return {
			contentType: `multipart/form-data; boundary=${boundary}`,
			contentLength: buffer.length,
			stream: new window.ReadableStream({
				// @ts-ignore
				type: 'bytes',

				async pull(ctrl) {
					const chunk = await bufferIterator.next();
					chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
				},

				async cancel() {
					bufferIterator.return();
				}
			})
		};
	}

	/**
	 * Escapes a form data entry name.
	 *
	 * @param name Name.
	 * @param filename Whether it is a filename.
	 * @returns Escaped name.
	 */
	private static escapeName(name: string, filename = false): string {
		return (filename ? name : name.replace(/\r?\n|\r/g, '\r\n'))
			.replace(/\n/g, '%0A')
			.replace(/\r/g, '%0D')
			.replace(/"/g, '%22');
	}
}
