import SVGGraphicsElement from './SVGGraphicsElement';
import Node from '../basic-types/Node';
import SVGRect from '../../html-element/SVGRect';
import SVGPoint from '../../html-element/SVGPoint';
import SVGLength from '../../html-element/SVGLength';
import SVGAngle from '../../html-element/SVGAngle';
import SVGNumber from '../../html-element/SVGNumber';
import SVGTransform from '../../html-element/SVGTransform';
import SVGAnimatedRect from '../../html-element/SVGAnimatedRect';
import * as SVGSVGElementPropertyAttributes from './SVGSVGElementPropertyAttributes.json';

/**
 * SVGSVGElement.
 */
export default class SVGSVGElement extends SVGGraphicsElement {
	protected static _observedPropertyAttributes = Object.assign({}, SVGGraphicsElement._observedPropertyAttributes, SVGSVGElementPropertyAttributes);
	
	public preserveAspectRatio: string = 'xMidYMid meet';
	public width: string = '';
	public height: string = '';
	public x: string = '';
	public y: string = '';
	public contentScriptType: string = '';

	public currentScale = 1;

    /**
     * Returns viewport.
     * 
     * @return {SVGRect} SVG rect.
     */
    public get viewport(): SVGRect {
        return new SVGRect();
    }

    /**
     * Returns current translate.
     * 
     * @return {SVGPoint} SVG point.
     */
    public get currentTranslate(): SVGPoint {
        return new SVGPoint();
    }

    /**
     * Returns view box.
     * 
     * @return {SVGAnimatedRect} Viewbox.
     */
    public get viewBox(): SVGAnimatedRect {
        return new SVGAnimatedRect();
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
	 * @returns {boolean} "true" if animation is paused.
	 */
	public animationsPaused(): boolean {
		return false;
	}
	
	/**
	 * Returns the current time in seconds relative to the start time for the current SVG document fragment.
	 * 
	 * @returns {number} Current time.
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
	 * @returns {Node[]} Intersection list.
	 */
	public getIntersectionList(): Node[] {
		return [];
	}
	
	/**
	 * Returns enclousure list.
	 * 
	 * @returns {Node[]} Enclousure list.
	 */
	public getEnclosureList(): Node[] {
		return [];
	}
	
	/**
	 * Returns true if the rendered content of the given element intersects the supplied rectangle.
	 * 
	 * @returns {boolean} Intersection state.
	 */
	public checkIntersection(): boolean {
		return false;
	}
	
	/**
	 * Returns true if the rendered content of the given element is entirely contained within the supplied rectangle.
	 * 
	 * @returns {boolean} Enclousure state.
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
     * @return {SVGNumber} Number.
     */
    public get createSVGNumber(): SVGNumber {
        return new SVGNumber();
    }

    /**
     * Returns a length.
     * 
     * @return {SVGLength} Length.
     */
    public get createSVGLength(): SVGLength {
        return new SVGLength();
    }

    /**
     * Returns a angle.
     * 
     * @return {SVGAngle} Angle.
     */
    public get createSVGAngle(): SVGAngle {
        return new SVGAngle();
    }

    /**
     * Returns a point.
     * 
     * @return {SVGPoint} Point.
     */
    public get createSVGPoint(): SVGPoint {
        return new SVGPoint();
    }

    /**
     * Returns a rect.
     * 
     * @return {SVGRect} Rect.
     */
    public get createSVGRect(): SVGRect {
        return new SVGRect();
    }

    /**
     * Returns a transform.
     * 
     * @return {SVGTransform} Transform.
     */
    public get createSVGTransform(): SVGTransform {
        return new SVGTransform();
    }
}
