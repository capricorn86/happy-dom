import { createCanvas } from 'canvas';

interface ICanvasShape {
	width: number;
	height: number;
}

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
	readonly #canvases = new WeakMap<object, ReturnType<typeof createCanvas>>();

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
	): unknown | null {
		if (contextType !== '2d') {
			return null;
		}
		return this.#getNodeCanvas(canvas).getContext('2d', contextAttributes);
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
