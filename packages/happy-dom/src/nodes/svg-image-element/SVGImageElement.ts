import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';
import SVGAnimatedPreserveAspectRatio from '../svg-element/SVGAnimatedPreserveAspectRatio.js';
import SVGAnimatedString from '../svg-element/SVGAnimatedString.js';
import SVGGraphicsElement from '../svg-graphics-element/SVGGraphicsElement.js';

/**
 * SVG Image Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGImageElement
 */
export default class SVGImageElement extends SVGGraphicsElement {
	// Internal properties
	public [PropertySymbol.href]: SVGAnimatedString | null = null;
	public [PropertySymbol.preserveAspectRatio]: SVGAnimatedPreserveAspectRatio | null = null;
	public [PropertySymbol.x]: SVGAnimatedLength | null = null;
	public [PropertySymbol.y]: SVGAnimatedLength | null = null;
	public [PropertySymbol.width]: SVGAnimatedLength | null = null;
	public [PropertySymbol.height]: SVGAnimatedLength | null = null;

	/**
	 * Returns href.
	 *
	 * @returns Href.
	 */
	public get href(): SVGAnimatedString {
		if (!this[PropertySymbol.href]) {
			this[PropertySymbol.href] = new SVGAnimatedString(
				PropertySymbol.illegalConstructor,
				this,
				'href'
			);
		}
		return this[PropertySymbol.href];
	}

	/**
	 * Returns decoding.
	 *
	 * @returns Decoding.
	 */
	public get decoding(): string {
		const value = this.getAttribute('decoding');
		switch (value) {
			case 'sync':
			case 'async':
			case 'auto':
				return value;
			default:
				return 'auto';
		}
	}

	/**
	 * Returns preserve aspect ratio.
	 *
	 * @returns Preserve aspect ratio.
	 */
	public get preserveAspectRatio(): SVGAnimatedPreserveAspectRatio {
		if (!this[PropertySymbol.preserveAspectRatio]) {
			this[PropertySymbol.preserveAspectRatio] = new SVGAnimatedPreserveAspectRatio(
				PropertySymbol.illegalConstructor,
				this
			);
		}
		return this[PropertySymbol.preserveAspectRatio];
	}

	/**
	 * Sets decoding.
	 *
	 * @param value Decoding.
	 */
	public set decoding(value: string) {
		this.setAttribute('decoding', value);
	}

	/**
	 * Returns x position.
	 *
	 * @returns X position.
	 */
	public get x(): SVGAnimatedLength {
		if (!this[PropertySymbol.x]) {
			this[PropertySymbol.x] = new SVGAnimatedLength(PropertySymbol.illegalConstructor, this, 'x');
		}
		return this[PropertySymbol.x];
	}

	/**
	 * Returns y position.
	 *
	 * @returns Y position.
	 */
	public get y(): SVGAnimatedLength {
		if (!this[PropertySymbol.y]) {
			this[PropertySymbol.y] = new SVGAnimatedLength(PropertySymbol.illegalConstructor, this, 'y');
		}
		return this[PropertySymbol.y];
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): SVGAnimatedLength {
		if (!this[PropertySymbol.width]) {
			this[PropertySymbol.width] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'width'
			);
		}
		return this[PropertySymbol.width];
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): SVGAnimatedLength {
		if (!this[PropertySymbol.height]) {
			this[PropertySymbol.height] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'height'
			);
		}
		return this[PropertySymbol.height];
	}

	/**
	 * Decodes the image.
	 *
	 * @returns Promise.
	 */
	public decode(): Promise<void> {
		return Promise.resolve();
	}
}
