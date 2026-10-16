import { afterEach, describe, expect, it, vi } from 'vitest';
import DocumentTimeline from '../../src/animation/DocumentTimeline.js';
import AnimationTimeline from '../../src/animation/AnimationTimeline.js';

describe('DocumentTimeline', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Extends AnimationTimeline.', () => {
			expect(new DocumentTimeline()).toBeInstanceOf(AnimationTimeline);
		});
	});

	describe('get currentTime()', () => {
		it('Returns the current high resolution time.', () => {
			vi.spyOn(performance, 'now').mockReturnValue(100);

			expect(new DocumentTimeline().currentTime).toBe(100);
		});

		it('Subtracts the origin time.', () => {
			vi.spyOn(performance, 'now').mockReturnValue(100);

			expect(new DocumentTimeline({ originTime: 25 }).currentTime).toBe(75);
		});
	});
});
