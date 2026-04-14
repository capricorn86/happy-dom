import HTMLCanvasElement from '../nodes/html-canvas-element/HTMLCanvasElement.js';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import OffscreenCanvas from './OffscreenCanvas.js';
import * as PropertySymbol from '../PropertySymbol.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import type IImageBitmapOptions from './IImageBitmapOptions.js';
import type { TImageBitmapSource } from './TImageBitmapSource.js';

type TImageBitmapInternalSource = HTMLCanvasElement | OffscreenCanvas | HTMLImageElement;

/**
 * Image Bitmap.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap
 */
export default class ImageBitmap {
	public [PropertySymbol.source]: TImageBitmapInternalSource | null = null;
	public [PropertySymbol.x] = 0;
	public [PropertySymbol.y] = 0;
	public [PropertySymbol.width] = 0;
	public [PropertySymbol.height] = 0;
	public [PropertySymbol.options]: IImageBitmapOptions | null = null;

	/**
	 * Constructor.
	 *
	 * @param illegalConstructorSymbol
	 * @param window Window.
	 * @param source Source.
	 * @param [sx] X.
	 * @param [sy] Y.
	 * @param [sw] Width.
	 * @param [sh] Height.
	 * @param [options] Options.
	 */
	constructor(
		illegalConstructorSymbol: Symbol,
		window: BrowserWindow,
		source: TImageBitmapSource,
		sx?: number | IImageBitmapOptions,
		sy?: number,
		sw?: number,
		sh?: number,
		options?: IImageBitmapOptions
	) {
		if (illegalConstructorSymbol !== PropertySymbol.illegalConstructor) {
			throw new TypeError('Illegal constructor');
		}

		while (source instanceof ImageBitmap) {
			if (source[PropertySymbol.source] === null) {
				throw new window.DOMException(
					"Failed to execute 'createImageBitmap' on 'Window': The image source is not usable.",
					DOMExceptionNameEnum.invalidStateError
				);
			}
			source = source[PropertySymbol.source];
		}

		if (source instanceof HTMLImageElement) {
			if (!source[PropertySymbol.buffer]) {
				throw new window.DOMException(
					"Failed to execute 'createImageBitmap' on 'Window': The image source is not usable.",
					DOMExceptionNameEnum.invalidStateError
				);
			}
			this[PropertySymbol.source] = source;
		} else if (source instanceof HTMLVideoElement) {
			throw new window.DOMException(
				"Failed to execute 'createImageBitmap' on 'Window': HTMLVideoElement is not supported as an image source yet in Happy DOM.",
				DOMExceptionNameEnum.invalidStateError
			);
		} else if (source instanceof HTMLCanvasElement || source instanceof OffscreenCanvas) {
			this[PropertySymbol.source] = source;
		}

		if (this[PropertySymbol.source] === null) {
			throw new window.TypeError(
				`Failed to execute 'createImageBitmap' on 'Window': The provided value is not of type '(Blob or HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap or ImageData or OffscreenCanvas or SVGImageElement or VideoFrame)'.`
			);
		}

		this[PropertySymbol.width] = this[PropertySymbol.source].width;
		this[PropertySymbol.height] = this[PropertySymbol.source].height;

		if (
			typeof sx === 'number' &&
			typeof sy === 'number' &&
			typeof sw === 'number' &&
			typeof sh === 'number'
		) {
			this[PropertySymbol.x] = sx;
			this[PropertySymbol.y] = sy;
			this[PropertySymbol.width] = sw;
			this[PropertySymbol.height] = sh;

			if (typeof options !== 'object') {
				throw new window.TypeError(`The provided value is not of type 'ImageBitmapOptions'.`);
			}

			this[PropertySymbol.options] = options;
		} else if (typeof sx === 'object') {
			this[PropertySymbol.options] = <IImageBitmapOptions>sx;
		} else if (sx !== undefined) {
			throw new window.TypeError(
				`Failed to execute 'createImageBitmap' on 'Window': Overload resolution failed.`
			);
		}
	}

	/**
	 * Disposes of all graphical resources associated with an ImageBitmap.
	 */
	public close(): void {
		this[PropertySymbol.source] = null;
	}
}
