import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSKeyframeRule from '../../../src/css/rules/CSSKeyframeRule.js';

describe('CSSKeyframeRule', () => {
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
			const cssRule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(8);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.keyframeRule);
		});
	});

	describe('get keyText()', () => {
		it('Returns key text', () => {
			const cssRule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.keyText] = 'from';
			expect(cssRule.keyText).toBe('from');
		});
	});

	describe('get style()', () => {
		it('Returns style declaration', () => {
			const cssRule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.cssText] = 'top: 200px;';
			expect(cssRule.style).toBe(cssRule.style);
			expect(cssRule.style.cssText).toBe('top: 200px;');
			expect(cssRule.style.top).toBe('200px');
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSKeyframeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.keyText] = 'from';
			cssRule[PropertySymbol.cssText] = 'top: 200px;';
			expect(cssRule.cssText).toBe('from { top: 200px; }');
		});
	});
});
