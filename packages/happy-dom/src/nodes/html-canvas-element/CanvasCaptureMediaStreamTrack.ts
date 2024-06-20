import HTMLCanvasElement from './HTMLCanvasElement.js';
import MediaStreamTrack from './MediaStreamTrack.js';

/**
 * Canvas Capture Media Stream Track.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasCaptureMediaStreamTrack
 */
export default class CanvasCaptureMediaStreamTrack extends MediaStreamTrack {
	public canvas: HTMLCanvasElement;

	/**
	 * Constructor.
	 *
	 * @param options Options.
	 * @param options.kind 'audio' or 'video'.
	 * @param options.canvas Canvas.
	 */
	constructor(options: { kind: 'audio' | 'video'; canvas: HTMLCanvasElement }) {
		super(options);
		this.canvas = options.canvas;
	}

	/**
	 * Requests a frame.
	 */
	public requestFrame(): void {
		// Do nothing
	}

	/**
	 * Clones the track.
	 *
	 * @returns Clone.
	 */
	public clone(): CanvasCaptureMediaStreamTrack {
		const clone = <CanvasCaptureMediaStreamTrack>super.clone();
		clone.canvas = this.canvas;
		return clone;
	}
}
