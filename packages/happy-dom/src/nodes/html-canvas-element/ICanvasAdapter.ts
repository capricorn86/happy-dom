import Blob from '../../file/Blob.js';

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
	 * @param canvas The canvas element requesting the context.
	 * @param contextType The context identifier ('2d', 'webgl', etc.).
	 * @param contextAttributes Optional context creation attributes.
	 * @returns The rendering context, or null if the type is unsupported.
	 */
	getContext(
		canvas: { width: number; height: number },
		contextType: string,
		contextAttributes?: Record<string, unknown>
	): unknown | null;

	/**
	 * Serialises the canvas content as a data URL.
	 *
	 * @param canvas The canvas element to serialise.
	 * @param type MIME type of the output image (e.g. `'image/png'`).
	 * @param quality Encoder quality for lossy formats, in the range 0–1.
	 * @returns A data URL string.
	 */
	toDataURL(canvas: { width: number; height: number }, type?: string, quality?: unknown): string;

	/**
	 * Creates a Blob from the canvas content and passes it to the callback.
	 *
	 * @param canvas The canvas element to read.
	 * @param callback Receives the resulting Blob, or null on failure.
	 * @param type MIME type of the output image.
	 * @param quality Encoder quality for lossy formats, in the range 0–1.
	 */
	toBlob(
		canvas: { width: number; height: number },
		callback: (blob: Blob | null) => void,
		type?: string,
		quality?: unknown
	): void;
}
