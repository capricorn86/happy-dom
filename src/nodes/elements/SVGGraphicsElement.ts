import SVGElement from './SVGElement';
import DOMRect from '../../html-element/DOMRect';

/**
 * SVGGraphicsElement.
 */
export default class SVGGraphicsElement extends SVGElement {
    protected static _observedPropertyAttributes = Object.assign({}, SVGElement._observedPropertyAttributes);

    /**
     * Returns DOM rect.
     * 
     * @return {DOMRect} DOM rect.
     */
    public getBBox(): DOMRect {
        return new DOMRect();
    }
}
