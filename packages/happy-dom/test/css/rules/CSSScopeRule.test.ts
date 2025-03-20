import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSScopeRule from '../../../src/css/rules/CSSScopeRule.js';

describe('CSSScopeRule', () => {
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
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(0);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.containerRule);
		});
	});

	describe('get start()', () => {
		it('Returns start', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.start).toBe('');
			cssRule[PropertySymbol.start] = '.from.element';
			expect(cssRule.start).toBe('.from.element');
		});
	});

	describe('get end()', () => {
		it('Returns end', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.end).toBe('');
			cssRule[PropertySymbol.end] = '.to.element';
			expect(cssRule.end).toBe('.to.element');
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.cssText).toBe('@scope {\n}');
			cssRule[PropertySymbol.start] = '.from .element';
			expect(cssRule.cssText).toBe('@scope (.from .element) {\n}');
			cssRule[PropertySymbol.end] = '.to .element';
			expect(cssRule.cssText).toBe('@scope (.from .element) to (.to .element) {\n}');

			cssRule.insertRule('div { color: red; }');

			expect(cssRule.cssText).toBe(
				'@scope (.from .element) to (.to .element) {\n  div { color: red; }\n}'
			);

			cssRule.insertRule('span { color: blue; }');

			expect(cssRule.cssText).toBe(
				'@scope (.from .element) to (.to .element) {\n  span { color: blue; }\n  div { color: red; }\n}'
			);
		});
	});
});
