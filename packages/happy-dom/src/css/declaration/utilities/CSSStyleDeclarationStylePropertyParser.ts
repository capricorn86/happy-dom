import ICSSStyleDeclarationProperty from '../ICSSStyleDeclarationProperty';
import CSSStyleDeclarationPropertyValidator from './CSSStyleDeclarationStylePropertyValidator';

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationStylePropertyParser {
	/**
	 * Returns property value.
	 *
	 * @param style Style.
	 * @param propertyName Property name.
	 * @returns Property value.
	 */
	public static getPropertyValue(
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

	/**
	 * Returns valid properties.
	 *
	 * @param property Property.
	 * @returns Properties.
	 */
	public static getValidProperties(property: ICSSStyleDeclarationProperty): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const { name, value, important } = property;
		let parts;

		switch (name) {
			case 'border':
				parts = value.split(/ +/);

				if (
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
					!CSSStyleDeclarationPropertyValidator.validateBorderStyle(parts[1]) ||
					!CSSStyleDeclarationPropertyValidator.validateColor(parts[2])
				) {
					return {};
				}

				return {
					'border-top-width': { name, important, value: parts[0] },
					'border-right-width': { name, important, value: parts[0] },
					'border-bottom-width': { name, important, value: parts[0] },
					'border-left-width': { name, important, value: parts[0] },
					'border-top-style': { name, important, value: parts[1] },
					'border-right-style': { name, important, value: parts[1] },
					'border-bottom-style': { name, important, value: parts[1] },
					'border-left-style': { name, important, value: parts[1] },
					'border-top-color': { name, important, value: parts[2] },
					'border-right-color': { name, important, value: parts[2] },
					'border-bottom-color': { name, important, value: parts[2] },
					'border-left-color': { name, important, value: parts[2] }
				};
			case 'border-left':
			case 'border-bottom':
			case 'border-right':
			case 'border-top':
				parts = value.split(/ +/);

				if (
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
					!CSSStyleDeclarationPropertyValidator.validateBorderStyle(parts[1]) ||
					!CSSStyleDeclarationPropertyValidator.validateColor(parts[2])
				) {
					return {};
				}

				const borderName = name.split('-')[1];

				return {
					[`border-${borderName}-width`]: { name, important, value: parts[0] },
					[`border-${borderName}-style`]: { name, important, value: parts[1] },
					[`border-${borderName}-color`]: { name, important, value: parts[2] }
				};
			case 'border-width':
				if (!CSSStyleDeclarationPropertyValidator.validateSize(value)) {
					return {};
				}
				return {
					'border-top-width': { name, important, value },
					'border-right-width': { name, important, value },
					'border-bottom-width': { name, important, value },
					'border-left-width': { name, important, value }
				};
			case 'border-style':
				if (!CSSStyleDeclarationPropertyValidator.validateBorderStyle(value)) {
					return {};
				}
				return {
					'border-top-style': { name, important, value },
					'border-right-style': { name, important, value },
					'border-bottom-style': { name, important, value },
					'border-left-style': { name, important, value }
				};
			case 'border-color':
				if (!CSSStyleDeclarationPropertyValidator.validateColor(value)) {
					return {};
				}
				return {
					'border-top-color': { name, important, value },
					'border-right-color': { name, important, value },
					'border-bottom-color': { name, important, value },
					'border-left-color': { name, important, value }
				};
			case 'border-radius':
				parts = value.split(/ +/);
				if (
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
					(parts[1] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[1])) ||
					(parts[2] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[2])) ||
					(parts[3] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[3]))
				) {
					return {};
				}
				return {
					'border-top-left-radius': { name, important, value: parts[0] || '' },
					'border-top-right-radius': { name, important, value: parts[1] || '' },
					'border-bottom-right-radius': { name, important, value: parts[2] || '' },
					'border-bottom-left-radius': { name, important, value: parts[3] || '' }
				};
			case 'border-collapse':
				if (!value || !CSSStyleDeclarationPropertyValidator.validateBorderCollapse(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'clear':
				if (!value || !CSSStyleDeclarationPropertyValidator.validateClear(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'clip':
				if (!value || !CSSStyleDeclarationPropertyValidator.validateClip(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'css-float':
			case 'float':
				if (!value || !CSSStyleDeclarationPropertyValidator.validateFloat(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'flex':
				const lowerValue = value.trim().toLowerCase();
				switch (lowerValue) {
					case 'none':
						return {
							'flex-grow': { name, important, value: '0' },
							'flex-shrink': { name, important, value: '0' },
							'flex-basis': { name, important, value: 'auto' }
						};
					case 'auto':
						return {
							'flex-grow': { name, important, value: '1' },
							'flex-shrink': { name, important, value: '1' },
							'flex-basis': { name, important, value: 'auto' }
						};
					case 'initial':
						return {
							'flex-grow': { name, important, value: '0' },
							'flex-shrink': { name, important, value: '1' },
							'flex-basis': { name, important, value: 'auto' }
						};
					case 'inherit':
						return {
							'flex-grow': { name, important, value: 'inherit' },
							'flex-shrink': { name, important, value: 'inherit' },
							'flex-basis': { name, important, value: 'inherit' }
						};
				}

				parts = value.split(/ +/);
				if (
					!CSSStyleDeclarationPropertyValidator.validateInteger(parts[0]) ||
					!CSSStyleDeclarationPropertyValidator.validateInteger(parts[1]) ||
					(parts[2] !== 'auto' &&
						parts[2] !== 'inherit' &&
						!CSSStyleDeclarationPropertyValidator.validateSize(parts[2]))
				) {
					return {};
				}
				return {
					'flex-grow': { name, important, value: parts[0] },
					'flex-shrink': { name, important, value: parts[1] },
					'flex-basis': { name, important, value: parts[2] }
				};
			case 'flex-shrink':
			case 'flex-grow':
				if (!value || !CSSStyleDeclarationPropertyValidator.validateInteger(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'flex-basis':
				if (
					value !== 'auto' &&
					value !== 'inherit' &&
					!CSSStyleDeclarationPropertyValidator.validateSize(value)
				) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'padding':
			case 'margin':
				parts = value.split(/ +/);
				if (
					!parts[0] ||
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
					(parts[1] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[1])) ||
					(parts[2] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[2])) ||
					(parts[3] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[3]))
				) {
					return {};
				}
				return {
					[`${name}-top`]: { name, important, value: parts[0] },
					[`${name}-right`]: { name, important, value: parts[1] || '' },
					[`${name}-bottom`]: { name, important, value: parts[2] || '' },
					[`${name}-left`]: { name, important, value: parts[3] || '' }
				};
			case 'background':
				parts = value.split(/ +/);
				// First value can be color or image url
				if (!CSSStyleDeclarationPropertyValidator.validateColor(parts[0])) {
					parts.unshift('');
				}
				if (
					(!parts[0] && !parts[1]) ||
					(parts[0] && !CSSStyleDeclarationPropertyValidator.validateColor(parts[0])) ||
					(parts[1] && !CSSStyleDeclarationPropertyValidator.validateURL(parts[1])) ||
					(parts[2] && !CSSStyleDeclarationPropertyValidator.validateBackgroundRepeat(parts[2])) ||
					(parts[3] &&
						!CSSStyleDeclarationPropertyValidator.validateBackgroundAttachment(parts[3])) ||
					(parts[4] && !CSSStyleDeclarationPropertyValidator.validateBackgroundPosition(parts[4]))
				) {
					return {};
				}
				return {
					'background-color': { name, important, value: parts[0] || '' },
					'background-image': { name, important, value: parts[1] || '' },
					'background-repeat': { name, important, value: parts[2] || '' },
					'background-attachment': { name, important, value: parts[3] || '' },
					'background-position': { name, important, value: parts[4] || '' }
				};
			case 'top':
			case 'right':
			case 'bottom':
			case 'left':
			case 'padding-top':
			case 'padding-bottom':
			case 'padding-left':
			case 'padding-right':
			case 'margin-top':
			case 'margin-bottom':
			case 'margin-left':
			case 'margin-right':
			case 'border-top-width':
			case 'border-bottom-width':
			case 'border-left-width':
			case 'border-right-width':
			case 'font-size':
				if (!CSSStyleDeclarationPropertyValidator.validateSize(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'color':
			case 'flood-color':
			case 'border-top-color':
			case 'border-bottom-color':
			case 'border-left-color':
			case 'border-right-color':
				if (!CSSStyleDeclarationPropertyValidator.validateColor(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
			case 'border-top-style':
			case 'border-bottom-style':
			case 'border-left-style':
			case 'border-right-style':
				if (!CSSStyleDeclarationPropertyValidator.validateBorderStyle(value)) {
					return {};
				}
				return {
					[name]: { name, important, value }
				};
		}

		return {
			[name]: { name, important, value }
		};
	}

	/**
	 * Returns related property names.
	 *
	 * @param propertyName Property name.
	 * @returns Properties.
	 */
	public static getRelatedPropertyNames(propertyName: string): string[] {
		const name = propertyName;

		switch (name) {
			case 'border':
				return [
					'border-top-width',
					'border-right-width',
					'border-bottom-width',
					'border-left-width',
					'border-top-style',
					'border-right-style',
					'border-bottom-style',
					'border-left-style',
					'border-top-color',
					'border-right-color',
					'border-bottom-color',
					'border-left-color'
				];
			case 'border-left':
			case 'border-bottom':
			case 'border-right':
			case 'border-top':
				const borderName = name.split('-')[1];

				return [
					`border-${borderName}-width`,
					`border-${borderName}-style`,
					`border-${borderName}-color`
				];
			case 'border-width':
				return [
					'border-top-width',
					'border-right-width',
					'border-bottom-width',
					'border-left-width'
				];
			case 'border-style':
				return [
					'border-top-style',
					'border-right-style',
					'border-bottom-style',
					'border-left-style'
				];
			case 'border-color':
				return [
					'border-top-color',
					'border-right-color',
					'border-bottom-color',
					'border-left-color'
				];
			case 'border-radius':
				return [
					'border-top-left-radius',
					'border-top-right-radius',
					'border-bottom-right-radius',
					'border-bottom-left-radius'
				];
			case 'background':
				return [
					'background-color',
					'background-image',
					'background-repeat',
					'background-attachment',
					'background-position'
				];
			case 'flex':
				return ['flex-grow', 'flex-shrink', 'flex-basis'];
			case 'padding':
			case 'margin':
				return [`${name}-top`, `${name}-right`, `${name}-bottom`, `${name}-left`];
		}

		return [name];
	}
}
