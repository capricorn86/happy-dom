import Event from '../../event/Event.js';
import IBrowserWindow from '../../window/IBrowserWindow.js';
import IDocument from '../document/IDocument.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import ICrossOriginBrowserWindow from '../../window/ICrossOriginBrowserWindow.js';

/**
 * HTML Iframe Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement.
 */
export default interface IHTMLIFrameElement extends IHTMLElement {
	src: string | null;
	allow: string | null;
	height: string | null;
	width: string | null;
	name: string | null;
	sandbox: string | null;
	srcdoc: string | null;
	readonly contentDocument: IDocument | null;
	readonly contentWindow: IBrowserWindow | ICrossOriginBrowserWindow | null;

	// Events
	onload: (event: Event) => void | null;
	onerror: (event: Event) => void | null;
}
