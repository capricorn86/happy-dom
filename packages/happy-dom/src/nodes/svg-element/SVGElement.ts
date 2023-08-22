import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import Element from '../element/Element.js';
import ISVGElement from './ISVGElement.js';
import ISVGSVGElement from './ISVGSVGElement.js';
import Event from '../../event/Event.js';
import Dataset from '../element/Dataset.js';
import HTMLElementUtility from '../html-element/HTMLElementUtility.js';
import INamedNodeMap from '../../named-node-map/INamedNodeMap.js';
import SVGElementNamedNodeMap from './SVGElementNamedNodeMap.js';

/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element implements ISVGElement {
	public override readonly attributes: INamedNodeMap = new SVGElementNamedNodeMap(this);

	// Events
	public onabort: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;
	public onload: (event: Event) => void | null = null;
	public onresize: (event: Event) => void | null = null;
	public onscroll: (event: Event) => void | null = null;
	public onunload: (event: Event) => void | null = null;

	// Private properties
	public _style: CSSStyleDeclaration = null;
	private _dataset: Dataset = null;

	/**
	 * Returns viewport.
	 *
	 * @returns SVG rect.
	 */
	public get viewportElement(): ISVGElement {
		return null;
	}

	/**
	 * Returns current translate.
	 *
	 * @returns Element.
	 */
	public get ownerSVGElement(): ISVGSVGElement {
		let parent = this.parentNode;
		while (parent) {
			if (parent['tagName'] === 'SVG') {
				return <ISVGSVGElement>parent;
			}

			parent = parent.parentNode;
		}
		return null;
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): { [key: string]: string } {
		return (this._dataset ??= new Dataset(this)).proxy;
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this._style) {
			this._style = new CSSStyleDeclaration(this);
		}
		return this._style;
	}

	/**
	 * Returns tab index.
	 *
	 * @returns Tab index.
	 */
	public get tabIndex(): number {
		const tabIndex = this.getAttribute('tabindex');
		return tabIndex !== null ? Number(tabIndex) : -1;
	}

	/**
	 * Returns tab index.
	 *
	 * @param tabIndex Tab index.
	 */
	public set tabIndex(tabIndex: number) {
		if (tabIndex === -1) {
			this.removeAttribute('tabindex');
		} else {
			this.setAttribute('tabindex', String(tabIndex));
		}
	}

	/**
	 * Triggers a blur event.
	 */
	public blur(): void {
		HTMLElementUtility.blur(this);
	}

	/**
	 * Triggers a focus event.
	 */
	public focus(): void {
		HTMLElementUtility.focus(this);
	}
}
