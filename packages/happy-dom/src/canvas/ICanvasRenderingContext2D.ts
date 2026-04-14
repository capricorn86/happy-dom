import type DOMMatrix from '../dom/dom-matrix/DOMMatrix.js';
import type HTMLCanvasElement from '../nodes/html-canvas-element/HTMLCanvasElement.js';
import type HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import type HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import type ICanvasGradient from './ICanvasGradient.js';
import type ICanvasPattern from './ICanvasPattern.js';
import type ImageBitmap from './ImageBitmap.js';
import type ImageData from './ImageData.js';
import type ITextMetrics from './ITextMetrics.js';
import type OffscreenCanvas from './OffscreenCanvas.js';

type TCanvas =
	| HTMLCanvasElement
	| OffscreenCanvas
	| HTMLImageElement
	| HTMLVideoElement
	| ImageBitmap /* | VideoFrame */;

type TCanvasFillRule = 'evenodd' | 'nonzero';
type TGlobalCompositeOperation =
	| 'clear'
	| 'copy'
	| 'destination'
	| 'source-over'
	| 'destination-over'
	| 'source-in'
	| 'destination-in'
	| 'source-out'
	| 'destination-out'
	| 'source-atop'
	| 'destination-atop'
	| 'xor'
	| 'lighter'
	| 'normal'
	| 'multiply'
	| 'screen'
	| 'overlay'
	| 'darken'
	| 'lighten'
	| 'color-dodge'
	| 'color-burn'
	| 'hard-light'
	| 'soft-light'
	| 'difference'
	| 'exclusion'
	| 'hue'
	| 'saturation'
	| 'color'
	| 'luminosity'
	| 'saturate';

type TCanvasLineCap = 'butt' | 'round' | 'square';
type TCanvasLineJoin = 'bevel' | 'miter' | 'round';
type TCanvasTextBaseline = 'alphabetic' | 'bottom' | 'hanging' | 'ideographic' | 'middle' | 'top';
type TCanvasTextAlign = 'center' | 'end' | 'left' | 'right' | 'start';

/**
 * The CanvasRenderingContext2D interface, part of the Canvas API, provides the 2D rendering context for the drawing surface of a <canvas> element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
export default interface ICanvasRenderingContext2D {
	/** Non-standard - Returned by "node-canvas-adapter":
	 * - patternQuality: 'fast' | 'good' | 'best' | 'nearest' | 'bilinear';
	 * - antialias: 'default' | 'gray' | 'none' | 'subpixel';
	 * - textDrawingMode: 'path' | 'glyph';
	 * - quality: 'fast' | 'good' | 'best' | 'nearest' | 'bilinear';
	 * - currentTransform: DOMMatrix;
	 * - addPage(width?: number, height?: number): void;
	 */

	imageSmoothingEnabled: boolean;
	globalCompositeOperation: TGlobalCompositeOperation;
	globalAlpha: number;
	shadowColor: string;
	miterLimit: number;
	lineWidth: number;
	lineCap: TCanvasLineCap;
	lineJoin: TCanvasLineJoin;
	lineDashOffset: number;
	shadowOffsetX: number;
	shadowOffsetY: number;
	shadowBlur: number;
	fillStyle: string | ICanvasGradient | ICanvasPattern;
	strokeStyle: string | ICanvasGradient | ICanvasPattern;
	font: string;
	textBaseline: TCanvasTextBaseline;
	textAlign: TCanvasTextAlign;
	canvas: TCanvas;
	direction: 'ltr' | 'rtl';
	lang: string;
	drawImage(image: TCanvas, dx: number, dy: number): void;
	drawImage(image: TCanvas, dx: number, dy: number, dw: number, dh: number): void;
	drawImage(
		image: TCanvas,
		sx: number,
		sy: number,
		sw: number,
		sh: number,
		dx: number,
		dy: number,
		dw: number,
		dh: number
	): void;
	putImageData(imagedata: ImageData, dx: number, dy: number): void;
	putImageData(
		imagedata: ImageData,
		dx: number,
		dy: number,
		dirtyX: number,
		dirtyY: number,
		dirtyWidth: number,
		dirtyHeight: number
	): void;
	getImageData(sx: number, sy: number, sw: number, sh: number): ImageData;
	createImageData(sw: number, sh: number): ImageData;
	createImageData(imagedata: ImageData): ImageData;
	save(): void;
	restore(): void;
	rotate(angle: number): void;
	translate(x: number, y: number): void;
	transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
	getTransform(): DOMMatrix;
	resetTransform(): void;
	setTransform(transform?: DOMMatrix): void;
	setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
	isPointInPath(x: number, y: number, fillRule?: TCanvasFillRule): boolean;
	scale(x: number, y: number): void;
	clip(fillRule?: TCanvasFillRule): void;
	fill(fillRule?: TCanvasFillRule): void;
	stroke(): void;
	fillText(text: string, x: number, y: number, maxWidth?: number): void;
	strokeText(text: string, x: number, y: number, maxWidth?: number): void;
	fillRect(x: number, y: number, w: number, h: number): void;
	strokeRect(x: number, y: number, w: number, h: number): void;
	clearRect(x: number, y: number, w: number, h: number): void;
	rect(x: number, y: number, w: number, h: number): void;
	roundRect(x: number, y: number, w: number, h: number, radii?: number | number[]): void;
	measureText(text: string): ITextMetrics;
	moveTo(x: number, y: number): void;
	lineTo(x: number, y: number): void;
	bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
	beginPath(): void;
	closePath(): void;
	arc(
		x: number,
		y: number,
		radius: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean
	): void;
	arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
	ellipse(
		x: number,
		y: number,
		radiusX: number,
		radiusY: number,
		rotation: number,
		startAngle: number,
		endAngle: number,
		counterclockwise?: boolean
	): void;
	setLineDash(segments: number[]): void;
	getLineDash(): number[];
	createPattern(
		image: TCanvas,
		repetition: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat' | '' | null
	): ICanvasPattern;
	createLinearGradient(x0: number, y0: number, x1: number, y1: number): ICanvasGradient;
	createRadialGradient(
		x0: number,
		y0: number,
		r0: number,
		x1: number,
		y1: number,
		r1: number
	): ICanvasGradient;
	beginTag(tagName: string, attributes?: string): void;
	endTag(tagName: string): void;
}
