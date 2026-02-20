import { describe, it, expect, beforeEach } from 'vitest';
import CanvasAdapter from '../src/CanvasAdapter.js';

describe('CanvasAdapter', () => {
	let adapter: CanvasAdapter;

	beforeEach(() => {
		adapter = new CanvasAdapter();
	});

	describe('getContext()', () => {
		it('Should return 2d context for "2d" context type.', () => {
			const canvas = { width: 100, height: 100 };
			const context = adapter.getContext(canvas, '2d');

			expect(context).toBeDefined();
			expect(typeof context).toBe('object');
		});

		it('Should return null for unsupported context types.', () => {
			const canvas = { width: 100, height: 100 };

			expect(adapter.getContext(canvas, 'webgl')).toBe(null);
			expect(adapter.getContext(canvas, 'webgl2')).toBe(null);
			expect(adapter.getContext(canvas, 'webgpu')).toBe(null);
			expect(adapter.getContext(canvas, 'bitmaprenderer')).toBe(null);
		});

		it('Should return the same context instance for the same canvas.', () => {
			const canvas = { width: 100, height: 100 };
			const context1 = adapter.getContext(canvas, '2d');
			const context2 = adapter.getContext(canvas, '2d');

			expect(context1).toBe(context2);
		});

		it('Should return different context instances for different canvas objects.', () => {
			const canvas1 = { width: 100, height: 100 };
			const canvas2 = { width: 200, height: 200 };
			const context1 = adapter.getContext(canvas1, '2d');
			const context2 = adapter.getContext(canvas2, '2d');

			expect(context1).not.toBe(context2);
		});

		it('Should pass context attributes to getContext.', () => {
			const canvas = { width: 100, height: 100 };
			const attributes = { alpha: false };
			const context = adapter.getContext(canvas, '2d', attributes);

			expect(context).toBeDefined();
		});
	});

	describe('toDataURL()', () => {
		it('Should return a valid data URL for PNG format.', () => {
			const canvas = { width: 100, height: 100 };
			adapter.getContext(canvas, '2d');

			const dataURL = adapter.toDataURL(canvas);

			expect(dataURL).toMatch(/^data:image\/png;base64,/);
		});

		it('Should return a valid data URL for JPEG format.', () => {
			const canvas = { width: 100, height: 100 };
			adapter.getContext(canvas, '2d');

			const dataURL = adapter.toDataURL(canvas, 'image/jpeg', 0.8);

			expect(dataURL).toMatch(/^data:image\/jpeg;base64,/);
		});

		it('Should return different data URLs for different canvas sizes.', () => {
			const canvas1 = { width: 100, height: 100 };
			const canvas2 = { width: 200, height: 200 };
			adapter.getContext(canvas1, '2d');
			adapter.getContext(canvas2, '2d');

			const dataURL1 = adapter.toDataURL(canvas1);
			const dataURL2 = adapter.toDataURL(canvas2);

			expect(dataURL1).not.toBe(dataURL2);
		});
	});

	describe('toBlob()', () => {
		it('Should create a PNG blob and call the callback.', async () => {
			const canvas = { width: 100, height: 100 };
			adapter.getContext(canvas, '2d');

			const blob = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(canvas, resolve);
			});

			expect(blob).toBeDefined();
			expect(blob).toBeInstanceOf(Blob);
			expect(blob?.type).toBe('image/png');
		});

		it('Should create a JPEG blob with quality setting.', async () => {
			const canvas = { width: 100, height: 100 };
			adapter.getContext(canvas, '2d');

			const blob = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(canvas, resolve, 'image/jpeg', 0.8);
			});

			expect(blob).toBeDefined();
			expect(blob).toBeInstanceOf(Blob);
			expect(blob?.type).toBe('image/jpeg');
		});

		it('Should handle different canvas sizes.', async () => {
			const canvas = { width: 300, height: 150 };
			adapter.getContext(canvas, '2d');

			const blob = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(canvas, resolve);
			});

			expect(blob).toBeDefined();
			expect(blob?.type).toBe('image/png');
		});
	});

	describe('Integration with drawing operations', () => {
		it('Should support basic drawing operations.', () => {
			const canvas = { width: 100, height: 100 };
			const ctx = <CanvasRenderingContext2D>adapter.getContext(canvas, '2d');

			// Perform drawing operations
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, 50, 50);

			ctx.strokeStyle = 'blue';
			ctx.strokeRect(50, 50, 50, 50);

			// Get data URL after drawing
			const dataURL = adapter.toDataURL(canvas);
			expect(dataURL).toMatch(/^data:image\/png;base64,/);
		});

		it('Should preserve drawing between toDataURL calls.', () => {
			const canvas = { width: 100, height: 100 };
			const ctx = <CanvasRenderingContext2D>adapter.getContext(canvas, '2d');

			ctx.fillStyle = 'green';
			ctx.fillRect(0, 0, 100, 100);

			const dataURL1 = adapter.toDataURL(canvas);
			const dataURL2 = adapter.toDataURL(canvas);

			// Both should be the same since canvas wasn't modified
			expect(dataURL1).toBe(dataURL2);
		});
	});
});
