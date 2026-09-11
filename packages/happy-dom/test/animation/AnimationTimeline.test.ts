import { describe, expect, it } from 'vitest';
import AnimationTimeline from '../../src/animation/AnimationTimeline.js';

describe('AnimationTimeline', () => {
	describe('get currentTime()', () => {
		it('Returns null.', () => {
			const timeline = new AnimationTimeline();

			expect(timeline.currentTime).toBe(null);
		});
	});
});
