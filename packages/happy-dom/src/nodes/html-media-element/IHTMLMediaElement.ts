import Event from '../../event/Event';
import IHTMLElement from '../html-element/IHTMLElement';

/**
 * HTML Media Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement.
 */

export interface IMediaError {
	code: number;
	message: string;
}
export default interface IHTMLMediaElement extends IHTMLElement {
	readonly currentSrc: string;
	readonly duration: number;
	readonly ended: boolean;
	readonly error: IMediaError | null;
	readonly networkState: number;
	readonly played: object; // TimeRanges https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
	readonly readyState: number;
	readonly seekable: object; // TimeRanges https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
	readonly seeking: boolean;
	readonly textTracks: object[];
	readonly videoTracks: object[];
	readonly buffered: object; // TimeRanges https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
	autoplay: boolean;
	controls: boolean;
	crossOrigin: string; // Only anonymus and 'use-credentials' is valid
	currentTime: number | string;
	defaultMuted: boolean;
	defaultPlaybackRate: number | string;
	loop: boolean;
	muted: boolean;
	paused: boolean;
	playbackRate: number | string;
	preload: string;
	preservesPitch: boolean;
	src: string;
	volume: number | string;

	// Events
	onabort: (event: Event) => void | null;
	oncanplay: (event: Event) => void | null;
	oncanplaythrough: (event: Event) => void | null;
	ondurationchange: (event: Event) => void | null;
	onemptied: (event: Event) => void | null;
	onended: (event: Event) => void | null;
	onerror: (event: Event) => void | null;
	onloadeddata: (event: Event) => void | null;
	onloadedmetadata: (event: Event) => void | null;
	onloadstart: (event: Event) => void | null;
	onpause: (event: Event) => void | null;
	onplay: (event: Event) => void | null;
	onplaying: (event: Event) => void | null;
	onprogress: (event: Event) => void | null;
	onratechange: (event: Event) => void | null;
	onresize: (event: Event) => void | null;
	onseeked: (event: Event) => void | null;
	onseeking: (event: Event) => void | null;
	onstalled: (event: Event) => void | null;
	onsuspend: (event: Event) => void | null;
	ontimeupdate: (event: Event) => void | null;
	onvolumechange: (event: Event) => void | null;
	onwaiting: (event: Event) => void | null;

	/**
	 * A MediaStream object which can be used as a source for audio and/or video data by other media processing code,
	 * or as a source for WebRTC.
	 * Https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream
	 */
	captureStream(): object;

	/**
	 * The HTMLMediaElement method canPlayType() reports how likely it is that the current browser will be able to play
	 * media of a given MIME type.
	 * Https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType
	 * possible return value: "" | "probably" | "maybe".
	 */
	canPlayType(_type: string): string;

	/**
	 * The HTMLMediaElement method load() resets the media element to its initial state and begins the process of
	 * selecting a media source and loading the media in preparation for playback to begin at the beginning.
	 * Https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/load.
	 */
	load(): void;

	/**
	 * The HTMLMediaElement.pause() method will pause playback of the media, if the media is already in a paused state
	 * this method will have no effect.
	 */
	pause(): void;

	/**
	 * The HTMLMediaElement play() method attempts to begin playback of the media. It returns a Promise
	 * which is resolved when playback has been successfully started.
	 */
	play(): Promise<void>;

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	cloneNode(deep?: boolean): IHTMLMediaElement;
}
