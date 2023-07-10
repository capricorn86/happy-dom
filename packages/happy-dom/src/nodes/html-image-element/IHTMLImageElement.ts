import IHTMLElement from '../html-element/IHTMLElement.js';

/**
 * HTML Image Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement.
 */
export default interface IHTMLImageElement extends IHTMLElement {
	alt: string;
	readonly complete: boolean;
	crossOrigin: string;
	readonly currentSrc: string;
	decoding: string;
	height: number;
	isMap: boolean;
	loading: string;
	readonly naturalHeight: number;
	readonly naturalWidth: number;
	referrerPolicy: string;
	sizes: string;
	src: string;
	srcset: string;
	useMap: string;
	width: number;
	readonly x: number;
	readonly y: number;

	/**
	 * The decode() method of the HTMLImageElement interface returns a Promise that resolves when the image is decoded and it is safe to append the image to the DOM.
	 *
	 * @returns Promise.
	 */
	decode(): Promise<void>;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLImageElement;
}
