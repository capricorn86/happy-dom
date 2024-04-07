import Event from '../../event/Event.js';
import EventTarget from '../../event/EventTarget.js';
import * as PropertySymbol from '../../PropertySymbol.js';
import Crypto from 'crypto';
import IMediaTrackCapabilities from './IMediaTrackCapabilities.js';
import IMediaTrackSettings from './IMediaTrackSettings.js';

const DEVICE_ID = 'S3F/aBCdEfGHIjKlMnOpQRStUvWxYz1234567890+1AbC2DEf2GHi3jK34le+ab12C3+1aBCdEf==';
const CAPABILITIES: IMediaTrackCapabilities = {
	aspectRatio: {
		max: 300,
		min: 0.006666666666666667
	},
	deviceId: DEVICE_ID,
	facingMode: [],
	frameRate: {
		max: 60,
		min: 0
	},
	height: {
		max: 150,
		min: 1
	},
	resizeMode: ['none', 'crop-and-scale'],
	width: {
		max: 300,
		min: 1
	}
};
const SETTINGS: IMediaTrackSettings = {
	deviceId: DEVICE_ID,
	frameRate: 60,
	resizeMode: 'none'
};

/**
 * Canvas Capture Media Stream Track.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack
 */
export default class MediaStreamTrack extends EventTarget {
	public contentHint:
		| ''
		| 'speech'
		| 'speech-recognition'
		| 'music'
		| 'motion'
		| 'detail'
		| 'text' = '';
	public enabled = true;
	public id: string = Crypto.randomUUID();
	public kind: 'audio' | 'video' = 'video';
	public label: string = DEVICE_ID;
	public muted = false;
	public readyState: 'live' | 'ended' = 'live';
	public [PropertySymbol.constraints]: object = {};
	public [PropertySymbol.capabilities]: IMediaTrackCapabilities = JSON.parse(
		JSON.stringify(CAPABILITIES)
	);
	public [PropertySymbol.settings]: IMediaTrackSettings = JSON.parse(JSON.stringify(SETTINGS));

	// Events
	public onended: (event: Event) => void | null = null;
	public onmute: (event: Event) => void | null = null;
	public onunmute: (event: Event) => void | null = null;

	/**
	 * Applies constraints.
	 *
	 * @param _constraints Constraints.
	 * @param constraints
	 */
	public async applyConstraints(constraints: object): Promise<void> {
		Object.apply(this[PropertySymbol.constraints], constraints);
	}

	/**
	 * Returns capabilities.
	 *
	 * @returns Capabilities.
	 */
	public getCapabilities(): IMediaTrackCapabilities {
		return this[PropertySymbol.capabilities];
	}

	/**
	 * Returns constraints.
	 *
	 * @returns Constraints.
	 */
	public getConstraints(): object {
		return this[PropertySymbol.constraints];
	}

	/**
	 * Returns settings.
	 *
	 * @returns Settings.
	 */
	public getSettings(): IMediaTrackSettings {
		return this[PropertySymbol.settings];
	}

	/**
	 * Clones the track.
	 *
	 * @returns Clone.
	 */
	public clone(): MediaStreamTrack {
		const clone = new (<typeof MediaStreamTrack>this.constructor)();
		clone.contentHint = this.contentHint;
		clone.enabled = this.enabled;
		clone.id = this.id;
		clone.kind = this.kind;
		clone.label = this.label;
		clone.muted = this.muted;
		clone.readyState = this.readyState;
		return clone;
	}

	/**
	 * Stops the track.
	 */
	public stop(): void {
		this.readyState = 'ended';
	}
}
