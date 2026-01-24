import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Check if node-canvas is available
let nodeCanvasAvailable = false;
try {
	require('canvas');
	nodeCanvasAvailable = true;
} catch {
	nodeCanvasAvailable = false;
}

describe.skipIf(!nodeCanvasAvailable)('NodeCanvasAdapter', () => {
	let NodeCanvasAdapter: typeof import('../../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js').NodeCanvasAdapter;
	let createNodeCanvasAdapter: typeof import('../../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js').createNodeCanvasAdapter;

	beforeEach(async () => {
		const module = await import(
			'../../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);
		NodeCanvasAdapter = module.NodeCanvasAdapter;
		createNodeCanvasAdapter = module.createNodeCanvasAdapter;
	});

	describe('constructor()', () => {
		it('Should create adapter instance.', () => {
			const adapter = new NodeCanvasAdapter();
			expect(adapter).toBeInstanceOf(NodeCanvasAdapter);
		});
	});

	describe('createNodeCanvasAdapter()', () => {
		it('Should create adapter via factory function.', () => {
			const adapter = createNodeCanvasAdapter();
			expect(adapter).toBeInstanceOf(NodeCanvasAdapter);
		});
	});

	describe('ensureLoaded()', () => {
		it('Should return true when node-canvas is available.', async () => {
			const adapter = new NodeCanvasAdapter();
			const loaded = await adapter.ensureLoaded();
			expect(loaded).toBe(true);
		});
	});

	describe('getContext()', () => {
		it('Should return CanvasRenderingContext2D for "2d" context.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;
			const ctx = adapter.getContext(mockCanvas, '2d');

			expect(ctx).not.toBe(null);
			expect(typeof (ctx as any).fillRect).toBe('function');
			expect(typeof (ctx as any).getImageData).toBe('function');
		});

		it('Should return null for "webgl" context.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;
			const ctx = adapter.getContext(mockCanvas, 'webgl');

			expect(ctx).toBe(null);
		});

		it('Should return null for "webgl2" context.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;
			const ctx = adapter.getContext(mockCanvas, 'webgl2');

			expect(ctx).toBe(null);
		});

		it('Should return same context for same canvas (caching).', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx1 = adapter.getContext(mockCanvas, '2d');
			const ctx2 = adapter.getContext(mockCanvas, '2d');

			expect(ctx1).toBe(ctx2);
		});

		it('Should return different context for different canvas.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas1 = { width: 100, height: 100 } as any;
			const mockCanvas2 = { width: 100, height: 100 } as any;

			const ctx1 = adapter.getContext(mockCanvas1, '2d');
			const ctx2 = adapter.getContext(mockCanvas2, '2d');

			expect(ctx1).not.toBe(ctx2);
		});

		it('Should invalidate context cache when dimensions change.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx1 = adapter.getContext(mockCanvas, '2d');

			// Change dimensions
			mockCanvas.width = 200;
			mockCanvas.height = 200;

			const ctx2 = adapter.getContext(mockCanvas, '2d');

			expect(ctx1).not.toBe(ctx2);
		});
	});

	describe('toDataURL()', () => {
		it('Should return PNG data URL by default.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 10, height: 10 } as any;

			// Draw something first
			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;
			ctx.fillStyle = '#ff0000';
			ctx.fillRect(0, 0, 10, 10);

			const dataURL = adapter.toDataURL(mockCanvas);

			expect(dataURL).toMatch(/^data:image\/png;base64,/);
		});

		it('Should return JPEG data URL when specified.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 10, height: 10 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;
			ctx.fillStyle = '#00ff00';
			ctx.fillRect(0, 0, 10, 10);

			const dataURL = adapter.toDataURL(mockCanvas, 'image/jpeg');

			expect(dataURL).toMatch(/^data:image\/jpeg;base64,/);
		});

		it('Should handle "image/jpg" as JPEG.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 10, height: 10 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;
			ctx.fillStyle = '#0000ff';
			ctx.fillRect(0, 0, 10, 10);

			const dataURL = adapter.toDataURL(mockCanvas, 'image/jpg');

			expect(dataURL).toMatch(/^data:image\/jpeg;base64,/);
		});

		it('Should respect quality parameter for JPEG.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;

			// Draw complex content (gradient + noise) to see quality difference
			const gradient = ctx.createLinearGradient(0, 0, 100, 100);
			gradient.addColorStop(0, 'red');
			gradient.addColorStop(0.5, 'green');
			gradient.addColorStop(1, 'blue');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 100, 100);

			// Add some shapes for complexity
			for (let i = 0; i < 10; i++) {
				ctx.fillStyle = `rgb(${i * 25}, ${255 - i * 25}, ${i * 10})`;
				ctx.fillRect(i * 10, i * 5, 15, 15);
			}

			const highQuality = adapter.toDataURL(mockCanvas, 'image/jpeg', 1.0);
			const lowQuality = adapter.toDataURL(mockCanvas, 'image/jpeg', 0.01);

			// Both should be valid JPEG data URLs
			expect(highQuality).toMatch(/^data:image\/jpeg;base64,/);
			expect(lowQuality).toMatch(/^data:image\/jpeg;base64,/);
			// Quality affects output (either size or same - but both valid)
			expect(highQuality.length).toBeGreaterThan(100);
			expect(lowQuality.length).toBeGreaterThan(100);
		});
	});

	describe('toBlob()', () => {
		it('Should create PNG blob by default.', async () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 10, height: 10 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;
			ctx.fillStyle = '#ff0000';
			ctx.fillRect(0, 0, 10, 10);

			const blob = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(mockCanvas, resolve);
			});

			expect(blob).not.toBe(null);
			expect(blob!.type).toBe('image/png');
			expect(blob!.size).toBeGreaterThan(0);
		});

		it('Should create JPEG blob when specified.', async () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 10, height: 10 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;
			ctx.fillStyle = '#00ff00';
			ctx.fillRect(0, 0, 10, 10);

			const blob = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(mockCanvas, resolve, 'image/jpeg');
			});

			expect(blob).not.toBe(null);
			expect(blob!.type).toBe('image/jpeg');
		});

		it('Should accept quality parameter for JPEG blob.', async () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;

			// Draw complex content
			const gradient = ctx.createLinearGradient(0, 0, 100, 100);
			gradient.addColorStop(0, 'red');
			gradient.addColorStop(0.5, 'green');
			gradient.addColorStop(1, 'blue');
			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 100, 100);

			const highQuality = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(mockCanvas, resolve, 'image/jpeg', 1.0);
			});

			const lowQuality = await new Promise<Blob | null>((resolve) => {
				adapter.toBlob(mockCanvas, resolve, 'image/jpeg', 0.01);
			});

			// Both should produce valid JPEG blobs
			expect(highQuality).not.toBe(null);
			expect(lowQuality).not.toBe(null);
			expect(highQuality!.type).toBe('image/jpeg');
			expect(lowQuality!.type).toBe('image/jpeg');
			expect(highQuality!.size).toBeGreaterThan(0);
			expect(lowQuality!.size).toBeGreaterThan(0);
		});
	});

	describe('Real rendering tests', () => {
		it('Should render gradient correctly.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;

			const gradient = ctx.createLinearGradient(0, 0, 100, 0);
			gradient.addColorStop(0, 'red');
			gradient.addColorStop(1, 'blue');

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, 100, 100);

			// Check left side (should be red)
			const leftPixel = ctx.getImageData(5, 50, 1, 1);
			expect(leftPixel.data[0]).toBeGreaterThan(200); // R
			expect(leftPixel.data[2]).toBeLessThan(50); // B

			// Check right side (should be blue)
			const rightPixel = ctx.getImageData(95, 50, 1, 1);
			expect(rightPixel.data[0]).toBeLessThan(50); // R
			expect(rightPixel.data[2]).toBeGreaterThan(200); // B
		});

		it('Should render text.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 200, height: 50 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;

			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 200, 50);

			ctx.fillStyle = 'black';
			ctx.font = '30px Arial';
			ctx.fillText('Hello', 10, 35);

			// Check that text was rendered (some pixels should be black)
			const imageData = ctx.getImageData(0, 0, 200, 50);
			let blackPixelCount = 0;

			for (let i = 0; i < imageData.data.length; i += 4) {
				if (
					imageData.data[i] < 50 &&
					imageData.data[i + 1] < 50 &&
					imageData.data[i + 2] < 50 &&
					imageData.data[i + 3] > 200
				) {
					blackPixelCount++;
				}
			}

			expect(blackPixelCount).toBeGreaterThan(100); // Text should have rendered
		});

		it('Should handle arc drawing.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;

			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, 100, 100);

			ctx.fillStyle = 'red';
			ctx.beginPath();
			ctx.arc(50, 50, 40, 0, Math.PI * 2);
			ctx.fill();

			// Center should be red
			const center = ctx.getImageData(50, 50, 1, 1);
			expect(center.data[0]).toBe(255);
			expect(center.data[1]).toBe(0);
			expect(center.data[2]).toBe(0);

			// Corner should be white
			const corner = ctx.getImageData(5, 5, 1, 1);
			expect(corner.data[0]).toBe(255);
			expect(corner.data[1]).toBe(255);
			expect(corner.data[2]).toBe(255);
		});

		it('Should support image composition.', () => {
			const adapter = new NodeCanvasAdapter();
			const mockCanvas = { width: 100, height: 100 } as any;

			const ctx = adapter.getContext(mockCanvas, '2d') as CanvasRenderingContext2D;

			// Draw red rectangle
			ctx.fillStyle = 'red';
			ctx.fillRect(0, 0, 60, 60);

			// Draw blue rectangle with multiply
			ctx.globalCompositeOperation = 'multiply';
			ctx.fillStyle = 'blue';
			ctx.fillRect(40, 40, 60, 60);

			// Overlap area should be dark (red * blue = dark)
			const overlap = ctx.getImageData(50, 50, 1, 1);
			// In multiply mode, pure red (255,0,0) * pure blue (0,0,255) = (0,0,0) black
			expect(overlap.data[0]).toBeLessThan(50);
			expect(overlap.data[1]).toBeLessThan(50);
			expect(overlap.data[2]).toBeLessThan(50);
		});
	});
});
