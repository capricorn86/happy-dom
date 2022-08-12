import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';

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
export default class CSSStyleDeclarationPropertyValueParser {
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
	public static getMarginValue(value: string): string {
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

	/**
	 * Returns border.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorder(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const borderWidth = parts[0] ? this.getBorderWidth(parts[0]) : '';
		const borderStyle = parts[1] ? this.getBorderStyle(parts[1]) : '';
		const borderColor = parts[2] ? this.getColor(parts[2]) : '';

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			return {
				['border-top-width']: { important, value: borderWidth },
				['border-top-style']: { important, value: borderStyle },
				['border-top-color']: { important, value: borderColor },
				['border-right-width']: { important, value: borderWidth },
				['border-right-style']: { important, value: borderStyle },
				['border-right-color']: { important, value: borderColor },
				['border-bottom-width']: { important, value: borderWidth },
				['border-bottom-style']: { important, value: borderStyle },
				['border-bottom-color']: { important, value: borderColor },
				['border-left-width']: { important, value: borderWidth },
				['border-left-style']: { important, value: borderStyle },
				['border-left-color']: { important, value: borderColor }
			};
		}

		return null;
	}

	/**
	 * Returns border radius.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const topLeft = parts[0] ? this.getMeasurement(parts[0]) : '';
		const topRight = parts[1] ? this.getMeasurement(parts[1]) : '';
		const bottomRight = parts[2] ? this.getMeasurement(parts[2]) : '';
		const bottomLeft = parts[3] ? this.getMeasurement(parts[3]) : '';
		const propertyValues = {};

		if (topLeft) {
			propertyValues['border-top-left-radius'] = { important, value: topLeft };
		}
		if (topLeft && topRight) {
			propertyValues['border-top-right-radius'] = { important, value: topRight };
		}
		if (topLeft && topRight && bottomRight) {
			propertyValues['border-bottom-right-radius'] = { important, value: bottomRight };
		}
		if (topLeft && topRight && bottomRight && bottomLeft) {
			propertyValues['border-bottom-left-radius'] = { important, value: bottomLeft };
		}

		return topLeft ? propertyValues : null;
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderTop(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderPosition('border-top', value, important);
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderRight(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderPosition('border-top', value, important);
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderBottom(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderPosition('border-top', value, important);
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderLeft(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		return this.getBorderPosition('border-top', value, important);
	}

	/**
	 * Returns padding.
	 *
	 * @param value Value.
	 * @param important Important.
	 */
	public static getPadding(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const top = parts[0] ? this.getMeasurement(parts[0]) : '';
		const right = parts[1] ? this.getMeasurement(parts[1]) : '';
		const bottom = parts[2] ? this.getMeasurement(parts[2]) : '';
		const left = parts[3] ? this.getMeasurement(parts[3]) : '';
		const propertyValues = {};

		if (top) {
			propertyValues['padding-top'] = { important, value: top };
		}
		if (top && right) {
			propertyValues['padding-right'] = { important, value: right };
		}
		if (top && right && bottom) {
			propertyValues['padding-bottom'] = { important, value: bottom };
		}
		if (top && right && bottom && left) {
			propertyValues['padding-left'] = { important, value: left };
		}

		return top ? propertyValues : null;
	}

	/**
	 * Returns margin.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMargin(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const top = parts[0] ? this.getMargin(parts[0]) : '';
		const right = parts[1] ? this.getMargin(parts[1]) : '';
		const bottom = parts[2] ? this.getMargin(parts[2]) : '';
		const left = parts[3] ? this.getMargin(parts[3]) : '';
		const propertyValues = {};

		if (top) {
			propertyValues['margin-top'] = { important, value: top };
		}
		if (top && right) {
			propertyValues['margin-right'] = { important, value: right };
		}
		if (top && right && bottom) {
			propertyValues['margin-bottom'] = { important, value: bottom };
		}
		if (top && right && bottom && left) {
			propertyValues['margin-left'] = { important, value: left };
		}

		return top ? propertyValues : null;
	}

	/**
	 * Returns flex.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	public static getFlex(name: string, value: string, important: boolean): void {
		const lowerValue = value.trim().toLowerCase();

		switch (lowerValue) {
			case 'none':
				this.properties['flex-grow'] = { important, value: '0' };
				this.properties['flex-shrink'] = { important, value: '0' };
				this.properties['flex-basis'] = { important, value: 'auto' };
				return;
			case 'auto':
				this.properties['flex-grow'] = { important, value: '1' };
				this.properties['flex-shrink'] = { important, value: '1' };
				this.properties['flex-basis'] = { important, value: 'auto' };
				return;
			case 'initial':
				this.properties['flex-grow'] = { important, value: '0' };
				this.properties['flex-shrink'] = { important, value: '0' };
				this.properties['flex-basis'] = { important, value: 'auto' };
				return;
			case 'inherit':
				this.properties['flex-grow'] = { important, value: 'inherit' };
				this.properties['flex-shrink'] = { important, value: 'inherit' };
				this.properties['flex-basis'] = { important, value: 'inherit' };
				return;
		}

		const parts = value.split(/ +/);
		const flexGrow = parts[0] ? this.getInteger(parts[0]) : '';
		const flexShrink = parts[1] ? this.getInteger(parts[1]) : '';
		const flexBasis = parts[2] ? this.getFlexBasis(parts[2]) : '';

		if (flexGrow && flexShrink && flexBasis) {
			this.properties['flex-grow'] = { important, value: flexGrow };
			this.properties['flex-shrink'] = { important, value: flexShrink };
			this.properties['flex-basis'] = { important, value: flexBasis };
		}
	}

	/**
	 * Returns background.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 */
	public static getBackground(name: string, value: string, important: boolean): void {
		const parts = value.split(/ +/);

		if (!parts[0]) {
			return;
		}

		// First value can be image if color is not specified.
		if (!this.getColor(parts[0])) {
			parts.unshift('');
		}

		const color = parts[0] ? this.getColor(parts[0]) : '';
		const image = parts[1] ? this.getURL(parts[1]) : '';
		const repeat = parts[2] ? this.getBackgroundRepeat(parts[2]) : '';
		const attachment = parts[3] ? this.getBackgroundAttachment(parts[3]) : '';
		const position = parts[4] ? this.getBackgroundPosition(parts[4]) : '';

		if ((color || image) && repeat !== null && attachment !== null && position !== null) {
			if (color) {
				this.properties['background-color'] = { important, value: color };
			}
			if (image) {
				this.properties['background-image'] = { important, value: image };
			}
			this.properties['background-repeat'] = { important, value: repeat };
			this.properties['background-attachment'] = { important, value: attachment };
			this.properties['background-position'] = { important, value: position };
		}
	}

	/**
	 * Returns border top, right, bottom or left.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 * @returns Property value.
	 */
	private static getBorderPosition(
		name: string,
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);
		const borderWidth = parts[0] ? this.getBorderWidth(parts[0]) : '';
		const borderStyle = parts[1] ? this.getBorderStyle(parts[1]) : '';
		const borderColor = parts[2] ? this.getColor(parts[2]) : '';
		const borderName = name.split('-')[1];

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			return {
				[`border-${borderName}-width`]: { important, value: borderWidth },
				[`border-${borderName}-style`]: { important, value: borderStyle },
				[`border-${borderName}-color`]: { important, value: borderColor }
			};
		}

		return null;
	}

	/**
	 * Returns margin.
	 *
	 * @param value Value.
	 * @returns Parsed value.
	 */
	public static getMarginValue(value: string): string {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto') {
			return lowerValue;
		}
		return this.getMeasurement(value);
	}
}
