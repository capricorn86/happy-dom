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
	 *
	 * @param canvas
	 * @param frameRate
	 */
	constructor(canvas: HTMLCanvasElement) {
		super();
		this.canvas = canvas;
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
	public clone(): MediaStreamTrack {
		const clone = <CanvasCaptureMediaStreamTrack>super.clone();
		clone.canvas = this.canvas;
		return clone;
	}
}
