import IDocument from '../document/IDocument.js';
import URL from '../../url/URL.js';

/**
 * HTML Anchor Element utility.
 */
export default class HTMLAnchorElementUtility {
	/**
	 * Returns "true" if it is a blob URL.
	 *
	 * According to spec, if element's url is non-null, its scheme is "blob", and it has an opaque path, then the process of updating properties on the URL should be terminated.
	 *
	 * @see https://html.spec.whatwg.org/multipage/links.html#reinitialise-url
	 * @param url
	 * @param url URL.
	 * @returns "true" if blob URL.
	 */
	public static isBlobURL(url: URL): boolean {
		return (
			url && url.protocol === 'blob:' && url.pathname.length > 1 && url.pathname.includes('://')
		);
	}

	/**
	 * Returns URL.
	 *
	 * @see https://html.spec.whatwg.org/multipage/links.html#dom-hyperlink-href
	 * @see https://html.spec.whatwg.org/multipage/links.html#hyperlink
	 * @param document Document.
	 * @param href Href.
	 * @returns URL.
	 */
	public static getUrl(document: IDocument, href: string | null): URL {
		if (!href) {
			return null;
		}

		const documentUrl = document.location.href;

		try {
			return new URL(href.trim(), documentUrl);
		} catch (TypeError) {
			// Ignore error
		}

		return null;
	}
}
