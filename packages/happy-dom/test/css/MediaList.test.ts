import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import CSSParser from '../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../src/css/CSSStyleSheet.js';
import CSSMediaRule from '../../src/css/rules/CSSMediaRule.js';

describe('MediaList', () => {
	let window: BrowserWindow;
	let styleSheet: CSSStyleSheet;
	let cssParser: CSSParser;
	let cssMediaRule: CSSMediaRule;

	beforeEach(() => {
		window = new Window();
		styleSheet = new window.CSSStyleSheet();
		cssParser = new CSSParser(styleSheet);
		cssMediaRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, cssParser);
	});

	describe('get [index]()', () => {
		it('Returns item', () => {
			const mediaList = cssMediaRule.media;
			expect(mediaList[0]).toBe(undefined);
			cssMediaRule[PropertySymbol.conditionText] = 'screen, print';
			expect(mediaList[0]).toBe('screen');
			expect(mediaList[1]).toBe('print');
			expect(mediaList[2]).toBe(undefined);
			cssMediaRule[PropertySymbol.conditionText] = 'screen, print , speech';
			expect(mediaList[0]).toBe('screen');
			expect(mediaList[1]).toBe('print');
			expect(mediaList[2]).toBe('speech');
			expect(mediaList[3]).toBe(undefined);
			cssMediaRule[PropertySymbol.conditionText] = 'screen';
			expect(mediaList[0]).toBe('screen');
			expect(mediaList[1]).toBe(undefined);
		});
	});

	describe('get length()', () => {
		it('Returns length', () => {
			const mediaList = cssMediaRule.media;
			expect(mediaList.length).toBe(0);
			cssMediaRule[PropertySymbol.conditionText] = 'screen, print';
			expect(mediaList.length).toBe(2);
			mediaList.mediaText = 'screen, print, speech';
			expect(mediaList.length).toBe(3);
		});
	});

	describe('get mediaText()', () => {
		it('Returns media text', () => {
			const mediaList = cssMediaRule.media;
			expect(mediaList.mediaText).toBe('');
			cssMediaRule[PropertySymbol.conditionText] = 'screen, print';
			expect(mediaList.mediaText).toBe('screen, print');
			mediaList.mediaText = 'screen, print, speech';
			expect(mediaList.mediaText).toBe('screen, print, speech');
		});
	});

	describe('set mediaText()', () => {
		it('Sets media text', () => {
			const mediaList = cssMediaRule.media;
			mediaList.mediaText = 'screen, print';
			expect(mediaList.mediaText).toBe('screen, print');
			expect(cssMediaRule[PropertySymbol.conditionText]).toBe('screen, print');
		});

		it('Adds space between each item', () => {
			const mediaList = cssMediaRule.media;
			mediaList.mediaText = 'screen,print';
			expect(mediaList.mediaText).toBe('screen, print');
		});

		it('Sets media text to empty string if value is null', () => {
			const mediaList = cssMediaRule.media;
			mediaList.mediaText = null;
			expect(mediaList.mediaText).toBe('');
			expect(cssMediaRule[PropertySymbol.conditionText]).toBe('');
		});

		it('Converts non-string values to string', () => {
			const mediaList = cssMediaRule.media;
			mediaList.mediaText = <string>(<unknown>undefined);
			expect(mediaList.mediaText).toBe('undefined');
			expect(cssMediaRule[PropertySymbol.conditionText]).toBe('undefined');
		});
	});

	describe('item()', () => {
		it('Returns item', () => {
			const mediaList = cssMediaRule.media;
			expect(mediaList.item(0)).toBe(null);
			cssMediaRule[PropertySymbol.conditionText] = 'screen, print';
			expect(mediaList.item(0)).toBe('screen');
			expect(mediaList.item(1)).toBe('print');
			expect(mediaList.item(2)).toBe(null);
		});
	});

	describe('appendMedium()', () => {
		it('Appends a medium', () => {
			const mediaList = cssMediaRule.media;
			mediaList.appendMedium('screen');
			expect(mediaList.mediaText).toBe('screen');
			mediaList.appendMedium('print');
			expect(mediaList.mediaText).toBe('screen, print');
			mediaList.appendMedium('print');
			expect(mediaList.mediaText).toBe('screen, print');
			expect(cssMediaRule[PropertySymbol.conditionText]).toBe('screen, print');
		});
	});

	describe('deleteMedium()', () => {
		it('Deletes a medium', () => {
			const mediaList = cssMediaRule.media;
			cssMediaRule[PropertySymbol.conditionText] = 'screen, print';
			mediaList.deleteMedium('screen');
			expect(mediaList.mediaText).toBe('print');
			mediaList.deleteMedium('print');
			expect(mediaList.mediaText).toBe('');
			expect(cssMediaRule[PropertySymbol.conditionText]).toBe('');
		});
	});
});
