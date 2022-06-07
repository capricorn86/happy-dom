const NEW_LINES_REGEXP = /[\n\r]/gm;

/**
 * HTML select element value sanitizer.
 */
export default class HTMLSelectElementValueSanitizer {
	/**
	 * Sanitizes a value.
	 *
	 * @param value Value.
	 */
	public static sanitize(value: string): string {
		return value.replace(NEW_LINES_REGEXP, '');
	}
}
