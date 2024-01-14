import ErrorEvent from '../../event/events/ErrorEvent.js';
import Event from '../../event/Event.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLMediaElement, { IMediaError } from './IHTMLMediaElement.js';
import * as PropertySymbol from '../../PropertySymbol.js';

/**
 *
 * This implementation coming from jsdom
 * https://github.com/jsdom/jsdom/blob/master/lib/jsdom/living/nodes/HTMLMediaElement-impl.js#L7
 *
 */
function getTimeRangeDummy(): object {
	return {
		length: 0,
		start() {
			return 0;
		},
		end() {
			return 0;
		}
	};
}
/**
 * HTML Media Element.
 *
 * Reference:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement.
 *
 */
export default class HTMLMediaElement extends HTMLElement implements IHTMLMediaElement {
	// Events
	public onabort: (event: Event) => void | null = null;
	public oncanplay: (event: Event) => void | null = null;
	public oncanplaythrough: (event: Event) => void | null = null;
	public ondurationchange: (event: Event) => void | null = null;
	public onemptied: (event: Event) => void | null = null;
	public onended: (event: Event) => void | null = null;
	public onerror: (event: ErrorEvent) => void | null = null;
	public onloadeddata: (event: Event) => void | null = null;
	public onloadedmetadata: (event: Event) => void | null = null;
	public onloadstart: (event: Event) => void | null = null;
	public onpause: (event: Event) => void | null = null;
	public onplay: (event: Event) => void | null = null;
	public onplaying: (event: Event) => void | null = null;
	public onprogress: (event: Event) => void | null = null;
	public onratechange: (event: Event) => void | null = null;
	public onresize: (event: Event) => void | null = null;
	public onseeked: (event: Event) => void | null = null;
	public onseeking: (event: Event) => void | null = null;
	public onstalled: (event: Event) => void | null = null;
	public onsuspend: (event: Event) => void | null = null;
	public ontimeupdate: (event: Event) => void | null = null;
	public onvolumechange: (event: Event) => void | null = null;
	public onwaiting: (event: Event) => void | null = null;

	// Internal Properties
	public [PropertySymbol.volume] = 1;
	public [PropertySymbol.paused] = true;
	public [PropertySymbol.currentTime] = 0;
	public [PropertySymbol.playbackRate] = 1;
	public [PropertySymbol.defaultPlaybackRate] = 1;
	public [PropertySymbol.muted] = false;
	public [PropertySymbol.defaultMuted] = false;
	public [PropertySymbol.preservesPitch] = true;
	public [PropertySymbol.buffered]: object = getTimeRangeDummy();
	public [PropertySymbol.duration] = NaN;
	public [PropertySymbol.error]: IMediaError = null;
	public [PropertySymbol.ended] = false;
	public [PropertySymbol.networkState] = 0;
	public [PropertySymbol.readyState] = 0;
	public [PropertySymbol.textTracks]: object[] = [];
	public [PropertySymbol.videoTracks]: object[] = [];
	public [PropertySymbol.seeking] = false;
	public [PropertySymbol.seekable] = getTimeRangeDummy();
	public [PropertySymbol.played] = getTimeRangeDummy();

	/**
	 * Returns buffered.
	 *
	 * @returns Buffered.
	 */
	public get buffered(): object {
		return this[PropertySymbol.buffered];
	}

	/**
	 * Returns duration.
	 *
	 * @returns Duration.
	 */
	public get duration(): number {
		return this[PropertySymbol.duration];
	}

	/**
	 * Returns error.
	 *
	 * @returns Error.
	 */
	public get error(): IMediaError {
		return this[PropertySymbol.error];
	}

	/**
	 * Returns ended.
	 *
	 * @returns Ended.
	 */
	public get ended(): boolean {
		return this[PropertySymbol.ended];
	}

	/**
	 * Returns networkState.
	 *
	 * @returns NetworkState.
	 */
	public get networkState(): number {
		return this[PropertySymbol.networkState];
	}

	/**
	 * Returns readyState.
	 *
	 * @returns ReadyState.
	 */
	public get readyState(): number {
		return this[PropertySymbol.readyState];
	}

	/**
	 * Returns textTracks.
	 *
	 * @returns TextTracks.
	 */
	public get textTracks(): object[] {
		return this[PropertySymbol.textTracks];
	}

	/**
	 * Returns videoTracks.
	 *
	 * @returns VideoTracks.
	 */
	public get videoTracks(): object[] {
		return this[PropertySymbol.videoTracks];
	}

	/**
	 * Returns seeking.
	 *
	 * @returns Seeking.
	 */
	public get seeking(): boolean {
		return this[PropertySymbol.seeking];
	}

	/**
	 * Returns seekable.
	 *
	 * @returns Seekable.
	 */
	public get seekable(): object {
		return this[PropertySymbol.seekable];
	}

	/**
	 * Returns played.
	 *
	 * @returns Played.
	 */
	public get played(): object {
		return this[PropertySymbol.played];
	}

	/**
	 * Returns autoplay.
	 *
	 * @returns Autoplay.
	 */
	public get autoplay(): boolean {
		return this.getAttribute('autoplay') !== null;
	}

	/**
	 * Sets autoplay.
	 *
	 * @param autoplay Autoplay.
	 */
	public set autoplay(autoplay: boolean) {
		if (!autoplay) {
			this.removeAttribute('autoplay');
		} else {
			this.setAttribute('autoplay', '');
		}
	}

	/**
	 * Returns controls.
	 *
	 * @returns Controls.
	 */
	public get controls(): boolean {
		return this.getAttribute('controls') !== null;
	}

	/**
	 * Sets controls.
	 *
	 * @param controls Controls.
	 */
	public set controls(controls: boolean) {
		if (!controls) {
			this.removeAttribute('controls');
		} else {
			this.setAttribute('controls', '');
		}
	}

	/**
	 * Returns loop.
	 *
	 * @returns Loop.
	 */
	public get loop(): boolean {
		return this.getAttribute('loop') !== null;
	}

	/**
	 * Sets loop.
	 *
	 * @param loop Loop.
	 */
	public set loop(loop: boolean) {
		if (!loop) {
			this.removeAttribute('loop');
		} else {
			this.setAttribute('loop', '');
		}
	}
	/**
	 * Returns muted.
	 *
	 * @returns Muted.
	 */
	public get muted(): boolean {
		if (this[PropertySymbol.muted]) {
			return this[PropertySymbol.muted];
		}

		if (!this[PropertySymbol.defaultMuted]) {
			return this.getAttribute('muted') !== null;
		}

		return false;
	}

	/**
	 * Sets muted.
	 *
	 * @param muted Muted.
	 */
	public set muted(muted: boolean) {
		this[PropertySymbol.muted] = !!muted;
		if (!muted && !this[PropertySymbol.defaultMuted]) {
			this.removeAttribute('muted');
		} else {
			this.setAttribute('muted', '');
		}
	}

	/**
	 * Returns defaultMuted.
	 *
	 * @returns DefaultMuted.
	 */
	public get defaultMuted(): boolean {
		return this[PropertySymbol.defaultMuted];
	}

	/**
	 * Sets defaultMuted.
	 *
	 * @param defaultMuted DefaultMuted.
	 */
	public set defaultMuted(defaultMuted: boolean) {
		this[PropertySymbol.defaultMuted] = !!defaultMuted;
		if (!this[PropertySymbol.defaultMuted] && !this[PropertySymbol.muted]) {
			this.removeAttribute('muted');
		} else {
			this.setAttribute('muted', '');
		}
	}

	/**
	 * Returns src.
	 *
	 * @returns Src.
	 */
	public get src(): string {
		return this.getAttribute('src') || '';
	}

	/**
	 * Sets src.
	 *
	 * @param src Src.
	 */
	public set src(src: string) {
		this.setAttribute('src', src);
		if (Boolean(src)) {
			this.dispatchEvent(new Event('canplay', { bubbles: false, cancelable: false }));
			this.dispatchEvent(new Event('durationchange', { bubbles: false, cancelable: false }));
		}
	}

	/**
	 * Returns currentSrc.
	 *
	 * @returns CurrentrSrc.
	 */
	public get currentSrc(): string {
		return this.src;
	}

	/**
	 * Returns volume.
	 *
	 * @returns Volume.
	 */
	public get volume(): number {
		return this[PropertySymbol.volume];
	}

	/**
	 * Sets volume.
	 *
	 * @param volume Volume.
	 */
	public set volume(volume: number | string) {
		const parsedVolume = Number(volume);

		if (isNaN(parsedVolume)) {
			throw new TypeError(
				`Failed to set the 'volume' property on 'HTMLMediaElement': The provided double value is non-finite.`
			);
		}
		if (parsedVolume < 0 || parsedVolume > 1) {
			throw new DOMException(
				`Failed to set the 'volume' property on 'HTMLMediaElement': The volume provided (${parsedVolume}) is outside the range [0, 1].`,
				DOMExceptionNameEnum.indexSizeError
			);
		}
		// TODO: volumechange event https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event
		this[PropertySymbol.volume] = parsedVolume;
	}

	/**
	 * Returns crossOrigin.
	 *
	 * @returns CrossOrigin.
	 */
	public get crossOrigin(): string {
		return this.getAttribute('crossorigin');
	}

	/**
	 * Sets crossOrigin.
	 *
	 * @param crossOrigin CrossOrigin.
	 */
	public set crossOrigin(crossOrigin: string | null) {
		if (crossOrigin === null) {
			return;
		}

		if (['', 'use-credentials', 'anonymous'].includes(crossOrigin)) {
			this.setAttribute('crossorigin', crossOrigin);
		} else {
			this.setAttribute('crossorigin', 'anonymous');
		}
	}

	/**
	 * Returns currentTime.
	 *
	 * @returns CurrentTime.
	 */
	public get currentTime(): number {
		return this[PropertySymbol.currentTime];
	}

	/**
	 * Sets currentTime.
	 *
	 * @param currentTime CurrentTime.
	 */
	public set currentTime(currentTime: number | string) {
		const parsedCurrentTime = Number(currentTime);
		if (isNaN(parsedCurrentTime)) {
			throw new TypeError(
				`Failed to set the 'currentTime' property on 'HTMLMediaElement': The provided double value is non-finite.`
			);
		}
		this[PropertySymbol.currentTime] = parsedCurrentTime;
	}

	/**
	 * Returns playbackRate.
	 *
	 * @returns PlaybackRate.
	 */
	public get playbackRate(): number {
		return this[PropertySymbol.playbackRate];
	}

	/**
	 * Sets playbackRate.
	 *
	 * @param playbackRate PlaybackRate.
	 */
	public set playbackRate(playbackRate: number | string) {
		const parsedPlaybackRate = Number(playbackRate);
		if (isNaN(parsedPlaybackRate)) {
			throw new TypeError(
				`Failed to set the 'playbackRate' property on 'HTMLMediaElement': The provided double value is non-finite.`
			);
		}
		this[PropertySymbol.playbackRate] = parsedPlaybackRate;
	}

	/**
	 * Returns defaultPlaybackRate.
	 *
	 * @returns DefaultPlaybackRate.
	 */
	public get defaultPlaybackRate(): number {
		return this[PropertySymbol.defaultPlaybackRate];
	}

	/**
	 * Sets defaultPlaybackRate.
	 *
	 * @param defaultPlaybackRate DefaultPlaybackRate.
	 */
	public set defaultPlaybackRate(defaultPlaybackRate: number | string) {
		const parsedDefaultPlaybackRate = Number(defaultPlaybackRate);
		if (isNaN(parsedDefaultPlaybackRate)) {
			throw new TypeError(
				`Failed to set the 'defaultPlaybackRate' property on 'HTMLMediaElement': The provided double value is non-finite.`
			);
		}
		this[PropertySymbol.defaultPlaybackRate] = parsedDefaultPlaybackRate;
	}

	/**
	 * Returns preservesPitch.
	 *
	 * @returns PlaybackRate.
	 */
	public get preservesPitch(): boolean {
		return this[PropertySymbol.preservesPitch];
	}

	/**
	 * Sets preservesPitch.
	 *
	 * @param preservesPitch PreservesPitch.
	 */
	public set preservesPitch(preservesPitch: boolean) {
		this[PropertySymbol.preservesPitch] = Boolean(preservesPitch);
	}

	/**
	 * Returns preload.
	 *
	 * @returns preload.
	 */
	public get preload(): string {
		return this.getAttribute('preload') || 'auto';
	}

	/**
	 * Sets preload.
	 *
	 * @param preload preload.
	 */
	public set preload(preload: string) {
		this.setAttribute('preload', preload);
	}

	/**
	 * Returns paused.
	 *
	 * @returns Paused.
	 */
	public get paused(): boolean {
		return this[PropertySymbol.paused];
	}

	/**
	 * Pause played media.
	 */
	public pause(): void {
		this[PropertySymbol.paused] = true;
		this.dispatchEvent(new Event('pause', { bubbles: false, cancelable: false }));
	}

	/**
	 * Start playing media.
	 */
	public async play(): Promise<void> {
		this[PropertySymbol.paused] = false;
		return Promise.resolve();
	}

	/**
	 *
	 * @param _type
	 */
	public canPlayType(_type: string): string {
		return '';
	}

	/**
	 * Load media.
	 */
	public load(): void {
		this.dispatchEvent(new Event('emptied', { bubbles: false, cancelable: false }));
	}

	/**
	 *
	 */
	public captureStream(): object {
		return {};
	}

	/**
	 * Clones a node.
	 *
	 * @override
	 * @param [deep=false] "true" to clone deep.
	 * @returns Cloned node.
	 */
	/**
	 *
	 * @param deep
	 */
	public cloneNode(deep = false): IHTMLMediaElement {
		return <IHTMLMediaElement>super.cloneNode(deep);
	}
}
