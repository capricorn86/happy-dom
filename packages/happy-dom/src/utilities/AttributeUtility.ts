import DOMException from '../exception/DOMException.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

const HTML_INVALID_ATTRIBUTE_NAME_CHARACTER_REGEX =
	/[\x00-\x1F\x7F\x80-\x9F "\'><=\/\uFDD0-\uFDEF\uFFFE\uFFFF\u1FFFE\u1FFFF\u2FFFE\u2FFFF\u3FFFE\u3FFFF\u4FFFE\u4FFFF\u5FFFE\u5FFFF\u6FFFE\u6FFFF\u7FFFE\u7FFFF\u8FFFE\u8FFFF\u9FFFE\u9FFFF\uAFFFE\uAFFFF\uBFFFE\uBFFFF\uCFFFE\uCFFFF\uDFFFE\uDFFFF\uEFFFE\uEFFFF\uFFFFE\uFFFFF\u10FFFE\u10FFFF]/;

/**
 * Attribute utility
 */
export class AttributeUtility {
	/**
	 *
	 * @param name the attribute name
	 * @param contentType the attribute has to be valid in
	 * @param context the context in which the error occurred in
	 * @param context.method
	 * @param context.instance
	 */
	public static validateAttributeName(
		name: unknown,
		contentType: string,
		context: {
			method: string;
			instance: string;
		}
	): void {
		const { method, instance } = context;
		if (contentType === 'text/html') {
			const normalizedName = String(name).toLowerCase();
			if (
				HTML_INVALID_ATTRIBUTE_NAME_CHARACTER_REGEX.test(normalizedName) ||
				normalizedName.length === 0 ||
				normalizedName[0] === '-'
			) {
				throw new DOMException(
					`Uncaught InvalidCharacterError: Failed to execute '${method}' on '${instance}': '${name}' is not a valid attribute name.`,
					DOMExceptionNameEnum.invalidCharacterError
				);
			}
		}
		// TODO: implement XML and other content types
	}
}
