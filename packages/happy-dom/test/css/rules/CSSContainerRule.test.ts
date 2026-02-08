import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import type CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSContainerRule from '../../../src/css/rules/CSSContainerRule.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';

describe('CSSContainerRule', () => {
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
			const cssRule = new CSSContainerRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(0);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.containerRule);
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSContainerRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.conditionText] = '(min-width: 900px)';
			expect(cssRule.cssText).toBe('@container (min-width: 900px) {\n}');
			cssRule.insertRule('body { color: red; }');
			cssRule.insertRule('.test { color: blue; }');
			expect(cssRule.cssText).toBe(
				'@container (min-width: 900px) {\n  .test { color: blue; }\n  body { color: red; }\n}'
			);
		});
	});
});
