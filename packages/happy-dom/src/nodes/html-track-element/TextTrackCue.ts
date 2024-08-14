import EventTarget from '../../event/EventTarget.js';
import Event from '../../event/Event.js';
import TextTrack from './TextTrack.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * TextTrackCue.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrackCue
 */
export default class TextTrackCue extends EventTarget {
	// Public properties
	public id: string = '';
	public startTime: number = 0;
	public endTime: number = 0;
	public pauseOnExit: boolean = false;

	// Internal properties
	public [PropertySymbol.track]: TextTrack | null = null;

	// Events
	public onenter: (event: Event) => void = null;
	public onexit: (event: Event) => void = null;

	/**
	 * Constructor.
	 *
	 * @param startTime The start time for the cue.
	 * @param endTime The end time for the cue.
	 */
	constructor(startTime: number, endTime: number) {
		super();
		this.startTime = startTime;
		this.endTime = endTime;
	}

	/**
	 * Returns the owner track.
	 *
	 * @returns TextTrack.
	 */
	public get track(): TextTrack {
		return this[PropertySymbol.track];
	}
}
