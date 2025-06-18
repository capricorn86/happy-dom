import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSScopeRule from '../../../src/css/rules/CSSScopeRule.js';
import CSSStyleRule from '../../../src/css/rules/CSSStyleRule.js';
import DOMException from '../../../src/exception/DOMException.js';
import DOMExceptionNameEnum from '../../../src/exception/DOMExceptionNameEnum.js';

describe('CSSGroupingRule', () => {
	let window: BrowserWindow;
	let styleSheet: CSSStyleSheet;
	let cssParser: CSSParser;

	beforeEach(() => {
		window = new Window();
		styleSheet = new window.CSSStyleSheet();
		cssParser = new CSSParser(styleSheet);
	});

	describe('get cssRules()', () => {
		it('Returns CSS rules', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.insertRule('body { color: red; }');
			expect(cssRule.cssRules.length).toBe(1);
			expect(cssRule.cssRules[0]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[0].cssText).toBe('body { color: red; }');
		});
	});

	describe('insertRule()', () => {
		it('Insert rule', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.insertRule('body { color: red; }');
			cssRule.insertRule('.test { color: blue; }');
			expect(cssRule.cssRules.length).toBe(2);
			expect(cssRule.cssRules[0]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[0].cssText).toBe('.test { color: blue; }');
			expect(cssRule.cssRules[1]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[1].cssText).toBe('body { color: red; }');
		});

		it('Insert rule at index', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.insertRule('body { color: red; }');
			cssRule.insertRule('.test { color: blue; }');
			cssRule.insertRule('.test2 { color: green; }', 1);
			expect(cssRule.cssRules.length).toBe(3);
			expect(cssRule.cssRules[0]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[0].cssText).toBe('.test { color: blue; }');
			expect(cssRule.cssRules[1]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[1].cssText).toBe('.test2 { color: green; }');
			expect(cssRule.cssRules[2]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[2].cssText).toBe('body { color: red; }');
		});

		it('Throws error when no arguments are provided', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				// @ts-expect-error
				cssRule.insertRule();
			}).toThrow(
				new TypeError(
					`Failed to execute 'insertRule' on 'CSSScopeRule': 1 argument required, but only 0 present.`
				)
			);
		});

		it('Throws error for an invalid rule', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				cssRule.insertRule('{ color: red; }');
			}).toThrow(
				new window.DOMException(
					`Failed to execute 'insertRule' on 'CSSScopeRule': Failed to parse the rule '{ color: red; }'.`,
					DOMExceptionNameEnum.syntaxError
				)
			);
		});

		it('Throws error for multiple rules', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				cssRule.insertRule('body { color: red; } .test { color: blue; }');
			}).toThrow(
				new window.DOMException(
					`Failed to execute 'insertRule' on 'CSSScopeRule': Failed to parse the rule 'body { color: red; } .test { color: blue; }'.`,
					DOMExceptionNameEnum.syntaxError
				)
			);
		});

		it('Throws error for an invalid index', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				// @ts-expect-error
				cssRule.insertRule('body { color: red; }', 'invalid');
			}).toThrow(
				new window.DOMException(
					`Failed to execute 'insertRule' on 'CSSScopeRule': The index provided (NaN) is larger than the maximum index (0).`,
					DOMExceptionNameEnum.indexSizeError
				)
			);

			expect(() => {
				cssRule.insertRule('body { color: red; }', 1);
			}).toThrow(
				new window.DOMException(
					`Failed to execute 'insertRule' on 'CSSScopeRule': The index provided (1) is larger than the maximum index (0).`,
					DOMExceptionNameEnum.indexSizeError
				)
			);
		});
	});

	describe('deleteRule()', () => {
		it('Deletes rule', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.insertRule('body { color: red; }');
			cssRule.insertRule('.test { color: blue; }');
			cssRule.deleteRule(0);
			expect(cssRule.cssRules.length).toBe(1);
			expect(cssRule.cssRules[0]).toBeInstanceOf(CSSStyleRule);
			expect(cssRule.cssRules[0].cssText).toBe('body { color: red; }');
		});

		it('Throws error when no arguments are provided', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);

			expect(() => {
				// @ts-expect-error
				cssRule.deleteRule();
			}).toThrow(
				new TypeError(
					`Failed to execute 'deleteRule' on 'CSSScopeRule': 1 argument required, but only 0 present.`
				)
			);
		});

		it('Throws error for an invalid index', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(() => {
				// @ts-expect-error
				cssRule.deleteRule('invalid');
			}).toThrow(
				new window.DOMException(
					`Failed to execute 'deleteRule' on 'CSSScopeRule': the index (NaN) is greater than the length of the rule list.`,
					DOMExceptionNameEnum.indexSizeError
				)
			);

			expect(() => {
				cssRule.deleteRule(1);
			}).toThrow(
				new window.DOMException(
					`Failed to execute 'deleteRule' on 'CSSScopeRule': the index (1) is greater than the length of the rule list.`,
					DOMExceptionNameEnum.indexSizeError
				)
			);
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSScopeRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule.insertRule('body { color: red; }');
			cssRule.insertRule('.test { color: blue; }');
			expect(cssRule.cssText).toBe('@scope {\n  .test { color: blue; }\n  body { color: red; }\n}');
		});
	});
});
