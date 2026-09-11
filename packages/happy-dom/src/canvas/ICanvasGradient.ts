/**
 * The CanvasGradient interface represents an opaque object describing a gradient. It is returned by the methods CanvasRenderingContext2D.createLinearGradient(), CanvasRenderingContext2D.createConicGradient() or CanvasRenderingContext2D.createRadialGradient().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasGradient
 */
export default interface ICanvasGradient {
	addColorStop(offset: number, color: string): void;
}
