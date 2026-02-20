import HTMLElement from '../html-element/HTMLElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Blob from '../../file/Blob.js';
import OffscreenCanvas from './OffscreenCanvas.js';
import Event from '../../event/Event.js';
import MediaStream from '../html-media-element/MediaStream.js';
import ElementEventAttributeUtility from '../element/ElementEventAttributeUtility.js';
import WindowBrowserContext from '../../window/WindowBrowserContext.js';

const DEVICE_ID = 'S3F/aBCdEfGHIjKlMnOpQRStUvWxYz1234567890+1AbC2DEf2GHi3jK34le+ab12C3+1aBCdEf==';

/**
 * HTMLCanvasElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
 */
export default class HTMLCanvasElement extends HTMLElement {
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
	 *
	 * @param contextType
	 * @param contextAttributes
	 */
	public getContext(
		contextType: '2d' | 'webgl' | 'webgl2' | 'webgpu' | 'bitmaprenderer',
		contextAttributes?: Record<string, unknown>
	): unknown {
		const settings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();
		if (settings?.canvasAdapter != null) {
			return settings.canvasAdapter.getContext(this, contextType, contextAttributes);
		}
		return null;
	}

	/**
	 *
	 * @param type
	 * @param encoderOptions
	 */
	public toDataURL(type?: string, encoderOptions?: unknown): string {
		const settings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();
		if (settings?.canvasAdapter != null) {
			return settings.canvasAdapter.toDataURL(this, type, encoderOptions);
		}
		return '';
	}

	/**
	 *
	 * @param callback
	 * @param type
	 * @param quality
	 */
	public toBlob(callback: (blob: Blob | null) => void, type?: string, quality?: unknown): void {
		const settings = new WindowBrowserContext(this[PropertySymbol.window]).getSettings();
		if (settings?.canvasAdapter != null) {
			settings.canvasAdapter.toBlob(this, callback, type, quality);
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
