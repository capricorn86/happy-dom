import SVGElement from './SVGElement';
import DOMRect from '../../basic/element/DOMRect';

/**
 * SVGGraphicsElement.
 */
export default class SVGGraphicsElement extends SVGElement {
	/**
	 * Returns DOM rect.
	 *
	 * @returns DOM rect.
	 */
	public getBBox(): DOMRect {
		return new DOMRect();
	}
}
