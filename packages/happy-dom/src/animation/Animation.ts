import * as PropertySymbol from '../PropertySymbol.js';
import EventTarget from '../event/EventTarget.js';
import type Event from '../event/Event.js';
import type AnimationTimeline from './AnimationTimeline.js';
import type KeyframeEffect from './KeyframeEffect.js';
import type BrowserWindow from '../window/BrowserWindow.js';
import DOMExceptionNameEnum from '../exception/DOMExceptionNameEnum.js';

export type TAnimationPlayState = 'finished' | 'idle' | 'paused' | 'running';
export type TAnimationReplaceState = 'active' | 'persisted' | 'removed';

/**
 * Animation.
 *
 * @see https://drafts.csswg.org/web-animations-1/#the-animation-interface
 */
export default class Animation extends EventTarget {
	// Injected by WindowContextClassExtender
	protected declare [PropertySymbol.window]: BrowserWindow;

	public id = '';
	public effect: KeyframeEffect | null;
	public timeline: AnimationTimeline | null;
	public startTime: number | null = null;
	public playbackRate = 1;
	public replaceState: TAnimationReplaceState = 'active';
	public ready: Promise<this>;
	public finished: Promise<this>;
	#playState: TAnimationPlayState = 'idle';
	#currentTime: number | null = null;
	#timer: NodeJS.Timeout | null = null;
	#resolveFinished: ((animation: this) => void) | null = null;
	#rejectFinished: ((reason: unknown) => void) | null = null;
	public [PropertySymbol.propertyEventListeners]: Map<string, ((event: Event) => void) | null> =
		new Map();

	/**
	 * Constructor.
	 *
	 * @param effect Animation effect.
	 * @param timeline Animation timeline.
	 */
	constructor(effect: KeyframeEffect | null = null, timeline?: AnimationTimeline | null) {
		super();
		this.effect = effect;
		this.timeline =
			timeline === undefined ? this[PropertySymbol.window].document.timeline : timeline;
		this.ready = Promise.resolve(this);
		this.finished = this.#createFinishedPromise();
	}

	// Events

	/* eslint-disable jsdoc/require-jsdoc */

	public get oncancel(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('oncancel') ?? null;
	}

	public set oncancel(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('oncancel', value);
	}

	public get onfinish(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onfinish') ?? null;
	}

	public set onfinish(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onfinish', value);
	}

	public get onremove(): ((event: Event) => void) | null {
		return this[PropertySymbol.propertyEventListeners].get('onremove') ?? null;
	}

	public set onremove(value: ((event: Event) => void) | null) {
		this[PropertySymbol.propertyEventListeners].set('onremove', value);
	}

	/* eslint-enable jsdoc/require-jsdoc */

	/**
	 * Returns the current time.
	 *
	 * @returns Current time.
	 */
	public get currentTime(): number | null {
		const timelineTime = this.timeline?.currentTime;
		if (this.#playState === 'running' && this.startTime !== null && timelineTime != null) {
			return (timelineTime - this.startTime) * this.playbackRate;
		}
		return this.#currentTime;
	}

	/**
	 * Sets the current time.
	 *
	 * @param value Current time.
	 */
	public set currentTime(value: number | null) {
		this.#currentTime = value;
		const timelineTime = this.timeline?.currentTime;
		if (value !== null && timelineTime != null && this.playbackRate !== 0) {
			this.startTime = timelineTime - value / this.playbackRate;
		}
		if (this.#playState === 'running') {
			this.#scheduleFinish();
		}
	}

	/**
	 * Returns the play state.
	 *
	 * @returns Play state.
	 */
	public get playState(): TAnimationPlayState {
		return this.#playState;
	}

	/**
	 * Returns whether a play or pause task is pending.
	 *
	 * @returns Pending state.
	 */
	public get pending(): boolean {
		return false;
	}

	/**
	 * Starts or resumes playback.
	 */
	public play(): void {
		if (this.#playState === 'finished' || this.#playState === 'idle') {
			this.finished = this.#createFinishedPromise();
		}
		const currentTime = this.#currentTime ?? (this.playbackRate < 0 ? this.#getEndTime() : 0);
		this.#currentTime = currentTime;
		const timelineTime = this.timeline?.currentTime;
		if (timelineTime != null && this.playbackRate !== 0) {
			this.startTime = timelineTime - currentTime / this.playbackRate;
		}
		this.#playState = 'running';
		this.#scheduleFinish();
	}

	/**
	 * Pauses playback.
	 */
	public pause(): void {
		if (this.#playState === 'running') {
			this.#currentTime = this.currentTime;
			this.startTime = null;
			this.#playState = 'paused';
			this.#clearTimer();
		}
	}

	/**
	 * Reverses playback.
	 */
	public reverse(): void {
		this.playbackRate = this.playbackRate === 0 ? -1 : -this.playbackRate;
		this.play();
	}

	/**
	 * Finishes playback.
	 */
	public finish(): void {
		if (this.playbackRate === 0) {
			throw new this[PropertySymbol.window].DOMException(
				'The animation playback rate is zero.',
				DOMExceptionNameEnum.invalidStateError
			);
		}
		this.#clearTimer();
		this.#currentTime = this.playbackRate < 0 ? 0 : this.#getEndTime();
		this.startTime = null;
		this.#playState = 'finished';
		this.#resolveFinished?.(this);
		this.dispatchEvent(new this[PropertySymbol.window].Event('finish'));
	}

	/**
	 * Cancels playback.
	 */
	public cancel(): void {
		if (this.#playState === 'idle') {
			return;
		}
		this.#clearTimer();
		this.#playState = 'idle';
		this.#currentTime = null;
		this.startTime = null;
		this.#rejectFinished?.(
			new this[PropertySymbol.window].DOMException(
				'The animation was canceled.',
				DOMExceptionNameEnum.abortError
			)
		);
		this.dispatchEvent(new this[PropertySymbol.window].Event('cancel'));
	}

	/**
	 * Persists the animation.
	 */
	public persist(): void {
		this.replaceState = 'persisted';
	}

	/**
	 * Updates the playback rate.
	 *
	 * @param playbackRate Playback rate.
	 */
	public updatePlaybackRate(playbackRate: number): void {
		const currentTime = this.currentTime;
		this.playbackRate = playbackRate;
		this.currentTime = currentTime;
	}

	/**
	 * Gets the end time of the animation.
	 *
	 * @returns End time.
	 */
	#getEndTime(): number {
		return this.effect?.getComputedTiming().endTime ?? 0;
	}

	/**
	 * Creates a new finished promise.
	 *
	 * @returns Finished promise.
	 */
	#createFinishedPromise(): Promise<this> {
		return new Promise<this>((resolve, reject) => {
			this.#resolveFinished = resolve;
			this.#rejectFinished = reject;
		});
	}

	/**
	 * Schedules the finish of the animation.
	 */
	#scheduleFinish(): void {
		this.#clearTimer();
		if (!this.effect || this.playbackRate === 0) {
			return;
		}
		const currentTime = this.currentTime ?? 0;
		const remaining =
			this.playbackRate < 0
				? currentTime / -this.playbackRate
				: (this.#getEndTime() - currentTime) / this.playbackRate;
		if (Number.isFinite(remaining)) {
			this.#timer = this[PropertySymbol.window].setTimeout(
				() => this.finish(),
				Math.max(0, remaining)
			);
		}
	}

	/**
	 * Clears the finish timer.
	 */
	#clearTimer(): void {
		if (this.#timer !== null) {
			this[PropertySymbol.window].clearTimeout(this.#timer);
			this.#timer = null;
		}
	}
}
