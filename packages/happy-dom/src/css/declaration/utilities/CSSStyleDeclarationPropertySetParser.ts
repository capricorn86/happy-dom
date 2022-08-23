import CSSStyleDeclarationValueParser from './CSSStyleDeclarationValueParser';
import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';

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
const BORDER_WIDTH = ['thin', 'medium', 'thick'];
const BORDER_COLLAPSE = ['separate', 'collapse'];
const BACKGROUND_REPEAT = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'];
const BACKGROUND_ATTACHMENT = ['scroll', 'fixed'];
const BACKGROUND_POSITION = ['top', 'center', 'bottom', 'left', 'right'];
const FLEX_BASIS = ['auto', 'fill', 'max-content', 'min-content', 'fit-content', 'content'];
const CLEAR = ['none', 'left', 'right', 'both'];
const FLOAT = ['none', 'left', 'right'];
const SYSTEM_FONT = ['caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar'];
const FONT_WEIGHT = ['normal', 'bold', 'bolder', 'lighter'];
const FONT_STYLE = ['normal', 'italic', 'oblique'];
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
	'larger'
];
const FONT_STRETCH = [
	'ultra-condensed',
	'extra-condensed',
	'condensed',
	'semi-condensed',
	'normal',
	'semi-expanded',
	'expanded',
	'extra-expanded',
	'ultra-expanded'
];

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertySetParser {
	/**
	 * Returns border collapse.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderCollapse(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BORDER_COLLAPSE.includes(lowerValue)) {
			return { 'border-collapse': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns background repeat.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundRepeat(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BACKGROUND_REPEAT.includes(lowerValue)) {
			return { 'background-repeat': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns background attachment.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundAttachment(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BACKGROUND_ATTACHMENT.includes(lowerValue)) {
			return { 'background-attachment': { value: lowerValue, important } };
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
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundPosition(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		if (!value) {
			return null;
		}
		const parts = value.split(/\s+/);
		if (parts.length > 2 || parts.length < 1) {
			return null;
		}
		if (parts.length === 1) {
			if (CSSStyleDeclarationValueParser.getLength(parts[0])) {
				return { 'background-position': { value, important } };
			}
			if (parts[0]) {
				const lowerValue = value.toLowerCase();
				if (BACKGROUND_POSITION.includes(lowerValue) || lowerValue === 'inherit') {
					return { 'background-position': { value: lowerValue, important } };
				}
			}
			return null;
		}
		if (
			(CSSStyleDeclarationValueParser.getLength(parts[0]) ||
				CSSStyleDeclarationValueParser.getPercentage(parts[0])) &&
			(CSSStyleDeclarationValueParser.getLength(parts[1]) ||
				CSSStyleDeclarationValueParser.getPercentage(parts[1]))
		) {
			return { 'background-position': { value: value.toLowerCase(), important } };
		}
		if (
			BACKGROUND_POSITION.includes(parts[0].toLowerCase()) &&
			BACKGROUND_POSITION.includes(parts[1].toLowerCase())
		) {
			return {
				'background-position': {
					value: `${parts[0].toLowerCase()} ${parts[1].toLowerCase()}`,
					important
				}
			};
		}
		return null;
	}

	/**
	 * Returns top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getTop(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parsedValue = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return parsedValue ? { top: { value: parsedValue, important } } : null;
	}

	/**
	 * Returns top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getRight(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parsedValue = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return parsedValue ? { right: { value: parsedValue, important } } : null;
	}

	/**
	 * Returns top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBottom(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parsedValue = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return parsedValue ? { bottom: { value: parsedValue, important } } : null;
	}

	/**
	 * Returns top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getLeft(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parsedValue = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return parsedValue ? { left: { value: parsedValue, important } } : null;
	}

	/**
	 * Returns clear.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getClear(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (CLEAR.includes(lowerValue)) {
			return { clear: { value: lowerValue, important } };
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
	 * @param important Important.
	 * @returns Property values
	 */
	public static getClip(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (lowerValue === 'auto' || lowerValue === 'initial' || lowerValue === 'inherit') {
			return { clip: { value: lowerValue, important } };
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
			if (!CSSStyleDeclarationValueParser.getMeasurement(part)) {
				return null;
			}
		}
		return { clip: { value, important } };
	}

	/**
	 * Returns float.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFloat(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FLOAT.includes(lowerValue)) {
			return { float: { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns float.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getCSSFloat(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const float = this.getFloat(value, important);
		return float ? { 'css-float': float['float'] } : null;
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
		const borderWidth = parts[0] ? this.getBorderWidth(parts[0], important) : '';
		const borderStyle = parts[1] ? this.getBorderStyle(parts[1], important) : '';
		const borderColor = parts[2] ? this.getBorderColor(parts[2], important) : '';
		const properties = {};

		if (borderWidth) {
			Object.assign(properties, borderWidth);
		}

		if (borderStyle) {
			Object.assign(properties, borderStyle);
		}

		if (borderColor) {
			Object.assign(properties, borderColor);
		}

		return borderWidth && borderStyle !== null && borderColor !== null ? properties : null;
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BORDER_WIDTH.includes(lowerValue)) {
			return {
				'border-top-width': { value: lowerValue, important },
				'border-right-width': { value: lowerValue, important },
				'border-bottom-width': { value: lowerValue, important },
				'border-left-width': { value: lowerValue, important }
			};
		}
		const length = CSSStyleDeclarationValueParser.getLength(value);
		return length
			? {
					'border-top-width': { value: length, important },
					'border-right-width': { value: length, important },
					'border-bottom-width': { value: length, important },
					'border-left-width': { value: length, important }
			  }
			: null;
	}
	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (BORDER_STYLE.includes(lowerValue)) {
			return {
				'border-top-style': { value: lowerValue, important },
				'border-right-style': { value: lowerValue, important },
				'border-bottom-style': { value: lowerValue, important },
				'border-left-style': { value: lowerValue, important }
			};
		}
		return null;
	}

	/**
	 * Returns border color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderColor(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const color = CSSStyleDeclarationValueParser.getColor(value);
		return color
			? {
					'border-top-color': { value: color, important },
					'border-right-color': { value: color, important },
					'border-bottom-color': { value: color, important },
					'border-left-color': { value: color, important }
			  }
			: null;
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderTopWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderWidth = this.getBorderWidth(value, important);
		return borderWidth ? { 'border-top-width': borderWidth['border-top-width'] } : null;
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderRightWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderWidth = this.getBorderWidth(value, important);
		return borderWidth ? { 'border-right-width': borderWidth['border-right-width'] } : null;
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderBottomWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderWidth = this.getBorderWidth(value, important);
		return borderWidth ? { 'border-bottom-width': borderWidth['border-bottom-width'] } : null;
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderLeftWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderWidth = this.getBorderWidth(value, important);
		return borderWidth ? { 'border-left-width': borderWidth['border-left-width'] } : null;
	}

	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderTopStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderStyle = this.getBorderStyle(value, important);
		return borderStyle ? { 'border-top-style': borderStyle['border-top-style'] } : null;
	}

	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderRightStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderStyle = this.getBorderStyle(value, important);
		return borderStyle ? { 'border-right-style': borderStyle['border-right-style'] } : null;
	}

	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderBottomStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderStyle = this.getBorderStyle(value, important);
		return borderStyle ? { 'border-bottom-style': borderStyle['border-bottom-style'] } : null;
	}

	/**
	 * Returns border style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderLeftStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderStyle = this.getBorderStyle(value, important);
		return borderStyle ? { 'border-left-style': borderStyle['border-left-style'] } : null;
	}

	/**
	 * Returns border color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderTopColor(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderColor = this.getBorderColor(value, important);
		return borderColor ? { 'border-top-color': borderColor['border-top-color'] } : null;
	}

	/**
	 * Returns border color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderRightColor(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderColor = this.getBorderColor(value, important);
		return borderColor ? { 'border-right-color': borderColor['border-right-color'] } : null;
	}

	/**
	 * Returns border color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderBottomColor(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderColor = this.getBorderColor(value, important);
		return borderColor ? { 'border-bottom-color': borderColor['border-bottom-color'] } : null;
	}

	/**
	 * Returns border color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderLeftColor(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const borderColor = this.getBorderColor(value, important);
		return borderColor ? { 'border-left-color': borderColor['border-left-color'] } : null;
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
		const topLeft = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		const topRight = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		const bottomRight = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		const bottomLeft = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';
		const properties = {};

		properties['border-top-left-radius'] = { important, value: topLeft };
		properties['border-top-right-radius'] = { important, value: topRight || topLeft };
		properties['border-bottom-right-radius'] = { important, value: bottomRight || topLeft };
		properties['border-bottom-left-radius'] = {
			important,
			value: bottomLeft || topRight || topLeft
		};

		return topLeft && topRight !== null && bottomRight !== null && bottomLeft !== null
			? properties
			: null;
	}

	/**
	 * Returns border radius.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderTopLeftRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const radius = this.getBorderRadius(value, important);
		return radius ? { 'border-top-left-radius': radius['border-top-left-radius'] } : null;
	}

	/**
	 * Returns border radius.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderTopRightRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const radius = this.getBorderRadius(value, important);
		return radius ? { 'border-top-right-radius': radius['border-top-right-radius'] } : null;
	}

	/**
	 * Returns border radius.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderBottomRightRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const radius = this.getBorderRadius(value, important);
		return radius ? { 'border-bottom-right-radius': radius['border-bottom-right-radius'] } : null;
	}

	/**
	 * Returns border radius.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBorderBottomLeftRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const radius = this.getBorderRadius(value, important);
		return radius ? { 'border-bottom-left-radius': radius['border-bottom-left-radius'] } : null;
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
		const border = this.getBorder(value, important);
		return border
			? {
					'border-top-width': border['border-top-width'],
					'border-top-style': border['border-top-style'],
					'border-top-color': border['border-top-color']
			  }
			: null;
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
		const border = this.getBorder(value, important);
		return border
			? {
					'border-right-width': border['border-right-width'],
					'border-right-style': border['border-right-style'],
					'border-right-color': border['border-right-color']
			  }
			: null;
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
		const border = this.getBorder(value, important);
		return border
			? {
					'border-bottom-width': border['border-bottom-width'],
					'border-bottom-style': border['border-bottom-style'],
					'border-bottom-color': border['border-bottom-color']
			  }
			: null;
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
		const border = this.getBorder(value, important);
		return border
			? {
					'border-left-width': border['border-left-width'],
					'border-left-style': border['border-left-style'],
					'border-left-color': border['border-left-color']
			  }
			: null;
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
		const top = parts[0] ? CSSStyleDeclarationValueParser.getMeasurement(parts[0]) : '';
		const right = parts[1] ? CSSStyleDeclarationValueParser.getMeasurement(parts[1]) : '';
		const bottom = parts[2] ? CSSStyleDeclarationValueParser.getMeasurement(parts[2]) : '';
		const left = parts[3] ? CSSStyleDeclarationValueParser.getMeasurement(parts[3]) : '';
		const properties = {};

		properties['padding-top'] = { important, value: top };
		properties['padding-right'] = { important, value: right || top };
		properties['padding-bottom'] = { important, value: bottom || top };
		properties['padding-left'] = { important, value: left || right || top };

		return top && right !== null && bottom !== null && left !== null ? properties : null;
	}

	/**
	 * Returns padding top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingTop(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const padding = CSSStyleDeclarationValueParser.getMeasurement(value);
		return padding ? { 'padding-top': { value: padding, important } } : null;
	}

	/**
	 * Returns padding right.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingRight(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const padding = CSSStyleDeclarationValueParser.getMeasurement(value);
		return padding ? { 'padding-right': { value: padding, important } } : null;
	}

	/**
	 * Returns padding bottom.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingBottom(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const padding = CSSStyleDeclarationValueParser.getMeasurement(value);
		return padding ? { 'padding-bottom': { value: padding, important } } : null;
	}

	/**
	 * Returns padding left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getPaddingLeft(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const padding = CSSStyleDeclarationValueParser.getMeasurement(value);
		return padding ? { 'padding-left': { value: padding, important } } : null;
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
		const top = parts[0] ? CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[0]) : '';
		const right = parts[1] ? CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[1]) : '';
		const bottom = parts[2] ? CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[2]) : '';
		const left = parts[3] ? CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[3]) : '';
		const properties = {};

		properties['margin-top'] = { important, value: top };
		properties['margin-right'] = { important, value: right || top };
		properties['margin-bottom'] = { important, value: bottom || top };
		properties['margin-left'] = { important, value: left || right || top };

		return top && right !== null && bottom !== null && left !== null ? properties : null;
	}

	/**
	 * Returns margin top.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginTop(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const margin = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return margin ? { 'margin-top': { value: margin, important } } : null;
	}

	/**
	 * Returns margin right.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginRight(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const margin = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return margin ? { 'margin-right': { value: margin, important } } : null;
	}

	/**
	 * Returns margin right.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginBottom(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const margin = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return margin ? { 'margin-bottom': { value: margin, important } } : null;
	}

	/**
	 * Returns margin left.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getMarginLeft(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const margin = CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
		return margin ? { 'margin-left': { value: margin, important } } : null;
	}

	/**
	 * Returns flex.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getFlex(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const lowerValue = value.trim().toLowerCase();

		switch (lowerValue) {
			case 'none':
				return {
					'flex-grow': { important, value: '0' },
					'flex-shrink': { important, value: '0' },
					'flex-basis': { important, value: 'auto' }
				};
			case 'auto':
				return {
					'flex-grow': { important, value: '1' },
					'flex-shrink': { important, value: '1' },
					'flex-basis': { important, value: 'auto' }
				};
			case 'initial':
				return {
					'flex-grow': { important, value: '0' },
					'flex-shrink': { important, value: '0' },
					'flex-basis': { important, value: 'auto' }
				};
			case 'inherit':
				return {
					'flex-grow': { important, value: 'inherit' },
					'flex-shrink': { important, value: 'inherit' },
					'flex-basis': { important, value: 'inherit' }
				};
		}

		const parts = value.split(/ +/);
		const flexGrow = parts[0] ? this.getFlexGrow(parts[0], important) : '';
		const flexShrink = parts[1] ? this.getFlexShrink(parts[1], important) : '';
		const flexBasis = parts[2] ? this.getFlexBasis(parts[2], important) : '';

		if (flexGrow && flexShrink && flexBasis) {
			return {
				...flexBasis,
				...flexGrow,
				...flexBasis
			};
		}

		return null;
	}

	/**
	 * Returns flex basis.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFlexBasis(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FLEX_BASIS.includes(lowerValue)) {
			return { 'flex-basis': { value: lowerValue, important } };
		}
		return { 'flex-basis': { value: CSSStyleDeclarationValueParser.getLength(value), important } };
	}

	/**
	 * Returns flex shrink.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFlexShrink(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parsedValue = CSSStyleDeclarationValueParser.getInteger(value);
		return parsedValue ? { 'flex-shrink': { value: parsedValue, important } } : null;
	}

	/**
	 * Returns flex grow.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFlexGrow(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parsedValue = CSSStyleDeclarationValueParser.getInteger(value);
		return parsedValue ? { 'flex-grow': { value: parsedValue, important } } : null;
	}

	/**
	 * Returns background.
	 *
	 * @param name Name.
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values.
	 */
	public static getBackground(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const parts = value.split(/ +/);

		if (!parts[0]) {
			return;
		}

		// First value can be image if color is not specified.
		if (!CSSStyleDeclarationValueParser.getColor(parts[0])) {
			parts.unshift('');
		}

		const color = parts[0] ? this.getBackgroundColor(parts[0], important) : '';
		const image = parts[1] ? this.getBackgroundImage(parts[1], important) : '';
		const repeat = parts[2] ? this.getBackgroundRepeat(parts[2], important) : '';
		const attachment = parts[3] ? this.getBackgroundAttachment(parts[3], important) : '';
		const position = parts[4] ? this.getBackgroundPosition(parts[4], important) : '';
		const properties = {};

		if (color) {
			Object.assign(properties, color);
		}

		if (image) {
			Object.assign(properties, image);
		}

		if (repeat) {
			Object.assign(properties, repeat);
		}

		if (attachment) {
			Object.assign(properties, attachment);
		}

		if (position) {
			Object.assign(properties, position);
		}

		return (color || image) && repeat !== null && attachment !== null && position !== null
			? properties
			: null;
	}

	/**
	 * Returns background color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property value.
	 */
	public static getBackgroundColor(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const color = CSSStyleDeclarationValueParser.getColor(value);

		return color
			? {
					['background-color']: { important, value: color }
			  }
			: null;
	}

	/**
	 * Returns background image.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property value.
	 */
	public static getBackgroundImage(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const image = CSSStyleDeclarationValueParser.getURL(value);

		return image
			? {
					['background-image']: { important, value: image }
			  }
			: null;
	}

	/**
	 * Returns color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property value.
	 */
	public static getColor(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const color = CSSStyleDeclarationValueParser.getColor(value);

		return color
			? {
					['color']: { important, value: color }
			  }
			: null;
	}

	/**
	 * Returns color.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property value.
	 */
	public static getFloodColor(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const color = CSSStyleDeclarationValueParser.getColor(value);

		return color
			? {
					['flood-color']: { important, value: color }
			  }
			: null;
	}

	/**
	 * Returns font.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFont(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (SYSTEM_FONT.includes(lowerValue)) {
			return { font: { value: lowerValue, important } };
		}

		const parts = value.split(/ +/);

		if (parts.length > 0 && this.getFontStyle(parts[0], important)) {
			if (parts[1] && parts[0] === 'oblique' && parts[1].endsWith('deg')) {
				parts[0] += ' ' + parts[1];
				parts.splice(1, 1);
			}
		} else {
			parts.splice(0, 0, '');
		}

		if (parts.length <= 1 || !this.getFontVariant(parts[1], important)) {
			parts.splice(1, 0, '');
		}

		if (parts.length <= 2 || !this.getFontWeight(parts[2], important)) {
			parts.splice(2, 0, '');
		}

		if (parts.length <= 3 || !this.getFontStretch(parts[3], important)) {
			parts.splice(3, 0, '');
		}

		const [fontSizeValue, lineHeightValue] = parts[4].split('/');

		const fontStyle = parts[0] ? this.getFontStyle(parts[0], important) : '';
		const fontVariant = parts[1] ? this.getFontVariant(parts[1], important) : '';
		const fontWeight = parts[2] ? this.getFontWeight(parts[2], important) : '';
		const fontStretch = parts[3] ? this.getFontStretch(parts[3], important) : '';
		const fontSize = fontSizeValue ? this.getFontSize(fontSizeValue, important) : '';
		const lineHeight = lineHeightValue ? this.getLineHeight(lineHeightValue, important) : '';
		const fontFamily = parts[5] ? this.getFontFamily(parts.slice(5).join(' '), important) : '';

		const properties = {};

		if (fontStyle) {
			Object.assign(properties, fontStyle);
		}
		if (fontVariant) {
			Object.assign(properties, fontVariant);
		}
		if (fontWeight) {
			Object.assign(properties, fontWeight);
		}
		if (fontStretch) {
			Object.assign(properties, fontStretch);
		}
		if (fontSize) {
			Object.assign(properties, fontSize);
		}
		if (lineHeight) {
			Object.assign(properties, lineHeight);
		}
		if (fontFamily) {
			Object.assign(properties, fontFamily);
		}

		return fontSize &&
			fontFamily &&
			fontStyle !== null &&
			fontVariant !== null &&
			fontWeight !== null &&
			fontStretch !== null &&
			lineHeight !== null
			? properties
			: null;
	}

	/**
	 * Returns font style.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontStyle(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FONT_STYLE.includes(lowerValue)) {
			return { 'font-style': { value: lowerValue, important } };
		}
		const parts = value.split(/ +/);
		if (parts.length === 2 && parts[0] === 'oblique') {
			const degree = CSSStyleDeclarationValueParser.getDegree(parts[1]);
			return degree ? { 'font-style': { value: lowerValue, important } } : null;
		}
		return null;
	}

	/**
	 * Returns font variant.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontVariant(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		return lowerValue === 'normal' || lowerValue === 'small-caps'
			? { 'font-variant': { value: lowerValue, important } }
			: null;
	}

	/**
	 * Returns font strech.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontStretch(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FONT_STRETCH.includes(lowerValue)) {
			return { 'font-stretch': { value: lowerValue, important } };
		}
		const percentage = CSSStyleDeclarationValueParser.getPercentage(value);
		return percentage ? { 'font-stretch': { value: percentage, important } } : null;
	}

	/**
	 * Returns font weight.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontWeight(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FONT_WEIGHT.includes(lowerValue)) {
			return { 'font-weight': { value: lowerValue, important } };
		}
		const integer = CSSStyleDeclarationValueParser.getInteger(value);
		return integer ? { 'font-weight': { value: integer, important } } : null;
	}

	/**
	 * Returns font size.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontSize(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (FONT_SIZE.includes(lowerValue)) {
			return { 'font-size': { value: lowerValue, important } };
		}
		const measurement = CSSStyleDeclarationValueParser.getMeasurement(value);
		return measurement ? { 'font-size': { value: measurement, important } } : null;
	}

	/**
	 * Returns line height.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getLineHeight(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		if (value.toLowerCase() === 'normal') {
			return { 'line-height': { value: 'normal', important } };
		}
		const lineHeight =
			CSSStyleDeclarationValueParser.getFloat(value) ||
			CSSStyleDeclarationValueParser.getMeasurement(value);
		return lineHeight ? { 'line-height': { value: lineHeight, important } } : null;
	}

	/**
	 * Returns font family.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getFontFamily(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const parts = value.split(',');
		let parsedValue = '';
		for (let i = 0, max = parts.length; i < max; i++) {
			const trimmedPart = parts[i].trim().replace(/[']/g, '"');
			if (!trimmedPart) {
				return null;
			}
			if (i > 0) {
				parsedValue += ', ';
			}
			parsedValue += trimmedPart;
		}
		if (!parsedValue) {
			return null;
		}
		return {
			'font-family': {
				important,
				value: parsedValue
			}
		};
	}
}
