import type FormData from '../form-data/FormData.js';

/**
 * State shared by all history items that belong to the same document.
 *
 * @see https://html.spec.whatwg.org/multipage/browsing-the-web.html#document-state-2
 */
export default interface IHistoryDocumentState {
	// URL the document was loaded from, used for origin checks.
	url: string;
	// Request method used to reload the document.
	method: string;
	// Request form-data used to reload the document.
	formData: FormData | null;
	// Origin inherited from the parent or opener frame when the navigation started, or null if the document doesn't inherit an origin.
	inheritedOrigin: string | null;
}
