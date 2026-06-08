import type Blob from '../file/Blob.js';
import type ICanvasAdapterCaller from './ICanvasAdapterCaller.js';
import type ICanvasRenderingContext2D from './ICanvasRenderingContext2D.js';

/**
 * Interface for pluggable canvas rendering adapters.
 *
 * Implement this interface to provide real canvas rendering support
 * (e.g., via node-canvas). The adapter is passed via browser settings:
 *
 * @example
 * ```typescript
 * import { Window } from 'happy-dom';
 * import { CanvasAdapter } from '@happy-dom/node-canvas-adapter';
 *
 * const window = new Window({
 *   settings: { canvasAdapter: new CanvasAdapter() }
 * });
 * ```
 */
export default interface ICanvasAdapter {
	/**
	 * Creates a rendering context for a canvas element.
	 *
	 * @param caller Information about the caller, including the canvas element and its associated window and browser frame.
	 * @param contextType The context identifier ('2d', 'webgl', etc.).
	 * @param [contextAttributes] Optional context creation attributes.
	 * @returns The rendering context, or null if the type is unsupported.
	 */
	getContext(
		caller: ICanvasAdapterCaller,
		contextType: string,
		contextAttributes?: Record<string, unknown>
	): ICanvasRenderingContext2D | null;

	/**
	 * Serialize the canvas content as a data URL.
	 *
	 * @param caller Information about the caller, including the canvas element and its associated window and browser frame.
	 * @param [type] MIME type of the output image (e.g. `'image/png'`).
	 * @param [quality] Encoder quality for lossy formats, in the range 0–1.
	 * @returns A data URL string.
	 */
	toDataURL(caller: ICanvasAdapterCaller, type?: string, quality?: unknown): string;

	/**
	 * Creates a Blob from the canvas content and passes it to the callback.
	 *
	 * @param options Options.
	 * @param options.window The window associated with the canvas.
	 * @param options.browserFrame The browser frame associated with the canvas.
	 * @param options.canvas The canvas element to read.
	 * @param options.callback Receives the resulting Blob, or null on failure.
	 * @param [options.type] MIME type of the output image.
	 * @param [options.quality] Encoder quality for lossy formats, in the range 0–1.
	 */
	toBlob(
		caller: ICanvasAdapterCaller,
		callback: (blob: Blob | null) => void,
		type?: string,
		quality?: unknown
	): void;
}
