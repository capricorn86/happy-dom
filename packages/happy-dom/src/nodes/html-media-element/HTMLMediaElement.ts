import ErrorEvent from '../../event/events/ErrorEvent.js';
import Event from '../../event/Event.js';
import DOMException from '../../exception/DOMException.js';
import DOMExceptionNameEnum from '../../exception/DOMExceptionNameEnum.js';
import HTMLElement from '../html-element/HTMLElement.js';
import IHTMLMediaElement, { IMediaError } from './IHTMLMediaElement.js';

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
	// Public Properties
	public readonly buffered = getTimeRangeDummy();
	public readonly duration = NaN;
	public readonly error: IMediaError = null;
	public readonly ended = false;
	public readonly networkState = 0;
	public readonly readyState = 0;
	public readonly textTracks = [];
	public readonly videoTracks = [];
	public readonly seeking = false;
	public readonly seekable = getTimeRangeDummy();
	public readonly played = getTimeRangeDummy();

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

	#volume = 1;
	#paused = true;
	#currentTime = 0;
	#playbackRate = 1;
	#defaultPlaybackRate = 1;
	#muted = false;
	#defaultMuted = false;
	#preservesPitch = true;
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
		if (this.#muted) {
			return this.#muted;
		}

		if (!this.#defaultMuted) {
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
		this.#muted = !!muted;
		if (!muted && !this.#defaultMuted) {
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
		return this.#defaultMuted;
	}

	/**
	 * Sets defaultMuted.
	 *
	 * @param defaultMuted DefaultMuted.
	 */
	public set defaultMuted(defaultMuted: boolean) {
		this.#defaultMuted = !!defaultMuted;
		if (!this.#defaultMuted && !this.#muted) {
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
		return this.#volume;
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
		this.#volume = parsedVolume;
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
		return this.#currentTime;
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
		this.#currentTime = parsedCurrentTime;
	}

	/**
	 * Returns playbackRate.
	 *
	 * @returns PlaybackRate.
	 */
	public get playbackRate(): number {
		return this.#playbackRate;
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
		this.#playbackRate = parsedPlaybackRate;
	}

	/**
	 * Returns defaultPlaybackRate.
	 *
	 * @returns DefaultPlaybackRate.
	 */
	public get defaultPlaybackRate(): number {
		return this.#defaultPlaybackRate;
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
		this.#defaultPlaybackRate = parsedDefaultPlaybackRate;
	}

	/**
	 * Returns preservesPitch.
	 *
	 * @returns PlaybackRate.
	 */
	public get preservesPitch(): boolean {
		return this.#preservesPitch;
	}

	/**
	 * Sets preservesPitch.
	 *
	 * @param preservesPitch PreservesPitch.
	 */
	public set preservesPitch(preservesPitch: boolean) {
		this.#preservesPitch = Boolean(preservesPitch);
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
		return this.#paused;
	}

	/**
	 * Pause played media.
	 */
	public pause(): void {
		this.#paused = true;
		this.dispatchEvent(new Event('pause', { bubbles: false, cancelable: false }));
	}

	/**
	 * Start playing media.
	 */
	public async play(): Promise<void> {
		this.#paused = false;
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
