import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';
import type Blob from '../file/Blob.js';
import WindowBrowserContext from '../window/WindowBrowserContext.js';
import type ICanvasAdapter from './ICanvasAdapter.js';
import type ICanvasRenderingContext2D from './ICanvasRenderingContext2D.js';
import ImageBitmap from './ImageBitmap.js';
import * as PropertySymbol from '../PropertySymbol.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import type ICanvasShape from './ICanvasShape.js';

/**
 * The OffscreenCanvas interface provides a canvas that can be rendered off screen, decoupling the DOM and the Canvas API so that the <canvas> element is no longer entirely dependent on the DOM.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas
 */
export default class OffscreenCanvas implements ICanvasShape {
	// Injected by WindowContextClassExtender
	protected declare [PropertySymbol.window]: BrowserWindow;

	protected [PropertySymbol.context]: ICanvasRenderingContext2D | null = null;

	public readonly width: number;
	public readonly height: number;

	/**
	 * Constructor.
	 *
	 * @param width Width.
	 * @param height Height.
	 */
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Converts the canvas to a Blob.
	 *
	 * @param options Options.
	 * @param options.type Type.
	 * @param options.quality Quality.
	 * @returns Blob.
	 */
	public convertToBlob(options?: { type?: string; quality?: any }): Promise<Blob> {
		const browserFrame = new WindowBrowserContext(this[PropertySymbol.window]).getBrowserFrame();
		if (!browserFrame) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'getContext' on 'OffscreenCanvas': Browser frame is not available. This happens when the browser is closing.`
			);
		}
		const settings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();
		const adapter = settings?.canvasAdapter;
		if (!adapter) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'convertToBlob' on 'OffscreenCanvas': No canvas adapter provided in Happy DOM browser settings.\n\nRead more: https://github.com/capricorn86/happy-dom/wiki/IOptionalBrowserSettings#properties`
			);
		}
		return new Promise((resolve, reject) => {
			(<ICanvasAdapter>adapter).toBlob(
				{
					window: this[PropertySymbol.window],
					browserFrame,
					canvas: this
				},
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject(
							new this[PropertySymbol.window].DOMException(
								`Failed to execute 'convertToBlob' on 'OffscreenCanvas': The canvas could not be converted to a Blob.`,
								DOMExceptionNameEnum.encodingError
							)
						);
					}
				},
				options?.type,
				options?.quality
			);
		});
	}

	/**
	 * Creates an ImageBitmap object from the most recently rendered image of the OffscreenCanvas.
	 *
	 * The image in the OffscreenCanvas is replaced with a new blank image for subsequent rendering.
	 *
	 * @returns ImageBitmap.
	 */
	public transferToImageBitmap(): ImageBitmap {
		const context = this[PropertySymbol.context];

		if (!context) {
			throw new this[PropertySymbol.window].TypeError(
				`Failed to execute 'transferToImageBitmap' on 'OffscreenCanvas': Cannot transfer an ImageBitmap from an OffscreenCanvas with no context`
			);
		}

		const width = this.width;
		const height = this.height;
		const imageData = context.getImageData(0, 0, width, height);
		const image = new this[PropertySymbol.window].Image();

		image[PropertySymbol.buffer] = Buffer.from(imageData.data);
		image[PropertySymbol.complete] = true;
		image[PropertySymbol.naturalWidth] = width;
		image[PropertySymbol.naturalHeight] = height;

		const imageBitmap = new ImageBitmap(
			PropertySymbol.illegalConstructor,
			this[PropertySymbol.window],
			image
		);

		context.clearRect(0, 0, width, height);

		return imageBitmap;
	}

	/**
	 * Returns context.
	 *
	 * @param contextType Context type.
	 * @param [contextAttributes] Context attributes.
	 * @returns Context.
	 */
	public getContext(
		contextType: '2d' | 'webgl' | 'webgl2' | 'webgpu' | 'bitmaprenderer',
		contextAttributes?: { [key: string]: any }
	): ICanvasRenderingContext2D | null {
		const browserFrame = new WindowBrowserContext(this[PropertySymbol.window]).getBrowserFrame();
		if (!browserFrame) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'getContext' on 'OffscreenCanvas': Browser frame is not available. This happens when the browser is closing.`
			);
		}
		const settings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();
		const adapter = settings?.canvasAdapter;
		if (!adapter) {
			throw new this[PropertySymbol.window].Error(
				`Failed to execute 'getContext' on 'OffscreenCanvas': No canvas adapter provided in Happy DOM browser settings.\n\nRead more: https://github.com/capricorn86/happy-dom/wiki/IOptionalBrowserSettings#properties`
			);
		}
		this[PropertySymbol.context] = (<ICanvasAdapter>adapter).getContext(
			{
				window: this[PropertySymbol.window],
				browserFrame,
				canvas: this
			},
			contextType,
			contextAttributes
		);
		return this[PropertySymbol.context];
	}
}
