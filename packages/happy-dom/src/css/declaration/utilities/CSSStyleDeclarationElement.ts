import IElement from '../../../nodes/element/IElement';

/**
 * CSS Style Declaration utility
 */
export default class CSSStyleDeclarationElement {
	/**
	 * Returns element style properties.
	 *
	 * @param element Element.
	 * @param [computed] Computed.
	 * @returns Element style properties.
	 */
	public static getElementStyle(element: IElement, computed: boolean): string {
		if (computed) {
			// TODO: Add logic for style sheets
		}
		if (element['_attributes']['style'] && element['_attributes']['style'].value) {
			return element['_attributes']['style'].value;
		}

		return null;
	}
}
