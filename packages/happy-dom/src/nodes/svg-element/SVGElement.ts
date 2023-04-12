import CSSStyleDeclaration from '../../css/declaration/CSSStyleDeclaration';
import Element from '../element/Element';
import ISVGElement from './ISVGElement';
import ISVGSVGElement from './ISVGSVGElement';
import IAttr from '../attr/IAttr';
import Event from '../../event/Event';
import Dataset from '../element/Dataset';

/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element implements ISVGElement {
	// Events
	public onabort: (event: Event) => void | null = null;
	public onerror: (event: Event) => void | null = null;
	public onload: (event: Event) => void | null = null;
	public onresize: (event: Event) => void | null = null;
	public onscroll: (event: Event) => void | null = null;
	public onunload: (event: Event) => void | null = null;

	private _style: CSSStyleDeclaration = null;
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
	 * @override
	 */
	public setAttributeNode(attribute: IAttr): IAttr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = attribute.value;
		}

		return replacedAttribute;
	}

	/**
	 * @override
	 */
	public removeAttributeNode(attribute: IAttr): IAttr {
		super.removeAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = '';
		}

		return attribute;
	}
}
