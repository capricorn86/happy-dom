/**
 * SVG length.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGLength
 */
export default class SVGLength {
	public static SVG_LENGTHTYPE_UNKNOWN = 0;
	public static SVG_LENGTHTYPE_NUMBER = 1;
	public static SVG_LENGTHTYPE_PERCENTAGE = 2;
	public static SVG_LENGTHTYPE_EMS = 3;
	public static SVG_LENGTHTYPE_EXS = 4;
	public static SVG_LENGTHTYPE_PX = 5;
	public static SVG_LENGTHTYPE_CM = 6;
	public static SVG_LENGTHTYPE_MM = 7;
	public static SVG_LENGTHTYPE_IN = 8;
	public static SVG_LENGTHTYPE_PT = 9;
	public static SVG_LENGTHTYPE_PC = 10;
	public unitType = '';
	public value = 0;
	public valueInSpecifiedUnits = 0;
	public valueAsString = '';

	/**
	 * New value specific units.
	 */
	public newValueSpecifiedUnits(): void {}

	/**
	 * Convert to specific units.
	 */
	public convertToSpecifiedUnits(): void {}
}
