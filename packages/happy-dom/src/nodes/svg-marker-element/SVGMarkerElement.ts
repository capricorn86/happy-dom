import SVGGeometryElement from '../svg-geometry-element/SVGGeometryElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedEnumeration from '../svg-element/SVGAnimatedEnumeration.js';
import SVGAnimatedLength from '../svg-element/SVGAnimatedLength.js';
import SVGAnimatedAngle from '../svg-element/SVGAnimatedAngle.js';
import SVGAnimatedRect from '../svg-element/SVGAnimatedRect.js';
import SVGAnimatedPreserveAspectRatio from '../svg-element/SVGAnimatedPreserveAspectRatio.js';
import SVGAngle from '../svg-element/SVGAngle.js';

/**
 * SVG Rect Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGMarkerElement
 */
export default class SVGMarkerElement extends SVGGeometryElement {
	// Internal properties
	public [PropertySymbol.markerUnits]: SVGAnimatedEnumeration | null = null;
	public [PropertySymbol.markerWidth]: SVGAnimatedLength | null = null;
	public [PropertySymbol.markerHeight]: SVGAnimatedLength | null = null;
	public [PropertySymbol.orientType]: SVGAnimatedEnumeration | null = null;
	public [PropertySymbol.orientAngle]: SVGAnimatedAngle | null = null;
	public [PropertySymbol.refX]: SVGAnimatedLength | null = null;
	public [PropertySymbol.refY]: SVGAnimatedLength | null = null;
	public [PropertySymbol.viewBox]: SVGAnimatedRect | null = null;
	public [PropertySymbol.preserveAspectRatio]: SVGAnimatedPreserveAspectRatio | null = null;

	/**
	 * Returns marker units.
	 *
	 * @returns Marker units.
	 */
	public get markerUnits(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.markerUnits]) {
			this[PropertySymbol.markerUnits] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this,
				'markerUnits',
				['userSpaceOnUse', 'strokeWidth'],
				'strokeWidth'
			);
		}
		return this[PropertySymbol.markerUnits];
	}

	/**
	 * Returns marker width.
	 *
	 * @returns Marker width.
	 */
	public get markerWidth(): SVGAnimatedLength {
		if (!this[PropertySymbol.markerWidth]) {
			this[PropertySymbol.markerWidth] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'markerWidth'
			);
		}
		return this[PropertySymbol.markerWidth];
	}

	/**
	 * Returns marker height.
	 *
	 * @returns Marker height.
	 */
	public get markerHeight(): SVGAnimatedLength {
		if (!this[PropertySymbol.markerHeight]) {
			this[PropertySymbol.markerHeight] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'markerHeight'
			);
		}
		return this[PropertySymbol.markerHeight];
	}

	/**
	 * Returns orient type.
	 *
	 * @returns Orient type.
	 */
	public get orientType(): SVGAnimatedEnumeration {
		if (!this[PropertySymbol.orientType]) {
			this[PropertySymbol.orientType] = new SVGAnimatedEnumeration(
				PropertySymbol.illegalConstructor,
				this,
				'orient',
				['auto', null],
				'auto'
			);
		}
		return this[PropertySymbol.orientType];
	}

	/**
	 * Returns orient angle.
	 *
	 * @returns Orient angle.
	 */
	public get orientAngle(): SVGAnimatedAngle {
		if (!this[PropertySymbol.orientAngle]) {
			this[PropertySymbol.orientAngle] = new SVGAnimatedAngle(
				PropertySymbol.illegalConstructor,
				this,
				'orient'
			);
		}
		return this[PropertySymbol.orientAngle];
	}

	/**
	 * Returns ref x.
	 *
	 * @returns Ref x.
	 */
	public get refX(): SVGAnimatedLength {
		if (!this[PropertySymbol.refX]) {
			this[PropertySymbol.refX] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'refX'
			);
		}
		return this[PropertySymbol.refX];
	}

	/**
	 * Returns ref y.
	 *
	 * @returns Ref y.
	 */
	public get refY(): SVGAnimatedLength {
		if (!this[PropertySymbol.refY]) {
			this[PropertySymbol.refY] = new SVGAnimatedLength(
				PropertySymbol.illegalConstructor,
				this,
				'refY'
			);
		}
		return this[PropertySymbol.refY];
	}

	/**
	 * Returns view box.
	 *
	 * @returns View box.
	 */
	public get viewBox(): SVGAnimatedRect {
		if (!this[PropertySymbol.viewBox]) {
			this[PropertySymbol.viewBox] = new SVGAnimatedRect(PropertySymbol.illegalConstructor, this);
		}
		return this[PropertySymbol.viewBox];
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
	 * Sets the value of the orient attribute to auto.
	 */
	public setOrientToAuto(): void {
		this.setAttribute('orient', 'auto');
	}

	/**
	 * Sets the value of the orient attribute to an angle.
	 *
	 * @param angle Angle.
	 */
	public setOrientToAngle(angle: SVGAngle): void {
		this.setAttribute('orient', angle.valueAsString);
	}
}
