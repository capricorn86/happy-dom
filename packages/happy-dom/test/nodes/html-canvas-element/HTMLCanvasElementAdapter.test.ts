import HTMLCanvasElement from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
import type { ICanvasAdapter } from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Blob from '../../../src/file/Blob.js';

describe('HTMLCanvasElement - Canvas Adapter', () => {
	let window: Window;
	let document: Document;
	let element: HTMLCanvasElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('canvas');
		// Reset adapter before each test
		HTMLCanvasElement.setCanvasAdapter(null);
	});

	afterEach(() => {
		// Clean up adapter after each test
		HTMLCanvasElement.setCanvasAdapter(null);
	});

	describe('setCanvasAdapter()', () => {
		it('Should set the canvas adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			expect(HTMLCanvasElement.getCanvasAdapter()).toBe(mockAdapter);
		});

		it('Should allow setting adapter to null.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			HTMLCanvasElement.setCanvasAdapter(null);
			expect(HTMLCanvasElement.getCanvasAdapter()).toBe(null);
		});
	});

	describe('getCanvasAdapter()', () => {
		it('Should return null when no adapter is set.', () => {
			expect(HTMLCanvasElement.getCanvasAdapter()).toBe(null);
		});

		it('Should return the set adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			expect(HTMLCanvasElement.getCanvasAdapter()).toBe(mockAdapter);
		});
	});

	describe('getContext() with adapter', () => {
		it('Should delegate to adapter.getContext() when adapter is set.', () => {
			const mockContext = { fillRect: vi.fn() };
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(mockContext),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			const ctx = element.getContext('2d');

			expect(mockAdapter.getContext).toHaveBeenCalledWith(element, '2d', undefined);
			expect(ctx).toBe(mockContext);
		});

		it('Should pass contextAttributes to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(null),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};
			const attributes = { alpha: false, desynchronized: true };

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			element.getContext('2d', attributes);

			expect(mockAdapter.getContext).toHaveBeenCalledWith(element, '2d', attributes);
		});

		it('Should return null when adapter returns null.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(null),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			expect(element.getContext('webgl')).toBe(null);
		});

		it('Should return null when no adapter is set.', () => {
			expect(element.getContext('2d')).toBe(null);
		});

		it('Should work with different context types.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockImplementation((_canvas, type) => {
					if (type === '2d') return { type: '2d' };
					if (type === 'webgl') return { type: 'webgl' };
					return null;
				}),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);

			expect(element.getContext('2d')).toEqual({ type: '2d' });
			expect(element.getContext('webgl')).toEqual({ type: 'webgl' });
			expect(element.getContext('bitmaprenderer')).toBe(null);
		});
	});

	describe('toDataURL() with adapter', () => {
		it('Should delegate to adapter.toDataURL() when adapter is set.', () => {
			const dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn().mockReturnValue(dataURL),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			const result = element.toDataURL();

			expect(mockAdapter.toDataURL).toHaveBeenCalledWith(element, undefined, undefined);
			expect(result).toBe(dataURL);
		});

		it('Should pass type and quality to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,/9j/4AAQ'),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			element.toDataURL('image/jpeg', 0.8);

			expect(mockAdapter.toDataURL).toHaveBeenCalledWith(element, 'image/jpeg', 0.8);
		});

		it('Should return empty string when no adapter is set.', () => {
			expect(element.toDataURL()).toBe('');
		});
	});

	describe('toBlob() with adapter', () => {
		it('Should delegate to adapter.toBlob() when adapter is set.', () => {
			const mockBlob = new Blob(['test'], { type: 'image/png' });
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn().mockImplementation((_canvas, callback) => {
					callback(mockBlob);
				})
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);

			let receivedBlob: Blob | null = null;
			element.toBlob((blob) => {
				receivedBlob = blob;
			});

			expect(mockAdapter.toBlob).toHaveBeenCalled();
			expect(receivedBlob).toBe(mockBlob);
		});

		it('Should pass type and quality to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn().mockImplementation((_canvas, callback) => {
					callback(null);
				})
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			element.toBlob(() => {}, 'image/jpeg', 0.9);

			expect(mockAdapter.toBlob).toHaveBeenCalledWith(
				element,
				expect.any(Function),
				'image/jpeg',
				0.9
			);
		});

		it('Should return empty Blob when no adapter is set.', () => {
			let receivedBlob: Blob | null = null;
			element.toBlob((blob) => {
				receivedBlob = blob;
			});

			expect(receivedBlob).toBeInstanceOf(Blob);
		});
	});

	describe('Adapter with canvas dimensions', () => {
		it('Should provide correct canvas dimensions to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockImplementation((canvas) => {
					return { width: canvas.width, height: canvas.height };
				}),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			element.width = 800;
			element.height = 600;

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			const ctx = element.getContext('2d');

			expect(ctx).toEqual({ width: 800, height: 600 });
		});

		it('Should use default dimensions when not set.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockImplementation((canvas) => {
					return { width: canvas.width, height: canvas.height };
				}),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);
			const ctx = element.getContext('2d');

			expect(ctx).toEqual({ width: 300, height: 150 });
		});
	});

	describe('Adapter isolation between elements', () => {
		it('Should use same adapter for all canvas elements.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue({ id: 'shared' }),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			HTMLCanvasElement.setCanvasAdapter(mockAdapter);

			const canvas1 = document.createElement('canvas');
			const canvas2 = document.createElement('canvas');

			canvas1.getContext('2d');
			canvas2.getContext('2d');

			expect(mockAdapter.getContext).toHaveBeenCalledTimes(2);
			expect(mockAdapter.getContext).toHaveBeenNthCalledWith(1, canvas1, '2d', undefined);
			expect(mockAdapter.getContext).toHaveBeenNthCalledWith(2, canvas2, '2d', undefined);
		});
	});
});

// Check if node-canvas is available at module level
let nodeCanvasAvailable = false;
try {
	require('canvas');
	nodeCanvasAvailable = true;
} catch {
	nodeCanvasAvailable = false;
}

describe.skipIf(!nodeCanvasAvailable)('HTMLCanvasElement - NodeCanvasAdapter Integration', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		HTMLCanvasElement.setCanvasAdapter(null);
	});

	afterEach(() => {
		HTMLCanvasElement.setCanvasAdapter(null);
	});

	it('Should render real pixels with NodeCanvasAdapter.', async () => {
		const { NodeCanvasAdapter } = await import(
			'../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);

		const adapter = new NodeCanvasAdapter();
		HTMLCanvasElement.setCanvasAdapter(adapter);

		const canvas = document.createElement('canvas');
		canvas.width = 100;
		canvas.height = 100;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		expect(ctx).not.toBe(null);

		// Draw red rectangle
		ctx.fillStyle = '#ff0000';
		ctx.fillRect(0, 0, 50, 50);

		// Verify pixels were actually rendered
		const imageData = ctx.getImageData(10, 10, 1, 1);
		expect(imageData.data[0]).toBe(255); // R
		expect(imageData.data[1]).toBe(0); // G
		expect(imageData.data[2]).toBe(0); // B
		expect(imageData.data[3]).toBe(255); // A
	});

	it('Should generate valid PNG data URL.', async () => {
		const { NodeCanvasAdapter } = await import(
			'../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);

		const adapter = new NodeCanvasAdapter();
		HTMLCanvasElement.setCanvasAdapter(adapter);

		const canvas = document.createElement('canvas');
		canvas.width = 10;
		canvas.height = 10;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.fillStyle = '#00ff00';
		ctx.fillRect(0, 0, 10, 10);

		const dataURL = canvas.toDataURL();
		expect(dataURL).toMatch(/^data:image\/png;base64,/);
		expect(dataURL.length).toBeGreaterThan(50);
	});

	it('Should generate valid JPEG data URL.', async () => {
		const { NodeCanvasAdapter } = await import(
			'../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);

		const adapter = new NodeCanvasAdapter();
		HTMLCanvasElement.setCanvasAdapter(adapter);

		const canvas = document.createElement('canvas');
		canvas.width = 10;
		canvas.height = 10;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.fillStyle = '#0000ff';
		ctx.fillRect(0, 0, 10, 10);

		const dataURL = canvas.toDataURL('image/jpeg', 0.8);
		expect(dataURL).toMatch(/^data:image\/jpeg;base64,/);
	});

	it('Should create Blob from canvas content.', async () => {
		const { NodeCanvasAdapter } = await import(
			'../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);

		const adapter = new NodeCanvasAdapter();
		HTMLCanvasElement.setCanvasAdapter(adapter);

		const canvas = document.createElement('canvas');
		canvas.width = 10;
		canvas.height = 10;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx.fillStyle = '#ff00ff';
		ctx.fillRect(0, 0, 10, 10);

		await new Promise<void>((resolve) => {
			canvas.toBlob((blob) => {
				expect(blob).not.toBe(null);
				expect(blob!.type).toBe('image/png');
				expect(blob!.size).toBeGreaterThan(0);
				resolve();
			});
		});
	});

	it('Should handle canvas resize correctly.', async () => {
		const { NodeCanvasAdapter } = await import(
			'../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);

		const adapter = new NodeCanvasAdapter();
		HTMLCanvasElement.setCanvasAdapter(adapter);

		const canvas = document.createElement('canvas');
		canvas.width = 50;
		canvas.height = 50;

		const ctx1 = canvas.getContext('2d') as CanvasRenderingContext2D;
		ctx1.fillStyle = '#ff0000';
		ctx1.fillRect(0, 0, 50, 50);

		// Resize canvas
		canvas.width = 100;
		canvas.height = 100;

		// Get context again - should be new context for new size
		const ctx2 = canvas.getContext('2d') as CanvasRenderingContext2D;

		// Old content should be cleared after resize (standard canvas behavior)
		const imageData = ctx2.getImageData(25, 25, 1, 1);
		expect(imageData.data[0]).toBe(0); // Transparent/black after resize
	});

	it('Should return null for WebGL context (not supported by node-canvas).', async () => {
		const { NodeCanvasAdapter } = await import(
			'../../../src/nodes/html-canvas-element/adapters/NodeCanvasAdapter.js'
		);

		const adapter = new NodeCanvasAdapter();
		HTMLCanvasElement.setCanvasAdapter(adapter);

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('webgl');

		expect(ctx).toBe(null);
	});
});
