const NEW_LINES_REGEXP = /[\n\r]/gm;

/**
 * HTML select element value sanitizer.
 */
export default class HTMLOptionElementValueSanitizer {
	/**
	 * Sanitizes a value.
	 *
	 * @param value Value.
	 */
	public static sanitize(value: string): string {
		return value.trim().replace(NEW_LINES_REGEXP, '');
	}
}
