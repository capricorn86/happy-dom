const COLOR_REGEXP =
	/^#([0-9a-fA-F]{3,4}){1,2}$|^rgb\(([^)]*)\)$|^rgba\(([^)]*)\)$|^hsla?\(\s*(-?\d+|-?\d*.\d+)\s*,\s*(-?\d+|-?\d*.\d+)%\s*,\s*(-?\d+|-?\d*.\d+)%\s*(,\s*(-?\d+|-?\d*.\d+)\s*)?\)/;

const LENGTH_REGEXP = /^(0|[-+]?[0-9]*\.?[0-9]+(in|cm|em|mm|pt|pc|px|ex|rem|vh|vw|ch))$/;
const PERCENTAGE_REGEXP = /^[-+]?[0-9]*\.?[0-9]+%$/;
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
const BORDER_WIDTH = ['thin', 'medium', 'thick', 'inherit', 'initial', 'unset', 'revert'];
const BORDER_COLLAPSE = ['separate', 'collapse', 'initial', 'inherit'];
const BACKGROUND_REPEAT = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'inherit'];
const BACKGROUND_ATTACHMENT = ['scroll', 'fixed', 'inherit'];
const BACKGROUND_POSITION = ['top', 'center', 'bottom', 'left', 'right'];
const FLEX_BASIS = [
	'auto',
	'fill',
	'max-content',
	'min-content',
	'fit-content',
	'content',
	'inherit',
	'initial',
	'revert',
	'unset'
];
const CLEAR = ['none', 'left', 'right', 'both', 'inherit'];
const FLOAT = ['none', 'left', 'right', 'inherit'];
const FONT_SIZE = [
	'xx-small',
	'x-small',
	'small',
	'medium',
	'large',
	'x-large',
	'xx-large',
	'xxx-large',
	'smaller',
	'larger',
	'inherit',
	'initial',
	'revert',
	'unset'
];

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationValueParser {
	/**
	 * Returns length.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getLength(value: string): string {
		if (value === '0') {
			return '0px';
		}
		if (LENGTH_REGEXP.test(value)) {
			return value;
		}
		return null;
	}

	/**
	 * Returns percentance.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getPercentage(value: string): string {
		if (value === '0') {
			return '0%';
		}
		if (PERCENTAGE_REGEXP.test(value)) {
			return value;
		}
		return null;
	}

	/**
	 * Returns measurement.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getMeasurement(value: string): string {
		const lowerValue = value.toLowerCase();
		if (
			lowerValue === 'inherit' ||
			lowerValue === 'initial' ||
			lowerValue === 'revert' ||
			lowerValue === 'unset'
		) {
			return lowerValue;
		}

		return this.getLength(value) || this.getPercentage(value);
	}

	/**
	 * Returns measurement or auto.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getMeasurementOrAuto(value: string): string {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto') {
			return lowerValue;
		}
		return this.getMeasurement(value);
	}

	/**
	 * Returns integer.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getInteger(value: string): string {
		if (!isNaN(parseInt(value))) {
			return value;
		}
		return null;
	}

	/**
	 * Returns color.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getColor(value: string): string {
		if (COLOR_REGEXP.test(value)) {
			return value;
		}
		return null;
	}

	/**
	 * Returns URL.
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/parsers.js#L222
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getURL(value: string): string {
		if (!value) {
			return null;
		}

		const lowerValue = value.toLowerCase();

		if (lowerValue === 'none' || lowerValue === 'inherit') {
			return lowerValue;
		}

		const result = URL_REGEXP.exec(value);

		if (!result) {
			return null;
		}

		let url = result[1];

		if ((url[0] === '"' || url[0] === "'") && url[0] !== url[url.length - 1]) {
			return null;
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
					return null;
				case '\\':
					i++;
					break;
			}
		}

		return value;
	}

	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getBorderStyle(value: string): string {
		const lowerValue = value.toLowerCase();
		if (BORDER_STYLE.includes(lowerValue)) {
			return lowerValue;
		}
		return null;
	}

	/**
	 * Returns border collapse.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getBorderCollapse(value: string): string {
		const lowerValue = value.toLowerCase();
		if (BORDER_COLLAPSE.includes(lowerValue)) {
			return lowerValue;
		}
		return null;
	}

	/**
	 * Returns background repeat.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getBackgroundRepeat(value: string): string {
		const lowerValue = value.toLowerCase();
		if (BACKGROUND_REPEAT.includes(lowerValue)) {
			return lowerValue;
		}
		return null;
	}

	/**
	 * Returns background attachment.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getBackgroundAttachment(value: string): string {
		const lowerValue = value.toLowerCase();
		if (BACKGROUND_ATTACHMENT.includes(lowerValue)) {
			return lowerValue;
		}
		return null;
	}

	/**
	 * Returns URL.
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/properties/backgroundPosition.js
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getBackgroundPosition(value: string): string {
		if (!value) {
			return null;
		}
		const parts = value.split(/\s+/);
		if (parts.length > 2 || parts.length < 1) {
			return null;
		}
		if (parts.length === 1) {
			if (this.getLength(parts[0])) {
				return value;
			}
			if (parts[0]) {
				const lowerValue = value.toLowerCase();
				if (BACKGROUND_POSITION.includes(lowerValue) || lowerValue === 'inherit') {
					return lowerValue;
				}
			}
			return null;
		}
		if (
			(this.getLength(parts[0]) || this.getPercentage(parts[0])) &&
			(this.getLength(parts[1]) || this.getPercentage(parts[1]))
		) {
			return value.toLowerCase();
		}
		if (
			BACKGROUND_POSITION.includes(parts[0].toLowerCase()) &&
			BACKGROUND_POSITION.includes(parts[1].toLowerCase())
		) {
			return `${parts[0].toLowerCase()} ${parts[1].toLowerCase()}`;
		}
		return null;
	}

	/**
	 * Returns flex basis.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getFlexBasis(value: string): string {
		const lowerValue = value.toLowerCase();
		if (FLEX_BASIS.includes(lowerValue)) {
			return lowerValue;
		}
		return this.getLength(value);
	}

	/**
	 * Returns margin.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getMargin(value: string): string {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto') {
			return lowerValue;
		}
		return this.getMeasurement(value);
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getBorderWidth(value: string): string {
		const lowerValue = value.toLowerCase();
		if (BORDER_WIDTH.includes(lowerValue)) {
			return lowerValue;
		}
		return this.getLength(value);
	}

	/**
	 * Returns clear.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getClear(value: string): string {
		const lowerValue = value.toLowerCase();
		if (CLEAR.includes(lowerValue)) {
			return lowerValue;
		}
		return null;
	}

	/**
	 * Returns clip
	 *
	 * Based on:
	 * https://github.com/jsdom/cssstyle/blob/master/lib/properties/clip.js
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getClip(value: string): string {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto' || lowerValue === 'initial' || lowerValue === 'inherit') {
			return lowerValue;
		}
		const matches = lowerValue.match(RECT_REGEXP);
		if (!matches) {
			return null;
		}
		const parts = matches[1].split(/\s*,\s*/);
		if (parts.length !== 4) {
			return null;
		}
		for (const part of parts) {
			if (!this.getMeasurement(part)) {
				return null;
			}
		}
		return value;
	}

	/**
	 * Returns float.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getFloat(value: string): string {
		const lowerValue = value.toLowerCase();
		if (FLOAT.includes(lowerValue)) {
			return lowerValue;
		}
		return null;
	}

	/**
	 * Returns font size.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getFontSize(value: string): string {
		const lowerValue = value.toLowerCase();
		if (FONT_SIZE.includes(lowerValue)) {
			return lowerValue;
		}
		return this.getLength(value) || this.getPercentage(value);
	}
}
