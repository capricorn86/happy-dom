import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedEnumeration from '../svg-element/SVGAnimatedEnumeration.js';
import SVGAnimatedString from '../svg-element/SVGAnimatedString.js';
import SVGAnimatedTransformList from '../svg-element/SVGAnimatedTransformList.js';
import SVGGraphicsElement from '../svg-graphics-element/SVGGraphicsElement.js';

/**
 * SVG Gradient Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGradientElement
 */
export default class SVGGradientElement extends SVGGraphicsElement {
	// Internal properties
	public [PropertySymbol.href]: SVGAnimatedString | null = null;
	public [PropertySymbol.gradientUnits]: SVGAnimatedEnumeration | null = null;
	public [PropertySymbol.gradientTransform]: SVGAnimatedTransformList | null = null;
	public [PropertySymbol.spreadMethod]: SVGAnimatedEnumeration | null = null;

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
	 * Returns gradient units.
	 *
	 * @returns Gradient units.
	 */
	public get gradientUnits(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.gradientUnits]) {
			this[PropertySymbol.gradientUnits] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this,
				'gradientUnits',
				['userSpaceOnUse', 'objectBoundingBox'],
				'objectBoundingBox'
			);
		}
		return this[PropertySymbol.gradientUnits];
	}

	/**
	 * Returns gradient transform.
	 *
	 * @returns Gradient transform.
	 */
	public get gradientTransform(): SVGAnimatedTransformList {
		if (!this[PropertySymbol.gradientTransform]) {
			this[PropertySymbol.gradientTransform] = new SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window]
			);
		}
		return this[PropertySymbol.gradientTransform];
	}

	/**
	 * Returns spread method.
	 *
	 * @returns Spread method.
	 */
	public get spreadMethod(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.spreadMethod]) {
			this[PropertySymbol.spreadMethod] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this,
				'spreadMethod',
				['pad', 'reflect', 'repeat'],
				'pad'
			);
		}
		return this[PropertySymbol.spreadMethod];
	}
}
