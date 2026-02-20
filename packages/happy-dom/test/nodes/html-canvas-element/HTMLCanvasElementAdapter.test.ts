import HTMLCanvasElement from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
import ICanvasAdapter from '../../../src/nodes/html-canvas-element/ICanvasAdapter.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import Blob from '../../../src/file/Blob.js';

describe('HTMLCanvasElement - Canvas Adapter', () => {
	let window: Window;
	let document: Document;
	let element: HTMLCanvasElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('canvas');
	});

	describe('getContext() with adapter', () => {
		it('Should delegate to adapter.getContext() when adapter is set.', () => {
			const mockContext = { fillRect: vi.fn() };
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(mockContext),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

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

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

			element.getContext('2d', attributes);

			expect(mockAdapter.getContext).toHaveBeenCalledWith(element, '2d', attributes);
		});

		it('Should return null when adapter returns null.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(null),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

			expect(element.getContext('webgl')).toBe(null);
		});

		it('Should return null when no adapter is set.', () => {
			expect(element.getContext('2d')).toBe(null);
		});

		it('Should work with different context types.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockImplementation((_canvas, type) => {
					if (type === '2d') {
						return { type: '2d' };
					}
					if (type === 'webgl') {
						return { type: 'webgl' };
					}
					return null;
				}),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

			expect(element.getContext('2d')).toEqual({ type: '2d' });
			expect(element.getContext('webgl')).toEqual({ type: 'webgl' });
			expect(element.getContext('bitmaprenderer')).toBe(null);
		});
	});

	describe('toDataURL() with adapter', () => {
		it('Should delegate to adapter.toDataURL() when adapter is set.', () => {
			const dataURL =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn().mockReturnValue(dataURL),
				toBlob: vi.fn()
			};

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

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

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

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

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

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

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

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

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');
			element.width = 800;
			element.height = 600;

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

			window = new Window({ settings: { canvasAdapter: mockAdapter } });
			document = window.document;
			element = document.createElement('canvas');

			const ctx = element.getContext('2d');

			expect(ctx).toEqual({ width: 300, height: 150 });
		});
	});

	describe('Adapter isolation between windows', () => {
		it('Should use different adapters for different windows.', () => {
			const mockAdapter1: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue({ id: 'window1' }),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};
			const mockAdapter2: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue({ id: 'window2' }),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			const window1 = new Window({ settings: { canvasAdapter: mockAdapter1 } });
			const window2 = new Window({ settings: { canvasAdapter: mockAdapter2 } });

			const canvas1 = window1.document.createElement('canvas');
			const canvas2 = window2.document.createElement('canvas');

			const ctx1 = canvas1.getContext('2d');
			const ctx2 = canvas2.getContext('2d');

			expect(ctx1).toEqual({ id: 'window1' });
			expect(ctx2).toEqual({ id: 'window2' });
		});

		it('Should return null when window has no adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue({ id: 'with-adapter' }),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			const windowWithAdapter = new Window({ settings: { canvasAdapter: mockAdapter } });
			const windowWithout = new Window();

			const canvas1 = windowWithAdapter.document.createElement('canvas');
			const canvas2 = windowWithout.document.createElement('canvas');

			expect(canvas1.getContext('2d')).toEqual({ id: 'with-adapter' });
			expect(canvas2.getContext('2d')).toBe(null);
		});
	});
});
