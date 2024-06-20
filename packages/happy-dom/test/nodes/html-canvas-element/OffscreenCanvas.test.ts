import { describe, it, expect } from 'vitest';
import OffscreenCanvas from '../../../src/nodes/html-canvas-element/OffscreenCanvas.js';
import ImageBitmap from '../../../src/nodes/html-canvas-element/ImageBitmap.js';
import Blob from '../../../src/file/Blob.js';

describe('OffscreenCanvas', () => {
	describe('get width()', () => {
		it('Returns width.', () => {
			const offscreenCanvas = new OffscreenCanvas(800, 600);
			expect(offscreenCanvas.width).toBe(800);
		});
	});
	describe('get height()', () => {
		it('Returns height.', () => {
			const offscreenCanvas = new OffscreenCanvas(800, 600);
			expect(offscreenCanvas.height).toBe(600);
		});
	});

	describe('getContext()', () => {
		it('Returns null (not implemented yet).', () => {
			const offscreenCanvas = new OffscreenCanvas(800, 600);
			for (const type of ['2d', 'webgl', 'webgl2', 'webgpu', 'bitmaprenderer']) {
				expect(offscreenCanvas.getContext(<'2d'>type)).toBe(null);
				expect(offscreenCanvas.getContext(<'2d'>type, {})).toBe(null);
			}
		});
	});

	describe('convertToBlob()', () => {
		it('Returns an empty Blob (not implemented yet).', async () => {
			const offscreenCanvas = new OffscreenCanvas(800, 600);

			expect(await offscreenCanvas.convertToBlob()).toBeInstanceOf(Blob);
			expect(await offscreenCanvas.convertToBlob({ type: 'image/png' })).toBeInstanceOf(Blob);
			expect(await offscreenCanvas.convertToBlob({ quality: 0.5 })).toBeInstanceOf(Blob);
		});
	});

	describe('transferToImageBitmap()', () => {
		it('Returns an ImageBitmap object.', () => {
			const offscreenCanvas = new OffscreenCanvas(800, 600);
			const imageBitmap = offscreenCanvas.transferToImageBitmap();
			expect(imageBitmap).toBeInstanceOf(ImageBitmap);
			expect(imageBitmap.width).toBe(800);
			expect(imageBitmap.height).toBe(600);
		});
	});
});
