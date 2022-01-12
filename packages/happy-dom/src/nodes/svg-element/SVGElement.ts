import CSSStyleDeclaration from '../../css/CSSStyleDeclaration';
import Element from '../element/Element';
import ISVGElement from './ISVGElement';
import ISVGSVGElement from './ISVGSVGElement';
import Attr from '../../attribute/Attr';

/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element implements ISVGElement {
	private _style: CSSStyleDeclaration = null;

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
		const parent = this.parentNode;
		while (parent) {
			if (parent['tagName'] === 'SVG') {
				return <ISVGSVGElement>parent;
			}
		}
		return null;
	}

	/**
	 * Returns data set.
	 *
	 * @returns Data set.
	 */
	public get dataset(): { [key: string]: string } {
		const dataset = {};
		for (const name of Object.keys(this._attributes)) {
			if (name.startsWith('data-')) {
				dataset[name.replace('data-', '')] = this._attributes[name].value;
			}
		}
		return dataset;
	}

	/**
	 * Returns style.
	 *
	 * @returns Style.
	 */
	public get style(): CSSStyleDeclaration {
		if (!this._style) {
			this._style = new CSSStyleDeclaration(this._attributes);
		}
		return this._style;
	}

	/**
	 * The setAttributeNode() method adds a new Attr node to the specified element.
	 *
	 * @override
	 * @param attribute Attribute.
	 * @returns Replaced attribute.
	 */
	public setAttributeNode(attribute: Attr): Attr {
		const replacedAttribute = super.setAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = attribute.value;
		}

		return replacedAttribute;
	}

	/**
	 * Removes an Attr node.
	 *
	 * @override
	 * @param attribute Attribute.
	 */
	public removeAttributeNode(attribute: Attr): void {
		super.removeAttributeNode(attribute);

		if (attribute.name === 'style' && this._style) {
			this._style.cssText = '';
		}
	}
}
