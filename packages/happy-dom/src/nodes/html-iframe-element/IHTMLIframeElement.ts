import Event from '../../event/Event';
import IWindow from '../../window/IWindow';
import IDocument from '../document/IDocument';
import IHTMLElement from '../html-element/IHTMLElement';
import IframeCrossOriginWindow from './IframeCrossOriginWindow';

/**
 * HTML Iframe Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLIframeElement.
 */
export default interface IHTMLIframeElement extends IHTMLElement {
	src: string | null;
	allow: string | null;
	height: string | null;
	width: string | null;
	name: string | null;
	sandbox: string | null;
	srcdoc: string | null;
	readonly contentDocument: IDocument | null;
	readonly contentWindow: IWindow | IframeCrossOriginWindow | null;

	// Events
	onload: (event: Event) => void | null;
	onerror: (event: Event) => void | null;
}
