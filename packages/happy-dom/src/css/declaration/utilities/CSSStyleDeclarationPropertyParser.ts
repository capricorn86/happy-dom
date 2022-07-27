import ICSSStyleDeclarationProperty from '../ICSSStyleDeclarationProperty';
import CSSStyleDeclarationPropertyValidator from './CSSStyleDeclarationPropertyValidator';

/**
 * Computed style property parser.
 */
export default class CSSStyleDeclarationPropertyParser {
	/**
	 * Returns style.
	 *
	 * @param style Style.
	 * @param propertyName Property name.
	 * @returns Element style properties.
	 */
	public static getPropertyValue(
		style: {
			[k: string]: ICSSStyleDeclarationProperty;
		},
		propertyName: string
	): string {
		switch (propertyName) {
			case 'margin':
			case 'padding':
				const padding = style[`${propertyName}-top`]?.value;
				if (!padding) {
					return '';
				}
				for (const property of ['right', 'bottom', 'left']) {
					if (style[`${propertyName}-${property}`]?.value !== padding) {
						return '';
					}
				}
				return padding;
			case 'border':
			case 'border-left':
			case 'border-right':
			case 'border-top':
			case 'border-bottom':
				const border = CSSStyleDeclarationBorderUtility.getBorder(styleProperties);

				switch (propertyName) {
					case 'border':
						return border.left.width &&
							border.left.width === border.right.width &&
							border.left.width === border.top.width &&
							border.left.width === border.bottom.width &&
							border.left.style &&
							border.left.style === border.right.style &&
							border.left.style === border.top.style &&
							border.left.style === border.bottom.style &&
							border.left.color === border.right.color &&
							border.left.color === border.top.color &&
							border.left.color === border.bottom.color
							? `${border.left.width} ${border.left.style} ${border.left.color}`
							: '';
					case 'border-left':
						return border.left.width && border.left.style && border.left.color
							? `${border.left.width} ${border.left.style} ${border.left.color}`
							: '';
					case 'border-right':
						return border.right.width && border.right.style && border.right.color
							? `${border.right.width} ${border.right.style} ${border.right.color}`
							: '';
					case 'border-top':
						return border.top.width && border.top.style && border.top.color
							? `${border.top.width} ${border.top.style} ${border.top.color}`
							: '';
					case 'border-bottom':
						return border.bottom.width && border.bottom.style && border.bottom.color
							? `${border.bottom.width} ${border.bottom.style} ${border.bottom.color}`
							: '';
				}
		}

		return '';
	}

	/**
	 * Returns valid properties.
	 *
	 * @param propertyName Name.
	 * @param propertyValue Value.
	 * @returns Properties.
	 */
	public static getValidProperties(
		propertyName: string,
		propertyValue: string
	): { [k: string]: ICSSStyleDeclarationProperty } {
		const important = propertyValue.endsWith(' !important');
		const name = propertyName;
		const value = propertyValue.replace(' !important', '');
		let parts;

		switch (propertyName) {
			case 'border':
				parts = value.split(/ +/);

				if (
					parts.length < 2 ||
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
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
					parts.length < 2 ||
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
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
					!value ||
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
					(parts[1] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[1])) ||
					(parts[2] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[2])) ||
					(parts[3] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[3]))
				) {
					return {};
				}
				return {
					'border-top-left-radius': { name, important, value: parts[0] || parts[0] },
					'border-top-right-radius': { name, important, value: parts[1] || parts[0] },
					'border-bottom-right-radius': { name, important, value: parts[2] || parts[0] },
					'border-bottom-left-radius': { name, important, value: parts[3] || parts[1] || parts[0] }
				};
			case 'padding':
			case 'margin':
				parts = value.split(/ +/);
				if (
					!value ||
					!CSSStyleDeclarationPropertyValidator.validateSize(parts[0]) ||
					(parts[1] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[1])) ||
					(parts[2] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[2])) ||
					(parts[3] && !CSSStyleDeclarationPropertyValidator.validateSize(parts[3]))
				) {
					return {};
				}
				return {
					[`${name}-top`]: { name, important, value: parts[0] },
					[`${name}-right`]: { name, important, value: parts[1] || parts[0] },
					[`${name}-bottom`]: { name, important, value: parts[2] || parts[0] },
					[`${name}-left`]: { name, important, value: parts[3] || parts[1] || parts[0] }
				};
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
				if (!CSSStyleDeclarationPropertyValidator.validateSize(value)) {
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
}
