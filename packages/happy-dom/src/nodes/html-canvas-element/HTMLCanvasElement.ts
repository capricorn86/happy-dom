import HTMLElement from '../html-element/HTMLElement.js';
import CanvasCaptureMediaStreamTrack from './CanvasCaptureMediaStreamTrack.js';
import MediaStream from './MediaStream.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Blob from '../../file/Blob.js';
import OffscreenCanvas from './OffscreenCanvas.js';
import Event from '../../event/Event.js';

/**
 * HTMLCanvasElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement
 */
export default class HTMLCanvasElement extends HTMLElement {
	// Events
	public oncontextlost: (event: Event) => void | null = null;
	public oncontextrestored: (event: Event) => void | null = null;
	public onwebglcontextcreationerror: (event: Event) => void | null = null;
	public onwebglcontextlost: (event: Event) => void | null = null;
	public onwebglcontextrestored: (event: Event) => void | null = null;

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
	 * @param [_frameRate] Frame rate.
	 * @returns Capture stream.
	 */
	public captureStream(_frameRate?: number): MediaStream {
		const stream = new MediaStream();
		stream.addTrack(new CanvasCaptureMediaStreamTrack(this));
		stream[PropertySymbol.capabilities].aspectRatio.max = this.width;
		stream[PropertySymbol.capabilities].height.max = this.height;
		stream[PropertySymbol.capabilities].width.max = this.width;
		return stream;
	}

	/**
	 * Returns context.
	 *
	 * @param _contextType Context type.
	 * @param [_contextAttributes] Context attributes.
	 * @returns Context.
	 */
	public getContext(
		_contextType: '2d' | 'webgl' | 'webgl2' | 'webgpu' | 'bitmaprenderer',
		_contextAttributes?: { [key: string]: any }
	): null {
		return null;
	}

	/**
	 * Returns to data URL.
	 *
	 * @param [_type] Type.
	 * @param [_encoderOptions] Quality.
	 * @returns Data URL.
	 */
	public toDataURL(_type?: string, _encoderOptions?: any): string {
		return '';
	}

	/**
	 * Returns to blob.
	 *
	 * @param callback Callback.
	 * @param [_type] Type.
	 * @param [_quality] Quality.
	 */
	public toBlob(callback: (blob: Blob) => void, _type?: string, _quality?: any): void {
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
