import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import EventTarget from '../../../src/event/EventTarget.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';

describe('MediaStreamTrack', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new window.MediaStreamTrack()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should not throw an error if the "illegalConstructor" symbol is provided', () => {
			expect(() => new window.MediaStreamTrack(PropertySymbol.illegalConstructor)).not.toThrow();
		});

		it('Is an instance of EventTarget', () => {
			expect(new window.MediaStreamTrack(PropertySymbol.illegalConstructor)).toBeInstanceOf(
				EventTarget
			);
		});
	});

	describe('applyConstraints()', () => {
		it('Applies constraints.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			const constraints = {
				width: { min: 640, ideal: 1280 },
				height: { min: 480, ideal: 720 },
				advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }]
			};
			track.applyConstraints(constraints);
			expect(track.getConstraints()).toEqual(constraints);
			track.applyConstraints({ width: { min: 300, ideal: 500 } });
			track.applyConstraints({ width: { test: true } });
			expect(track.getConstraints()).toEqual({
				width: { min: 300, ideal: 500, test: true },
				height: { min: 480, ideal: 720 },
				advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }]
			});
		});
	});

	describe('getConstrains()', () => {
		it('Returns constraints.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			const constraints = {
				width: { min: 640, ideal: 1280 },
				height: { min: 480, ideal: 720 },
				advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }]
			};
			track.applyConstraints(constraints);
			expect(track.getConstraints()).toEqual(constraints);
		});
	});

	describe('getCapabilities()', () => {
		it('Returns capabilities.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			expect(track.getCapabilities()).toEqual({
				aspectRatio: {
					max: 300,
					min: 0.006666666666666667
				},
				deviceId: '',
				facingMode: [],
				frameRate: {
					max: 60,
					min: 0
				},
				height: {
					max: 150,
					min: 1
				},
				resizeMode: ['none', 'crop-and-scale'],
				width: {
					max: 300,
					min: 1
				}
			});
		});

		it('Is possible to edit object.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			track[PropertySymbol.capabilities].width.max = 800;
			expect(track.getCapabilities().width.max).toBe(800);
		});
	});

	describe('getSettings()', () => {
		it('Returns settings.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			expect(track.getSettings()).toEqual({
				deviceId: '',
				frameRate: 60,
				resizeMode: 'none'
			});
		});

		it('Is possible to edit object.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			track[PropertySymbol.settings].frameRate = 30;
			expect(track.getSettings().frameRate).toBe(30);
		});
	});

	describe('clone()', () => {
		it('Clones the track.', () => {
			const track = new window.MediaStreamTrack(PropertySymbol.illegalConstructor);
			track[PropertySymbol.kind] = 'video';
			const clone = track.clone();
			expect(clone).not.toBe(track);
			expect(clone.id).not.toBe(track.id);
			expect(clone.label).toBe(track.label);
			expect(clone.kind).toBe(track.kind);
			expect(clone.muted).toBe(track.muted);
			expect(clone.readyState).toBe(track.readyState);
			expect(clone.getCapabilities()).toEqual(track.getCapabilities());
			expect(clone.getSettings()).toEqual(track.getSettings());
		});
	});
});
