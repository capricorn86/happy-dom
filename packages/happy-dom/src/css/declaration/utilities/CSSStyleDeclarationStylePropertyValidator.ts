const COLOR_REGEXP =
	/^#([0-9a-fA-F]{3,4}){1,2}$|^rgb\(([^)]*)\)$|^rgba\(([^)]*)\)$|^hsla?\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*(,\s*(-?\d+|-?\d*.\d+)\s*)?\)/;

const SIZE_REGEXP =
	/^(0|[-+]?[0-9]*\.?[0-9]+(in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch))$|^[-+]?[0-9]*\.?[0-9]+%$/;
const URL_REGEXP = /^url\(\s*([^)]*)\s*\)$/;
const RECT_REGEXP = /^rect\((.*)\)$/i;
const BORDER_STYLE = [
	'none',
	'hidden',
	'dotted',
	'dashed',
	'solid',
	'double',
	'groove',
	'ridge',
	'inset',
	'outset'
];
const BORDER_COLLAPSE = ['separate', 'collapse', 'initial', 'inherit'];
const BACKGROUND_REPEAT = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'inherit'];
const BACKGROUND_ATTACHMENT = ['scroll', 'fixed', 'inherit'];
const BACKGROUND_POSITIONS = ['top', 'center', 'bottom', 'left', 'right', 'inherit'];
const CLEAR = ['none', 'left', 'right', 'both', 'inherit'];
const FLOAT = ['none', 'left', 'right', 'inherit'];

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationStylePropertyValidator {
	/**
	 * Validates size.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateSize(value: string): boolean {
		return SIZE_REGEXP.test(value);
	}

	/**
	 * Validates integer.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateInteger(value: string): boolean {
		return !isNaN(parseInt(value));
	}

	/**
	 * Validates color.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateColor(value: string): boolean {
		return COLOR_REGEXP.test(value);
	}

	/**
	 * Validates URL.
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/parsers.js#L222
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateURL(value: string): boolean {
		if (!value || value === 'none' || value === 'inherit') {
			return false;
		}

		const result = URL_REGEXP.exec(value);

		if (!result) {
			return false;
		}

		let url = result[1];

		if ((url[0] === '"' || url[0] === "'") && url[0] !== url[url.length - 1]) {
			return false;
		}

		if (url[0] === '"' || url[0] === "'") {
			url = url.substring(1, url.length - 1);
		}

		for (let i = 0; i < url.length; i++) {
			switch (url[i]) {
				case '(':
				case ')':
				case ' ':
				case '\t':
				case '\n':
				case "'":
				case '"':
					return false;
				case '\\':
					i++;
					break;
			}
		}

		return true;
	}

	/**
	 * Validates border style.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateBorderStyle(value: string): boolean {
		return BORDER_STYLE.includes(value.toLowerCase());
	}

	/**
	 * Validates border collapse.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateBorderCollapse(value: string): boolean {
		return BORDER_COLLAPSE.includes(value.toLowerCase());
	}

	/**
	 * Validates background repeat.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateBackgroundRepeat(value: string): boolean {
		return BACKGROUND_REPEAT.includes(value.toLowerCase());
	}

	/**
	 * Validates background attachment.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateBackgroundAttachment(value: string): boolean {
		return BACKGROUND_ATTACHMENT.includes(value.toLowerCase());
	}

	/**
	 * Validates URL.
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/properties/backgroundPosition.js
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateBackgroundPosition(value: string): boolean {
		if (!value) {
			return false;
		}
		const parts = value.split(/\s+/);
		if (parts.length > 2 || parts.length < 1) {
			return false;
		}
		if (parts.length === 1) {
			if (this.validateSize(parts[0])) {
				return true;
			}
			if (parts[0]) {
				if (BACKGROUND_POSITIONS.includes(value.toLowerCase())) {
					return true;
				}
			}
			return false;
		}
		if (this.validateSize(parts[0]) && this.validateSize(parts[1])) {
			return true;
		}
		if (
			BACKGROUND_POSITIONS.includes(parts[0].toLowerCase()) &&
			BACKGROUND_POSITIONS.includes(parts[1].toLowerCase())
		) {
			return true;
		}
		return false;
	}

	/**
	 * Validates clear.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateClear(value: string): boolean {
		return CLEAR.includes(value.toLowerCase());
	}

	/**
	 * Validates clip
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/properties/clip.js
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateClip(value: string): boolean {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto' || lowerValue === 'initial' || lowerValue === 'inherit') {
			return true;
		}
		const matches = lowerValue.match(RECT_REGEXP);
		if (!matches) {
			return false;
		}
		const parts = matches[1].split(/\s*,\s*/);
		if (parts.length !== 4) {
			return false;
		}
		for (const part of parts) {
			if (!this.validateSize(part)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Validates float.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateFloat(value: string): boolean {
		return FLOAT.includes(value.toLowerCase());
	}
}
