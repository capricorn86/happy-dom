import SVGElement from '../svg-element/SVGElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGAnimatedNumber from '../../svg/SVGAnimatedNumber.js';

/**
 * SVGFEPointLightElement.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGFEPointLightElement
 */
export default class SVGFEPointLightElement extends SVGElement {
	// Internal properties
	public [PropertySymbol.x]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.y]: SVGAnimatedNumber | null = null;
	public [PropertySymbol.z]: SVGAnimatedNumber | null = null;

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
}
