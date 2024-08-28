import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';

describe('TextTrackCue', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Should throw an error if constructed without the "illegalConstructor" symbol', () => {
			// @ts-ignore
			expect(() => new window.TextTrackCue()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should not throw an error if constructed with the "illegalConstructor" symbol', () => {
			// @ts-ignore
			expect(() => new window.TextTrackCue(PropertySymbol.illegalConstructor)).not.toThrow();
		});
	});

	describe('get id()', () => {
		it('Should return an empty string by default', () => {
			// @ts-ignore
			const textTrackCue = new window.TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.id).toBe('');
		});
	});

	describe('get startTime()', () => {
		it('Should return 0 by default', () => {
			// @ts-ignore
			const textTrackCue = new window.TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.startTime).toBe(0);
		});
	});

	describe('get endTime()', () => {
		it('Should return 0 by default', () => {
			// @ts-ignore
			const textTrackCue = new window.TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.endTime).toBe(0);
		});
	});

	describe('get pauseOnExit()', () => {
		it('Should return false by default', () => {
			// @ts-ignore
			const textTrackCue = new window.TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.pauseOnExit).toBe(false);
		});
	});

	describe('get track()', () => {
		it('Should return null by default', () => {
			// @ts-ignore
			const textTrackCue = new window.TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.track).toBe(null);
		});

		it('Should return the value set', () => {
			// @ts-ignore
			const textTrackCue = new window.TextTrackCue(PropertySymbol.illegalConstructor);
			const track = {};
			textTrackCue[PropertySymbol.track] = track;
			expect(textTrackCue.track).toBe(track);
		});
	});
});
