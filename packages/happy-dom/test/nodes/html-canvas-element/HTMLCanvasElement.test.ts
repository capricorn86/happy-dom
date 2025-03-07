import HTMLCanvasElement from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import CanvasCaptureMediaStreamTrack from '../../../src/nodes/html-canvas-element/CanvasCaptureMediaStreamTrack.js';
import Blob from '../../../src/file/Blob.js';
import OffscreenCanvas from '../../../src/nodes/html-canvas-element/OffscreenCanvas.js';
import MediaStream from '../../../src/nodes/html-media-element/MediaStream.js';
import Event from '../../../src/event/Event.js';

const DEVICE_ID = 'S3F/aBCdEfGHIjKlMnOpQRStUvWxYz1234567890+1AbC2DEf2GHi3jK34le+ab12C3+1aBCdEf==';

describe('HTMLCanvasElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLCanvasElement;

	beforeEach(() => {
		window = new Window();
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
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
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
		it('Returns null (not implemented yet).', () => {
			for (const type of ['2d', 'webgl', 'webgl2', 'webgpu', 'bitmaprenderer']) {
				expect(element.getContext(<'2d'>type)).toBe(null);
				expect(element.getContext(<'2d'>type, {})).toBe(null);
			}
		});
	});

	describe('toDataURL()', () => {
		it('Returns an empty string (not implemented yet).', () => {
			expect(element.toDataURL()).toBe('');
			expect(element.toDataURL('2d')).toBe('');
			expect(element.toDataURL('2d', '')).toBe('');
		});
	});

	describe('toBlob()', () => {
		it('Returns an empty Blob (not implemented yet).', () => {
			let blob: Blob | null = null;
			element.toBlob((b) => (blob = b));
			expect(<Blob>(<unknown>blob)).toBeInstanceOf(Blob);

			blob = null;
			element.toBlob((b) => (blob = b), 'image/png');
			expect(<Blob>(<unknown>blob)).toBeInstanceOf(Blob);

			blob = null;
			element.toBlob((b) => (blob = b), 'image/png', 0.5);
			expect(<Blob>(<unknown>blob)).toBeInstanceOf(Blob);
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
	});
});
