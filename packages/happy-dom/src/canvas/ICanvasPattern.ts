import type DOMMatrix from '../dom/dom-matrix/DOMMatrix.js';

/**
 * The CanvasPattern interface represents an opaque object describing a pattern, based on an image, a canvas, or a video, created by the CanvasRenderingContext2D.createPattern() method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasPattern
 */
export default interface ICanvasPattern {
	setTransform(transform?: DOMMatrix): void;
}
