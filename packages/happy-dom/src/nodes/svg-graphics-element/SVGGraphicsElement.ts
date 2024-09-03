import SVGElement from '../svg-element/SVGElement.js';
import DOMRect from '../element/DOMRect.js';
import DOMMatrix from '../svg-element/DOMMatrix.js';
import SVGStringList from '../svg-element/SVGStringList.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGStringListAttributeSeparatorEnum from '../svg-element/SVGStringListAttributeSeparatorEnum.js';
import SVGAnimatedTransformList from '../svg-element/SVGAnimatedTransformList.js';
import Event from '../../event/Event.js';

/**
 * SVG Graphics Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
 */
export default class SVGGraphicsElement extends SVGElement {
	// Internal properties
	public [PropertySymbol.requiredExtensions]: SVGStringList | null = null;
	public [PropertySymbol.systemLanguage]: SVGStringList | null = null;
	public [PropertySymbol.transform]: SVGAnimatedTransformList | null = null;

	// Events
	public oncopy: (event: Event) => void | null = null;
	public oncut: (event: Event) => void | null = null;
	public onpaste: (event: Event) => void | null = null;

	/**
	 * Returns required extensions.
	 *
	 * @returns Required extensions.
	 */
	public get requiredExtensions(): SVGStringList {
		if (!this[PropertySymbol.requiredExtensions]) {
			this[PropertySymbol.requiredExtensions] = new SVGStringList(
				PropertySymbol.illegalConstructor,
				this,
				'requiredExtensions',
				SVGStringListAttributeSeparatorEnum.space
			);
		}
		return this[PropertySymbol.requiredExtensions];
	}

	/**
	 * Returns system language.
	 *
	 * @returns System language.
	 */
	public get systemLanguage(): SVGStringList {
		if (!this[PropertySymbol.systemLanguage]) {
			this[PropertySymbol.systemLanguage] = new SVGStringList(
				PropertySymbol.illegalConstructor,
				this,
				'systemLanguage',
				SVGStringListAttributeSeparatorEnum.comma
			);
		}
		return this[PropertySymbol.systemLanguage];
	}

	/**
	 * Returns transform.
	 *
	 * @returns Transform.
	 */
	public get transform(): SVGAnimatedTransformList {
		if (!this[PropertySymbol.transform]) {
			this[PropertySymbol.transform] = new SVGAnimatedTransformList(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window]
			);
		}
		return this[PropertySymbol.transform];
	}

	/**
	 * Returns DOM rect.
	 *
	 * @returns DOM rect.
	 */
	public getBBox(): DOMRect {
		return new DOMRect();
	}

	/**
	 * Returns CTM.
	 *
	 * @returns CTM.
	 */
	public getCTM(): DOMMatrix {
		return new DOMMatrix();
	}

	/**
	 * Returns screen CTM.
	 *
	 * @returns Screen CTM.
	 */
	public getScreenCTM(): DOMMatrix {
		return new DOMMatrix();
	}
}
