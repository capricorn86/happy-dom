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
	/**
	 * Writes data.
	 *
	 * @param boundary
	 * @param data Data.
	 */
	public static getFormData(boundary: string, data: Uint8Array): void {
		const boundaryChars = new Uint8Array(boundary.length);

		for (let i = 0, max = boundary.length; i < max; i++) {
			boundaryChars[i] = boundary.charCodeAt(i);
		}

		const formData = new FormData();
		let index = 0;
		let state = MultiparParserStateEnum.boundary;
		let contentDisposition: { [key: string]: string } | null = null;
		let fieldData: number[] = [];
		let contentType: string | null = null;
		let header: string;
		let char: number;

		for (let i = 0, max = data.length; i < max; i++) {
			char = data[i];

			switch (state) {
				case MultiparParserStateEnum.boundary:
					if (char === boundaryChars[index]) {
						index++;
					}
					if (index === boundaryChars.length && char === CHARACTER_CODE.lf) {
						state = MultiparParserStateEnum.header;
						header = '';
						contentDisposition = null;
						contentType = null;
						fieldData = [];
						index = 0;
					}
					break;
				case MultiparParserStateEnum.header:
					if (char !== CHARACTER_CODE.cr && char !== CHARACTER_CODE.lf) {
						header += String.fromCharCode(char);
					} else {
						if (header) {
							const headerParts = header.split(':');
							const headerName = headerParts[0].toLowerCase();
							const headerValue = headerParts[1].trim();

							switch (headerName) {
								case 'content-disposition':
									contentDisposition = this.getContentDisposition(headerValue);
									break;
								case 'content-type':
									contentType = headerValue;
									break;
							}
						} else if (contentDisposition) {
							state = MultiparParserStateEnum.data;
						}
					}
					break;
				case MultiparParserStateEnum.data:
					if (
						data[i] === CHARACTER_CODE.cr &&
						data[i + 1] === CHARACTER_CODE.lf &&
						data[i + 2] === CHARACTER_CODE.cr &&
						data[i + 3] === CHARACTER_CODE.lf &&
						data[i + 4] === CHARACTER_CODE.hyphen
					) {
						if (contentDisposition && contentDisposition.name) {
							formData.append(
								contentDisposition.name,
								new Blob([new Uint8Array(fieldData)], { type: contentType })
							);
						}

						state = MultiparParserStateEnum.boundary;
						i += 4;
					}
			}
		}
	}

	/**
	 * Returns content disposition.
	 *
	 * @param headerValue Header value.
	 * @returns Content disposition.
	 */
	private static getContentDisposition(headerValue: string): { [key: string]: string } {
		const regex = /([a-z]+) *= *"([^"]+)"/g;
		const contentDisposition: { [key: string]: string } = {};
		let match: RegExpExecArray;

		while ((match = regex.exec(headerValue))) {
			contentDisposition[match[1]] = match[2];
		}

		return contentDisposition;
	}
}
