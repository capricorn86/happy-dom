import { createCanvas, createImageData, Image as CanvasImage } from 'canvas';
// @ts-ignore
import { SetSource } from 'canvas/lib/bindings.js';
import {
	HTMLCanvasElement,
	HTMLImageElement,
	ImageData,
	PropertySymbol,
	type ICanvasRenderingContext2D
} from 'happy-dom';
import OffscreenCanvas from 'happy-dom/lib/canvas/OffscreenCanvas';

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
export default class CanvasAdapter {
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
	 * @param canvas The canvas element.
	 * @param contextType The context identifier ('2d', 'webgl', etc.).
	 * @param contextAttributes Optional context creation attributes.
	 * @returns The rendering context, or null if the type is unsupported.
	 *
	 * @example
	 * ```typescript
	 * const ctx = adapter.getContext(canvas, '2d');
	 * ```
	 */
	public getContext(
		canvas: ICanvasShape,
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
					const imageData = createImageData(
						new Uint8ClampedArray(buffer),
						shape.width,
						shape.height
					);
					args[0] = imageData;
					(<any>context.putImageData).apply(context, args);
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

		// getImageData()
		const originalGetImageData = context.getImageData;
		context.getImageData = (...args: any[]) => {
			const imageData = originalGetImageData.apply(context, <any>args);
			return new ImageData(
				new Uint8ClampedArray(imageData.data),
				imageData.width,
				imageData.height
			);
		};

		// createImageData()
		const originalCreateImageData = context.createImageData;
		context.createImageData = (...args: any[]) => {
			const imageData = originalCreateImageData.apply(context, <any>args);
			return new ImageData(
				new Uint8ClampedArray(imageData.data),
				imageData.width,
				imageData.height
			);
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
				SetSource(canvasImage, shape[PropertySymbol.buffer]);
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
				SetSource(canvasImage, Buffer.from(shape.data.buffer));
				return originalCreatePattern(canvasImage, repetition);
			}
			return null;
		};

		return <ICanvasRenderingContext2D>(<unknown>context);
	}

	/**
	 * Serialises the canvas content as a data URL.
	 *
	 * @param canvas The canvas element.
	 * @param type MIME type of the output image.
	 * @param quality Encoder quality for lossy formats, in the range 0–1.
	 * @returns A data URL string.
	 *
	 * @example
	 * ```typescript
	 * const url = adapter.toDataURL(canvas, 'image/png');
	 * ```
	 */
	public toDataURL(canvas: ICanvasShape, type?: string, quality?: unknown): string {
		const nodeCanvas = this.#getNodeCanvas(canvas);
		if (type === 'image/jpeg') {
			return nodeCanvas.toDataURL('image/jpeg', <number>quality);
		}
		return nodeCanvas.toDataURL('image/png');
	}

	/**
	 * Creates a Blob from the canvas content and passes it to the callback.
	 *
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
		canvas: ICanvasShape,
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
