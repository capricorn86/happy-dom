import DOMRect from '../element/DOMRect';
import DOMMatrix from './DOMMatrix';
import ISVGElement from './ISVGElement';

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
