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
const BACKGROUND_ORIGIN = ['border-box', 'padding-box', 'content-box'];
const BACKGROUND_CLIP = ['border-box', 'padding-box', 'content-box'];
const BACKGROUND_ATTACHMENT = ['scroll', 'fixed'];
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

const DISPLAY = [
	/* Legacy values */
	'block',
	'inline',
	'inline-block',
	'flex',
	'inline-flex',
	'grid',
	'inline-grid',
	'flow-root',

	/* Box generation */
	'none',
	'contents',

	/* Two-value syntax */
	'block flow',
	'inline flow',
	'inline flow-root',
	'block flex',
	'inline flex',
	'block grid',
	'inline grid',
	'block flow-root',

	/* Other values */
	'table',
	'table-row',
	'list-item'
];
const BORDER_IMAGE_REPEAT = ['stretch', 'repeat', 'round', 'space'];

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
		if (
			CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			BORDER_COLLAPSE.includes(lowerValue)
		) {
			return { 'border-collapse': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns display.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getDisplay(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || DISPLAY.includes(lowerValue)) {
			return { display: { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns direction.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getDirection(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (
			CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			lowerValue === 'ltr' ||
			lowerValue === 'rtl'
		) {
			return { direction: { value: lowerValue, important } };
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
		const parsedValue =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const parsedValue =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const parsedValue =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const parsedValue =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || CLEAR.includes(lowerValue)) {
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || lowerValue === 'auto') {
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || FLOAT.includes(lowerValue)) {
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
		const float =
			CSSStyleDeclarationValueParser.getGlobal(value) || this.getFloat(value, important);
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getBorderWidth(globalValue, important),
				...this.getBorderStyle(globalValue, important),
				...this.getBorderColor(globalValue, important),
				...this.getBorderImage(globalValue, important)
			};
		}

		const properties = {
			...this.getBorderWidth('initial', important),
			...this.getBorderStyle('initial', important),
			...this.getBorderColor('initial', important),
			...this.getBorderImage('none', important)
		};

		const parts = value.split(/ +/);

		for (const part of parts) {
			const width = this.getBorderWidth(part, important);
			const style = this.getBorderStyle(part, important);
			const color = this.getBorderColor(part, important);

			if (width === null && style === null && color === null) {
				return null;
			}

			Object.assign(properties, width, style, color);
		}

		return properties;
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getBorderTopWidth(globalValue, important),
				...this.getBorderRightWidth(globalValue, important),
				...this.getBorderBottomWidth(globalValue, important),
				...this.getBorderLeftWidth(globalValue, important)
			};
		}

		const parts = value.split(/ +/);
		const top = this.getBorderTopWidth(parts[0], important);
		const right = this.getBorderRightWidth(parts[1] || parts[0], important);
		const bottom = this.getBorderBottomWidth(parts[2] || parts[0], important);
		const left = this.getBorderLeftWidth(parts[3] || parts[1] || parts[0], important);

		if (!top || !right || !bottom || !left) {
			return null;
		}

		return {
			...top,
			...right,
			...bottom,
			...left
		};
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getBorderTopStyle(globalValue, important),
				...this.getBorderRightStyle(globalValue, important),
				...this.getBorderBottomStyle(globalValue, important),
				...this.getBorderLeftStyle(globalValue, important)
			};
		}

		const parts = value.split(/ +/);
		const top = this.getBorderTopStyle(parts[0], important);
		const right = this.getBorderRightStyle(parts[1] || parts[0], important);
		const bottom = this.getBorderBottomStyle(parts[2] || parts[0], important);
		const left = this.getBorderLeftStyle(parts[3] || parts[1] || parts[0], important);

		if (!top || !right || !bottom || !left) {
			return null;
		}

		return {
			...top,
			...right,
			...bottom,
			...left
		};
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getBorderTopColor(globalValue, important),
				...this.getBorderRightColor(globalValue, important),
				...this.getBorderBottomColor(globalValue, important),
				...this.getBorderLeftColor(globalValue, important)
			};
		}

		const parts = value.split(/ +/);
		const top = this.getBorderTopColor(parts[0], important);
		const right = this.getBorderRightColor(parts[1] || parts[0], important);
		const bottom = this.getBorderBottomColor(parts[2] || parts[0], important);
		const left = this.getBorderLeftColor(parts[3] || parts[1] || parts[0], important);

		if (!top || !right || !bottom || !left) {
			return null;
		}

		return {
			...top,
			...right,
			...bottom,
			...left
		};
	}

	/**
	 * Returns border image.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderImage(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getBorderImageSource(globalValue, important),
				...this.getBorderImageSlice(globalValue, important),
				...this.getBorderImageWidth(globalValue, important),
				...this.getBorderImageOutset(globalValue, important),
				...this.getBorderImageRepeat(globalValue, important)
			};
		}

		const parsedValue = value.replace(/[ ]*\/[ ]*/g, '/');
		const parts = parsedValue.split(/ +/);
		const properties = {
			...this.getBorderImageSource('none', important),
			...this.getBorderImageSlice('100%', important),
			...this.getBorderImageWidth('1', important),
			...this.getBorderImageOutset('0', important),
			...this.getBorderImageRepeat('stretch', important)
		};

		for (const part of parts) {
			if (part.includes('/')) {
				const [slice, width, outset] = part.split('/');
				const borderImageSlice = this.getBorderImageSlice(slice, important);
				const borderImageWidth = this.getBorderImageWidth(width, important);
				const borderImageOutset = this.getBorderImageOutset(outset, important);

				if (borderImageSlice === null || borderImageWidth === null || borderImageOutset === null) {
					return null;
				}

				Object.assign(properties, borderImageSlice);
				Object.assign(properties, borderImageWidth);
				Object.assign(properties, borderImageOutset);
			} else {
				const source = this.getBorderImageSource(part, important);
				const repeat = this.getBorderImageRepeat(part, important);

				if (source === null && repeat === null) {
					return null;
				}

				Object.assign(properties, source);
				Object.assign(properties, repeat);
			}
		}

		return properties;
	}

	/**
	 * Returns border source.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderImageSource(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || lowerValue === 'none') {
			return {
				'border-image-source': {
					important,
					value: 'none'
				}
			};
		}

		return {
			'border-image-source': {
				important,
				value:
					CSSStyleDeclarationValueParser.getURL(value) ||
					CSSStyleDeclarationValueParser.getGradient(value)
			}
		};
	}

	/**
	 * Returns border slice.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderImageSlice(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return {
				'border-image-slice': {
					important,
					value: lowerValue
				}
			};
		}

		const parts = lowerValue.split(/ +/);

		for (const part of parts) {
			if (
				part !== 'fill' &&
				!CSSStyleDeclarationValueParser.getPercentage(part) &&
				!CSSStyleDeclarationValueParser.getInteger(part)
			) {
				return null;
			}
		}

		return {
			'border-image-slice': {
				important,
				value: lowerValue
			}
		};
	}

	/**
	 * Returns border width.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderImageWidth(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return {
				'border-image-width': {
					important,
					value: lowerValue
				}
			};
		}

		const parts = lowerValue.split(/ +/);

		for (const part of parts) {
			if (
				!CSSStyleDeclarationValueParser.getInteger(part) &&
				!CSSStyleDeclarationValueParser.getMeasurementOrAuto(part)
			) {
				return null;
			}
		}

		return {
			'border-image-width': {
				important,
				value
			}
		};
	}

	/**
	 * Returns border outset.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderImageOutset(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return {
				'border-image-outset': {
					important,
					value: lowerValue
				}
			};
		}

		const parts = value.split(/ +/);

		for (const part of parts) {
			if (
				!CSSStyleDeclarationValueParser.getLength(part) &&
				!CSSStyleDeclarationValueParser.getFloat(value)
			) {
				return null;
			}
		}

		return {
			'border-image-outset': {
				important,
				value
			}
		};
	}

	/**
	 * Returns border repeat.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBorderImageRepeat(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return {
				'border-image-repeat': {
					important,
					value: lowerValue
				}
			};
		}

		const parts = lowerValue.split(/ +/);

		if (parts.length > 2) {
			return null;
		}

		for (const part of parts) {
			if (!BORDER_IMAGE_REPEAT.includes(part)) {
				return null;
			}
		}

		return {
			'border-image-repeat': {
				important,
				value
			}
		};
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
		const lowerValue = value.toLowerCase();
		const parsedValue =
			BORDER_WIDTH.includes(lowerValue) || CSSStyleDeclarationValueParser.getGlobal(lowerValue)
				? lowerValue
				: CSSStyleDeclarationValueParser.getLength(value);
		if (parsedValue) {
			return {
				'border-top-width': { value: parsedValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		const parsedValue =
			BORDER_WIDTH.includes(lowerValue) || CSSStyleDeclarationValueParser.getGlobal(lowerValue)
				? lowerValue
				: CSSStyleDeclarationValueParser.getLength(value);
		if (parsedValue) {
			return {
				'border-right-width': { value: parsedValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		const parsedValue =
			BORDER_WIDTH.includes(lowerValue) || CSSStyleDeclarationValueParser.getGlobal(lowerValue)
				? lowerValue
				: CSSStyleDeclarationValueParser.getLength(value);
		if (parsedValue) {
			return {
				'border-bottom-width': { value: parsedValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		const parsedValue =
			BORDER_WIDTH.includes(lowerValue) || CSSStyleDeclarationValueParser.getGlobal(lowerValue)
				? lowerValue
				: CSSStyleDeclarationValueParser.getLength(value);
		if (parsedValue) {
			return {
				'border-left-width': { value: parsedValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || BORDER_STYLE.includes(lowerValue)) {
			return {
				'border-top-style': { value: lowerValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || BORDER_STYLE.includes(lowerValue)) {
			return {
				'border-right-style': { value: lowerValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || BORDER_STYLE.includes(lowerValue)) {
			return {
				'border-bottom-style': { value: lowerValue, important }
			};
		}
		return null;
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
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || BORDER_STYLE.includes(lowerValue)) {
			return {
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
	public static getBorderTopColor(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);
		return color
			? {
					'border-top-color': { value: color, important }
			  }
			: null;
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
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);
		return color
			? {
					'border-right-color': { value: color, important }
			  }
			: null;
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
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);
		return color
			? {
					'border-bottom-color': { value: color, important }
			  }
			: null;
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
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);
		return color
			? {
					'border-left-color': { value: color, important }
			  }
			: null;
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
		const topLeft = parts[0] ? this.getBorderTopLeftRadius(parts[0], important) : '';
		const topRight = parts[1] ? this.getBorderTopRightRadius(parts[1] || parts[0], important) : '';
		const bottomRight = parts[2]
			? this.getBorderTopRightRadius(parts[2] || parts[0], important)
			: '';
		const bottomLeft = parts[3]
			? this.getBorderTopRightRadius(parts[3] || parts[1] || parts[0], important)
			: '';

		if (topLeft && topRight !== null && bottomRight !== null && bottomLeft !== null) {
			return {
				...topLeft,
				...topRight,
				...bottomRight,
				...bottomLeft
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
	public static getBorderTopLeftRadius(
		value: string,
		important: boolean
	): { [key: string]: ICSSStyleDeclarationPropertyValue } {
		const radius = CSSStyleDeclarationValueParser.getMeasurement(value);
		return radius ? { 'border-top-left-radius': { important, value: radius } } : null;
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
		const radius = CSSStyleDeclarationValueParser.getMeasurement(value);
		return radius ? { 'border-top-right-radius': { important, value: radius } } : null;
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
		const radius = CSSStyleDeclarationValueParser.getMeasurement(value);
		return radius ? { 'border-bottom-right-radius': { important, value: radius } } : null;
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
		const radius = CSSStyleDeclarationValueParser.getMeasurement(value);
		return radius ? { 'border-bottom-left-radius': { important, value: radius } } : null;
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);
		const parts = value.split(/ +/);
		const borderWidth =
			globalValue || parts[0] ? this.getBorderTopWidth(globalValue || parts[0], important) : '';
		const borderStyle =
			globalValue || parts[1] ? this.getBorderTopStyle(globalValue || parts[1], important) : '';
		const borderColor =
			globalValue || parts[2] ? this.getBorderTopColor(globalValue || parts[2], important) : '';

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			return {
				...this.getBorderImage('initial', important),
				...borderWidth,
				...borderStyle,
				...borderColor
			};
		}

		return null;
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);
		const parts = value.split(/ +/);
		const borderWidth =
			globalValue || parts[0] ? this.getBorderRightWidth(globalValue || parts[0], important) : '';
		const borderStyle =
			globalValue || parts[1] ? this.getBorderRightStyle(globalValue || parts[1], important) : '';
		const borderColor =
			globalValue || parts[2] ? this.getBorderRightColor(globalValue || parts[2], important) : '';

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			return {
				...this.getBorderImage('initial', important),
				...borderWidth,
				...borderStyle,
				...borderColor
			};
		}

		return null;
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);
		const parts = value.split(/ +/);
		const borderWidth =
			globalValue || parts[0] ? this.getBorderBottomWidth(globalValue || parts[0], important) : '';
		const borderStyle =
			globalValue || parts[1] ? this.getBorderBottomStyle(globalValue || parts[1], important) : '';
		const borderColor =
			globalValue || parts[2] ? this.getBorderBottomColor(globalValue || parts[2], important) : '';

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			return {
				...this.getBorderImage('initial', important),
				...borderWidth,
				...borderStyle,
				...borderColor
			};
		}

		return null;
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);
		const parts = value.split(/ +/);
		const borderWidth =
			globalValue || parts[0] ? this.getBorderLeftWidth(globalValue || parts[0], important) : '';
		const borderStyle =
			globalValue || parts[1] ? this.getBorderLeftStyle(globalValue || parts[1], important) : '';
		const borderColor =
			globalValue || parts[2] ? this.getBorderLeftColor(globalValue || parts[2], important) : '';

		if (borderWidth && borderStyle !== null && borderColor !== null) {
			return {
				...this.getBorderImage('initial', important),
				...borderWidth,
				...borderStyle,
				...borderColor
			};
		}

		return null;
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getPaddingTop(globalValue, important),
				...this.getPaddingRight(globalValue, important),
				...this.getPaddingBottom(globalValue, important),
				...this.getPaddingLeft(globalValue, important)
			};
		}

		const parts = value.split(/ +/);
		const top = this.getPaddingTop(parts[0], important);
		const right = this.getPaddingRight(parts[1] || '0', important);
		const bottom = this.getPaddingBottom(parts[2] || '0', important);
		const left = this.getPaddingLeft(parts[3] || '0', important);

		if (!top || !right || !bottom || !left) {
			return null;
		}

		return {
			...top,
			...right,
			...bottom,
			...left
		};
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
		const padding =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurement(value);
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
		const padding =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurement(value);
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
		const padding =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurement(value);
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
		const padding =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurement(value);
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getMarginTop(globalValue, important),
				...this.getMarginRight(globalValue, important),
				...this.getMarginBottom(globalValue, important),
				...this.getMarginLeft(globalValue, important)
			};
		}

		const parts = value.split(/ +/);
		const top = this.getMarginTop(parts[0], important);
		const right = this.getMarginRight(parts[1] || '0', important);
		const bottom = this.getMarginBottom(parts[2] || '0', important);
		const left = this.getMarginLeft(parts[3] || '0', important);

		if (!top || !right || !bottom || !left) {
			return null;
		}

		return {
			...top,
			...right,
			...bottom,
			...left
		};
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
		const margin =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const margin =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const margin =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const margin =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getMeasurementOrAuto(value);
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getFlexGrow(globalValue, important),
				...this.getFlexShrink(globalValue, important),
				...this.getFlexBasis(globalValue, important)
			};
		}

		switch (lowerValue) {
			case 'none':
				return {
					...this.getFlexGrow('0', important),
					...this.getFlexShrink('0', important),
					...this.getFlexBasis('auto', important)
				};
			case 'auto':
				return {
					...this.getFlexGrow('1', important),
					...this.getFlexShrink('1', important),
					...this.getFlexBasis('auto', important)
				};
		}

		const parts = value.split(/ +/);
		const flexGrow = parts[0] && this.getFlexGrow(parts[0], important);
		const flexShrink = parts[1] && this.getFlexShrink(parts[1], important);
		const flexBasis = parts[2] && this.getFlexBasis(parts[2], important);

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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || FLEX_BASIS.includes(lowerValue)) {
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
		const parsedValue =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getInteger(value);
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
		const parsedValue =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getInteger(value);
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return {
				...this.getBackgroundImage(globalValue, important),
				...this.getBackgroundPosition(globalValue, important),
				...this.getBackgroundSize(globalValue, important),
				...this.getBackgroundRepeat(globalValue, important),
				...this.getBackgroundAttachment(globalValue, important),
				...this.getBackgroundOrigin(globalValue, important),
				...this.getBackgroundClip(globalValue, important),
				...this.getBackgroundColor(globalValue, important)
			};
		}

		const properties = {
			...this.getBackgroundImage('initial', important),
			...this.getBackgroundPosition('initial', important),
			...this.getBackgroundSize('initial', important),
			...this.getBackgroundRepeat('initial', important),
			...this.getBackgroundAttachment('initial', important),
			...this.getBackgroundOrigin('initial', important),
			...this.getBackgroundClip('initial', important),
			...this.getBackgroundColor('initial', important)
		};

		const parts = value.replace(/[ ]*\/[ ]*/g, '/').split(/ +/);

		for (const part of parts) {
			if (part.includes('/')) {
				const [position, size] = part.split('/');
				const backgroundPosition = properties['background-position-x']
					? this.getBackgroundPositionY(position, important)
					: this.getBackgroundPosition(position, important);
				const backgroundSize = this.getBackgroundSize(size, important);

				if (!backgroundPosition || !backgroundSize) {
					return null;
				}

				Object.assign(properties, backgroundPosition, backgroundSize);
			} else {
				const backgroundImage = this.getBackgroundImage(part, important);
				const backgroundRepeat = this.getBackgroundRepeat(part, important);
				const backgroundAttachment = this.getBackgroundAttachment(part, important);
				const backgroundPosition = this.getBackgroundPosition(part, important);
				const backgroundColor = this.getBackgroundColor(part, important);

				if (
					!backgroundImage &&
					!backgroundRepeat &&
					!backgroundAttachment &&
					!backgroundPosition &&
					!backgroundColor
				) {
					return null;
				}

				Object.assign(
					properties,
					backgroundImage,
					backgroundRepeat,
					backgroundAttachment,
					backgroundPosition,
					backgroundColor
				);
			}
		}

		return properties;
	}

	/**
	 * Returns background size.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundSize(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return { 'background-size': { value: lowerValue, important } };
		}

		const imageParts = lowerValue.split(',');
		const parsed = [];

		for (const imagePart of imageParts) {
			const parts = imagePart.trim().split(' ');
			if (parts.length !== 1 && parts.length !== 2) {
				return null;
			}
			if (parts.length === 1) {
				if (
					parts[0] !== 'cover' &&
					parts[0] !== 'contain' &&
					!CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[0])
				) {
					return null;
				}
				parsed.push(parts[0]);
			} else {
				if (
					!CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[0]) ||
					!CSSStyleDeclarationValueParser.getMeasurementOrAuto(parts[1])
				) {
					return null;
				}
				parsed.push(`${parts[0]} ${parts[1]}`);
			}
		}
		if (parsed.length === 1) {
			return { 'background-size': { value: parsed.join(', '), important } };
		}
		return null;
	}

	/**
	 * Returns background origin.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundOrigin(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (
			CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			BACKGROUND_ORIGIN.includes(lowerValue)
		) {
			return { 'background-origin': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns background clip.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundClip(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();
		if (
			CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			BACKGROUND_CLIP.includes(lowerValue)
		) {
			return { 'background-clip': { value: lowerValue, important } };
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
		if (
			CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			BACKGROUND_REPEAT.includes(lowerValue)
		) {
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
		if (
			CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			BACKGROUND_ATTACHMENT.includes(lowerValue)
		) {
			return { 'background-attachment': { value: lowerValue, important } };
		}
		return null;
	}

	/**
	 * Returns background position.
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);
		if (globalValue) {
			return {
				...this.getBackgroundPositionX(globalValue, important),
				...this.getBackgroundPositionY(globalValue, important)
			};
		}

		const imageParts = value.split(',');
		let x = '';
		let y = '';

		for (const imagePart of imageParts) {
			const parts = imagePart.trim().split(/ +/);

			if (x) {
				x += ',';
				y += ',';
			}

			if (parts.length === 1) {
				if (parts[0] === 'top' || parts[0] === 'bottom') {
					x += 'center';
					y += parts[0];
				} else if (parts[0] === 'left' || parts[0] === 'right') {
					x += parts[0];
					y += 'center';
				} else if (parts[0] === 'center') {
					x += 'center';
					y += 'center';
				}
			}

			if (parts.length !== 2 && parts.length !== 4) {
				return null;
			}

			if (parts.length === 2) {
				x += parts[0] === 'top' || parts[0] === 'bottom' ? parts[1] : parts[0];
				y += parts[0] === 'left' || parts[0] === 'right' ? parts[0] : parts[1];
			} else if (parts.length === 4) {
				x +=
					parts[0] === 'top' || parts[0] === 'bottom' || parts[1] === 'top' || parts[1] === 'bottom'
						? `${parts[2]} ${parts[3]}`
						: `${parts[0]} ${parts[1]}`;
				y +=
					parts[2] === 'left' || parts[2] === 'right' || parts[3] === 'left' || parts[3] === 'right'
						? `${parts[0]} ${parts[1]}`
						: `${parts[2]} ${parts[3]}`;
			}
		}

		const xValue = this.getBackgroundPositionX(x, important);
		const yValue = this.getBackgroundPositionY(y, important);

		if (xValue && yValue) {
			return {
				...xValue,
				...yValue
			};
		}

		return null;
	}

	/**
	 * Returns background position.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundPositionX(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return { 'background-position-x': { value: lowerValue, important } };
		}

		const imageParts = lowerValue.split(',');
		let parsedValue = '';

		for (const imagePart of imageParts) {
			const parts = imagePart.trim().split(/ +/);

			if (parsedValue) {
				parsedValue += ',';
			}

			for (const part of parts) {
				if (
					!CSSStyleDeclarationValueParser.getMeasurement(part) &&
					part !== 'left' &&
					part !== 'right' &&
					part !== 'center'
				) {
					return null;
				}

				if (parsedValue) {
					parsedValue += ' ';
				}

				parsedValue += part;
			}
		}

		return { 'background-position-x': { value: parsedValue, important } };
	}

	/**
	 * Returns background position.
	 *
	 * @param value Value.
	 * @param important Important.
	 * @returns Property values
	 */
	public static getBackgroundPositionY(
		value: string,
		important: boolean
	): {
		[key: string]: ICSSStyleDeclarationPropertyValue;
	} {
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return { 'background-position-y': { value: lowerValue, important } };
		}

		const imageParts = lowerValue.split(',');
		let parsedValue = '';

		for (const imagePart of imageParts) {
			const parts = imagePart.trim().split(/ +/);

			if (parsedValue) {
				parsedValue += ',';
			}

			for (const part of parts) {
				if (
					!CSSStyleDeclarationValueParser.getMeasurement(part) &&
					part !== 'top' &&
					part !== 'bottom' &&
					part !== 'center'
				) {
					return null;
				}

				if (parsedValue) {
					parsedValue += ' ';
				}

				parsedValue += part;
			}
		}

		return { 'background-position-y': { value: parsedValue, important } };
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
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);

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
		const lowerValue = value.toLowerCase();

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || lowerValue === 'none') {
			return { 'background-image': { value: lowerValue, important } };
		}

		const parts = value.split(',');
		const parsed = [];

		for (const part of parts) {
			const url = CSSStyleDeclarationValueParser.getURL(part.trim());
			if (!url) {
				return null;
			}
			parsed.push(url);
		}

		if (parsed.length) {
			return { 'background-image': { value: parsed.join(', '), important } };
		}

		return null;
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
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);

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
		const color =
			CSSStyleDeclarationValueParser.getGlobal(value) ||
			CSSStyleDeclarationValueParser.getColor(value);

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

		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue)) {
			return {
				...this.getFontStyle(lowerValue, important),
				...this.getFontVariant(lowerValue, important),
				...this.getFontWeight(lowerValue, important),
				...this.getFontStretch(lowerValue, important),
				...this.getFontSize(lowerValue, important),
				...this.getLineHeight(lowerValue, important),
				...this.getFontFamily(lowerValue, important)
			};
		}

		if (SYSTEM_FONT.includes(lowerValue)) {
			return { font: { value: lowerValue, important } };
		}

		const properties = {
			...this.getFontStyle('normal', important),
			...this.getFontVariant('normal', important),
			...this.getFontWeight('normal', important),
			...this.getFontStretch('normal', important),
			...this.getLineHeight('normal', important)
		};

		const parts = value.replace(/ *\/ */g, '/').split(/ +/);

		for (let i = 0, max = parts.length; i < max; i++) {
			const part = parts[i];
			if (part.includes('/')) {
				const [size, height] = part.split('/');
				const fontSize = this.getFontSize(size, important);
				const lineHeight = this.getLineHeight(height, important);

				if (!fontSize || !lineHeight) {
					return null;
				}

				Object.assign(properties, fontSize, lineHeight);
			} else {
				const fontStyle = this.getFontStyle(part, important);
				const fontVariant = this.getFontVariant(part, important);
				const fontWeight = this.getFontWeight(part, important);
				const fontSize = this.getFontSize(part, important);
				const fontStretch = this.getFontStretch(part, important);

				if (fontStyle) {
					Object.assign(properties, fontStyle);
				} else if (fontVariant) {
					Object.assign(properties, fontVariant);
				} else if (fontWeight) {
					Object.assign(properties, fontWeight);
				} else if (fontSize) {
					Object.assign(properties, fontSize);
				} else if (fontStretch) {
					Object.assign(properties, fontStretch);
				} else {
					const fontFamilyValue = parts.slice(i).join(' ');
					const fontFamily = this.getFontFamily(fontFamilyValue, important);
					if (!fontFamily) {
						return null;
					}
					Object.assign(properties, fontFamily);
				}
			}
		}

		return properties;
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || FONT_STYLE.includes(lowerValue)) {
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
		return CSSStyleDeclarationValueParser.getGlobal(lowerValue) ||
			lowerValue === 'normal' ||
			lowerValue === 'small-caps'
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || FONT_STRETCH.includes(lowerValue)) {
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || FONT_WEIGHT.includes(lowerValue)) {
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
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || FONT_SIZE.includes(lowerValue)) {
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
		const lowerValue = value.toLowerCase();
		if (CSSStyleDeclarationValueParser.getGlobal(lowerValue) || lowerValue === 'normal') {
			return { 'line-height': { value: lowerValue, important } };
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
		const globalValue = CSSStyleDeclarationValueParser.getGlobal(value);

		if (globalValue) {
			return { 'font-family': { value: globalValue, important } };
		}

		const parts = value.split(',');
		let parsedValue = '';
		for (let i = 0, max = parts.length; i < max; i++) {
			const trimmedPart = parts[i].trim().replace(/'/g, '"');
			if (
				trimmedPart.includes(' ') &&
				(trimmedPart[0] !== '"' || trimmedPart[trimmedPart.length - 1] !== "'")
			) {
				return null;
			}
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
