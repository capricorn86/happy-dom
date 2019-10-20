import HTMLElement from '../../basic-types/html-element/HTMLElement';

/**
 * SVGElement.
 */
export default class SVGElement extends HTMLElement {
	protected static _observedPropertyAttributes = Object.assign({}, HTMLElement._observedPropertyAttributes);

	/**
	 * Returns viewport.
	 *
	 * @return {SVGRect} SVG rect.
	 */
	public get viewportElement(): HTMLElement {
		return null;
	}

	/**
	 * Returns current translate.
	 *
	 * @return {HTMLElement} Element.
	 */
	public get ownerSVGElement(): HTMLElement {
		return null;
	}
}
