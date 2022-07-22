import IElement from '../../nodes/element/IElement';
import ComputedStylePropertyParser from './ComputedStylePropertyParser';
import CSSStyleDeclarationDefaultValues from './config/CSSStyleDeclarationDefaultValues';
import CSSStyleDeclarationNodeDefaultValues from './config/CSSStyleDeclarationNodeDefaultValues';
import CSSStyleDeclaration from '../declaration/CSSStyleDeclaration';
import CSSStyleDeclarationUtility from '../declaration/CSSStyleDeclarationUtility';

/**
 * Computed styles.
 */
export default class ComputedStyle {
	/**
	 * Converts style string to object.
	 *
	 * @param element Element.
	 * @returns Style object.
	 */
	public static getComputedStyle(element: IElement): CSSStyleDeclaration {
		const cssStyleDeclaration = new CSSStyleDeclaration();
		const styles = this.getStyles(element);

		for (const key of Object.keys(styles)) {
			cssStyleDeclaration.setProperty(key, styles[key]);
		}

		cssStyleDeclaration._readonly = true;

		return cssStyleDeclaration;
	}

	/**
	 * Returns property styles for element.
	 *
	 * @param element Element.
	 * @returns Styles.
	 */
	private static getStyles(element: IElement): { [k: string]: string } {
		const styles = {};

		if (element['_attributes']['style'] && element['_attributes']['style'].value) {
			const styleProperty = CSSStyleDeclarationUtility.styleStringToObject(
				element['_attributes']['style'].value
			);
			for (const key of Object.keys(styleProperty)) {
				Object.assign(styles, ComputedStylePropertyParser.parseProperty(key, styleProperty[key]));
			}
		}
		return Object.assign(
			CSSStyleDeclarationDefaultValues,
			CSSStyleDeclarationNodeDefaultValues[element.tagName],
			styles
		);
	}
}
