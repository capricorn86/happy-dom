import { beforeEach, describe, expect, it } from 'vitest';
import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';
import type Element from '../../src/nodes/element/Element.js';
import type KeyframeEffect from '../../src/animation/KeyframeEffect.js';

describe('KeyframeEffect', () => {
	let window: Window;
	let document: Document;
	let element: Element;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	describe('constructor()', () => {
		it('Sets the target and default properties.', () => {
			const effect = new window.KeyframeEffect(element, null);

			expect(effect.target).toBe(element);
			expect(effect.pseudoElement).toBe(null);
			expect(effect.composite).toBe('replace');
			expect(effect.iterationComposite).toBe('replace');
			expect(effect.getKeyframes()).toEqual([]);
			expect(effect.getTiming()).toEqual({
				delay: 0,
				direction: 'normal',
				duration: 'auto',
				easing: 'linear',
				endDelay: 0,
				fill: 'auto',
				iterationStart: 0,
				iterations: 1
			});
		});

		it('Sets effect options.', () => {
			const effect = new window.KeyframeEffect(element, [], {
				composite: 'add',
				iterationComposite: 'accumulate',
				delay: 10,
				direction: 'alternate',
				duration: 100,
				easing: 'ease-in',
				endDelay: 20,
				fill: 'both',
				iterationStart: 0.5,
				iterations: 3
			});

			expect(effect.composite).toBe('add');
			expect(effect.iterationComposite).toBe('accumulate');
			expect(effect.getTiming()).toMatchObject({
				delay: 10,
				direction: 'alternate',
				duration: 100,
				easing: 'ease-in',
				endDelay: 20,
				fill: 'both',
				iterationStart: 0.5,
				iterations: 3
			});
		});

		it('Throws for invalid timing and keyframe offsets.', () => {
			expect(() => new window.KeyframeEffect(element, [], { duration: -1 })).toThrow(
				window.TypeError
			);
			expect(
				() => new window.KeyframeEffect(element, [{ offset: 0.75 }, { offset: 0.25 }])
			).toThrow(window.TypeError);
			expect(() => new window.KeyframeEffect(element, [{ offset: 2 }])).toThrow(window.TypeError);
		});
	});

	describe('getKeyframes()', () => {
		it('Normalizes sequence keyframes and computes missing offsets.', () => {
			const effect = new window.KeyframeEffect(element, [
				{ opacity: 0 },
				{ offset: 0.25, easing: 'ease-in', composite: 'add', opacity: 0.5 },
				{ opacity: 1 }
			]);

			expect(effect.getKeyframes()).toEqual([
				{
					offset: null,
					easing: 'linear',
					composite: 'auto',
					computedOffset: 0,
					opacity: '0'
				},
				{
					offset: 0.25,
					easing: 'ease-in',
					composite: 'add',
					computedOffset: 0.25,
					opacity: '0.5'
				},
				{
					offset: null,
					easing: 'linear',
					composite: 'auto',
					computedOffset: 1,
					opacity: '1'
				}
			]);
		});

		it('Normalizes property-indexed keyframes.', () => {
			const effect = new window.KeyframeEffect(element, {
				opacity: [0, 0.5, 1],
				easing: ['ease-in', 'linear', 'ease-out'],
				composite: ['replace', 'add', 'auto']
			});

			expect(effect.getKeyframes()).toEqual([
				{
					offset: null,
					easing: 'ease-in',
					composite: 'replace',
					computedOffset: 0,
					opacity: '0'
				},
				{
					offset: null,
					easing: 'linear',
					composite: 'add',
					computedOffset: 0.5,
					opacity: '0.5'
				},
				{
					offset: null,
					easing: 'ease-out',
					composite: 'auto',
					computedOffset: 1,
					opacity: '1'
				}
			]);
		});

		it('Returns a copy of the keyframes.', () => {
			const effect = new window.KeyframeEffect(element, [{ opacity: 0 }, { opacity: 1 }]);
			const keyframes = effect.getKeyframes();

			keyframes[0].opacity = '1';

			expect(effect.getKeyframes()[0].opacity).toBe('0');
		});
	});

	describe('setKeyframes()', () => {
		it('Replaces the keyframes.', () => {
			const effect = new window.KeyframeEffect(element, []);

			effect.setKeyframes([{ transform: 'scale(1)' }, { transform: 'scale(2)' }]);

			expect(effect.getKeyframes().map((keyframe) => keyframe.transform)).toEqual([
				'scale(1)',
				'scale(2)'
			]);
		});
	});

	describe('updateTiming()', () => {
		it('Updates timing without replacing unspecified values.', () => {
			const effect = new window.KeyframeEffect(element, [], { duration: 100, iterations: 2 });

			effect.updateTiming({ delay: 10, fill: 'forwards' });

			expect(effect.getTiming()).toMatchObject({
				delay: 10,
				duration: 100,
				fill: 'forwards',
				iterations: 2
			});
		});
	});

	describe('getComputedTiming()', () => {
		it('Returns computed duration values.', () => {
			const effect: KeyframeEffect = new window.KeyframeEffect(element, [], {
				delay: 10,
				duration: 100,
				endDelay: 20,
				iterations: 3
			});

			expect(effect.getComputedTiming()).toMatchObject({
				activeDuration: 300,
				currentIteration: null,
				endTime: 330,
				localTime: null,
				progress: null
			});
		});
	});
});
