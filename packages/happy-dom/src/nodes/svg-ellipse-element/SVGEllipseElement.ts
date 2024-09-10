import SVGGeometryElement from '../svg-geometry-element/SVGGeometryElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';

/**
 * SVG Ellipse Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGEllipseElement
 */
export default class SVGEllipseElement extends SVGGeometryElement {
	// Internal properties
	public [PropertySymbol.cx]: SVGAnimatedLength | null = null;
	public [PropertySymbol.cy]: SVGAnimatedLength | null = null;
	public [PropertySymbol.rx]: SVGAnimatedLength | null = null;
	public [PropertySymbol.ry]: SVGAnimatedLength | null = null;

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
	 * Returns rx.
	 *
	 * @returns Rx.
	 */
	public get rx(): SVGAnimatedLength {
		if (!this[PropertySymbol.rx]) {
			this[PropertySymbol.rx] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'rx'
			);
		}
		return this[PropertySymbol.rx];
	}

	/**
	 * Returns ry.
	 *
	 * @returns Ry.
	 */
	public get ry(): SVGAnimatedLength {
		if (!this[PropertySymbol.ry]) {
			this[PropertySymbol.ry] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'ry'
			);
		}
		return this[PropertySymbol.ry];
	}
}
