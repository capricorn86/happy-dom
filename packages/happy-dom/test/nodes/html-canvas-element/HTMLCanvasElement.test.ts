import HTMLCanvasElement from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
import Window from '../../../src/window/Window.js';
import Browser from '../../../src/browser/Browser.js';
import type Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import CanvasCaptureMediaStreamTrack from '../../../src/nodes/html-canvas-element/CanvasCaptureMediaStreamTrack.js';
import Blob from '../../../src/file/Blob.js';
import OffscreenCanvas from '../../../src/canvas/OffscreenCanvas.js';
import MediaStream from '../../../src/nodes/html-media-element/MediaStream.js';
import Event from '../../../src/event/Event.js';
import type ICanvasAdapter from '../../../src/canvas/ICanvasAdapter.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';

const DEVICE_ID = 'S3F/aBCdEfGHIjKlMnOpQRStUvWxYz1234567890+1AbC2DEf2GHi3jK34le+ab12C3+1aBCdEf==';

describe('HTMLCanvasElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLCanvasElement;

	beforeEach(() => {
		window = new Window({
			settings: { enableJavaScriptEvaluation: true, suppressCodeGenerationFromStringsWarning: true }
		});
		document = window.document;
		element = document.createElement('canvas');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLCanvasElement', () => {
			expect(element instanceof HTMLCanvasElement).toBe(true);
		});
	});

	for (const event of [
		'contextlost',
		'contextrestored',
		'webglcontextcreationerror',
		'webglcontextlost',
		'webglcontextrestored'
	]) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect((<any>element)[`on${event}`]).toBeTypeOf('function');
				(<any>element)[`on${event}`](new Event(event));
				expect((<any>window)['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				(<any>element)[`on${event}`] = () => {
					(<any>window)['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect((<any>window)['test']).toBe(1);
			});
		});
	}

	describe('get width()', () => {
		it('Returns the "width" attribute.', () => {
			const element = document.createElement('canvas');
			element.setAttribute('width', '100');
			expect(element.width).toBe(100);
		});

		it('Returns 300 if the "width" attribute is not set.', () => {
			const element = document.createElement('canvas');
			expect(element.width).toBe(300);
		});
	});

	describe('set width()', () => {
		it('Sets the attribute "width".', () => {
			const element = document.createElement('canvas');
			element.width = 100;
			expect(element.getAttribute('width')).toBe('100');
		});
	});

	describe('get height()', () => {
		it('Returns the "height" attribute.', () => {
			const element = document.createElement('canvas');
			element.setAttribute('height', '100');
			expect(element.height).toBe(100);
		});

		it('Returns 150 if the "height" attribute is not set.', () => {
			const element = document.createElement('canvas');
			expect(element.height).toBe(150);
		});
	});

	describe('set height()', () => {
		it('Sets the attribute "height".', () => {
			const element = document.createElement('canvas');
			element.height = 100;
			expect(element.getAttribute('height')).toBe('100');
		});
	});

	describe('captureStream()', () => {
		it('Returns a MediaStream.', () => {
			element.width = 800;
			element.height = 600;

			const stream = element.captureStream();

			expect(stream instanceof MediaStream).toBe(true);
			expect(stream.getAudioTracks()).toEqual([]);
			expect(stream.getVideoTracks().length).toBe(1);
			expect(stream.getVideoTracks()[0]).toBeInstanceOf(CanvasCaptureMediaStreamTrack);
			expect(stream.getVideoTracks()[0].getCapabilities()).toEqual({
				aspectRatio: {
					max: 800,
					min: 0.006666666666666667
				},
				deviceId: DEVICE_ID,
				facingMode: [],
				frameRate: {
					max: 60,
					min: 0
				},
				height: {
					max: 600,
					min: 1
				},
				resizeMode: ['none', 'crop-and-scale'],
				width: {
					max: 800,
					min: 1
				}
			});

			expect(element.captureStream(30).getVideoTracks()[0].getSettings().frameRate).toBe(30);
			expect(element.captureStream(30).getVideoTracks()[0].getCapabilities().frameRate.max).toBe(
				30
			);
		});
	});

	describe('getContext()', () => {
		it('Returns null when no adapter has been set.', () => {
			for (const type of ['2d', 'webgl', 'webgl2', 'webgpu', 'bitmaprenderer']) {
				expect(element.getContext(<'2d'>type)).toBe(null);
				expect(element.getContext(<'2d'>type, {})).toBe(null);
			}
		});

		it('Should delegate to adapter.getContext() when adapter is set.', () => {
			const mockContext = { fillRect: vi.fn() };
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(mockContext),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			const ctx = element.getContext('2d');

			expect(mockAdapter.getContext).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: element
				},
				'2d',
				undefined
			);
			expect(ctx).toBe(mockContext);
		});

		it('Should pass contextAttributes to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(null),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};
			const attributes = { alpha: false, desynchronized: true };

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			element.getContext('2d', attributes);

			expect(mockAdapter.getContext).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: element
				},
				'2d',
				attributes
			);
		});

		it('Should return null when adapter returns null.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn().mockReturnValue(null),
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			const window = new Window({ settings: { canvasAdapter: mockAdapter } });
			const document = window.document;
			const element = document.createElement('canvas');

			expect(element.getContext('webgl')).toBe(null);
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

			const window = new Window({ settings: { canvasAdapter: mockAdapter } });
			const document = window.document;
			const element = document.createElement('canvas');

			expect(element.getContext('2d')).toEqual({ type: '2d' });
			expect(element.getContext('webgl')).toEqual({ type: 'webgl' });
			expect(element.getContext('bitmaprenderer')).toBe(null);
		});

		it('Should provide correct canvas dimensions to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: ({ canvas }): any => {
					return { width: canvas.width, height: canvas.height };
				},
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			const window = new Window({ settings: { canvasAdapter: mockAdapter } });
			const document = window.document;
			const element = document.createElement('canvas');
			element.width = 800;
			element.height = 600;

			const ctx = element.getContext('2d');

			expect(ctx).toEqual({ width: 800, height: 600 });
		});

		it('Should use default dimensions when not set.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: ({ canvas }): any => {
					return { width: canvas.width, height: canvas.height };
				},
				toDataURL: vi.fn(),
				toBlob: vi.fn()
			};

			const window = new Window({ settings: { canvasAdapter: mockAdapter } });
			const document = window.document;
			const element = document.createElement('canvas');

			const ctx = element.getContext('2d');

			expect(ctx).toEqual({ width: 300, height: 150 });
		});

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

	describe('toDataURL()', () => {
		it('Returns a string with an empty base64 string when no adapter is set.', () => {
			const base64 = Buffer.from([]).toString('base64');
			expect(element.toDataURL()).toBe(`data:image/png;base64,${base64}`);
			expect(element.toDataURL('image/jpeg')).toBe(`data:image/jpeg;base64,${base64}`);
			expect(element.toDataURL('image/jpeg', 2)).toBe(`data:image/jpeg;base64,${base64}`);
		});

		it('Should delegate to adapter.toDataURL() when adapter is set.', () => {
			const dataURL =
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn().mockReturnValue(dataURL),
				toBlob: vi.fn()
			};

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			const result = element.toDataURL();

			expect(mockAdapter.toDataURL).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: element
				},
				undefined,
				undefined
			);
			expect(result).toBe(dataURL);
		});

		it('Should pass type and quality to adapter.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,/9j/4AAQ'),
				toBlob: vi.fn()
			};

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			element.toDataURL('image/jpeg', 0.8);

			expect(mockAdapter.toDataURL).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: element
				},
				'image/jpeg',
				0.8
			);
		});

		it('Should return data URL from OffscreenCanvas when adapter is set and canvas is transferred to OffscreenCanvas.', () => {
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn().mockReturnValue('data:image/png;base64,dGVzdA=='),
				toBlob: vi.fn()
			};

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			element.width = 800;
			element.height = 600;

			const offscreenCanvas = element.transferControlToOffscreen();

			expect(element.toDataURL()).toBe('data:image/png;base64,dGVzdA==');
			expect(mockAdapter.toDataURL).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: offscreenCanvas
				},
				undefined,
				undefined
			);
		});
	});

	describe('toBlob()', () => {
		it('Returns an empty Blob when no adapter is set.', async () => {
			const blob = await new Promise<Blob | null>((resolve) => {
				element.toBlob((blob) => resolve(blob));
			});
			expect(blob).toBeInstanceOf(Blob);
			expect(blob!.size).toBe(0);

			const blob2 = await new Promise<Blob | null>((resolve) => {
				element.toBlob((blob) => resolve(blob), 'image/jpeg');
			});
			expect(blob2).toBeInstanceOf(Blob);
			expect(blob2!.type).toBe('image/jpeg');

			const blob3 = await new Promise<Blob | null>((resolve) => {
				element.toBlob((blob) => resolve(blob), 'image/jpeg', 0.8);
			});
			expect(blob3).toBeInstanceOf(Blob);
			expect(blob3!.type).toBe('image/jpeg');
		});

		it('Should delegate to adapter.toBlob() when adapter is set.', () => {
			const mockBlob = new Blob(['test'], { type: 'image/png' });
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn().mockImplementation((_canvas, callback) => {
					callback(mockBlob);
				})
			};

			const window = new Window({ settings: { canvasAdapter: mockAdapter } });
			const document = window.document;
			const element = document.createElement('canvas');

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

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			element.toBlob(() => {}, 'image/jpeg', 0.9);

			expect(mockAdapter.toBlob).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: element
				},
				expect.any(Function),
				'image/jpeg',
				0.9
			);
		});

		it('Should return Blob from OffscreenCanvas when adapter is set and canvas is transferred to OffscreenCanvas.', async () => {
			const mockBlob = new Blob(['test'], { type: 'image/png' });
			const mockAdapter: ICanvasAdapter = {
				getContext: vi.fn(),
				toDataURL: vi.fn(),
				toBlob: vi.fn().mockImplementation((_canvas, callback) => {
					callback(mockBlob);
				})
			};

			const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
			const page = browser.newPage();
			const browserFrame = page.mainFrame;
			const window = browserFrame.window;
			const document = window.document;
			const element = document.createElement('canvas');

			element.width = 800;
			element.height = 600;

			const offscreenCanvas = element.transferControlToOffscreen();
			const resultBlob: Blob | null = await new Promise((resolve) =>
				element.toBlob((blob) => resolve(blob))
			);

			expect(resultBlob).toBe(mockBlob);
			expect(mockAdapter.toBlob).toHaveBeenCalledWith(
				{
					browserFrame,
					window,
					canvas: offscreenCanvas
				},
				expect.any(Function),
				undefined,
				undefined
			);
		});
	});

	describe('transferControlToOffscreen()', () => {
		it('Returns an OffscreenCanvas.', () => {
			element.width = 800;
			element.height = 600;
			const offscreenCanvas = element.transferControlToOffscreen();
			expect(offscreenCanvas).toBeInstanceOf(OffscreenCanvas);
			expect(offscreenCanvas.width).toBe(800);
			expect(offscreenCanvas.height).toBe(600);
		});

		it('Throws an error if the canvas is already transferred.', () => {
			element.transferControlToOffscreen();
			expect(() => element.transferControlToOffscreen()).toThrow(
				new window.DOMException(
					`Failed to execute 'transferControlToOffscreen' on 'HTMLCanvasElement': Cannot transfer control from a canvas for more than one time.`,
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});

		it('Throws an error if the canvas is already in context mode.', () => {
			element.getContext('2d');
			expect(() => element.transferControlToOffscreen()).toThrow(
				new window.DOMException(
					`Failed to execute 'transferControlToOffscreen' on 'HTMLCanvasElement': Cannot transfer control from a canvas that has a rendering context.`,
					DOMExceptionNameEnum.invalidStateError
				)
			);
		});
	});
});
