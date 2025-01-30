const INVALID_CHARACTER_REGEX =
	/[\x00-\x1F\x7F\x80-\x9F "\'><=\/\uFDD0-\uFDEF\uFFFE\uFFFF\u1FFFE\u1FFFF\u2FFFE\u2FFFF\u3FFFE\u3FFFF\u4FFFE\u4FFFF\u5FFFE\u5FFFF\u6FFFE\u6FFFF\u7FFFE\u7FFFF\u8FFFE\u8FFFF\u9FFFE\u9FFFF\uAFFFE\uAFFFF\uBFFFE\uBFFFF\uCFFFE\uCFFFF\uDFFFE\uDFFFF\uEFFFE\uEFFFF\uFFFFE\uFFFFF\u10FFFE\u10FFFF]/;

/**
 * Attribute utility
 */
export class AttributeUtility {
	/**
	 *
	 * @param name the attribute name
	 */
	public static isValidAttributeName(name: unknown): boolean {
		return INVALID_CHARACTER_REGEX.test(String(name));
	}
}
