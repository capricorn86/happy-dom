/**
 * SVG transform.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransform
 */
export default class SVGTransform {
	public static SVG_TRANSFORM_UNKNOWN = 0;
	public static SVG_TRANSFORM_MATRIX = 1;
	public static SVG_TRANSFORM_TRANSLATE = 2;
	public static SVG_TRANSFORM_SCALE = 3;
	public static SVG_TRANSFORM_ROTATE = 4;
	public static SVG_TRANSFORM_SKEWX = 5;
	public static SVG_TRANSFORM_SKEWY = 6;

	public type = 0;
	public angle = 0;

	/**
	 * Set matrix.
	 */
	public setMatrix(): void {}
	/**
	 * Set translate.
	 */
	public setTranslate(): void {}
	/**
	 * Set scale.
	 */
	public setScale(): void {}
	/**
	 * Set rotate.
	 */
	public setRotate(): void {}
	/**
	 * Set skew x.
	 */
	public setSkewX(): void {}
	/**
	 * Set skew y.
	 */
	public setSkewY(): void {}
}
