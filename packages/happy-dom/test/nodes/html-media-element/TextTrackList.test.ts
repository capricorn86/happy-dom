import { describe, it, expect, beforeEach } from 'vitest';
import TextTrackList from '../../../src/nodes/html-media-element/TextTrackList.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import TextTrack from '../../../src/nodes/html-media-element/TextTrack.js';
import EventTarget from '../../../src/event/EventTarget.js';

describe('TextTrackList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Should throw an error if the "illegalConstructor" symbol is not sent to the constructor', () => {
			expect(() => new window.TextTrackList(Symbol(''), [])).toThrow(
				new TypeError('Illegal constructor')
			);
		});

		it('Should not throw an error if the "illegalConstructor" symbol is provided', () => {
			expect(() => new window.TextTrackList(PropertySymbol.illegalConstructor, [])).not.toThrow();
		});

		it('Is an instance of EventTarget', () => {
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, []);
			expect(textTrackList).toBeInstanceOf(EventTarget);
		});
	});

	describe('get length()', () => {
		it('Should return 0 by default', () => {
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, []);
			expect(textTrackList.length).toBe(0);
		});

		it('Should return the number of tracks', () => {
			const items = [
				new window.TextTrack(PropertySymbol.illegalConstructor),
				new window.TextTrack(PropertySymbol.illegalConstructor)
			];
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, items);
			expect(textTrackList.length).toBe(2);
		});
	});

	describe('get [index]()', () => {
		it('Should return the item at the index', () => {
			const items = [
				new window.TextTrack(PropertySymbol.illegalConstructor),
				new window.TextTrack(PropertySymbol.illegalConstructor)
			];
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, items);
			expect(textTrackList[0]).toBe(items[0]);
			expect(textTrackList[1]).toBe(items[1]);
		});
	});

	describe('get [Symbol.toStringTag]()', () => {
		it('Should return "TextTrackList"', () => {
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, []);
			expect(textTrackList[Symbol.toStringTag]).toBe('TextTrackList');
		});
	});

	describe('toLocaleString()', () => {
		it('Should return "[object TextTrackList]"', () => {
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, []);
			expect(textTrackList.toLocaleString()).toBe('[object TextTrackList]');
		});
	});

	describe('toString()', () => {
		it('Should return "[object TextTrackList]"', () => {
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, []);
			expect(textTrackList.toString()).toBe('[object TextTrackList]');
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('Should return an iterator', () => {
			const items = [
				new window.TextTrack(PropertySymbol.illegalConstructor),
				new window.TextTrack(PropertySymbol.illegalConstructor)
			];
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, items);
			const iteratedItems: TextTrack[] = [];

			for (const item of textTrackList) {
				iteratedItems.push(item);
			}

			expect(iteratedItems).toEqual(items);
		});
	});

	describe('getTrackById()', () => {
		it('Should return null if no track is found', () => {
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, []);
			expect(textTrackList.getTrackById('test')).toBeNull();
		});

		it('Should return the track if found', () => {
			const track1 = new window.TextTrack(PropertySymbol.illegalConstructor);
			const track2 = new window.TextTrack(PropertySymbol.illegalConstructor);
			track1[PropertySymbol.id] = 'track1';
			track2[PropertySymbol.id] = 'track2';
			const items = [track1, track2];
			const textTrackList = new window.TextTrackList(PropertySymbol.illegalConstructor, items);
			expect(textTrackList.getTrackById('track1')).toBe(track1);
			expect(textTrackList.getTrackById('track2')).toBe(track2);
		});
	});
});
