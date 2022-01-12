import CSSStyleDeclaration from '../../css/CSSStyleDeclaration';
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
}
