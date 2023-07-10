import IDOMTokenList from '../../dom-token-list/IDOMTokenList.js';
import IHTMLElement from '../html-element/IHTMLElement.js';
import IHTMLHyperlinkElementUtils from './IHTMLHyperlinkElementUtils.js';

/**
 * HTML Anchor Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLAnchorElement.
 */
export default interface IHTMLAnchorElement extends IHTMLElement, IHTMLHyperlinkElementUtils {
	readonly relList: IDOMTokenList;
	download: string;
	ping: string;
	hreflang: string;
	referrerPolicy: string;
	rel: string;
	target: string;
	text: string;
	type: string;
}
