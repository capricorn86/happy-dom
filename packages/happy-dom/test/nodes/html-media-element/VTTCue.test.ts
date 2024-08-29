import { describe, it, expect, beforeEach } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import TextTrackCue from '../../../src/nodes/html-media-element/TextTrackCue.js';

describe('VTTCue', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Should throw an error arguments are less than 3', () => {
			// @ts-ignore
			expect(() => new window.VTTCue()).toThrow(
				new TypeError("Failed to construct 'VTTCue': 3 arguments required, but only 0 present.")
			);

			// @ts-ignore
			expect(() => new window.VTTCue(1)).toThrow(
				new TypeError("Failed to construct 'VTTCue': 3 arguments required, but only 1 present.")
			);
		});

		it('Should throw an error if startTime or endTime is not parsable as a number', () => {
			// @ts-ignore
			expect(() => new window.VTTCue('a', 1, 2)).toThrow(
				new TypeError(`Failed to construct 'VTTCue': The provided double value is non-finite.`)
			);

			// @ts-ignore
			expect(() => new window.VTTCue(1, 'a', 2)).toThrow(
				new TypeError(`Failed to construct 'VTTCue': The provided double value is non-finite.`)
			);
		});

		it('Should not throw an error is valid parameters are provided', () => {
			const vttCue = new window.VTTCue(10, 20, 'test');
			expect(vttCue.startTime).toBe(10);
			expect(vttCue.endTime).toBe(20);
			expect(vttCue.text).toBe('test');
		});

		it('Is an instance of TextTrackCue', () => {
			expect(new window.VTTCue(0, 10, 'test')).toBeInstanceOf(TextTrackCue);
		});
	});

	describe('get region()', () => {
		it('Should return null by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.region).toBe(null);
		});
	});

	describe('get vertical()', () => {
		it('Should return "" by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.vertical).toBe('');
		});
	});

	describe('get snapToLines()', () => {
		it('Should return true by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.snapToLines).toBe(true);
		});
	});

	describe('get line()', () => {
		it('Should return 0 by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.line).toBe(0);
		});
	});

	describe('get lineAlign()', () => {
		it('Should return "" by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.lineAlign).toBe('');
		});
	});

	describe('get position()', () => {
		it('Should return "auto" by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.position).toBe('auto');
		});
	});

	describe('get positionAlign()', () => {
		it('Should return "auto" by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.positionAlign).toBe('auto');
		});
	});

	describe('get size()', () => {
		it('Should return 100 by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.size).toBe(100);
		});
	});

	describe('get align()', () => {
		it('Should return "" by default', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.align).toBe('');
		});
	});

	describe('get text()', () => {
		it('Should return the text of the cue', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			expect(cue.text).toBe('test');
		});
	});

	describe('getCueAsHTML()', () => {
		it('Should reurn a DocumentFragment with a text node', () => {
			const cue = new window.VTTCue(0, 10, 'test');
			const fragment = cue.getCueAsHTML();
			expect(fragment.childNodes.length).toBe(1);
			expect(fragment.childNodes[0].textContent).toBe('test');
		});
	});
});
