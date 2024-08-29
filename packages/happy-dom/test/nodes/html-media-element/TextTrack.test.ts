import { describe, it, expect, beforeEach } from 'vitest';
import TextTrack from '../../../src/nodes/html-media-element/TextTrack.js';
import TextTrackKindEnum from '../../../src/nodes/html-media-element/TextTrackKindEnum.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import EventTarget from '../../../src/event/EventTarget.js';

describe('TextTrack', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new window.TextTrack()).toThrow(new TypeError('Illegal constructor'));
		});

		it('Should not throw an error if the "illegalConstructor" symbol is provided', () => {
			expect(() => new window.TextTrack(PropertySymbol.illegalConstructor)).not.toThrow();
		});

		it('Is an instance of EventTarget', () => {
			const textTrackList = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrackList).toBeInstanceOf(EventTarget);
		});
	});

	describe('get kind()', () => {
		it('Should return "subtitles" by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.kind).toBe(TextTrackKindEnum.subtitles);
		});

		it('Should return the value set', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack[PropertySymbol.kind] = TextTrackKindEnum.captions;
			expect(textTrack.kind).toBe('captions');
		});
	});

	describe('get label()', () => {
		it('Should return an empty string by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.label).toBe('');
		});

		it('Should return the value set', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack[PropertySymbol.label] = 'test';
			expect(textTrack.label).toBe('test');
		});
	});

	describe('get language()', () => {
		it('Should return an empty string by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.language).toBe('');
		});

		it('Should return the value set', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack[PropertySymbol.language] = 'test';
			expect(textTrack.language).toBe('test');
		});
	});

	describe('get id()', () => {
		it('Should return an empty string by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.id).toBe('');
		});

		it('Should return the value set', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack[PropertySymbol.id] = 'test';
			expect(textTrack.id).toBe('test');
		});
	});

	describe('get mode()', () => {
		it('Should return "disabled" by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.mode).toBe('disabled');
		});

		it('Should return the value set', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack.mode = 'showing';
			expect(textTrack.mode).toBe('showing');
		});
	});

	describe('set mode()', () => {
		it('Should set the mode', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack.mode = 'showing';
			expect(textTrack.mode).toBe('showing');
		});

		it('Should ignore invalid values', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack.mode = <'showing'>'invalid';
			expect(textTrack.mode).toBe('disabled');
			textTrack.mode = 'showing';
			expect(textTrack.mode).toBe('showing');
			textTrack.mode = 'disabled';
			expect(textTrack.mode).toBe('disabled');
		});
	});

	describe('get cues()', () => {
		it('Should return null by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.cues).toBe(null);
		});

		it('Should return a TextTrackCueList when mode is "showing"', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack.mode = 'showing';
			expect(textTrack.cues).toBeInstanceOf(window.TextTrackCueList);
		});
	});

	describe('get activeCues()', () => {
		it('Should return null by default', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			expect(textTrack.activeCues).toBe(null);
		});

		it('Should return a TextTrackCueList when mode is "showing"', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			textTrack.mode = 'showing';
			expect(textTrack.activeCues).toBeInstanceOf(window.TextTrackCueList);
		});
	});

	describe('addCue()', () => {
		it('Should add a cue', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			const cue = new window.VTTCue(0, 10, 'test');

			textTrack.addCue(cue);

			expect(cue.track).toBe(textTrack);

			expect(textTrack.cues).toBe(null);

			textTrack.mode = 'showing';

			expect(textTrack.cues?.length).toBe(1);
			expect(textTrack.cues?.[0]).toBe(cue);
		});
	});

	describe('removeCue()', () => {
		it('Should remove a cue', () => {
			const textTrack = new window.TextTrack(PropertySymbol.illegalConstructor);
			const cue = new window.VTTCue(0, 10, 'test');

			textTrack.addCue(cue);
			textTrack.removeCue(cue);

			expect(cue.track).toBe(null);

			expect(textTrack.cues).toBe(null);

			textTrack.mode = 'showing';

			expect(textTrack.cues?.length).toBe(0);
		});
	});
});
