import HTMLImageElement from './HTMLImageElement';

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
	 * @param [width] Width.
	 * @param [height] Height.
	 */
	constructor(width: number = null, height: number = null) {
		super();

		if (width !== null) {
			this.width = width;
		}

		if (height !== null) {
			this.height = height;
		}
	}
}
