/**
 * SVG angle.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAngle
 */
export default class SVGAngle {
	public static SVG_ANGLETYPE_UNKNOWN = 'unknown';
	public static SVG_ANGLETYPE_UNSPECIFIED = 'unspecified';
	public static SVG_ANGLETYPE_DEG = '0deg';
	public static SVG_ANGLETYPE_RAD = '0rad';
	public static SVG_ANGLETYPE_GRAD = '0grad';

	public unitType: string = '';
	public value: number = 0;
	public valueInSpecifiedUnits: number = 0;
	public valueAsString: string = '';

	/**
	 * New value specific units.
	 */
	public newValueSpecifiedUnits(): void {}

	/**
	 * Convert to specific units.
	 */
	public convertToSpecifiedUnits(): void {}
}
