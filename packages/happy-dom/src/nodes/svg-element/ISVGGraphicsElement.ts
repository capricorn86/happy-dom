import DOMRect from '../element/DOMRect.js';
import DOMMatrix from './DOMMatrix.js';
import ISVGElement from './ISVGElement.js';

/**
 * SVG Graphics Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
 */
export default interface ISVGGraphicsElement extends ISVGElement {
	readonly transform: {};

	/**
	 * Returns DOM rect.
	 *
	 * @returns DOM rect.
	 */
	getBBox(): DOMRect;

	/**
	 * Returns CTM.
	 *
	 * @returns CTM.
	 */
	getCTM(): DOMMatrix;

	/**
	 * Returns screen CTM.
	 *
	 * @returns Screen CTM.
	 */
	getScreenCTM(): DOMMatrix;
}
