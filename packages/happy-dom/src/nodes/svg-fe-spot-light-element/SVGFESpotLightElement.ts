import SVGElement from '../svg-element/SVGElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedNumber from '../../svg/SVGAnimatedNumber.js';

/**
 * SVGFESpotLightElement.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGFESpotLightElement
 */
export default class SVGFESpotLightElement extends SVGElement {
	// Internal properties
	public [PropertySymbol.x]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.y]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.z]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.pointsAtX]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.pointsAtY]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.pointsAtZ]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.specularExponent]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.limitingConeAngle]: SVGAnimatedNumber | null = null;

	/**
	 * Returns x.
	 *
	 * @returns X.
	 */
	public get x(): SVGAnimatedNumber {
		if (!this[PropertySymbol.x]) {
			this[PropertySymbol.x] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('x'),
					setAttribute: (value) =>
						value ? this.setAttribute('x', value) : this.removeAttribute('x')
				}
			);
		}
		return this[PropertySymbol.x];
	}

	/**
	 * Returns y.
	 *
	 * @returns Y.
	 */
	public get y(): SVGAnimatedNumber {
		if (!this[PropertySymbol.y]) {
			this[PropertySymbol.y] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('y'),
					setAttribute: (value) =>
						value ? this.setAttribute('y', value) : this.removeAttribute('y')
				}
			);
		}
		return this[PropertySymbol.y];
	}

	/**
	 * Returns z.
	 *
	 * @returns Z.
	 */
	public get z(): SVGAnimatedNumber {
		if (!this[PropertySymbol.z]) {
			this[PropertySymbol.z] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('z'),
					setAttribute: (value) =>
						value ? this.setAttribute('z', value) : this.removeAttribute('z')
				}
			);
		}
		return this[PropertySymbol.z];
	}

	/**
	 * Returns pointsAtX.
	 *
	 * @returns PointsAtX.
	 */
	public get pointsAtX(): SVGAnimatedNumber {
		if (!this[PropertySymbol.pointsAtX]) {
			this[PropertySymbol.pointsAtX] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('pointsAtX'),
					setAttribute: (value) =>
						value ? this.setAttribute('pointsAtX', value) : this.removeAttribute('pointsAtX')
				}
			);
		}
		return this[PropertySymbol.pointsAtX];
	}

	/**
	 * Returns pointsAtY.
	 *
	 * @returns PointsAtY.
	 */
	public get pointsAtY(): SVGAnimatedNumber {
		if (!this[PropertySymbol.pointsAtY]) {
			this[PropertySymbol.pointsAtY] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('pointsAtY'),
					setAttribute: (value) =>
						value ? this.setAttribute('pointsAtY', value) : this.removeAttribute('pointsAtY')
				}
			);
		}
		return this[PropertySymbol.pointsAtY];
	}

	/**
	 * Returns pointsAtZ.
	 *
	 * @returns PointsAtZ.
	 */
	public get pointsAtZ(): SVGAnimatedNumber {
		if (!this[PropertySymbol.pointsAtZ]) {
			this[PropertySymbol.pointsAtZ] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('pointsAtZ'),
					setAttribute: (value) =>
						value ? this.setAttribute('pointsAtZ', value) : this.removeAttribute('pointsAtZ')
				}
			);
		}
		return this[PropertySymbol.pointsAtZ];
	}

	/**
	 * Returns specularExponent.
	 *
	 * @returns SpecularExponent.
	 */
	public get specularExponent(): SVGAnimatedNumber {
		if (!this[PropertySymbol.specularExponent]) {
			this[PropertySymbol.specularExponent] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('specularExponent'),
					setAttribute: (value) =>
						value
							? this.setAttribute('specularExponent', value)
							: this.removeAttribute('specularExponent')
				}
			);
		}
		return this[PropertySymbol.specularExponent];
	}

	/**
	 * Returns limitingConeAngle.
	 *
	 * @returns LimitingConeAngle.
	 */
	public get limitingConeAngle(): SVGAnimatedNumber {
		if (!this[PropertySymbol.limitingConeAngle]) {
			this[PropertySymbol.limitingConeAngle] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('limitingConeAngle'),
					setAttribute: (value) =>
						value
							? this.setAttribute('limitingConeAngle', value)
							: this.removeAttribute('limitingConeAngle')
				}
			);
		}
		return this[PropertySymbol.limitingConeAngle];
	}
}
