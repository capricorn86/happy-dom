import Element from '../element/Element';
import ISVGElement from './ISVGElement';
import ISVGSVGElement from './ISVGSVGElement';

/**
 * SVG Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/SVGElement.
 */
export default class SVGElement extends Element implements ISVGElement {
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
}
