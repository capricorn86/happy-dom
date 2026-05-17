import InputEvent from '../../../src/event/events/InputEvent.js';
import StaticRange from '../../../src/range/StaticRange.js';
import Window from '../../../src/window/Window.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('InputEvent', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('getTargetRanges()', () => {
		it('Returns an empty array by default.', () => {
			const event = new InputEvent('input');
			expect(event.getTargetRanges()).toEqual([]);
		});

		it('Returns the StaticRange instances passed in the constructor.', () => {
			const doc = window.document;
			const textNode = doc.createTextNode('hello');
			const range = new StaticRange({
				startContainer: textNode,
				startOffset: 0,
				endContainer: textNode,
				endOffset: 5
			});
			const event = new InputEvent('beforeinput', { targetRanges: [range] });
			const result = event.getTargetRanges();
			expect(result).toHaveLength(1);
			expect(result[0]).toBe(range);
		});

		it('Returns a copy, not the original array.', () => {
			const doc = window.document;
			const textNode = doc.createTextNode('hello');
			const range = new StaticRange({
				startContainer: textNode,
				startOffset: 0,
				endContainer: textNode,
				endOffset: 5
			});
			const event = new InputEvent('beforeinput', { targetRanges: [range] });
			const result1 = event.getTargetRanges();
			const result2 = event.getTargetRanges();
			expect(result1).not.toBe(result2);
		});
	});
});
