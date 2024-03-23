import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Element from '../element/Element.js';
import SVGSVGElement from './SVGSVGElement.js';
import Event from '../../event/Event.js';
import HTMLElementUtility from '../html-element/HTMLElementUtility.js';
import NamedNodeMap from '../../named-node-map/NamedNodeMap.js';
import SVGElementNamedNodeMap from './SVGElementNamedNodeMap.js';
import DatasetFactory from '../element/DatasetFactory.js';
import IDataset from '../element/IDataset.js';

/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element {
	// Events
	public onabort: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;
	public onload: (event: Event) => void | null = null;
	public onresize: (event: Event) => void | null = null;
	public onscroll: (event: Event) => void | null = null;
	public onunload: (event: Event) => void | null = null;

	// Internal properties
	public override [PropertySymbol.attributes]: NamedNodeMap = new SVGElementNamedNodeMap(this);
	public [PropertySymbol.style]: CSSStyleDeclaration | null = null;

	// Private properties
	#dataset: IDataset = null;

	/**
	 * Returns viewport.
	 *
	 * @returns SVG rect.
	 */
	public get viewportElement(): SVGElement {
		return null;
	}

	/**
	 * Returns current translate.
	 *
	 * @returns Element.
	 */
	public get ownerSVGElement(): SVGSVGElement {
		let parent = this[PropertySymbol.parentNode];
		while (parent) {
			if (parent[PropertySymbol.localName] === 'svg') {
				return <SVGSVGElement>parent;
			}

			parent = parent[PropertySymbol.parentNode];
		}
		return null;
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): IDataset {
		return (this.#dataset ??= DatasetFactory.createDataset(this));
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this[PropertySymbol.style]) {
			this[PropertySymbol.style] = new CSSStyleDeclaration(this);
		}
		return this[PropertySymbol.style];
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
