import { URL as NodeJSURL } from 'url';
import * as PropertySymbol from '../PropertySymbol.js';
import { Blob as NodeJSBlob } from 'buffer';
import Blob from '../file/Blob.js';
import BrowserWindow from '../window/BrowserWindow.js';

/**
 * URL.
 */
export default class URL extends NodeJSURL {
	// Injected by WindowContextClassExtender
	protected declare [PropertySymbol.window]?: BrowserWindow;

	/**
	 * Constructor.
	 *
	 * @param url URL.
	 * @param [base] Base URL.
	 */
	constructor(url: string | URL, base?: string | URL) {
		try {
			super(url, base);
		} catch (error) {
			super('about:blank');
			if (this[PropertySymbol.window]) {
				throw new this[PropertySymbol.window].TypeError('Invalid URL');
			}
			throw error;
		}
	}

	/**
	 * Creates a string containing a URL representing the object given in the parameter.
	 *
	 * @param object Object.
	 * @returns URL.
	 */
	public static override createObjectURL(object: NodeJSBlob | Blob): string {
		if (object instanceof Blob) {
			const blob = new NodeJSBlob([object[PropertySymbol.buffer]], { type: object.type });
			return super.createObjectURL(blob);
		}
		return super.createObjectURL(object);
	}
}
