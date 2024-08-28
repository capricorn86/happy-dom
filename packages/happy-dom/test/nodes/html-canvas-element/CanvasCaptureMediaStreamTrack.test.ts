import HTMLCanvasElement from '../../../src/nodes/html-canvas-element/HTMLCanvasElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import MediaStreamTrack from '../../../src/nodes/html-media-element/MediaStreamTrack.js';

describe('CanvasCaptureMediaStreamTrack', () => {
	let window: Window;
	let document: Document;
	let canvas: HTMLCanvasElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		canvas = document.createElement('canvas');
	});

	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new window.CanvasCaptureMediaStreamTrack()).toThrow(
				new TypeError('Illegal constructor')
			);
		});

		it('Should not throw an error if the "illegalConstructor" symbol is provided', () => {
			expect(
				() => new window.CanvasCaptureMediaStreamTrack(PropertySymbol.illegalConstructor)
			).not.toThrow();
		});

		it('Is an instance of MediaStreamTrack', () => {
			expect(
				new window.CanvasCaptureMediaStreamTrack(PropertySymbol.illegalConstructor)
			).toBeInstanceOf(MediaStreamTrack);
		});
	});

	describe('get canvas()', () => {
		it('Returns the canvas.', () => {
			const track = new window.CanvasCaptureMediaStreamTrack(
				PropertySymbol.illegalConstructor,
				canvas
			);
			track[PropertySymbol.kind] = 'video';
			expect(track.canvas).toBe(canvas);
		});
	});

	describe('requestFrame()', () => {
		it('Does nothing.', () => {
			const track = new window.CanvasCaptureMediaStreamTrack(
				PropertySymbol.illegalConstructor,
				canvas
			);
			track[PropertySymbol.kind] = 'video';
			expect(() => track.requestFrame()).not.toThrow();
		});
	});

	describe('clone()', () => {
		it('Clones the track.', () => {
			const track = new window.CanvasCaptureMediaStreamTrack(
				PropertySymbol.illegalConstructor,
				canvas
			);
			track[PropertySymbol.kind] = 'video';
			const clone = track.clone();

			// MediaStreamTrack
			expect(clone).not.toBe(track);
			expect(clone.id).not.toBe(track.id);
			expect(clone.label).toBe(track.label);
			expect(clone.kind).toBe(track.kind);
			expect(clone.muted).toBe(track.muted);
			expect(clone.readyState).toBe(track.readyState);
			expect(clone.getCapabilities()).toEqual(track.getCapabilities());
			expect(clone.getSettings()).toEqual(track.getSettings());

			// CanvasCaptureMediaStreamTrack
			expect(clone.canvas).toBe(track.canvas);
		});
	});
});
