import HTMLCanvasElement from '../nodes/html-canvas-element/HTMLCanvasElement.js';
import HTMLImageElement from '../nodes/html-image-element/HTMLImageElement.js';
import HTMLVideoElement from '../nodes/html-video-element/HTMLVideoElement.js';
import OffscreenCanvas from './OffscreenCanvas.js';
import * as PropertySymbol from '../PropertySymbol.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import type IImageBitmapOptions from './IImageBitmapOptions.js';
import type { TImageBitmapSource } from './TImageBitmapSource.js';
import type ICanvasShape from './ICanvasShape.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';

/**
 * Image Bitmap.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap
 */
export default class ImageBitmap implements ICanvasShape {
	public [PropertySymbol.canvas]: OffscreenCanvas | null = null;
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

		let validSource: TImageBitmapSource | null = null;
		if (source instanceof ImageBitmap) {
			if (source[PropertySymbol.canvas] === null) {
				throw new window.DOMException(
					"Failed to execute 'createImageBitmap' on 'Window': The image source is not usable.",
					DOMExceptionNameEnum.invalidStateError
				);
			}
			validSource = source;
		}

		if (source instanceof HTMLImageElement) {
			if (!source[PropertySymbol.buffer]) {
				throw new window.DOMException(
					"Failed to execute 'createImageBitmap' on 'Window': The image source is not usable.",
					DOMExceptionNameEnum.invalidStateError
				);
			}
			validSource = source;
		} else if (source instanceof HTMLVideoElement) {
			throw new window.DOMException(
				"Failed to execute 'createImageBitmap' on 'Window': HTMLVideoElement is not supported as an image source yet in Happy DOM.",
				DOMExceptionNameEnum.invalidStateError
			);
		} else if (source instanceof HTMLCanvasElement || source instanceof OffscreenCanvas) {
			validSource = source;
		}

		if (validSource === null) {
			throw new window.TypeError(
				`Failed to execute 'createImageBitmap' on 'Window': The provided value is not of type '(Blob or HTMLCanvasElement or HTMLImageElement or HTMLVideoElement or ImageBitmap or ImageData or OffscreenCanvas or SVGImageElement or VideoFrame)'.`
			);
		}

		this[PropertySymbol.width] = validSource.width;
		this[PropertySymbol.height] = validSource.height;

		let x = 0;
		let y = 0;

		if (
			typeof sx === 'number' &&
			typeof sy === 'number' &&
			typeof sw === 'number' &&
			typeof sh === 'number'
		) {
			x = sx;
			y = sy;
			this[PropertySymbol.width] = sw;
			this[PropertySymbol.height] = sh;

			if (options !== undefined && typeof options !== 'object') {
				throw new window.TypeError(`The provided value is not of type 'ImageBitmapOptions'.`);
			}

			this[PropertySymbol.options] = options || null;
		} else if (typeof sx === 'object') {
			this[PropertySymbol.options] = <IImageBitmapOptions>sx;
		} else if (sx !== undefined) {
			throw new window.TypeError(
				`Failed to execute 'createImageBitmap' on 'Window': Overload resolution failed.`
			);
		}

		const settings = new WindowBrowserContext(window).getSettings();
		const canvas = new window.OffscreenCanvas(
			this[PropertySymbol.width],
			this[PropertySymbol.height]
		);
		if (settings?.canvasAdapter) {
			const context = canvas.getContext('2d')!;
			context.drawImage(validSource, -x, -y, validSource.width, validSource.height);
			this[PropertySymbol.canvas] = canvas;
		}
	}

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): number {
		return this[PropertySymbol.width];
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): number {
		return this[PropertySymbol.height];
	}

	/**
	 * Disposes of all graphical resources associated with an ImageBitmap.
	 */
	public close(): void {
		this[PropertySymbol.canvas] = null;
		this[PropertySymbol.options] = null;
		this[PropertySymbol.width] = 0;
		this[PropertySymbol.height] = 0;
	}
}
