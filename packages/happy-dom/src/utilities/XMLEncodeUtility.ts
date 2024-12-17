/**
 * Utility for encoding.
 */
export default class XMLEncodeUtility {
	/**
	 * Encodes attribute value.
	 *
	 * @param value Value.
	 * @returns Escaped value.
	 */
	public static encodeAttributeValue(value: string | null): string {
		if (value === null) {
			return '';
		}
		return value
			.replace(/&/gu, '&amp;')
			.replace(/"/gu, '&quot;')
			.replace(/</gu, '&lt;')
			.replace(/>/gu, '&gt;')
			.replace(/\t/gu, '&#x9;')
			.replace(/\n/gu, '&#xA;')
			.replace(/\r/gu, '&#xD;');
	}

	/**
	 * Decodes attribute value.
	 *
	 * @param value Value.
	 * @returns Decoded value.
	 */
	public static decodeAttributeValue(value: string | null): string {
		if (value === null) {
			return '';
		}

		return value
			.replace(/&amp;/gu, '&')
			.replace(/&quot;/gu, '"')
			.replace(/&lt;/gu, '<')
			.replace(/&gt;/gu, '>')
			.replace(/&#x9;/gu, '\t')
			.replace(/&#xA;/gu, '\n')
			.replace(/&#xD;/gu, '\r');
	}

	/**
	 * Encodes text content.
	 *
	 * @param text Value.
	 * @returns Escaped value.
	 */
	public static encodeTextContent(text: string | null): string {
		if (text === null) {
			return '';
		}

		return text
			.replace(/&/gu, '&amp;')
			.replace(/\xA0/gu, '&nbsp;')
			.replace(/</gu, '&lt;')
			.replace(/>/gu, '&gt;');
	}

	/**
	 * Decodes text content.
	 *
	 * @param text Value.
	 * @returns Decoded value.
	 */
	public static decodeTextContent(text: string | null): string {
		if (text === null) {
			return '';
		}

		return text
			.replace(/&amp;/gu, '&')
			.replace(/&nbsp;/gu, String.fromCharCode(160))
			.replace(/&lt;/gu, '<')
			.replace(/&gt;/gu, '>');
	}

	/**
	 * Decodes HTML entities.
	 *
	 * @param value Value.
	 * @returns Decoded value.
	 */
	public static decodeHTMLEntities(value: string): string {
		if (value === null) {
			return '';
		}

		return value
			.replace(/&amp;/gu, '&')
			.replace(/&lt;/gu, '<')
			.replace(/&gt;/gu, '>')
			.replace(/&nbsp;/gu, String.fromCharCode(160))
			.replace(/&quot;/gu, '"')
			.replace(/&apos;/gu, "'")
			.replace(/&#(\d+);/gu, (_match, dec) => String.fromCharCode(parseInt(dec, 10)))
			.replace(/&#x([A-Fa-f\d]+);/gu, (_match, hex) => String.fromCharCode(parseInt(hex, 16)));
	}

	/**
	 * Decodes XML entities.
	 *
	 * @param value Value.
	 * @returns Decoded value.
	 */
	public static decodeXMLEntities(value: string): string {
		if (value === null) {
			return '';
		}

		return (
			value
				.replace(/&amp;/gu, '&')
				.replace(/&lt;/gu, '<')
				.replace(/&gt;/gu, '>')
				// .replace(/&nbsp;/gu, String.fromCharCode(160))
				.replace(/&quot;/gu, '"')
				.replace(/&apos;/gu, "'")
				.replace(/&#(\d+);/gu, (_match, dec) => String.fromCharCode(parseInt(dec, 10)))
				.replace(/&#x([A-Fa-f\d]+);/gu, (_match, hex) => String.fromCharCode(parseInt(hex, 16)))
		);
	}
}
