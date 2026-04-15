import { createCanvas, Image as CanvasImage } from 'canvas';
import type { ICanvasAdapterCaller } from 'happy-dom';
import {
	HTMLCanvasElement,
	HTMLImageElement,
	OffscreenCanvas,
	ImageData,
	PropertySymbol,
	type ICanvasAdapter,
	type ICanvasRenderingContext2D,
	Blob
} from 'happy-dom';

interface ICanvasShape {
	width: number;
	height: number;
}

const EXTENDED_SYMBOL = Symbol('extended');

/**
 * Canvas adapter that delegates rendering to the `canvas` npm package.
 *
 * @example
 * ```typescript
 * import { Window } from 'happy-dom';
 * import { CanvasAdapter } from '@happy-dom/node-canvas-adapter';
 *
 * const window = new Window({
 *   settings: { canvasAdapter: new CanvasAdapter() }
 * });
 *
 * const canvas = window.document.createElement('canvas');
 * const ctx = canvas.getContext('2d');
 * ```
 */
export default class CanvasAdapter implements ICanvasAdapter {
	readonly #canvases = new WeakMap<ICanvasShape, ReturnType<typeof createCanvas>>();

	/**
	 * Returns or creates a node-canvas instance bound to the given canvas element.
	 *
	 * @param canvas The canvas element.
	 * @returns The bound node-canvas instance.
	 */
	#getNodeCanvas(canvas: ICanvasShape): ReturnType<typeof createCanvas> {
		const existing = this.#canvases.get(canvas);
		if (existing !== undefined) {
			return existing;
		}
		const nodeCanvas = createCanvas(canvas.width, canvas.height);
		this.#canvases.set(canvas, nodeCanvas);
		return nodeCanvas;
	}

	/**
	 * Creates a rendering context for the given canvas element.
	 *
	 * @param canvas.canvas
	 * @param canvas The canvas element.
	 * @param canvas.window Window.
	 * @param contextType The context identifier ('2d', 'webgl', etc.).
	 * @param contextAttributes Optional context creation attributes.
	 * @param canvas.canvasType
	 * @returns The rendering context, or null if the type is unsupported.
	 *
	 * @example
	 * ```typescript
	 * const ctx = adapter.getContext(canvas, '2d');
	 * ```
	 */
	public getContext(
		{ canvas, window }: ICanvasAdapterCaller,
		contextType: string,
		contextAttributes?: Record<string, unknown>
	): ICanvasRenderingContext2D | null {
		if (contextType !== '2d') {
			return null;
		}
		const context = this.#getNodeCanvas(canvas).getContext('2d', contextAttributes);

		if (context === null) {
			return null;
		}

		if ((<any>context)[EXTENDED_SYMBOL]) {
			return <ICanvasRenderingContext2D>(<unknown>context);
		}

		(<any>context)[EXTENDED_SYMBOL] = true;

		// drawImage()
		const originalDrawImage = context.drawImage;
		context.drawImage = (...args: any[]) => {
			const shape = <ICanvasShape>args[0];
			if (shape instanceof HTMLImageElement) {
				const loadImage = (buffer: Buffer): void => {
					const canvasImage = new CanvasImage();
					canvasImage.src = buffer;
					canvasImage.width = shape.width;
					canvasImage.height = shape.height;
					args[0] = canvasImage;
					(<any>originalDrawImage).apply(context, args);
				};
				if (shape[PropertySymbol.buffer]) {
					loadImage(shape[PropertySymbol.buffer]);
					return;
				}
				if (!shape.complete) {
					shape.addEventListener('load', () => {
						if (shape[PropertySymbol.buffer]) {
							loadImage(shape[PropertySymbol.buffer]);
						}
					});
				}
				return;
			}
			if (shape instanceof HTMLVideoElement) {
				// Not supported yet
				return;
			}
			if (shape instanceof HTMLCanvasElement || shape instanceof OffscreenCanvas) {
				const nodeCanvas = this.#getNodeCanvas(shape);
				if (nodeCanvas) {
					args[0] = nodeCanvas;
					(<any>originalDrawImage).apply(context, args);
				}
				return;
			}
			if (shape instanceof ImageData) {
				(<any>originalDrawImage).apply(context, args);
				return;
			}
		};

		// createImageData()
		const originalCreateImageData = context.createImageData;
		context.createImageData = (...args: any[]) => {
			const imageData = originalCreateImageData.apply(context, <any>args);
			return new ImageData(imageData.data, imageData.width, imageData.height);
		};

		// putImageData()
		const originalPutImageData = context.putImageData;
		context.putImageData = (...args: any[]) => {
			const imageData = args[0];
			if (!(imageData instanceof ImageData)) {
				throw new window.TypeError(
					`Failed to execute 'putImageData' on 'CanvasRenderingContext2D': parameter 1 is not of type 'ImageData'`
				);
			}
			const canvasImageData = (<any>originalCreateImageData).call(
				context,
				imageData.width,
				imageData.height
			);
			canvasImageData.data.set(imageData.data);
			args[0] = canvasImageData;
			(<any>originalPutImageData).apply(context, args);
		};

		// getImageData()
		const originalGetImageData = context.getImageData;
		context.getImageData = (...args: any[]) => {
			const imageData = originalGetImageData.apply(context, <any>args);
			return new ImageData(imageData.data, imageData.width, imageData.height);
		};

		// createPattern()
		const originalCreatePattern = context.createPattern;
		context.createPattern = (
			shape: any,
			repetition: '' | 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
		): any => {
			if (shape instanceof HTMLImageElement) {
				if (!shape[PropertySymbol.buffer]) {
					return null;
				}

				const canvasImage = new CanvasImage();
				canvasImage.src = shape[PropertySymbol.buffer];
				canvasImage.width = shape.width;
				canvasImage.height = shape.height;
				return originalCreatePattern(canvasImage, repetition);
			}
			if (shape instanceof HTMLCanvasElement || shape instanceof OffscreenCanvas) {
				const nodeCanvas = this.#getNodeCanvas(shape);
				if (nodeCanvas) {
					return originalCreatePattern(nodeCanvas, repetition);
				}
				return null;
			}
			if (shape instanceof ImageData) {
				const canvasImage = new CanvasImage();
				canvasImage.src = Buffer.from(shape.data.buffer);
				canvasImage.width = shape.width;
				canvasImage.height = shape.height;
				return originalCreatePattern(canvasImage, repetition);
			}
			return null;
		};

		return <ICanvasRenderingContext2D>(<unknown>context);
	}

	/**
	 * Serialize the canvas content as a data URL.
	 *
	 * @param caller Information about the caller, including the canvas element and its associated window and browser frame.
	 * @param caller.canvas Canvas.
	 * @param type MIME type of the output image.
	 * @param quality Encoder quality for lossy formats, in the range 0–1.
	 * @returns A data URL string.
	 *
	 * @example
	 * ```typescript
	 * const url = adapter.toDataURL(canvas, 'image/png');
	 * ```
	 */
	public toDataURL({ canvas }: ICanvasAdapterCaller, type?: string, quality?: unknown): string {
		const nodeCanvas = this.#getNodeCanvas(canvas);
		if (type === 'image/jpeg') {
			return nodeCanvas.toDataURL('image/jpeg', <number>quality);
		}
		return nodeCanvas.toDataURL('image/png');
	}

	/**
	 * Creates a Blob from the canvas content and passes it to the callback.
	 *
	 * @param caller Information about the caller, including the canvas element and its associated window and browser frame.
	 * @param caller.canvas Canvas.
	 * @param canvas The canvas element.
	 * @param callback Receives the resulting Blob, or null on failure.
	 * @param type MIME type of the output image.
	 * @param quality Encoder quality for lossy formats, in the range 0–1.
	 *
	 * @example
	 * ```typescript
	 * adapter.toBlob(canvas, (blob) => console.log(blob?.size));
	 * ```
	 */
	public toBlob(
		{ canvas }: ICanvasAdapterCaller,
		callback: (blob: Blob | null) => void,
		type?: string,
		quality?: unknown
	): void {
		const nodeCanvas = this.#getNodeCanvas(canvas);
		if (type === 'image/jpeg') {
			nodeCanvas.toBuffer(
				(error, buffer) => {
					if (error !== null) {
						callback(null);
						return;
					}
					callback(new Blob([new Uint8Array(buffer)], { type: 'image/jpeg' }));
				},
				'image/jpeg',
				{ quality: <number>quality }
			);
			return;
		}
		nodeCanvas.toBuffer((error, buffer) => {
			if (error !== null) {
				callback(null);
				return;
			}
			callback(new Blob([new Uint8Array(buffer)], { type: type ?? 'image/png' }));
		});
	}
}
