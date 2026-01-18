import { decodeHTML } from 'entities';

/**
 * Pre-compiled RegExp patterns for encoding/decoding.
 * Using pre-compiled patterns avoids RegExp compilation on each call.
 */

// Encoding patterns
const ENCODE_XML_ATTR_REGEXP = /[&"<>\t\n\r]/g;
const ENCODE_HTML_ATTR_REGEXP = /[&"]/g;
const ENCODE_TEXT_CONTENT_REGEXP = /[&\xA0<>]/g;

// Decoding patterns
const DECODE_XML_ATTR_REGEXP = /&(?:quot|lt|gt|amp|#x9|#xA|#xD);/g;
const DECODE_HTML_ATTR_REGEXP = /&(?:quot|amp);/g;
const DECODE_TEXT_CONTENT_REGEXP = /&(?:nbsp|lt|gt|amp);/g;
const DECODE_XML_ENTITIES_REGEXP = /&(?:lt|gt|quot|apos|#(\d+)|#x([A-Fa-f\d]+)|amp);/g;

// Encoding lookup tables
const ENCODE_XML_ATTR_MAP: { [key: string]: string } = {
	'&': '&amp;',
	'"': '&quot;',
	'<': '&lt;',
	'>': '&gt;',
	'\t': '&#x9;',
	'\n': '&#xA;',
	'\r': '&#xD;'
};

const ENCODE_HTML_ATTR_MAP: { [key: string]: string } = {
	'&': '&amp;',
	'"': '&quot;'
};

const ENCODE_TEXT_CONTENT_MAP: { [key: string]: string } = {
	'&': '&amp;',
	'\xA0': '&nbsp;',
	'<': '&lt;',
	'>': '&gt;'
};

// Decoding lookup tables
const DECODE_XML_ATTR_MAP: { [key: string]: string } = {
	'&quot;': '"',
	'&lt;': '<',
	'&gt;': '>',
	'&#x9;': '\t',
	'&#xA;': '\n',
	'&#xD;': '\r',
	'&amp;': '&'
};

const DECODE_HTML_ATTR_MAP: { [key: string]: string } = {
	'&quot;': '"',
	'&amp;': '&'
};

const DECODE_TEXT_CONTENT_MAP: { [key: string]: string } = {
	'&nbsp;': String.fromCharCode(160),
	'&lt;': '<',
	'&gt;': '>',
	'&amp;': '&'
};

const DECODE_ENTITIES_MAP: { [key: string]: string } = {
	'&lt;': '<',
	'&gt;': '>',
	'&nbsp;': String.fromCharCode(160),
	'&quot;': '"',
	'&apos;': "'",
	'&amp;': '&'
};

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
	public static encodeXMLAttributeValue(value: string | null): string {
		if (value === null) {
			return '';
		}
		return value.replace(ENCODE_XML_ATTR_REGEXP, (char) => ENCODE_XML_ATTR_MAP[char]);
	}

	/**
	 * Decodes attribute value.
	 *
	 * @param value Value.
	 * @returns Decoded value.
	 */
	public static decodeXMLAttributeValue(value: string | null): string {
		if (value === null) {
			return '';
		}
		return value.replace(DECODE_XML_ATTR_REGEXP, (entity) => DECODE_XML_ATTR_MAP[entity]);
	}

	/**
	 * Encodes attribute value.
	 *
	 * @param value Value.
	 * @returns Escaped value.
	 */
	public static encodeHTMLAttributeValue(value: string | null): string {
		if (value === null) {
			return '';
		}
		return value.replace(ENCODE_HTML_ATTR_REGEXP, (char) => ENCODE_HTML_ATTR_MAP[char]);
	}

	/**
	 * Decodes attribute value.
	 *
	 * @param value Value.
	 * @returns Decoded value.
	 */
	public static decodeHTMLAttributeValue(value: string | null): string {
		if (value === null) {
			return '';
		}
		return value.replace(DECODE_HTML_ATTR_REGEXP, (entity) => DECODE_HTML_ATTR_MAP[entity]);
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
		return text.replace(ENCODE_TEXT_CONTENT_REGEXP, (char) => ENCODE_TEXT_CONTENT_MAP[char]);
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
		return text.replace(DECODE_TEXT_CONTENT_REGEXP, (entity) => DECODE_TEXT_CONTENT_MAP[entity]);
	}

	/**
	 * Decodes HTML entities.
	 *
	 * Uses the 'entities' library for comprehensive HTML5 named character reference support.
	 *
	 * @param value Value.
	 * @returns Decoded value.
	 */
	public static decodeHTMLEntities(value: string): string {
		if (value === null) {
			return '';
		}

		return decodeHTML(value);
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
		// Note: "&nbsp;" is not supported in XML
		return value.replace(DECODE_XML_ENTITIES_REGEXP, (match, dec, hex) => {
			if (dec !== undefined) {
				return String.fromCodePoint(parseInt(dec, 10));
			}
			if (hex !== undefined) {
				return String.fromCodePoint(parseInt(hex, 16));
			}
			return DECODE_ENTITIES_MAP[match];
		});
	}
}
