import { describe, it, expect } from 'vitest';
import ImageBitmap from '../../../src/nodes/html-canvas-element/ImageBitmap.js';

describe('ImageBitmap', () => {
	describe('get width()', () => {
		it('Returns width.', () => {
			const imageBitmap = new ImageBitmap(800, 600);
			expect(imageBitmap.width).toBe(800);
		});
	});
	describe('get height()', () => {
		it('Returns height.', () => {
			const imageBitmap = new ImageBitmap(800, 600);
			expect(imageBitmap.height).toBe(600);
		});
	});

	describe('close()', () => {
		it('Does nothing (not implemented yet).', () => {
			const imageBitmap = new ImageBitmap(800, 600);
			expect(() => imageBitmap.close()).not.toThrow();
		});
	});
});
