import ICSSStyleDeclarationPropertyValue from './ICSSStyleDeclarationPropertyValue';

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertyGetParser {
	/**
	 * Returns margin.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getMargin(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['margin-top']?.value) {
			return null;
		}
		return {
			important: ![
				properties['margin-top']?.important,
				properties['margin-bottom']?.important,
				properties['margin-left']?.important,
				properties['margin-right']?.important
			].some((important) => important === false),
			value: `${properties['margin-top'].value} ${properties['margin-right']?.value || ''} ${
				properties['margin-top'].value !== properties['margin-bottom']?.value
					? properties['margin-bottom']?.value || ''
					: ''
			} ${
				properties['margin-right']?.value !== properties['margin-left']?.value
					? properties['margin-left']?.value || ''
					: ''
			}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns padding.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getPadding(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['padding-top']?.value) {
			return null;
		}
		return {
			important: ![
				properties['padding-top']?.important,
				properties['padding-bottom']?.important,
				properties['padding-left']?.important,
				properties['padding-right']?.important
			].some((important) => important === false),
			value: `${properties['padding-top'].value} ${properties['padding-right']?.value || ''} ${
				properties['padding-top'].value !== properties['padding-bottom']?.value
					? properties['padding-bottom']?.value || ''
					: ''
			} ${
				properties['padding-right']?.value !== properties['padding-left']?.value
					? properties['padding-left']?.value || ''
					: ''
			}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorder(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (
			!properties['border-top-width']?.value ||
			properties['border-right-width']?.value !== properties['border-top-width']?.value ||
			properties['border-right-style']?.value !== properties['border-top-style']?.value ||
			properties['border-right-color']?.value !== properties['border-top-color']?.value ||
			properties['border-bottom-width']?.value !== properties['border-top-width']?.value ||
			properties['border-bottom-style']?.value !== properties['border-top-style']?.value ||
			properties['border-bottom-color']?.value !== properties['border-top-color']?.value ||
			properties['border-left-width']?.value !== properties['border-top-width']?.value ||
			properties['border-left-style']?.value !== properties['border-top-style']?.value ||
			properties['border-left-color']?.value !== properties['border-top-color']?.value
		) {
			return null;
		}
		return {
			important: ![
				properties['border-top-width']?.important,
				properties['border-right-width']?.important,
				properties['border-bottom-width']?.important,
				properties['border-left-width']?.important,
				properties['border-top-style']?.important,
				properties['border-right-style']?.important,
				properties['border-bottom-style']?.important,
				properties['border-left-style']?.important,
				properties['border-top-color']?.important,
				properties['border-right-color']?.important,
				properties['border-bottom-color']?.important,
				properties['border-left-color']?.important
			].some((important) => important === false),
			value: `${properties['border-top-width'].value} ${
				properties['border-top-style']?.value || ''
			} ${properties['border-top-color']?.value || ''}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderTop(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['border-top-width']?.value) {
			return null;
		}
		return {
			important: ![
				properties['border-top-width']?.important,
				properties['border-top-style']?.important,
				properties['border-top-color']?.important
			].some((important) => important === false),
			value: `${properties['border-top-width'].value} ${
				properties['border-top-style']?.value || ''
			} ${properties['border-top-color']?.value || ''}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderRight(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['border-right-width']?.value) {
			return null;
		}
		return {
			important: ![
				properties['border-right-width']?.important,
				properties['border-right-style']?.important,
				properties['border-right-color']?.important
			].some((important) => important === false),
			value: `${properties['border-right-width'].value} ${
				properties['border-right-style']?.value || ''
			} ${properties['border-right-color']?.value || ''}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderBottom(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['border-bottom-width']?.value) {
			return null;
		}
		return {
			important: ![
				properties['border-bottom-width']?.important,
				properties['border-bottom-style']?.important,
				properties['border-bottom-color']?.important
			].some((important) => important === false),
			value: `${properties['border-bottom-width'].value} ${
				properties['border-bottom-style']?.value || ''
			} ${properties['border-bottom-color']?.value || ''}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderLeft(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['border-left-width']?.value) {
			return null;
		}
		return {
			important: ![
				properties['border-left-width']?.important,
				properties['border-left-style']?.important,
				properties['border-left-color']?.important
			].some((important) => important === false),
			value: `${properties['border-left-width'].value} ${
				properties['border-left-style']?.value || ''
			} ${properties['border-left-color']?.value || ''}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderColor(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (
			!properties['border-top-color']?.value ||
			properties['border-top-color']?.value !== properties['border-right-color']?.value ||
			properties['border-top-color']?.value !== properties['border-bottom-color']?.value ||
			properties['border-top-color']?.value !== properties['border-left-color']?.value
		) {
			return null;
		}
		return {
			important: ![
				properties['border-top-color']?.important,
				properties['border-right-color']?.important,
				properties['border-bottom-color']?.important,
				properties['border-left-color']?.important
			].some((important) => important === false),
			value: properties['border-top-color'].value
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderWidth(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (
			!properties['border-top-width']?.value ||
			properties['border-top-width']?.value !== properties['border-right-width']?.value ||
			properties['border-top-width']?.value !== properties['border-bottom-width']?.value ||
			properties['border-top-width']?.value !== properties['border-left-width']?.value
		) {
			return null;
		}
		return {
			important: ![
				properties['border-top-width']?.important,
				properties['border-right-width']?.important,
				properties['border-bottom-width']?.important,
				properties['border-left-width']?.important
			].some((important) => important === false),
			value: properties['border-top-width'].value
		};
	}

	/**
	 * Returns border.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderStyle(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (
			!properties['border-top-style']?.value ||
			properties['border-top-style']?.value !== properties['border-right-style']?.value ||
			properties['border-top-style']?.value !== properties['border-bottom-style']?.value ||
			properties['border-top-style']?.value !== properties['border-left-style']?.value
		) {
			return null;
		}
		return {
			important: ![
				properties['border-top-style']?.important,
				properties['border-right-style']?.important,
				properties['border-bottom-style']?.important,
				properties['border-left-style']?.important
			].some((important) => important === false),
			value: properties['border-top-style'].value
		};
	}

	/**
	 * Returns border radius.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBorderRadius(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['border-top-left-radius']?.value) {
			return null;
		}
		return {
			important: ![
				properties['border-top-left-radius']?.important,
				properties['border-top-right-radius']?.important,
				properties['border-bottom-right-radius']?.important,
				properties['border-bottom-left-radius']?.important
			].some((important) => important === false),
			value: `${properties['border-top-left-radius'].value} ${
				properties['border-top-right-radius']?.value || ''
			} ${
				properties['border-top-left-radius'].value !==
				properties['border-bottom-right-radius']?.value
					? properties['border-bottom-right-radius']?.value || ''
					: ''
			} ${
				properties['border-top-right-radius']?.value !==
				properties['border-bottom-left-radius']?.value
					? properties['border-bottom-left-radius']?.value || ''
					: ''
			}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns background.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getBackground(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['background-color']?.value && !properties['background-image']?.value) {
			return null;
		}
		return {
			important: ![
				properties['background-color']?.important,
				properties['background-image']?.important,
				properties['background-repeat']?.important,
				properties['background-attachment']?.important,
				properties['background-position']?.important
			].some((important) => important === false),
			value: `${properties['background-color']?.value || ''} ${
				properties['background-image']?.value || ''
			} ${properties['background-repeat']?.value || ''} ${
				properties['background-repeat']?.value
					? properties['background-attachment']?.value || ''
					: ''
			} ${
				properties['background-repeat']?.value && properties['background-attachment']?.value
					? properties['background-position']?.value || ''
					: ''
			}`
				.replace(/  /g, '')
				.trim()
		};
	}

	/**
	 * Returns flex.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getFlex(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (
			!properties['flex-grow']?.value ||
			!properties['flex-shrink']?.value ||
			!properties['flex-basis']?.value
		) {
			return null;
		}
		return {
			important: ![
				properties['flex-grow']?.important,
				properties['flex-shrink']?.important,
				properties['flex-basis']?.important
			].some((important) => important === false),
			value: `${properties['flex-grow'].value} ${properties['flex-shrink'].value} ${properties['flex-basis'].value}`
		};
	}

	/**
	 * Returns flex.
	 *
	 * @param properties Properties.
	 * @returns Property value
	 */
	public static getFont(properties: {
		[k: string]: ICSSStyleDeclarationPropertyValue;
	}): ICSSStyleDeclarationPropertyValue {
		if (!properties['font-family']?.value || !properties['font-size']?.value) {
			return null;
		}
		const sizeAndLineHeight = [properties['font-size'].value];

		if (properties['line-height']?.value) {
			sizeAndLineHeight.push(properties['line-height'].value);
		}

		return {
			important: ![
				properties['font-style']?.important,
				properties['font-variant']?.important,
				properties['font-weight']?.important,
				properties['font-stretch']?.important,
				properties['font-size']?.important,
				properties['line-height']?.important,
				properties['font-family']?.important
			].some((important) => important === false),
			value: `${properties['font-style']?.value || ''} ${properties['font-variant']?.value || ''} ${
				properties['font-weight']?.value || ''
			} ${properties['font-stretch']?.value || ''} ${sizeAndLineHeight.join('/')} ${
				properties['font-family'].value || ''
			}`
				.replace(/  /g, '')
				.trim()
		};
	}
}
