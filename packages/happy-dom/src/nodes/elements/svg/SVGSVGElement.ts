import SVGGraphicsElement from './SVGGraphicsElement';
import Node from '../../basic/node/Node';
import SVGRect from './SVGRect';
import SVGPoint from './SVGPoint';
import SVGLength from './SVGLength';
import SVGAngle from './SVGAngle';
import SVGNumber from './SVGNumber';
import SVGTransform from './SVGTransform';
import SVGAnimatedRect from './SVGAnimatedRect';

/**
 * SVGSVGElement.
 */
export default class SVGSVGElement extends SVGGraphicsElement {
	public preserveAspectRatio = 'xMidYMid meet';
	public width = '';
	public height = '';
	public x = '';
	public y = '';
	public contentScriptType = '';

	public currentScale = 1;

	/**
	 * Returns viewport.
	 *
	 * @returns SVG rect.
	 */
	public get viewport(): SVGRect {
		return new SVGRect();
	}

	/**
	 * Returns current translate.
	 *
	 * @returns SVG point.
	 */
	public get currentTranslate(): SVGPoint {
		return new SVGPoint();
	}

	/**
	 * Returns view box.
	 *
	 * @returns Viewbox.
	 */
	public get viewBox(): SVGAnimatedRect {
		const rect = new SVGAnimatedRect();
		const viewBox = this.getAttribute('viewBox');
		const list = viewBox.split(/\s+/);
		rect.baseVal.x = Number(list[0]);
		rect.baseVal.y = Number(list[1]);
		rect.baseVal.width = Number(list[2]);
		rect.baseVal.height = Number(list[3]);
		return rect;
	}

	/**
	 * Pauses animation.
	 */
	public pauseAnimations(): void {}

	/**
	 * Unpauses animation.
	 */
	public unpauseAnimations(): void {}

	/**
	 * Returns "true" if animation is paused.
	 *
	 * @returns "true" if animation is paused.
	 */
	public animationsPaused(): boolean {
		return false;
	}

	/**
	 * Returns the current time in seconds relative to the start time for the current SVG document fragment.
	 *
	 * @returns Current time.
	 */
	public getCurrentTime(): number {
		return 0;
	}

	/**
	 * Sets current time.
	 */
	public setCurrentTime(): void {}

	/**
	 * Returns intersection list.
	 *
	 * @returns Intersection list.
	 */
	public getIntersectionList(): Node[] {
		return [];
	}

	/**
	 * Returns enclousure list.
	 *
	 * @returns Enclousure list.
	 */
	public getEnclosureList(): Node[] {
		return [];
	}

	/**
	 * Returns true if the rendered content of the given element intersects the supplied rectangle.
	 *
	 * @returns Intersection state.
	 */
	public checkIntersection(): boolean {
		return false;
	}

	/**
	 * Returns true if the rendered content of the given element is entirely contained within the supplied rectangle.
	 *
	 * @returns Enclousure state.
	 */
	public checkEnclosure(): boolean {
		return false;
	}

	/**
	 * Unselects any selected objects, including any selections of text strings and type-in bars.
	 */
	public deselectAll(): void {}

	/**
	 * Returns a number.
	 *
	 * @returns Number.
	 */
	public get createSVGNumber(): SVGNumber {
		return new SVGNumber();
	}

	/**
	 * Returns a length.
	 *
	 * @returns Length.
	 */
	public get createSVGLength(): SVGLength {
		return new SVGLength();
	}

	/**
	 * Returns a angle.
	 *
	 * @returns Angle.
	 */
	public get createSVGAngle(): SVGAngle {
		return new SVGAngle();
	}

	/**
	 * Returns a point.
	 *
	 * @returns Point.
	 */
	public get createSVGPoint(): SVGPoint {
		return new SVGPoint();
	}

	/**
	 * Returns a rect.
	 *
	 * @returns Rect.
	 */
	public get createSVGRect(): SVGRect {
		return new SVGRect();
	}

	/**
	 * Returns a transform.
	 *
	 * @returns Transform.
	 */
	public get createSVGTransform(): SVGTransform {
		return new SVGTransform();
	}

	/**
	 * @override
	 */
	public _setAttributeProperty(name: string, value: string): void {
		if (name.toLowerCase() === 'preserveAspectRatio') {
			this.preserveAspectRatio = value;
		} else {
			super._setAttributeProperty(name, value);
		}
	}
}
