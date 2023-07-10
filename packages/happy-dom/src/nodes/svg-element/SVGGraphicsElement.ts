import SVGElement from './SVGElement.js';
import DOMRect from '../element/DOMRect.js';
import DOMMatrix from './DOMMatrix.js';
import ISVGGraphicsElement from './ISVGGraphicsElement.js';

/**
 * SVG Graphics Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
 */
export default class SVGGraphicsElement extends SVGElement implements ISVGGraphicsElement {
	public readonly transform = {};

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
