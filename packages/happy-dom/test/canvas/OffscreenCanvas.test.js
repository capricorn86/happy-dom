import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImageBitmap from '../../src/canvas/ImageBitmap.js';
import Blob from '../../src/file/Blob.js';
import Window from '../../src/window/Window.js';
import Browser from '../../src/browser/Browser.js';
import DOMExceptionNameEnum from '../../src/exception/DOMExceptionNameEnum.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
describe('OffscreenCanvas', () => {
    let window;
    beforeEach(() => {
        window = new Window({
            settings: { enableJavaScriptEvaluation: true, suppressCodeGenerationFromStringsWarning: true }
        });
    });
    describe('get width()', () => {
        it('Returns width.', () => {
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            expect(offscreenCanvas.width).toBe(800);
        });
    });
    describe('get height()', () => {
        it('Returns height.', () => {
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            expect(offscreenCanvas.height).toBe(600);
        });
    });
    describe('getContext()', () => {
        it('Returns null when no adapter has been set.', () => {
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            for (const type of ['2d', 'webgl', 'webgl2', 'webgpu', 'bitmaprenderer']) {
                expect(offscreenCanvas.getContext(type)).toBe(null);
                expect(offscreenCanvas.getContext(type, {})).toBe(null);
            }
        });
        it('Should delegate to adapter.getContext() when adapter is set.', () => {
            const mockContext = { fillRect: vi.fn() };
            const mockAdapter = {
                getContext: vi.fn().mockReturnValue(mockContext),
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
            const page = browser.newPage();
            const browserFrame = page.mainFrame;
            const window = browserFrame.window;
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            const ctx = offscreenCanvas.getContext('2d');
            expect(mockAdapter.getContext).toHaveBeenCalledWith({
                browserFrame,
                window,
                canvas: offscreenCanvas
            }, '2d', undefined);
            expect(ctx).toBe(mockContext);
        });
        it('Should pass contextAttributes to adapter.', () => {
            const mockAdapter = {
                getContext: vi.fn().mockReturnValue(null),
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const attributes = { alpha: false, desynchronized: true };
            const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
            const page = browser.newPage();
            const browserFrame = page.mainFrame;
            const window = browserFrame.window;
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            offscreenCanvas.getContext('2d', attributes);
            expect(mockAdapter.getContext).toHaveBeenCalledWith({
                browserFrame,
                window,
                canvas: offscreenCanvas
            }, '2d', attributes);
        });
        it('Should return null when adapter returns null.', () => {
            const mockAdapter = {
                getContext: vi.fn().mockReturnValue(null),
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const window = new Window({ settings: { canvasAdapter: mockAdapter } });
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            expect(offscreenCanvas.getContext('webgl')).toBe(null);
        });
        it('Should work with different context types.', () => {
            const mockAdapter = {
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
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            expect(offscreenCanvas.getContext('2d')).toEqual({ type: '2d' });
            expect(offscreenCanvas.getContext('webgl')).toEqual({ type: 'webgl' });
            expect(offscreenCanvas.getContext('bitmaprenderer')).toBe(null);
        });
        it('Should provide correct canvas dimensions to adapter.', () => {
            const mockAdapter = {
                getContext: ({ canvas }) => {
                    return { width: canvas.width, height: canvas.height };
                },
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const window = new Window({ settings: { canvasAdapter: mockAdapter } });
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            const ctx = offscreenCanvas.getContext('2d');
            expect(ctx).toEqual({ width: 800, height: 600 });
        });
        it('Should use different adapters for different windows.', () => {
            const mockAdapter1 = {
                getContext: vi.fn().mockReturnValue({ id: 'window1' }),
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const mockAdapter2 = {
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
            const mockAdapter = {
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
    describe('convertToBlob()', () => {
        it('Returns an empty Blob when no adapter has been set.', async () => {
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            const blob = await offscreenCanvas.convertToBlob();
            expect(blob).toBeInstanceOf(Blob);
            expect(blob.size).toBe(0);
            const blob2 = await offscreenCanvas.convertToBlob({ type: 'image/jpeg' });
            expect(blob2.type).toBe('image/jpeg');
            const blob3 = await offscreenCanvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
            expect(blob3).toBeInstanceOf(Blob);
            expect(blob3.type).toBe('image/jpeg');
        });
        it('Should delegate to adapter.toBlob() when adapter is set.', async () => {
            const mockBlob = new Blob(['test'], { type: 'image/png' });
            const mockAdapter = {
                getContext: vi.fn(),
                toDataURL: vi.fn(),
                toBlob: vi.fn().mockImplementation((_canvas, callback) => {
                    callback(mockBlob);
                })
            };
            const window = new Window({ settings: { canvasAdapter: mockAdapter } });
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            const blob = await offscreenCanvas.convertToBlob();
            expect(mockAdapter.toBlob).toHaveBeenCalled();
            expect(blob).toBe(mockBlob);
        });
        it('Should pass type and quality to adapter.', async () => {
            const mockAdapter = {
                getContext: vi.fn(),
                toDataURL: vi.fn(),
                toBlob: vi.fn().mockImplementation((_canvas, callback) => {
                    callback({});
                })
            };
            const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
            const page = browser.newPage();
            const browserFrame = page.mainFrame;
            const window = browserFrame.window;
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            await offscreenCanvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
            expect(mockAdapter.toBlob).toHaveBeenCalledWith({
                browserFrame,
                window,
                canvas: offscreenCanvas
            }, expect.any(Function), 'image/jpeg', 0.9);
        });
        it('Should reject if adapter returns null blob.', async () => {
            const mockAdapter = {
                getContext: vi.fn(),
                toDataURL: vi.fn(),
                toBlob: vi.fn().mockImplementation((_canvas, callback) => {
                    callback(null);
                })
            };
            const window = new Window({ settings: { canvasAdapter: mockAdapter } });
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            await expect(offscreenCanvas.convertToBlob()).rejects.toThrowError(new window.DOMException(`Failed to execute 'convertToBlob' on 'OffscreenCanvas': The canvas could not be converted to a Blob.`, DOMExceptionNameEnum.encodingError));
        });
    });
    describe('transferToImageBitmap()', () => {
        it('Returns an ImageBitmap object when no adapter has been set.', () => {
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            const imageBitmap = offscreenCanvas.transferToImageBitmap();
            expect(imageBitmap).toBeInstanceOf(ImageBitmap);
            expect(imageBitmap.width).toBe(800);
            expect(imageBitmap.height).toBe(600);
        });
        it('Should throw if getContext() has not been called to set the context.', () => {
            const mockAdapter = {
                getContext: vi.fn(),
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const window = new Window({ settings: { canvasAdapter: mockAdapter } });
            const offscreenCanvas = new window.OffscreenCanvas(800, 600);
            expect(() => offscreenCanvas.transferToImageBitmap()).toThrowError(new TypeError(`Failed to execute 'transferToImageBitmap' on 'OffscreenCanvas': Cannot transfer an ImageBitmap from an OffscreenCanvas with no context`));
        });
        it('Should delegate to adapter.getContext() when adapter is set.', () => {
            let offscreenCanvas = null;
            const mockContext = { fillRect: vi.fn(), drawImage: vi.fn(), clearRect: vi.fn() };
            const mockContext2 = { fillRect: vi.fn(), drawImage: vi.fn(), clearRect: vi.fn() };
            const mockAdapter = {
                getContext: vi.fn().mockImplementation(({ canvas }, type) => {
                    if (type === '2d') {
                        if (canvas === offscreenCanvas) {
                            return mockContext;
                        }
                        else {
                            return mockContext2;
                        }
                    }
                    return null;
                }),
                toDataURL: vi.fn(),
                toBlob: vi.fn()
            };
            const browser = new Browser({ settings: { canvasAdapter: mockAdapter } });
            const page = browser.newPage();
            const browserFrame = page.mainFrame;
            const window = browserFrame.window;
            offscreenCanvas = new window.OffscreenCanvas(800, 600);
            // Call getContext() to set the context on the OffscreenCanvas before transferring to ImageBitmap.
            offscreenCanvas.getContext('2d');
            const imageBitmap = offscreenCanvas.transferToImageBitmap();
            expect(imageBitmap).toBeInstanceOf(ImageBitmap);
            expect(imageBitmap.width).toBe(800);
            expect(imageBitmap.height).toBe(600);
            expect(mockAdapter.getContext).toHaveBeenCalledWith({
                browserFrame,
                window,
                canvas: offscreenCanvas
            }, '2d', undefined);
            expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
            expect(mockContext2.clearRect).not.toHaveBeenCalled();
            expect(mockContext2.drawImage).toHaveBeenCalledWith(offscreenCanvas, -0, -0, 800, 600);
            expect(imageBitmap[PropertySymbol.canvas].getContext('2d')).toBe(mockContext2);
        });
    });
});
//# sourceMappingURL=OffscreenCanvas.test.js.map