import TextTrackCue from './TextTrackCue.js';

/**
 *
 */
export default class TextTrackCueList extends Array<TextTrackCue> {
	/**
	 * Returns the first TextTrackCue object with the identifier passed to it.
	 *
	 * @param id Text track cue identifier.
	 */
	public getCueById(id: string): TextTrackCue | null {
		for (const cue of this) {
			if (cue.id === id) {
				return cue;
			}
		}
		return null;
	}
}
