import IconvLite from 'iconv-lite';

const CONTENT_TYPE_ENCODING_REGEXP = /charset=([^;]*)/i;

/**
 *
 */
export default class XMLHttpRequestResponseTextDecoder {
	/**
	 * Decodes response text.
	 *
	 * @param data Data.
	 * @param [contentType] Content type.
	 * @returns Decoded text.
	 **/
	public static decode(data: Buffer, contentType?: string): string {
		if (!contentType) {
			return IconvLite.decode(data, 'utf-8');
		}

		const contextTypeEncodingRegexp = new RegExp(CONTENT_TYPE_ENCODING_REGEXP, 'gi');
		const charset = contextTypeEncodingRegexp.exec(contentType);

		return IconvLite.decode(data, charset ? charset[1] : 'utf-8');
	}
}
