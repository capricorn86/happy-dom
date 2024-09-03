import SVGGeometryElement from '../svg-geometry-element/SVGGeometryElement.js';
import DOMRect from '../element/DOMRect.js';
import DOMMatrix from '../svg-element/DOMMatrix.js';
import SVGStringList from '../svg-element/SVGStringList.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import SVGStringListAttributeSeparatorEnum from '../svg-element/SVGStringListAttributeSeparatorEnum.js';
import SVGAnimatedTransformList from '../svg-element/SVGAnimatedTransformList.js';
import Event from '../../event/Event.js';

/**
 * SVG Rect Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGRectElement
 */
export default class SVGRectElement extends SVGGeometryElement {
	// Internal properties
	public [PropertySymbol.requiredExtensions]: SVGStringList | null = null;

	/**
	 * Returns x position.
	 *
	 * @returns X position.
	 */
	public get x(): SVGAnimatedLength {}
}
