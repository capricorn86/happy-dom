import HTMLElement from '../../basic/html-element/HTMLElement';

/**
 * SVGElement.
 */
export default class SVGElement extends HTMLElement {
	/**
	 * Returns viewport.
	 *
	 * @returns SVG rect.
	 */
	public get viewportElement(): HTMLElement {
		return null;
	}

	/**
	 * Returns current translate.
	 *
	 * @returns Element.
	 */
	public get ownerSVGElement(): HTMLElement {
		return null;
	}
}
