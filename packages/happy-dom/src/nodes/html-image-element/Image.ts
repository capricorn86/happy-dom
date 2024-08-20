import Document from '../document/Document.js';
import HTMLImageElement from './HTMLImageElement.js';

/**
 * Image as constructor.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image.
 */
export default class Image extends HTMLImageElement {
	/**
	 * Constructor.
	 *
	 * @param [ownerDocument] Owner document.
	 * @param [width] Width.
	 * @param [height] Height.
	 */
	constructor(ownerDocument?: Document, width: number = null, height: number = null) {
		super(ownerDocument);

		if (width !== null) {
			this.width = width;
		}

		if (height !== null) {
			this.height = height;
		}
	}
}
