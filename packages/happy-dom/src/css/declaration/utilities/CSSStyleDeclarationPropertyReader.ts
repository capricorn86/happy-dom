import ICSSStyleDeclarationProperty from './ICSSStyleDeclarationPropertyValue';
/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertyReader {
	/**
	 * Returns property value.
	 *
	 * @param style Style.
	 * @param propertyName Property name.
	 * @returns Property value.
	 */
	public static getValue(
		style: {
			[k: string]: ICSSStyleDeclarationProperty;
		},
		propertyName: string
	): string {
		switch (propertyName) {
			case 'margin':
				if (!style['margin-top']?.value) {
					return '';
				}
				return `${style['margin-top']?.value} ${style['margin-right']?.value} ${style['margin-bottom']?.value} ${style['margin-left']?.value}`
					.replace(/  /g, '')
					.trim();
			case 'padding':
				if (!style['padding-top']?.value) {
					return '';
				}
				return `${style['padding-top']?.value} ${style['padding-right']?.value} ${style['padding-bottom']?.value} ${style['padding-left']?.value}`
					.replace(/  /g, '')
					.trim();
			case 'border':
				if (
					!style['border-top-width']?.value ||
					!style['border-top-style']?.value ||
					!style['border-top-color']?.value ||
					style['border-right-width']?.value !== style['border-top-width']?.value ||
					style['border-right-style']?.value !== style['border-top-style']?.value ||
					style['border-right-color']?.value !== style['border-top-color']?.value ||
					style['border-bottom-width']?.value !== style['border-top-width']?.value ||
					style['border-bottom-style']?.value !== style['border-top-style']?.value ||
					style['border-bottom-color']?.value !== style['border-top-color']?.value ||
					style['border-left-width']?.value !== style['border-top-width']?.value ||
					style['border-left-style']?.value !== style['border-top-style']?.value ||
					style['border-left-color']?.value !== style['border-top-color']?.value
				) {
					return '';
				}
				return `${style['border-top-width'].value} ${style['border-top-style'].value} ${style['border-top-color'].value}`;
			case 'border-left':
				if (
					!style['border-left-width']?.value ||
					!style['border-left-style']?.value ||
					!style['border-left-color']?.value
				) {
					return '';
				}
				return `${style['border-left-width'].value} ${style['border-left-style'].value} ${style['border-left-color'].value}`;
			case 'border-right':
				if (
					!style['border-right-width']?.value ||
					!style['border-right-style']?.value ||
					!style['border-right-color']?.value
				) {
					return '';
				}
				return `${style['border-right-width'].value} ${style['border-right-style'].value} ${style['border-right-color'].value}`;
			case 'border-top':
				if (
					!style['border-top-width']?.value ||
					!style['border-top-style']?.value ||
					!style['border-top-color']?.value
				) {
					return '';
				}
				return `${style['border-top-width'].value} ${style['border-top-style'].value} ${style['border-top-color'].value}`;
			case 'border-bottom':
				if (
					!style['border-bottom-width']?.value ||
					!style['border-bottom-style']?.value ||
					!style['border-bottom-color']?.value
				) {
					return '';
				}
				return `${style['border-bottom-width'].value} ${style['border-bottom-style'].value} ${style['border-bottom-color'].value}`;
			case 'background':
				if (!style['background-color']?.value && !style['background-image']?.value) {
					return '';
				}
				return `${style['background-color']?.value} ${style['background-image']?.value} ${style['background-repeat']?.value} ${style['background-attachment']?.value} ${style['background-position']?.value}`
					.replace(/  /g, '')
					.trim();
			case 'flex':
				if (
					!style['flex-grow']?.value ||
					!style['flex-shrink']?.value ||
					!style['flex-basis']?.value
				) {
					return '';
				}
				return `${style['flex-grow'].value} ${style['flex-shrink'].value} ${style['flex-basis'].value}`;
		}

		return style[propertyName]?.value || '';
	}
}
