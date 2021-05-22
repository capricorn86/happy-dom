import INode from '../node/INode';
import ISVGGraphicsElement from './ISVGGraphicsElement';
import SVGAngle from './SVGAngle';
import SVGAnimatedRect from './SVGAnimatedRect';
import SVGLength from './SVGLength';
import SVGNumber from './SVGNumber';
import SVGPoint from './SVGPoint';
import SVGRect from './SVGRect';
import SVGTransform from './SVGTransform';

/**
 * SVG Graphics Element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement
 */
export default interface ISVGSVGElement extends ISVGGraphicsElement {
	preserveAspectRatio: string;
	width: string;
	height: string;
	x: string;
	y: string;
	contentScriptType: string;
	currentScale: number;
	viewport: SVGRect;
	currentTranslate: SVGPoint;
	viewBox: SVGAnimatedRect;

	/**
	 * Pauses animation.
	 */
	pauseAnimations(): void;

	/**
	 * Unpauses animation.
	 */
	unpauseAnimations(): void;

	/**
	 * Returns "true" if animation is paused.
	 *
	 * @returns "true" if animation is paused.
	 */
	animationsPaused(): boolean;

	/**
	 * Returns the current time in seconds relative to the start time for the current SVG document fragment.
	 *
	 * @returns Current time.
	 */
	getCurrentTime(): number;

	/**
	 * Sets current time.
	 */
	setCurrentTime(): void;

	/**
	 * Returns intersection list.
	 *
	 * @returns Intersection list.
	 */
	getIntersectionList(): INode[];

	/**
	 * Returns enclousure list.
	 *
	 * @returns Enclousure list.
	 */
	getEnclosureList(): INode[];

	/**
	 * Returns true if the rendered content of the given element intersects the supplied rectangle.
	 *
	 * @returns Intersection state.
	 */
	checkIntersection(): boolean;

	/**
	 * Returns true if the rendered content of the given element is entirely contained within the supplied rectangle.
	 *
	 * @returns Enclousure state.
	 */
	checkEnclosure(): boolean;

	/**
	 * Unselects any selected objects, including any selections of text strings and type-in bars.
	 */
	deselectAll(): void;

	/**
	 * Returns a number.
	 *
	 * @returns Number.
	 */
	createSVGNumber(): SVGNumber;

	/**
	 * Returns a length.
	 *
	 * @returns Length.
	 */
	createSVGLength(): SVGLength;

	/**
	 * Returns a angle.
	 *
	 * @returns Angle.
	 */
	createSVGAngle(): SVGAngle;

	/**
	 * Returns a point.
	 *
	 * @returns Point.
	 */
	createSVGPoint(): SVGPoint;

	/**
	 * Returns a rect.
	 *
	 * @returns Rect.
	 */
	createSVGRect(): SVGRect;

	/**
	 * Returns a transform.
	 *
	 * @returns Transform.
	 */
	createSVGTransform(): SVGTransform;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep: boolean): ISVGSVGElement;
}
