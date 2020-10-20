import CSSStyleDeclaration from '../../../css/CSSStyleDeclaration';
import IElement from '../element/IElement';

/**
 * HTMLElement.
 */
export default interface IHTMLElement extends IElement {
	style: CSSStyleDeclaration;
	tabIndex: number;
	offsetHeight: number;
	offsetWidth: number;
	offsetLeft: number;
	offsetTop: number;
	clientHeight: number;
	clientWidth: number;
	innerText: string;

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
}
