import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSFontFaceRule from '../../../src/css/rules/CSSFontFaceRule.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';

describe('CSSFontFaceRule', () => {
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
			const cssRule = new CSSFontFaceRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(5);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.fontFaceRule);
		});
	});

	describe('get style()', () => {
		it('Returns style declaration', () => {
			const cssRule = new CSSFontFaceRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.cssText] = 'font-family: "Trickster";';
			expect(cssRule.style).toBe(cssRule.style);
			expect(cssRule.style.cssText).toBe('font-family: Trickster;');
			expect(cssRule.style.fontFamily).toBe('Trickster');
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSFontFaceRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.cssText] = 'font-family: "Trickster";';
			expect(cssRule.cssText).toBe('@font-face { font-family: Trickster; }');
		});
	});
});
