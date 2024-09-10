import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';
import SVGGradientElement from '../svg-gradient-element/SVGGradientElement.js';

/**
 * SVG Radial Gradient Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGRadialGradientElement
 */
export default class SVGRadialGradientElement extends SVGGradientElement {
	// Internal properties
	public [PropertySymbol.cx]: SVGAnimatedLength | null = null;
	public [PropertySymbol.cy]: SVGAnimatedLength | null = null;
	public [PropertySymbol.r]: SVGAnimatedLength | null = null;
	public [PropertySymbol.fx]: SVGAnimatedLength | null = null;
	public [PropertySymbol.fy]: SVGAnimatedLength | null = null;

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

	/**
	 * Returns fx.
	 *
	 * @returns Fx.
	 */
	public get fx(): SVGAnimatedLength {
		if (!this[PropertySymbol.fx]) {
			this[PropertySymbol.fx] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'fx'
			);
		}
		return this[PropertySymbol.fx];
	}

	/**
	 * Returns fy.
	 *
	 * @returns Fy.
	 */
	public get fy(): SVGAnimatedLength {
		if (!this[PropertySymbol.fy]) {
			this[PropertySymbol.fy] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'fy'
			);
		}
		return this[PropertySymbol.fy];
	}
}
