import { URL as NodeJSURL } from 'url';
import * as PropertySymbol from '../PropertySymbol.js';
import { Blob as NodeJSBlob } from 'buffer';
import Blob from '../file/Blob.js';
import type BrowserWindow from '../window/BrowserWindow.js';

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
	 * Returns href.
	 *
	 * Node's util.inspect() calls this getter on the prototype when checking for URLs, which throws in Node's URL getter for subclasses (#1938).
	 *
	 * @returns Href.
	 */
	public override get href(): string {
		if (Object.hasOwn(this, 'constructor')) {
			return '';
		}
		return super.href;
	}

	/**
	 * Sets href.
	 *
	 * @param href Href.
	 */
	public override set href(href: string) {
		super.href = href;
	}

	/**
	 * Creates a string containing a URL representing the object given in the parameter.
	 *
	 * @param object Object.
	 * @returns URL.
	 */
	public static override createObjectURL(object: NodeJSBlob | Blob): string {
		if (object instanceof Blob) {
			const blob = new NodeJSBlob([<any>object[PropertySymbol.buffer]], { type: object.type });
			return super.createObjectURL(blob);
		}
		return super.createObjectURL(object);
	}
}
