import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSKeyframesRule from '../../../src/css/rules/CSSKeyframesRule.js';
import CSSKeyframeRule from '../../../src/css/rules/CSSKeyframeRule.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';

describe('CSSKeyframesRule', () => {
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
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(7);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.keyframesRule);
		});
	});

	describe('get cssRules()', () => {
		it('Returns key text', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.appendRule('0% { transform: rotate(360deg); }');
			expect(cssRule.cssRules.length).toBe(1);
			expect(cssRule.cssRules[0]).toBeInstanceOf(CSSKeyframeRule);
			expect(cssRule.cssRules[0].cssText).toBe('0% { transform: rotate(360deg); }');
		});
	});

	describe('get name()', () => {
		it('Returns name', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.name] = 'test';
			expect(cssRule.name).toBe('test');
		});
	});

	describe('get length()', () => {
		it('Returns length', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.appendRule('0% { transform: rotate(360deg); }');
			expect(cssRule.length).toBe(1);
		});
	});

	describe('appendRule()', () => {
		it('Appends rule', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.appendRule('0% { transform: rotate(360deg); }');
			cssRule.appendRule('100% { transform: rotate(0deg); }');
			expect(cssRule.cssRules.length).toBe(2);
			expect(cssRule.cssRules[0].cssText).toBe('0% { transform: rotate(360deg); }');
			expect(cssRule.cssRules[1].cssText).toBe('100% { transform: rotate(0deg); }');
		});

		it('Throws an error if no arguments are provided', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				// @ts-expect-error
				cssRule.appendRule();
			}).toThrow(
				new TypeError(
					`Failed to execute 'appendRule' on 'CSSKeyframesRule': 1 argument required, but only 0 present.`
				)
			);
		});

		it('Throws an error if the rule is invalid', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);

			expect(() => {
				cssRule.appendRule('100 { transform: rotate(0deg); }');
			}).toThrow(
				new window.DOMException(`Invalid or unexpected token`, DOMExceptionNameEnum.syntaxError)
			);

			expect(() => {
				cssRule.appendRule('test { transform: rotate(0deg); }');
			}).toThrow(
				new window.DOMException(`Invalid or unexpected token`, DOMExceptionNameEnum.syntaxError)
			);
		});
	});

	describe('deleteRule()', () => {
		it('Deletes rule', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.appendRule('0% { transform: rotate(360deg); }');
			cssRule.appendRule('100% { transform: rotate(0deg); }');
			cssRule.deleteRule('0%');
			expect(cssRule.cssRules.length).toBe(1);
			expect(cssRule.cssRules[0].cssText).toBe('100% { transform: rotate(0deg); }');
		});

		it('Throws an error if no arguments are provided', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				// @ts-expect-error
				cssRule.deleteRule();
			}).toThrow(
				new TypeError(
					`Failed to execute 'deleteRule' on 'CSSKeyframesRule': 1 argument required, but only 0 present.`
				)
			);
		});
	});

	describe('findRule()', () => {
		it('Finds rule', () => {
			const cssRule = new CSSKeyframesRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.appendRule('0% { transform: rotate(360deg); }');
			cssRule.appendRule('100% { transform: rotate(0deg); }');
			const rule = cssRule.findRule('0%');
			expect(rule).toBeInstanceOf(CSSKeyframeRule);
			expect(rule.cssText).toBe('0% { transform: rotate(360deg); }');
		});
	});
});
