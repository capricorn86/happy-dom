import File from '../../file/File';
import FormData from '../../form-data/FormData';

enum MultiparParserStateEnum {
	boundary = 0,
	header = 1,
	data = 2
}

const CHARACTER_CODE = {
	lf: 10,
	cr: 13,
	space: 32,
	hyphen: 45,
	colon: 58,
	a: 97,
	z: 122
};

/**
 * Multipart parser.
 *
 * Based on:
 * https://github.com/node-fetch/node-fetch/blob/main/src/utils/multipart-parser.js (MIT)
 */
export default class MultipartParser {
	private formData: FormData;
	private boundary: Uint8Array;
	private boundaryIndex = 0;
	private state = MultiparParserStateEnum.boundary;
	private data: {
		contentDisposition: { [key: string]: string } | null;
		value: number[];
		contentType: string | null;
		header: string;
		char: number;
	};

	/**
	 * Constructor.
	 *
	 * @param formData Form data.
	 * @param boundary Boundary.
	 */
	constructor(formData: FormData, boundary: string) {
		this.formData = formData;
		this.boundary = new Uint8Array(boundary.length);

		for (let i = 0, max = boundary.length; i < max; i++) {
			this.boundary[i] = boundary.charCodeAt(i);
		}
	}

	/**
	 * Appends data the form data object.
	 *
	 * @param data Data.
	 */
	public append(data: Uint8Array): void {
		let char: number;

		for (let i = 0, max = data.length; i < max; i++) {
			char = data[i];

			switch (this.state) {
				case MultiparParserStateEnum.boundary:
				case MultiparParserStateEnum.data:
					if (char === this.boundary[this.boundaryIndex]) {
						this.boundaryIndex++;
					} else {
						this.boundaryIndex = 0;
					}
					if (this.boundaryIndex === this.boundary.length && char === CHARACTER_CODE.lf) {
						if (this.data.value.length) {
							if (this.data.contentDisposition.filename) {
								this.formData.append(
									this.data.contentDisposition.name,
									new File(
										[new Uint8Array(this.data.value)],
										this.data.contentDisposition.filename,
										{
											type: this.data.contentType
										}
									)
								);
							} else if (this.data.value) {
								this.formData.append(
									this.data.contentDisposition.name,
									Buffer.from(this.data.value).toString()
								);
							}
						}

						this.state = MultiparParserStateEnum.header;
						this.data.header = '';
						this.data.contentDisposition = null;
						this.data.contentType = null;
						this.data.value = [];
						this.boundaryIndex = 0;
					}
					break;
				case MultiparParserStateEnum.header:
					if (char !== CHARACTER_CODE.cr && char !== CHARACTER_CODE.lf) {
						this.data.header += String.fromCharCode(char);
					} else if (char === CHARACTER_CODE.lf) {
						if (this.data.header) {
							const headerParts = this.data.header.split(':');
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
						} else if (this.data.contentDisposition?.name) {
							this.state = MultiparParserStateEnum.data;
						} else {
							this.state = MultiparParserStateEnum.boundary;
						}
					}
					break;
				case MultiparParserStateEnum.data:
					this.data.value.push(char);
					break;
			}
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
		let match: RegExpExecArray;

		while ((match = regex.exec(headerValue))) {
			contentDisposition[match[1]] = match[2];
		}

		return contentDisposition;
	}
}
