import IHTMLElement from '../html-element/IHTMLElement.js';

/**
 * HTML Meta Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMetaElement.
 */
export default interface IHTMLMetaElement extends IHTMLElement {
	content: string;
	httpEquiv: string;
	name: string;
	scheme: string;
}
