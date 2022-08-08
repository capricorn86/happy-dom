import IElement from '../../../nodes/element/IElement';
import ICSSStyleDeclarationProperty from '../ICSSStyleDeclarationProperty';
import CSSStyleDeclarationPropertyParser from './CSSStyleDeclarationStylePropertyParser';

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationStyleParser {
	/**
	 * Returns a style from a string.
	 *
	 * @param styleString Style string (e.g. "border: 2px solid red; font-size: 12px;").
	 * @returns Style.
	 */
	public static getStyleProperties(styleString: string): {
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
						const important = trimmedValue.endsWith(' !important');
						const valueWithoutImportant = trimmedValue.replace(' !important', '');

						if (valueWithoutImportant) {
							Object.assign(
								style,
								CSSStyleDeclarationPropertyParser.getValidProperties({
									name: trimmedName,
									value: valueWithoutImportant,
									important
								})
							);
						}
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
	public static getStyleString(style: { [k: string]: ICSSStyleDeclarationProperty }): string {
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
	public static getElementStyleProperties(
		element: IElement,
		computed: boolean
	): {
		[k: string]: ICSSStyleDeclarationProperty;
	} {
		if (computed) {
			// TODO: Add logic for style sheets
		}
		if (element['_attributes']['style'] && element['_attributes']['style'].value) {
			return this.getStyleProperties(element['_attributes']['style'].value);
		}

		return {};
	}
}
