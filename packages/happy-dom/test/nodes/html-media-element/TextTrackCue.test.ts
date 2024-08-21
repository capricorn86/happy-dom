import { describe, it, expect } from 'vitest';
import TextTrackCue from '../../../src/nodes/html-media-element/TextTrackCue.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('TextTrackCue', () => {
	describe('constructor()', () => {
		it('Should throw an error if constructed without the "illegalConstructor" symbol', () => {
			// @ts-ignore
			expect(() => new TextTrackCue()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should not throw an error if constructed with the "illegalConstructor" symbol', () => {
			// @ts-ignore
			expect(() => new TextTrackCue(PropertySymbol.illegalConstructor)).not.toThrow();
		});
	});

	describe('get id()', () => {
		it('Should return an empty string by default', () => {
			// @ts-ignore
			const textTrackCue = new TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.id).toBe('');
		});
	});

	describe('get startTime()', () => {
		it('Should return 0 by default', () => {
			// @ts-ignore
			const textTrackCue = new TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.startTime).toBe(0);
		});
	});

	describe('get endTime()', () => {
		it('Should return 0 by default', () => {
			// @ts-ignore
			const textTrackCue = new TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.endTime).toBe(0);
		});
	});

	describe('get pauseOnExit()', () => {
		it('Should return false by default', () => {
			// @ts-ignore
			const textTrackCue = new TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.pauseOnExit).toBe(false);
		});
	});

	describe('get track()', () => {
		it('Should return null by default', () => {
			// @ts-ignore
			const textTrackCue = new TextTrackCue(PropertySymbol.illegalConstructor);
			expect(textTrackCue.track).toBe(null);
		});

		it('Should return the value set', () => {
			// @ts-ignore
			const textTrackCue = new TextTrackCue(PropertySymbol.illegalConstructor);
			const track = {};
			textTrackCue[PropertySymbol.track] = track;
			expect(textTrackCue.track).toBe(track);
		});
	});
});
