import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import type CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSLayerBlockRule from '../../../src/css/rules/CSSLayerBlockRule.js';

describe('CSSLayerBlockRule', () => {
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
			const cssRule = new CSSLayerBlockRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(0);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.containerRule);
		});
	});

	describe('get name()', () => {
		it('Returns name', () => {
			const cssRule = new CSSLayerBlockRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.name).toBe('');
			cssRule[PropertySymbol.name] = 'base';
			expect(cssRule.name).toBe('base');
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSLayerBlockRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.cssText).toBe('@layer {\n}');
			cssRule[PropertySymbol.name] = 'base';
			expect(cssRule.cssText).toBe('@layer base {\n}');

			cssRule.insertRule('div { color: red; }');

			expect(cssRule.cssText).toBe('@layer base {\n  div { color: red; }\n}');

			cssRule.insertRule('span { color: blue; }');

			expect(cssRule.cssText).toBe(
				'@layer base {\n  span { color: blue; }\n  div { color: red; }\n}'
			);
		});
	});
});
