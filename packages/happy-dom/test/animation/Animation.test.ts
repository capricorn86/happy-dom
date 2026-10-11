import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Window from '../../src/window/Window.js';
import type Animation from '../../src/animation/Animation.js';
import type KeyframeEffect from '../../src/animation/KeyframeEffect.js';
import EventTarget from '../../src/event/EventTarget.js';

describe('Animation', () => {
	let window: Window;
	let effect: KeyframeEffect;
	let animation: Animation;

	beforeEach(() => {
		window = new Window();
		effect = new window.KeyframeEffect(window.document.body, [], { duration: 10000 });
		animation = new window.Animation(effect);
	});

	afterEach(() => {
		if (animation.playState !== 'idle') {
			animation.finished.catch(() => {});
			animation.cancel();
		}
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Sets the effect, document timeline and initial state.', async () => {
			expect(animation).toBeInstanceOf(EventTarget);
			expect(animation.effect).toBe(effect);
			expect(animation.timeline).toBe(window.document.timeline);
			expect(animation.id).toBe('');
			expect(animation.startTime).toBe(null);
			expect(animation.currentTime).toBe(null);
			expect(animation.playbackRate).toBe(1);
			expect(animation.playState).toBe('idle');
			expect(animation.pending).toBe(false);
			expect(animation.replaceState).toBe('active');
			await expect(animation.ready).resolves.toBe(animation);
		});

		it('Supports a null timeline and effect.', () => {
			animation = new window.Animation(null, null);

			expect(animation.effect).toBe(null);
			expect(animation.timeline).toBe(null);
		});
	});

	describe('play() and pause()', () => {
		it('Starts, pauses and resumes playback.', () => {
			animation.play();
			expect(animation.playState).toBe('running');
			expect(animation.currentTime).toBeGreaterThanOrEqual(0);
			expect(animation.startTime).toBeTypeOf('number');

			animation.pause();
			const pausedTime = animation.currentTime;
			expect(animation.playState).toBe('paused');
			expect(animation.startTime).toBe(null);

			animation.play();
			expect(animation.playState).toBe('running');
			expect(animation.currentTime).toBeGreaterThanOrEqual(pausedTime ?? 0);
		});
	});

	describe('currentTime', () => {
		it('Sets the current time.', () => {
			animation.currentTime = 250;

			expect(animation.currentTime).toBe(250);
			expect(animation.startTime).toBeTypeOf('number');
		});
	});

	describe('finish()', () => {
		it('Finishes the animation, resolves finished and dispatches an event.', async () => {
			const listener = vi.fn();
			animation.onfinish = listener;
			animation.play();
			const finished = animation.finished;

			animation.finish();

			expect(animation.playState).toBe('finished');
			expect(animation.currentTime).toBe(10000);
			expect(animation.startTime).toBe(null);
			expect(listener).toHaveBeenCalledOnce();
			await expect(finished).resolves.toBe(animation);
		});

		it('Throws when playback rate is zero.', () => {
			animation.playbackRate = 0;

			expect(() => animation.finish()).toThrow(
				expect.objectContaining({ name: 'InvalidStateError' })
			);
		});
	});

	describe('cancel()', () => {
		it('Cancels the animation, replaces finished and dispatches an event.', async () => {
			const listener = vi.fn();
			animation.oncancel = listener;
			animation.play();
			const finished = animation.finished;

			animation.cancel();
			const nextFinished = animation.finished;

			expect(animation.playState).toBe('idle');
			expect(animation.currentTime).toBe(null);
			expect(animation.startTime).toBe(null);
			expect(listener).toHaveBeenCalledOnce();
			expect(nextFinished).not.toBe(finished);
			await expect(finished).rejects.toMatchObject({ name: 'AbortError' });

			animation.play();
			expect(animation.finished).toBe(nextFinished);
			animation.finish();
			await expect(nextFinished).resolves.toBe(animation);
		});

		it('Does not report an unhandled rejection when finished is unobserved.', async () => {
			animation.play();
			animation.cancel();

			// Cross one event-loop turn so Vitest can report an unhandled rejection.
			await new Promise<void>((resolve) => setImmediate(resolve));
		});
	});

	describe('reverse()', () => {
		it('Reverses the playback rate and starts the animation at its end.', () => {
			animation.reverse();

			expect(animation.playbackRate).toBe(-1);
			expect(animation.playState).toBe('running');
			expect(animation.currentTime).toBeLessThanOrEqual(10000);
		});
	});

	describe('persist()', () => {
		it('Persists the animation.', () => {
			animation.persist();

			expect(animation.replaceState).toBe('persisted');
		});
	});

	describe('updatePlaybackRate()', () => {
		it('Updates the playback rate while preserving current time.', () => {
			animation.currentTime = 250;

			animation.updatePlaybackRate(2);

			expect(animation.playbackRate).toBe(2);
			expect(animation.currentTime).toBe(250);
		});
	});

	describe('event handler properties', () => {
		it('Gets and sets event handlers.', () => {
			const oncancel = vi.fn();
			const onfinish = vi.fn();
			const onremove = vi.fn();

			animation.oncancel = oncancel;
			animation.onfinish = onfinish;
			animation.onremove = onremove;

			expect(animation.oncancel).toBe(oncancel);
			expect(animation.onfinish).toBe(onfinish);
			expect(animation.onremove).toBe(onremove);
		});
	});
});
