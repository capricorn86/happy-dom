/**
 * Node-Canvas Adapter for Happy-DOM
 *
 * Provides real Canvas rendering via node-canvas library.
 *
 * @example
 * ```typescript
 * import { HTMLCanvasElement } from 'happy-dom';
 * import { NodeCanvasAdapter } from './adapters/NodeCanvasAdapter.js';
 *
 * HTMLCanvasElement.setCanvasAdapter(new NodeCanvasAdapter());
 * ```
 */

import type { ICanvasAdapter } from '../HTMLCanvasElement.js';
import type HTMLCanvasElement from '../HTMLCanvasElement.js';
import Blob from '../../../file/Blob.js';

// Dynamic import to make node-canvas optional
let createCanvas: typeof import('canvas').createCanvas | null = null;
let nodeCanvasLoaded = false;

/**
 * Loads node-canvas asynchronously.
 *
 * @returns Whether node-canvas was loaded successfully.
 */
async function loadNodeCanvas(): Promise<boolean> {
	if (nodeCanvasLoaded) {
		return createCanvas !== null;
	}
	nodeCanvasLoaded = true;

	try {
		const canvasModule = await import('canvas');
		createCanvas = canvasModule.createCanvas;
		return true;
	} catch {
		return false;
	}
}

/**
 * Loads node-canvas synchronously.
 *
 * @returns Whether node-canvas was loaded successfully.
 */
function loadNodeCanvasSync(): boolean {
	if (nodeCanvasLoaded) {
		return createCanvas !== null;
	}
	nodeCanvasLoaded = true;

	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const canvasModule = require('canvas');
		createCanvas = canvasModule.createCanvas;
		return true;
	} catch {
		return false;
	}
}

// Store backing canvases
const backingCanvasMap = new WeakMap<HTMLCanvasElement, import('canvas').Canvas>();
const contextMap = new WeakMap<HTMLCanvasElement, import('canvas').CanvasRenderingContext2D>();

/**
 * Node-Canvas adapter implementation.
 */
export class NodeCanvasAdapter implements ICanvasAdapter {
	private initialized = false;

	/**
	 * Constructor.
	 */
	constructor() {
		// Try sync load first (works if canvas is already required)
		this.initialized = loadNodeCanvasSync();
	}

	/**
	 * Ensures node-canvas is loaded.
	 *
	 * @returns Whether node-canvas is loaded.
	 */
	public async ensureLoaded(): Promise<boolean> {
		if (this.initialized) {
			return true;
		}
		this.initialized = await loadNodeCanvas();
		return this.initialized;
	}

	/**
	 * Gets or creates backing canvas for element.
	 *
	 * @param canvas The canvas element.
	 * @returns The backing canvas or null.
	 */
	private getBackingCanvas(canvas: HTMLCanvasElement): import('canvas').Canvas | null {
		if (!createCanvas) {
			return null;
		}

		let backing = backingCanvasMap.get(canvas);
		if (!backing) {
			backing = createCanvas(canvas.width, canvas.height);
			backingCanvasMap.set(canvas, backing);
		} else if (backing.width !== canvas.width || backing.height !== canvas.height) {
			// Resize if dimensions changed
			backing = createCanvas(canvas.width, canvas.height);
			backingCanvasMap.set(canvas, backing);
			contextMap.delete(canvas);
		}
		return backing;
	}

	/**
	 * Creates a rendering context.
	 *
	 * @param canvas The canvas element.
	 * @param contextType The context type.
	 * @param _contextAttributes Optional context attributes.
	 * @returns The rendering context or null.
	 */
	public getContext(
		canvas: HTMLCanvasElement,
		contextType: string,
		_contextAttributes?: { [key: string]: unknown }
	): unknown | null {
		if (contextType !== '2d') {
			// WebGL not supported by node-canvas
			return null;
		}

		// Get backing canvas first - this handles dimension changes and invalidates context cache
		const backing = this.getBackingCanvas(canvas);
		if (!backing) {
			return null;
		}

		// Check cache after dimension check
		let ctx = contextMap.get(canvas);
		if (ctx) {
			return ctx;
		}

		ctx = backing.getContext('2d');
		contextMap.set(canvas, ctx);
		return ctx;
	}

	/**
	 * Returns data URL of canvas content.
	 *
	 * @param canvas The canvas element.
	 * @param type The image format.
	 * @param encoderOptions Quality for lossy formats.
	 * @returns The data URL string.
	 */
	public toDataURL(canvas: HTMLCanvasElement, type?: string, encoderOptions?: unknown): string {
		const backing = this.getBackingCanvas(canvas);
		if (!backing) {
			return '';
		}

		const mimeType = type ?? 'image/png';
		const quality = typeof encoderOptions === 'number' ? encoderOptions : undefined;

		if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
			return backing.toDataURL('image/jpeg', quality);
		}
		return backing.toDataURL('image/png');
	}

	/**
	 * Creates blob from canvas content.
	 *
	 * @param canvas The canvas element.
	 * @param callback Callback receiving the blob.
	 * @param type The image format.
	 * @param quality Quality for lossy formats.
	 */
	public toBlob(
		canvas: HTMLCanvasElement,
		callback: (blob: Blob | null) => void,
		type?: string,
		quality?: unknown
	): void {
		const backing = this.getBackingCanvas(canvas);
		if (!backing) {
			callback(null);
			return;
		}

		const mimeType = type ?? 'image/png';
		const qualityNum = typeof quality === 'number' ? quality : undefined;

		let buffer: Buffer;
		if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
			buffer = backing.toBuffer('image/jpeg', { quality: qualityNum ?? 0.92 });
		} else {
			buffer = backing.toBuffer('image/png');
		}

		const blob = new Blob([buffer], { type: mimeType });
		callback(blob);
	}
}

/**
 * Creates a new NodeCanvasAdapter instance.
 *
 * @returns A new NodeCanvasAdapter.
 */
export function createNodeCanvasAdapter(): NodeCanvasAdapter {
	return new NodeCanvasAdapter();
}

export default NodeCanvasAdapter;
