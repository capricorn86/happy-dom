import CSSRule from './CSSRule';
import CSSStyleDeclaration from './CSSStyleDeclaration';

/**
 * CSSStyleDeclaration interface.
 */
export default class CSSStyleDeclarationFactory {
	/**
	 * Create a CSSStyleDeclaration.
	 *
	 * @param [cssText] CSS text.
	 * @param [parentRule] Parent rule.
	 */
	public static createCSSStyleDeclaration(
		cssText: string = null,
		parentRule: CSSRule = null
	): CSSStyleDeclaration {
		const cssStyleDeclaration = new CSSStyleDeclaration();
		// @ts-ignore
		cssStyleDeclaration.parentRule = parentRule;

		if (cssText) {
			for (const part of cssText.replace(/[\n\r]/gm, '').split(';')) {
				const [key, value] = part.split(':');
				if (key && value) {
					cssStyleDeclaration.setProperty(key.trim(), value.trim());
				}
			}
		}

		return cssStyleDeclaration;
	}
}
