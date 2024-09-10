import SVGGeometryElement from '../svg-geometry-element/SVGGeometryElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';

/**
 * SVG Circle Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGCircleElement
 */
export default class SVGCircleElement extends SVGGeometryElement {
	// Internal properties
	public [PropertySymbol.cx]: SVGAnimatedLength | null = null;
	public [PropertySymbol.cy]: SVGAnimatedLength | null = null;
	public [PropertySymbol.r]: SVGAnimatedLength | null = null;

	/**
	 * Returns cx.
	 *
	 * @returns Cx.
	 */
	public get cx(): SVGAnimatedLength {
		if (!this[PropertySymbol.cx]) {
			this[PropertySymbol.cx] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'cx'
			);
		}
		return this[PropertySymbol.cx];
	}

	/**
	 * Returns cy.
	 *
	 * @returns Cy.
	 */
	public get cy(): SVGAnimatedLength {
		if (!this[PropertySymbol.cy]) {
			this[PropertySymbol.cy] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'cy'
			);
		}
		return this[PropertySymbol.cy];
	}

	/**
	 * Returns r.
	 *
	 * @returns R.
	 */
	public get r(): SVGAnimatedLength {
		if (!this[PropertySymbol.r]) {
			this[PropertySymbol.r] = new SVGAnimatedLength(PropertySymbol.illegalConstructor, this, 'r');
		}
		return this[PropertySymbol.r];
	}
}
