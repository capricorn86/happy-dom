import SVGGeometryElement from '../svg-geometry-element/SVGGeometryElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';

/**
 * SVG Line Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGLineElement
 */
export default class SVGLineElement extends SVGGeometryElement {
	// Internal properties
	public [PropertySymbol.x1]: SVGAnimatedLength | null = null;
	public [PropertySymbol.y1]: SVGAnimatedLength | null = null;
	public [PropertySymbol.x2]: SVGAnimatedLength | null = null;
	public [PropertySymbol.y2]: SVGAnimatedLength | null = null;

	/**
	 * Returns x1 position.
	 *
	 * @returns X1 position.
	 */
	public get x1(): SVGAnimatedLength {
		if (!this[PropertySymbol.x1]) {
			this[PropertySymbol.x1] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'x1'
			);
		}
		return this[PropertySymbol.x1];
	}

	/**
	 * Returns y1 position.
	 *
	 * @returns Y1 position.
	 */
	public get y1(): SVGAnimatedLength {
		if (!this[PropertySymbol.y1]) {
			this[PropertySymbol.y1] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'y1'
			);
		}
		return this[PropertySymbol.y1];
	}

	/**
	 * Returns x2 position.
	 *
	 * @returns X2 position.
	 */
	public get x2(): SVGAnimatedLength {
		if (!this[PropertySymbol.x2]) {
			this[PropertySymbol.x2] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'x2'
			);
		}
		return this[PropertySymbol.x2];
	}

	/**
	 * Returns y2 position.
	 *
	 * @returns Y2 position.
	 */
	public get y2(): SVGAnimatedLength {
		if (!this[PropertySymbol.y2]) {
			this[PropertySymbol.y2] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'y2'
			);
		}
		return this[PropertySymbol.y2];
	}
}
