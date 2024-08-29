import { describe, it, expect, beforeEach } from 'vitest';
import TextTrackCueList from '../../../src/nodes/html-media-element/TextTrackCueList.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

describe('TextTrackCueList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new TextTrackCueList()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should be an instance of Array', () => {
			const textTrackCueList = new TextTrackCueList(PropertySymbol.illegalConstructor);
			expect(textTrackCueList).toBeInstanceOf(Array);
		});
	});

	describe('getCueById()', () => {
		it('Should return null if no cue is found', () => {
			const textTrackCueList = new TextTrackCueList(PropertySymbol.illegalConstructor);
			expect(textTrackCueList.getCueById('test')).toBeNull();
		});

		it('Should return the cue if found', () => {
			const textTrackCueList = new TextTrackCueList(PropertySymbol.illegalConstructor);
			const cue1 = new window.VTTCue(0, 10, 'test');
			const cue2 = new window.VTTCue(0, 10, 'test');
			cue1.id = 'cue1';
			cue2.id = 'cue2';
			textTrackCueList.push(cue1);
			textTrackCueList.push(cue2);
			expect(textTrackCueList.getCueById('cue1')).toBe(cue1);
			expect(textTrackCueList.getCueById('cue2')).toBe(cue2);
		});
	});
});
