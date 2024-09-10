import SVGGraphicsElement from '../svg-graphics-element/SVGGraphicsElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';
import SVGAnimatedEnumeration from '../svg-element/SVGAnimatedEnumeration.js';

/**
 * SVG Text Content Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTextContentElement
 */
export default class SVGTextContentElement extends SVGGraphicsElement {
	// Internal properties
	public [PropertySymbol.textLength]: SVGAnimatedLength | null = null;
	public [PropertySymbol.lengthAdjust]: SVGAnimatedEnumeration | null = null;

	/**
	 * Returns textLength.
	 *
	 * @returns Text length.
	 */
	public get textLength(): SVGAnimatedLength {
		if (!this[PropertySymbol.textLength]) {
			this[PropertySymbol.textLength] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'textLength'
			);
		}
		return this[PropertySymbol.textLength];
	}

	/**
	 * Returns lengthAdjust.
	 *
	 * @returns Length adjust.
	 */
	public get lengthAdjust(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.lengthAdjust]) {
			this[PropertySymbol.lengthAdjust] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this,
				'lengthAdjust',
				['spacing', 'spacingAndGlyphs'],
				'spacing'
			);
		}
		return this[PropertySymbol.lengthAdjust];
	}

	/**
	 * Returns the number of characters available for rendering.
	 *
	 * @returns Number of characters.
	 */
	public getNumberOfChars(): number {
		if (!this[PropertySymbol.isConnected]) {
			return 0;
		}

		return this.textContent.length;
	}

	/**
	 * Returns a float representing the computed length for the text within the element.
	 *
	 * @returns Computed text length.
	 */
	public getComputedTextLength(): number {
		// TODO: Implement.
		return 0;
	}

	/**
	 * Returns a float representing the computed length of the formatted text advance distance for a substring of text within the element. Note that this method only accounts for the widths of the glyphs in the substring and any extra spacing inserted by the CSS 'letter-spacing' and 'word-spacing' properties. Visual spacing adjustments made by the 'x' attribute is ignored.
	 *
	 * @param _charnum The index of the first character in the substring.
	 * @param _nchars The number of characters in the substring.
	 */
	public getSubStringLength(_charnum: number, _nchars: number): number {
		// TODO: Implement.
		return 0;
	}
}
