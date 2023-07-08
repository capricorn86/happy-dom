import SVGGraphicsElement from './SVGGraphicsElement.js';
import SVGRect from './SVGRect.js';
import SVGPoint from './SVGPoint.js';
import SVGLength from './SVGLength.js';
import SVGAngle from './SVGAngle.js';
import SVGNumber from './SVGNumber.js';
import SVGTransform from './SVGTransform.js';
import SVGAnimatedRect from './SVGAnimatedRect.js';
import ISVGSVGElement from './ISVGSVGElement.js';
import INode from '../node/INode.js';
import Event from '../../event/Event.js';

/**
 * SVGSVGElement.
 */
export default class SVGSVGElement extends SVGGraphicsElement implements ISVGSVGElement {
	// Events
	public onafterprint: (event: Event) => void | null = null;
	public onbeforeprint: (event: Event) => void | null = null;
	public onbeforeunload: (event: Event) => void | null = null;
	public ongamepadconnected: (event: Event) => void | null = null;
	public ongamepaddisconnected: (event: Event) => void | null = null;
	public onhashchange: (event: Event) => void | null = null;
	public onlanguagechange: (event: Event) => void | null = null;
	public onmessage: (event: Event) => void | null = null;
	public onmessageerror: (event: Event) => void | null = null;
	public onoffline: (event: Event) => void | null = null;
	public ononline: (event: Event) => void | null = null;
	public onpagehide: (event: Event) => void | null = null;
	public onpageshow: (event: Event) => void | null = null;
	public onpopstate: (event: Event) => void | null = null;
	public onrejectionhandled: (event: Event) => void | null = null;
	public onstorage: (event: Event) => void | null = null;
	public onunhandledrejection: (event: Event) => void | null = null;
	public onunload: (event: Event) => void | null = null;

	/**
	 * Returns preserveAspectRatio.
	 *
	 * @returns PreserveAspectRatio.
	 */
	public get preserveAspectRatio(): string {
		return this.getAttributeNS(null, 'preserveAspectRatio') || 'xMidYMid meet';
	}

	/**
	 * Sets preserveAspectRatio.
	 *
	 * @param preserveAspectRatio PreserveAspectRatio.
	 */
	public set preserveAspectRatio(preserveAspectRatio: string) {
		this.setAttributeNS(null, 'preserveAspectRatio', preserveAspectRatio);
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): string {
		return this.getAttributeNS(null, 'width') || '';
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: string) {
		this.setAttributeNS(null, 'width', width);
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): string {
		return this.getAttributeNS(null, 'height') || '';
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: string) {
		this.setAttributeNS(null, 'height', height);
	}

	/**
	 * Returns x.
	 *
	 * @returns X.
	 */
	public get x(): string {
		return this.getAttributeNS(null, 'x') || '';
	}

	/**
	 * Sets x.
	 *
	 * @param x X.
	 */
	public set x(x: string) {
		this.setAttributeNS(null, 'x', x);
	}

	/**
	 * Returns y.
	 *
	 * @returns Y.
	 */
	public get y(): string {
		return this.getAttributeNS(null, 'y') || '';
	}

	/**
	 * Sets y.
	 *
	 * @param y Y.
	 */
	public set y(y: string) {
		this.setAttributeNS(null, 'y', y);
	}

	/**
	 * Returns contentScriptType.
	 *
	 * @returns ContentScriptType.
	 */
	public get contentScriptType(): string {
		return this.getAttributeNS(null, 'contentScriptType') || '';
	}

	/**
	 * Sets contentScriptType.
	 *
	 * @param contentScriptType ContentScriptType.
	 */
	public set contentScriptType(contentScriptType: string) {
		this.setAttributeNS(null, 'contentScriptType', contentScriptType);
	}

	/**
	 * Returns currentScale.
	 *
	 * @returns CurrentScale.
	 */
	public get currentScale(): number {
		const currentScale = this.getAttributeNS(null, 'currentScale');
		if (currentScale !== null) {
			return parseFloat(currentScale);
		}
		return 1;
	}

	/**
	 * Sets currentScale.
	 *
	 * @param currentScale CurrentScale.
	 */
	public set currentScale(currentScale: number) {
		this.setAttributeNS(null, 'currentScale', String(currentScale));
	}

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
	public getIntersectionList(): INode[] {
		return [];
	}

	/**
	 * Returns enclousure list.
	 *
	 * @returns Enclousure list.
	 */
	public getEnclosureList(): INode[] {
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
	public createSVGNumber(): SVGNumber {
		return new SVGNumber();
	}

	/**
	 * Returns a length.
	 *
	 * @returns Length.
	 */
	public createSVGLength(): SVGLength {
		return new SVGLength();
	}

	/**
	 * Returns a angle.
	 *
	 * @returns Angle.
	 */
	public createSVGAngle(): SVGAngle {
		return new SVGAngle();
	}

	/**
	 * Returns a point.
	 *
	 * @returns Point.
	 */
	public createSVGPoint(): SVGPoint {
		return new SVGPoint();
	}

	/**
	 * Returns a rect.
	 *
	 * @returns Rect.
	 */
	public createSVGRect(): SVGRect {
		return new SVGRect();
	}

	/**
	 * Returns a transform.
	 *
	 * @returns Transform.
	 */
	public createSVGTransform(): SVGTransform {
		return new SVGTransform();
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	public cloneNode(deep = false): ISVGSVGElement {
		return <ISVGSVGElement>super.cloneNode(deep);
	}
}
