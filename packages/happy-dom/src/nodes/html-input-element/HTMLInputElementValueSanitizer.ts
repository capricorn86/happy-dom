import HTMLInputElement from './HTMLInputElement';

const NEW_LINES_REGEXP = /[\n\r]/gm;

/**
 * HTML input element value sanitizer.
 */
export default class HTMLInputElementValueSanitizer {
	/**
	 * Sanitizes a value.
	 *
	 * @param input Input.
	 * @param value Value.
	 */
	public static sanitize(input: HTMLInputElement, value: string): string {
		switch (input.type) {
			case 'password':
			case 'search':
			case 'tel':
			case 'text':
				return value.replace(NEW_LINES_REGEXP, '');
			case 'color':
				// https://html.spec.whatwg.org/multipage/forms.html#color-state-(type=color):value-sanitization-algorithm
				return /^#[a-fA-F\d]{6}$/.test(value) ? value.toLowerCase() : '#000000';
			case 'email':
				// https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email):value-sanitization-algorithm
				// https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-(type=email):value-sanitization-algorithm-2
				if (input.multiple) {
					return value
						.split(',')
						.map((token) => token.trim())
						.join(',');
				}
				return value.trim().replace(NEW_LINES_REGEXP, '');
			case 'number':
				// https://html.spec.whatwg.org/multipage/input.html#number-state-(type=number):value-sanitization-algorithm
				return !isNaN(Number.parseFloat(value)) ? value : '';
			case 'range':
				// https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range):value-sanitization-algorithm
				const number = Number.parseFloat(value);
				const min = parseFloat(input.min) || 0;
				const max = parseFloat(input.max) || 100;

				if (isNaN(number)) {
					return max < min ? String(min) : String((min + max) / 2);
				} else if (number < min) {
					return String(min);
				} else if (number > max) {
					return String(max);
				}

				return value;
			case 'url':
				// https://html.spec.whatwg.org/multipage/forms.html#url-state-(type=url):value-sanitization-algorithm
				return value.trim().replace(NEW_LINES_REGEXP, '');
		}

		return value;
	}
}
