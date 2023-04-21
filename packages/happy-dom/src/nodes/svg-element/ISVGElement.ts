import Event from '../../event/Event';
import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration';
import IElement from '../element/IElement';
import ISVGSVGElement from './ISVGSVGElement';

/**
 * SVG Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */
export default interface ISVGElement extends IElement {
	readonly viewportElement: ISVGElement;
	readonly ownerSVGElement: ISVGSVGElement;
	readonly dataset: { [key: string]: string };
	readonly style: CSSStyleDeclaration;
	tabIndex: number;

	// Events
	onabort: (event: Event) => void | null;
	onerror: (event: Event) => void | null;
	onload: (event: Event) => void | null;
	onresize: (event: Event) => void | null;
	onscroll: (event: Event) => void | null;
	onunload: (event: Event) => void | null;

	/**
	 * Triggers a blur event.
	 */
	blur(): void;

	/**
	 * Triggers a focus event.
	 */
	focus(): void;
}
