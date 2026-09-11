import type HTMLCanvasElement from '../nodes/html-canvas-element/HTMLCanvasElement.js';
import type HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import type HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import type ImageBitmap from './ImageBitmap.js';
import type OffscreenCanvas from './OffscreenCanvas.js';

export type TImageBitmapSource =
	| HTMLCanvasElement
	| OffscreenCanvas
	| HTMLImageElement
	| HTMLVideoElement
	| ImageBitmap;
