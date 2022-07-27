import IElement from '../../../nodes/element/IElement';
import ICSSStyleDeclarationProperty from '../ICSSStyleDeclarationProperty';
import CSSStyleDeclarationPropertyParser from './CSSStyleDeclarationPropertyParser';

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationUtility {
	/**
	 * Returns a style from a string.
	 *
	 * @param styleString Style string (e.g. "border: 2px solid red; font-size: 12px;").
	 * @returns Style.
	 */
	public static stringToStyle(styleString: string): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		const style = {};
		const parts = styleString.split(';');

		for (const part of parts) {
			if (part) {
				const [name, value]: string[] = part.trim().split(':');
				if (value) {
					const trimmedName = name.trim();
					const trimmedValue = value.trim();
					if (trimmedName && trimmedValue) {
						Object.assign(
							style,
							CSSStyleDeclarationPropertyParser.parseProperty(trimmedName, trimmedValue)
						);
					}
				}
			}
		}

		return style;
	}

	/**
	 * Returns a style string.
	 *
	 * @param style Style.
	 * @returns Styles as string.
	 */
	public static styleToString(style: { [k: string]: ICSSStyleDeclarationProperty }): string {
		let styleString = '';

		for (const property of Object.values(style)) {
			if (styleString) {
				styleString += ' ';
			}
			styleString += `${property.name}: ${property.value}${
				property.important ? ' !important' : ''
			};`;
		}

		return styleString;
	}

	/**
	 * Returns element style properties.
	 *
	 * @param element Element.
	 * @param [computed] Computed.
	 * @returns Element style properties.
	 */
	public static getElementStyle(
		element: IElement,
		computed = false
	): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		if (computed) {
			// TODO: Add logic for style sheets
		}
		if (element['_attributes']['style'] && element['_attributes']['style'].value) {
			return this.stringToStyle(element['_attributes']['style'].value);
		}

		return {};
	}

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
}
