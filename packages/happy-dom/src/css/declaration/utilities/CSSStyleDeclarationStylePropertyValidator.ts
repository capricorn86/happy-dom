const COLOR_REGEXP =
	/^#([0-9a-fA-F]{3,4}){1,2}$|^rgb\(([^)]*)\)$|^rgba\(([^)]*)\)$|^hsla?\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*(,\s*(-?\d+|-?\d*.\d+)\s*)?\)/;

const SIZE_REGEXP =
	/^(0|[-+]?[0-9]*\.?[0-9]+(in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch))$|^[-+]?[0-9]*\.?[0-9]+%$/;
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
const BACKGROUND_REPEAT = [
    'repeat',
	'repeat-x',
	'repeat-y',
	'no-repeat',
	'inherit'
];
const BACKGROUND_ATTACHMENT = [
    'scroll',
	'fixed',
	'inherit'
];

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
	 * Validates color.
	 *
	 * @param value Value.
	 * @returns "true" if valid.
	 */
	public static validateColor(value: string): boolean {
		return COLOR_REGEXP.test(value);
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
}
