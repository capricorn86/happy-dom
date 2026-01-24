import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Blob from '../../file/Blob.js';
import OffscreenCanvas from './OffscreenCanvas.js';
import Event from '../../event/Event.js';
import MediaStream from '../html-media-element/MediaStream.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';

const DEVICE_ID = 'S3F/aBCdEfGHIjKlMnOpQRStUvWxYz1234567890+1AbC2DEf2GHi3jK34le+ab12C3+1aBCdEf==';

/**
 * Canvas rendering adapter interface.
 * Implement this to provide real canvas rendering (e.g., via node-canvas).
 */
export interface ICanvasAdapter {
	/**
	 * Creates a rendering context for the canvas.
	 * @param canvas The canvas element.
	 * @param contextType The context type ('2d', 'webgl', etc.).
	 * @param contextAttributes Optional context attributes.
	 * @returns The rendering context or null.
	 */
	getContext(
		canvas: HTMLCanvasElement,
		contextType: string,
		contextAttributes?: { [key: string]: unknown }
	): unknown | null;

	/**
	 * Returns a data URL of the canvas content.
	 * @param canvas The canvas element.
	 * @param type The image format (e.g., 'image/png').
	 * @param encoderOptions Quality for lossy formats.
	 * @returns The data URL string.
	 */
	toDataURL(canvas: HTMLCanvasElement, type?: string, encoderOptions?: unknown): string;

	/**
	 * Creates a Blob from the canvas content.
	 * @param canvas The canvas element.
	 * @param callback Callback receiving the blob.
	 * @param type The image format.
	 * @param quality Quality for lossy formats.
	 */
	toBlob(
		canvas: HTMLCanvasElement,
		callback: (blob: Blob | null) => void,
		type?: string,
		quality?: unknown
	): void;
}

/**
 * HTMLCanvasElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
 */
export default class HTMLCanvasElement extends HTMLElement {
	// Canvas adapter for real rendering support
	private static canvasAdapter: ICanvasAdapter | null = null;

	/**
	 * Sets the canvas adapter for real rendering support.
	 * @param adapter The adapter implementation (e.g., node-canvas adapter).
	 */
	public static setCanvasAdapter(adapter: ICanvasAdapter | null): void {
		HTMLCanvasElement.canvasAdapter = adapter;
	}

	/**
	 * Gets the current canvas adapter.
	 * @returns The current adapter or null.
	 */
	public static getCanvasAdapter(): ICanvasAdapter | null {
		return HTMLCanvasElement.canvasAdapter;
	}

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get oncontextlost(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncontextlost');
	}

	public set oncontextlost(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextlost', value);
	}

	public get oncontextrestored(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'oncontextrestored');
	}

	public set oncontextrestored(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncontextrestored', value);
	}

	public get onwebglcontextcreationerror(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onwebglcontextcreationerror');
	}

	public set onwebglcontextcreationerror(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebglcontextcreationerror', value);
	}

	public get onwebglcontextlost(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onwebglcontextlost');
	}

	public set onwebglcontextlost(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebglcontextlost', value);
	}

	public get onwebglcontextrestored(): ((event: Event) => void) | null {
		return ElementEventAttributeUtility.getEventListener(this, 'onwebglcontextrestored');
	}

	public set onwebglcontextrestored(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onwebglcontextrestored', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns width.
	 *
	 * @returns Width.
	 */
	public get width(): number {
		const width = this.getAttribute('width');
		return width !== null ? Number(width) : 300;
	}

	/**
	 * Sets width.
	 *
	 * @param width Width.
	 */
	public set width(width: number) {
		this.setAttribute('width', String(width));
	}

	/**
	 * Returns height.
	 *
	 * @returns Height.
	 */
	public get height(): number {
		const height = this.getAttribute('height');
		return height !== null ? Number(height) : 150;
	}

	/**
	 * Sets height.
	 *
	 * @param height Height.
	 */
	public set height(height: number) {
		this.setAttribute('height', String(height));
	}

	/**
	 * Returns capture stream.
	 *
	 * @param [frameRate] Frame rate.
	 * @returns Capture stream.
	 */
	public captureStream(frameRate?: number): MediaStream {
		const stream = new this[PropertySymbol.window].MediaStream();
		const track = new this[PropertySymbol.window].CanvasCaptureMediaStreamTrack(
			PropertySymbol.illegalConstructor,
			this
		);

		track[PropertySymbol.kind] = 'video';
		track[PropertySymbol.capabilities].deviceId = DEVICE_ID;
		track[PropertySymbol.capabilities].aspectRatio.max = this.width;
		track[PropertySymbol.capabilities].height.max = this.height;
		track[PropertySymbol.capabilities].width.max = this.width;
		track[PropertySymbol.settings].deviceId = DEVICE_ID;

		if (frameRate !== undefined) {
			track[PropertySymbol.capabilities].frameRate.max = frameRate;
			track[PropertySymbol.settings].frameRate = frameRate;
		}

		stream.addTrack(track);

		return stream;
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
		contextAttributes?: { [key: string]: unknown }
	): unknown {
		const adapter = HTMLCanvasElement.canvasAdapter;
		if (adapter) {
			return adapter.getContext(this, contextType, contextAttributes);
		}
		return null;
	}

	/**
	 * Returns to data URL.
	 *
	 * @param [type] Type.
	 * @param [encoderOptions] Quality.
	 * @returns Data URL.
	 */
	public toDataURL(type?: string, encoderOptions?: unknown): string {
		const adapter = HTMLCanvasElement.canvasAdapter;
		if (adapter) {
			return adapter.toDataURL(this, type, encoderOptions);
		}
		return '';
	}

	/**
	 * Returns to blob.
	 *
	 * @param callback Callback.
	 * @param [type] Type.
	 * @param [quality] Quality.
	 */
	public toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: unknown): void {
		const adapter = HTMLCanvasElement.canvasAdapter;
		if (adapter) {
			adapter.toBlob(this, callback, type, quality);
			return;
		}
		callback(new Blob([]));
	}

	/**
	 * Transfers control to offscreen.
	 *
	 * @returns Offscreen canvas.
	 */
	public transferControlToOffscreen(): OffscreenCanvas {
		return new OffscreenCanvas(this.width, this.height);
	}
}
