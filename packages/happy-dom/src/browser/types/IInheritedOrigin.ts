import type BrowserWindow from '../../window/BrowserWindow.js';

/**
 * Origin of a document.
 *
 * "about:blank", "about:srcdoc" and "javascript:" documents inherit the origin of the document that created them.
 */
export default interface IInheritedOrigin {
	/**
	 * Origin as a string. "null" is an opaque origin (such as for "data:").
	 */
	origin: string;

	/**
	 * Window that identifies an opaque origin, as it is only the same origin as itself.
	 * Not set for other origins, to not keep a window that has navigated away reachable.
	 */
	window: BrowserWindow | null;
}
