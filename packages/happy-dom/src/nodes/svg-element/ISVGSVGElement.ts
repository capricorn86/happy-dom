import Event from '../../event/Event.js';
import INode from '../node/INode.js';
import ISVGGraphicsElement from './ISVGGraphicsElement.js';
import SVGAngle from './SVGAngle.js';
import SVGAnimatedRect from './SVGAnimatedRect.js';
import SVGLength from './SVGLength.js';
import SVGNumber from './SVGNumber.js';
import SVGPoint from './SVGPoint.js';
import SVGRect from './SVGRect.js';
import SVGTransform from './SVGTransform.js';

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

	// Events
	onafterprint: (event: Event) => void | null;
	onbeforeprint: (event: Event) => void | null;
	onbeforeunload: (event: Event) => void | null;
	ongamepadconnected: (event: Event) => void | null;
	ongamepaddisconnected: (event: Event) => void | null;
	onhashchange: (event: Event) => void | null;
	onlanguagechange: (event: Event) => void | null;
	onmessage: (event: Event) => void | null;
	onmessageerror: (event: Event) => void | null;
	onoffline: (event: Event) => void | null;
	ononline: (event: Event) => void | null;
	onpagehide: (event: Event) => void | null;
	onpageshow: (event: Event) => void | null;
	onpopstate: (event: Event) => void | null;
	onrejectionhandled: (event: Event) => void | null;
	onstorage: (event: Event) => void | null;
	onunhandledrejection: (event: Event) => void | null;
	onunload: (event: Event) => void | null;

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
	cloneNode(deep?: boolean): ISVGSVGElement;
}
