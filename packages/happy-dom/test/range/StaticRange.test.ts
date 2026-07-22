import StaticRange from '../../src/range/StaticRange.js';
import Window from '../../src/window/Window.js';
import { describe, it, expect, beforeEach } from 'vitest';

describe('StaticRange', () => {
	let window: Window;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Sets startContainer, startOffset, endContainer, endOffset.', () => {
			const doc = window.document;
			const textNode = doc.createTextNode('hello');
			const range = new StaticRange({
				startContainer: textNode,
				startOffset: 1,
				endContainer: textNode,
				endOffset: 3
			});
			expect(range.startContainer).toBe(textNode);
			expect(range.startOffset).toBe(1);
			expect(range.endContainer).toBe(textNode);
			expect(range.endOffset).toBe(3);
		});
	});

	describe('collapsed', () => {
		it('Returns true when start and end are the same container and offset.', () => {
			const doc = window.document;
			const textNode = doc.createTextNode('hello');
			const range = new StaticRange({
				startContainer: textNode,
				startOffset: 2,
				endContainer: textNode,
				endOffset: 2
			});
			expect(range.collapsed).toBe(true);
		});

		it('Returns false when start and end differ.', () => {
			const doc = window.document;
			const textNode = doc.createTextNode('hello');
			const range = new StaticRange({
				startContainer: textNode,
				startOffset: 0,
				endContainer: textNode,
				endOffset: 3
			});
			expect(range.collapsed).toBe(false);
		});
	});
});
