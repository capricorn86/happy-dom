import DocumentFragment from '../document-fragment/DocumentFragment.js';
import TextTrackCue from './TextTrackCue.js';
import VTTRegion from './VTTRegion.js';

/**
 * VTTCue.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/VTTCue
 */
export default class VTTCue extends TextTrackCue {
	public region: VTTRegion | null = null;
	public vertical: string = '';
	public snapToLines: boolean = true;
	public line: number = 0;
	public lineAlign: string = '';
	public position: string = 'auto';
	public positionAlign: string = 'auto';
	public size: number = 100;
	public align: string = '';
	public text: string = '';

	/**
	 * Constructor.
	 *
	 * @param startTime The start time for the cue.
	 * @param endTime The end time for the cue.
	 * @param text The text of the cue.
	 */
	constructor(startTime: number, endTime: number, text: string) {
		super(startTime, endTime);
		this.text = text;
	}

	/**
	 * Returns the cue as HTML.
	 *
	 * @returns DocumentFragment
	 */
	public getCueAsHTML(): DocumentFragment {
		// TODO: Implement.
		return null;
	}
}
