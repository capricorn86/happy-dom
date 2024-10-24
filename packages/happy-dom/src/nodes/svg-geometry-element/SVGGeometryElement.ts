import SVGGraphicsElement from '../svg-graphics-element/SVGGraphicsElement.js';
import SVGAnimatedNumber from '../../svg/SVGAnimatedNumber.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * SVG Geometry Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement
 */
export default class SVGGeometryElement extends SVGGraphicsElement {
	// Internal properties
	public [PropertySymbol.pathLength]: SVGAnimatedNumber | null = null;

	/**
	 * Returns path length.
	 *
	 * @returns Path length.
	 */
	public get pathLength(): SVGAnimatedNumber {
		if (!this[PropertySymbol.pathLength]) {
			this[PropertySymbol.pathLength] = new SVGAnimatedNumber(
				PropertySymbol.illegalConstructor,
				this[PropertySymbol.window],
				{
					getAttribute: () => this.getAttribute('pathLength'),
					setAttribute: (value) => this.setAttribute('pathLength', value)
				}
			);
		}
		return this[PropertySymbol.pathLength]!;
	}

	/**
	 * Returns true if the point is in the fill of the element.
	 *
	 * Not implemented yet.
	 *
	 * @param _domPoint DOM point.
	 * @returns True if the point is in the fill of the element.
	 */
	public isPointInFill(_domPoint: object): boolean {
		// TODO: Implement isPointInFill()
		return false;
	}

	/**
	 * Returns true if the point is in the stroke of the element.
	 *
	 * Not implemented yet.
	 *
	 * @param _domPoint DOM point.
	 * @returns True if the point is in the stroke of the element.
	 */
	public isPointInStroke(_domPoint: object): boolean {
		// TODO: Implement isPointInStroke()
		return false;
	}

	/**
	 * Returns total length.
	 *
	 * Not implemented yet.
	 *
	 * @returns Total length.
	 */
	public getTotalLength(): number {
		// TODO: Implement getTotalLength()
		return 0;
	}

	/**
	 * Returns point at length.
	 *
	 * Not implemented yet.
	 *
	 * @param _distance Distance.
	 * @returns Point at length.
	 */
	public getPointAtLength(_distance: number): object {
		// TODO: Implement getPointAtLength()
		return {};
	}
}
