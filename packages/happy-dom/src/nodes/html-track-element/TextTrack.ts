import EventTarget from '../../event/EventTarget.js';
import Event from '../../event/Event.js';
import TextTrackCue from './TextTrackCue.js';
import TextTrackCueList from './TextTrackCueList.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 * TextTrack.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrack
 */
export default class TextTrack extends EventTarget {
	// Public properties
	public kind: string = 'subtitles';
	public label: string = '';
	public language: string = '';
	public id: string = '';
	public mode: string = 'disabled';
	public cues: TextTrackCueList | null = null;
	public activeCues: TextTrackCueList | null = null;

	// Events
	public oncuechange: (event: Event) => void = null;

	/**
	 * Adds a cue to the track list.
	 *
	 * @param cue Text track cue.
	 */
	public addCue(cue: TextTrackCue): void {
		if (!this.cues) {
			return;
		}
		cue[PropertySymbol.track] = this;
		this.cues.push(cue);
	}

	/**
	 * Removes a cue from the track list.
	 *
	 * @param cue Text track cue.
	 */
	public removeCue(cue: TextTrackCue): void {
		if (!this.cues) {
			return;
		}
		const index = this.cues.indexOf(cue);
		if (index !== -1) {
			cue[PropertySymbol.track] = null;
			this.cues.splice(index, 1);
		}
	}
}
