import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import type CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSMediaRule from '../../../src/css/rules/CSSMediaRule.js';
import MediaList from '../../../src/css/MediaList.js';

describe('CSSMediaRule', () => {
	let window: BrowserWindow;
	let styleSheet: CSSStyleSheet;
	let cssParser: CSSParser;

	beforeEach(() => {
		window = new Window();
		styleSheet = new window.CSSStyleSheet();
		cssParser = new CSSParser(styleSheet);
	});

	describe('get type()', () => {
		it('Returns container rule type', () => {
			const cssRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(4);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.mediaRule);
		});
	});

	describe('get media()', () => {
		it('Returns media', () => {
			const cssRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, cssParser);

			expect(cssRule.media).toBe(cssRule.media);
			expect(cssRule.media).toBeInstanceOf(MediaList);

			cssRule.media.appendMedium('screen');
			cssRule.media.appendMedium('print');

			expect(cssRule.media.mediaText).toBe('screen, print');
			expect(cssRule.conditionText).toBe('screen, print');
			expect(cssRule.media.length).toBe(2);
			expect(cssRule.media[0]).toBe('screen');
			expect(cssRule.media[1]).toBe('print');

			cssRule.media.mediaText = 'test';

			expect(cssRule.media.mediaText).toBe('test');
			expect(cssRule.conditionText).toBe('test');
			expect(cssRule.media.length).toBe(1);
			expect(cssRule.media[0]).toBe('test');
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, cssParser);

			expect(cssRule.cssText).toBe('@media  {  }');

			cssRule.media.appendMedium('screen');
			cssRule.media.appendMedium('print');

			cssRule.insertRule('body { color: red; }');
			cssRule.insertRule('.test { color: blue; }');

			expect(cssRule.cssText).toBe(
				'@media screen, print {\n  .test { color: blue; }\n  body { color: red; }\n}'
			);
		});
	});

	describe('get conditionText()', () => {
		it('Returns conditional text', () => {
			const cssRule = new CSSMediaRule(PropertySymbol.illegalConstructor, window, cssParser);

			cssRule.media.appendMedium('screen');
			cssRule.media.appendMedium('print');

			expect(cssRule.conditionText).toBe('screen, print');

			cssRule.media.mediaText = 'test';

			expect(cssRule.conditionText).toBe('test');
		});
	});
});
