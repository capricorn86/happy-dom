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
		const values = [properties['margin-top'].value];
		if (
			properties['margin-right']?.value &&
			(properties['margin-right'].value !== properties['margin-top'].value ||
				(properties['margin-bottom']?.value &&
					properties['margin-bottom'].value !== properties['margin-top'].value))
		) {
			values.push(properties['margin-right'].value);
		}
		if (
			properties['margin-bottom']?.value &&
			(properties['margin-bottom'].value !== properties['margin-top'].value ||
				(properties['margin-left']?.value &&
					properties['margin-left'].value !== properties['margin-right'].value))
		) {
			values.push(properties['margin-bottom'].value);
		}
		if (properties['margin-left']?.value) {
			values.push(properties['margin-left'].value);
		}
		return {
			important: ![
				properties['margin-top']?.important,
				properties['margin-bottom']?.important,
				properties['margin-left']?.important,
				properties['margin-right']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
		const values = [properties['padding-top'].value];
		if (properties['padding-right']?.value) {
			values.push(properties['padding-right'].value);
		}
		if (properties['padding-bottom']?.value) {
			values.push(properties['padding-bottom'].value);
		}
		if (properties['padding-left']?.value) {
			values.push(properties['padding-left'].value);
		}
		return {
			important: ![
				properties['padding-top']?.important,
				properties['padding-bottom']?.important,
				properties['padding-left']?.important,
				properties['padding-right']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
			properties['border-top-width']?.value !== properties['border-right-width']?.value ||
			properties['border-top-width']?.value !== properties['border-bottom-width']?.value ||
			properties['border-top-width']?.value !== properties['border-left-width']?.value
		) {
			return null;
		}

		const values = [properties['border-top-width'].value];

		if (
			properties['border-top-style']?.value &&
			properties['border-top-style'].value === properties['border-right-style'].value &&
			properties['border-top-color'].value === properties['border-right-color'].value &&
			properties['border-top-color'].value === properties['border-bottom-color'].value &&
			properties['border-top-color'].value === properties['border-left-color'].value
		) {
			values.push(properties['border-top-style'].value);
		}

		if (
			properties['border-top-color']?.value &&
			properties['border-top-color'].value === properties['border-right-color'].value &&
			properties['border-top-color'].value === properties['border-bottom-color'].value &&
			properties['border-top-color'].value === properties['border-left-color'].value
		) {
			values.push(properties['border-top-color'].value);
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
			value: values.join(' ')
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
		const values = [properties['border-top-width'].value];
		if (properties['border-top-style']?.value) {
			values.push(properties['border-top-style'].value);
		}
		if (properties['border-top-color']?.value) {
			values.push(properties['border-top-color'].value);
		}
		return {
			important: ![
				properties['border-top-width']?.important,
				properties['border-top-style']?.important,
				properties['border-top-color']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
		const values = [properties['border-right-width'].value];
		if (properties['border-right-style']?.value) {
			values.push(properties['border-right-style'].value);
		}
		if (properties['border-right-color']?.value) {
			values.push(properties['border-right-color'].value);
		}
		return {
			important: ![
				properties['border-right-width']?.important,
				properties['border-right-style']?.important,
				properties['border-right-color']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
		const values = [properties['border-bottom-width'].value];
		if (properties['border-bottom-style']?.value) {
			values.push(properties['border-bottom-style'].value);
		}
		if (properties['border-bottom-color']?.value) {
			values.push(properties['border-bottom-color'].value);
		}
		return {
			important: ![
				properties['border-bottom-width']?.important,
				properties['border-bottom-style']?.important,
				properties['border-bottom-color']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
		const values = [properties['border-left-width'].value];
		if (properties['border-left-style']?.value) {
			values.push(properties['border-bottom-style'].value);
		}
		if (properties['border-left-color']?.value) {
			values.push(properties['border-left-color'].value);
		}
		return {
			important: ![
				properties['border-left-width']?.important,
				properties['border-left-style']?.important,
				properties['border-left-color']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
		const values = [properties['border-top-left-radius'].value];
		if (properties['border-top-right-radius']?.value) {
			values.push(properties['border-top-right-radius'].value);
		}
		if (properties['border-bottom-right-radius']?.value) {
			values.push(properties['border-bottom-right-radius'].value);
		}
		if (properties['border-bottom-left-radius']?.value) {
			values.push(properties['border-bottom-left-radius'].value);
		}
		return {
			important: ![
				properties['border-top-left-radius']?.important,
				properties['border-top-right-radius']?.important,
				properties['border-bottom-right-radius']?.important,
				properties['border-bottom-left-radius']?.important
			].some((important) => important === false),
			value: values.join(' ')
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
		const values = [];
		if (properties['background-color']?.value) {
			values.push(properties['background-color'].value);
		}
		if (properties['background-image']?.value) {
			values.push(properties['background-image'].value);
		}
		if (properties['background-repeat']?.value) {
			values.push(properties['background-repeat'].value);
		}
		if (properties['background-attachment']?.value) {
			values.push(properties['background-attachment'].value);
		}
		if (properties['background-position']?.value) {
			values.push(properties['background-position'].value);
		}
		return {
			important: ![
				properties['background-color']?.important,
				properties['background-image']?.important,
				properties['background-repeat']?.important,
				properties['background-attachment']?.important,
				properties['background-position']?.important
			].some((important) => important === false),
			value: values.join(' ')
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

		const values = [];
		if (properties['font-style']?.value) {
			values.push(properties['font-style'].value);
		}
		if (properties['font-variant']?.value) {
			values.push(properties['font-variant'].value);
		}
		if (properties['font-weight']?.value) {
			values.push(properties['font-weight'].value);
		}
		if (properties['font-stretch']?.value) {
			values.push(properties['font-stretch'].value);
		}

		values.push(sizeAndLineHeight.join('/'));

		if (properties['font-family']?.value) {
			values.push(properties['font-family'].value);
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
			value: values.join(' ')
		};
	}
}
