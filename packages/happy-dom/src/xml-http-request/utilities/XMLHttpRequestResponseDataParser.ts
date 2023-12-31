import XMLHttpResponseTypeEnum from '../XMLHttpResponseTypeEnum.js';
import XMLHttpRequestResponseTextDecoder from './XMLHttpRequestResponseTextDecoder.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import Blob from '../../file/Blob.js';
import IDocument from '../../nodes/document/IDocument.js';

export default class XMLHttpRequestResponseDataParser {
	/**
	 * Parses response.
	 *
	 * @param options Options.
	 * @param options.window Window.
	 * @param [options.responseType] Response type.
	 * @param [options.data] Data.
	 * @param [options.contentType] Content type.
	 * @returns Parsed response.
	 **/
	public static parse(options: {
		window: IBrowserWindow;
		responseType: string;
		data?: Buffer;
		contentType?: string;
	}): ArrayBuffer | Blob | IDocument | object | string | null {
		if (!options.data) {
			return '';
		}
		switch (options.responseType) {
			case XMLHttpResponseTypeEnum.arraybuffer:
				// See: https://github.com/jsdom/jsdom/blob/c3c421c364510e053478520500bccafd97f5fa39/lib/jsdom/living/helpers/binary-data.js
				const newAB = new ArrayBuffer(options.data.length);
				const view = new Uint8Array(newAB);
				view.set(options.data);
				return view;
			case XMLHttpResponseTypeEnum.blob:
				try {
					return new options.window.Blob([new Uint8Array(options.data)], {
						type: options.contentType || ''
					});
				} catch (e) {
					// Ignore error.
				}
				return null;
			case XMLHttpResponseTypeEnum.document:
				const window = options.window;
				const domParser = new window.DOMParser();

				try {
					return domParser.parseFromString(
						XMLHttpRequestResponseTextDecoder.decode(options.data, options.contentType),
						'text/xml'
					);
				} catch (e) {
					// Ignore error.
				}

				return null;
			case XMLHttpResponseTypeEnum.json:
				try {
					return JSON.parse(
						XMLHttpRequestResponseTextDecoder.decode(options.data, options.contentType)
					);
				} catch (e) {
					// Ignore error.
				}
				return null;
			case XMLHttpResponseTypeEnum.text:
			case '':
			default:
				return XMLHttpRequestResponseTextDecoder.decode(options.data, options.contentType);
		}
	}
}
