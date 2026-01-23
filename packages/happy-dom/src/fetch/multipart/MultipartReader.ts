import File from '../../file/File.js';
import FormData from '../../form-data/FormData.js';
import BrowserWindow from '../../window/BrowserWindow.js';

enum MultipartParserStateEnum {
	boundary = 0,
	headerStart = 2,
	header = 3,
	data = 5
}

const CHARACTER_CODE = {
	lf: 10,
	cr: 13
};

/**
 * Multipart reader.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/utils/multipart-parser.js (MIT)
 */
export default class MultipartReader {
	private formData: FormData;
	private boundary: Uint8Array;
	private boundaryIndex = 0;
	private state = MultipartParserStateEnum.boundary;
	private data: {
		contentDisposition: { [key: string]: string } | null;
		value: number[];
		contentType: string | null;
		header: string;
	} = {
		contentDisposition: null,
		value: [],
		contentType: null,
		header: ''
	};

	/**
	 * Constructor.
	 *
	 * @param window Window.
	 * @param formData Form data.
	 * @param boundary Boundary.
	 */
	constructor(window: BrowserWindow, boundary: string) {
		const boundaryHeader = `--${boundary}`;
		this.boundary = new Uint8Array(boundaryHeader.length);
		this.formData = new window.FormData();

		for (let i = 0, max = boundaryHeader.length; i < max; i++) {
			this.boundary[i] = boundaryHeader.charCodeAt(i);
		}
	}

	/**
	 * Appends data.
	 *
	 * @param data Data.
	 */
	public write(data: Uint8Array): void {
		let char: number;
		let nextChar: number;

		for (let i = 0, max = data.length; i < max; i++) {
			char = data[i];
			nextChar = data[i + 1];

			switch (this.state) {
				case MultipartParserStateEnum.boundary:
					if (char === this.boundary[this.boundaryIndex]) {
						this.boundaryIndex++;
					} else {
						this.boundaryIndex = 0;
					}

					if (this.boundaryIndex === this.boundary.length) {
						this.state = MultipartParserStateEnum.headerStart;
						this.boundaryIndex = 0;
					}

					break;

				case MultipartParserStateEnum.headerStart:
					if (nextChar !== CHARACTER_CODE.cr && nextChar !== CHARACTER_CODE.lf) {
						this.data.header = '';
						this.state =
							data[i - 2] === CHARACTER_CODE.lf
								? MultipartParserStateEnum.data
								: MultipartParserStateEnum.header;
					}

					break;

				case MultipartParserStateEnum.header:
					if (char === CHARACTER_CODE.cr) {
						if (this.data.header) {
							const headerParts = this.data.header.split(':');
							if (headerParts.length > 1) {
								const headerName = headerParts[0].toLowerCase();
								const headerValue = headerParts[1].trim();

								switch (headerName) {
									case 'content-disposition':
										this.data.contentDisposition = this.getContentDisposition(headerValue);
										break;
									case 'content-type':
										this.data.contentType = headerValue;
										break;
								}
							}
						}

						this.state = MultipartParserStateEnum.headerStart;
					} else {
						this.data.header += String.fromCharCode(char);
					}

					break;

				case MultipartParserStateEnum.data:
					if (char === this.boundary[this.boundaryIndex]) {
						this.boundaryIndex++;
					} else {
						this.boundaryIndex = 0;
					}

					if (this.boundaryIndex === this.boundary.length) {
						this.state = MultipartParserStateEnum.headerStart;

						if (this.data.value.length) {
							this.appendFormData(
								this.data.contentDisposition!.name,
								Buffer.from(this.data.value.slice(0, -(this.boundary.length + 1))),
								this.data.contentDisposition!.filename,
								this.data.contentType!
							);

							this.data.value = [];
							this.data.contentDisposition = null;
							this.data.contentType = null;
						}

						this.boundaryIndex = 0;
					} else {
						this.data.value.push(char);
					}

					break;
			}
		}
	}

	/**
	 * Ends the stream.
	 *
	 * @returns Form data.
	 */
	public end(): FormData {
		// If we are missing an end boundary, but we have data, we should append it.
		if (this.data.contentDisposition && this.data.value.length) {
			this.appendFormData(
				this.data.contentDisposition.name,
				Buffer.from(this.data.value.slice(0, -2)),
				this.data.contentDisposition.filename,
				this.data.contentType!
			);
		}

		return this.formData;
	}

	/**
	 * Appends data.
	 *
	 * @param key Key.
	 * @param value value.
	 * @param filename Filename.
	 * @param type Type.
	 */
	private appendFormData(key: string, value: Buffer, filename?: string, type?: string): void {
		if (!value.length) {
			return;
		}

		if (filename) {
			this.formData.append(
				key,
				new File([value], filename, {
					type
				})
			);
		} else {
			this.formData.append(key, value.toString());
		}
	}

	/**
	 * Returns content disposition.
	 *
	 * @param headerValue Header value.
	 * @returns Content disposition.
	 */
	private getContentDisposition(headerValue: string): { [key: string]: string } {
		const regex = /([a-z]+) *= *"([^"]+)"/g;
		const contentDisposition: { [key: string]: string } = {};
		let match: RegExpExecArray | null;

		while ((match = regex.exec(headerValue))) {
			contentDisposition[match[1]] = match[2];
		}

		return contentDisposition;
	}
}
