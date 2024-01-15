import Event from '../../event/Event.js';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import IElement from '../element/IElement.js';

/**
 * HTML Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.
 */
export default interface IHTMLElement extends IElement {
	accessKey: string;
	contentEditable: string;
	isContentEditable: boolean;
	dataset: { [key: string]: string };
	tabIndex: number;
	offsetHeight: number;
	offsetWidth: number;
	offsetLeft: number;
	offsetTop: number;
	clientHeight: number;
	clientWidth: number;
	clientLeft: number;
	clientTop: number;
	innerText: string;
	outerText: string;

	// Events
	oncopy: (event: Event) => void | null;
	oncut: (event: Event) => void | null;
	onpaste: (event: Event) => void | null;
	oninvalid: (event: Event) => void | null;
	onanimationcancel: (event: Event) => void | null;
	onanimationend: (event: Event) => void | null;
	onanimationiteration: (event: Event) => void | null;
	onanimationstart: (event: Event) => void | null;
	onbeforeinput: (event: Event) => void | null;
	oninput: (event: Event) => void | null;
	onchange: (event: Event) => void | null;
	ongotpointercapture: (event: Event) => void | null;
	onlostpointercapture: (event: Event) => void | null;
	onpointercancel: (event: Event) => void | null;
	onpointerdown: (event: Event) => void | null;
	onpointerenter: (event: Event) => void | null;
	onpointerleave: (event: Event) => void | null;
	onpointermove: (event: Event) => void | null;
	onpointerout: (event: Event) => void | null;
	onpointerover: (event: Event) => void | null;
	onpointerup: (event: Event) => void | null;
	ontransitioncancel: (event: Event) => void | null;
	ontransitionend: (event: Event) => void | null;
	ontransitionrun: (event: Event) => void | null;
	ontransitionstart: (event: Event) => void | null;

	get style(): CSSStyleDeclaration;
	set style(cssText: string | CSSStyleDeclaration | null);

	/**
	 * Triggers a click event.
	 */
	click(): void;

	/**
	 * Triggers a blur event.
	 */
	blur(): void;

	/**
	 * Triggers a focus event.
	 */
	focus(): void;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLElement;
}
