import SVGRect from './SVGRect';

/**
 * Rect object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAnimatedRect
 */
export default class SVGAnimatedRect {
	public baseVal: SVGRect = new SVGRect();
	public animVal: SVGRect = new SVGRect();
}
