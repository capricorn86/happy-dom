/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertyValidator {
	/**
	 * Validates size.
	 *
	 * @param _value Value.
	 * @returns "true" if valid.
	 */
	public static validateSize(_value: string): boolean {
		return true;
	}

	/**
	 * Validates color.
	 *
	 * @param _value Value.
	 * @returns "true" if valid.
	 */
	public static validateColor(_value: string): boolean {
		return true;
	}
}
