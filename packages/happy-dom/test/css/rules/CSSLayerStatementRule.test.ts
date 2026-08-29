import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import type CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSLayerStatementRule from '../../../src/css/rules/CSSLayerStatementRule.js';

describe('CSSLayerStatementRule', () => {
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
			const cssRule = new CSSLayerStatementRule(
				PropertySymbol.illegalConstructor,
				window,
				cssParser
			);
			expect(cssRule.type).toBe(0);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.containerRule);
		});
	});

	describe('get nameList()', () => {
		it('Returns name list', () => {
			const cssRule = new CSSLayerStatementRule(
				PropertySymbol.illegalConstructor,
				window,
				cssParser
			);
			expect(cssRule.nameList).toEqual([]);
			cssRule[PropertySymbol.nameList] = ['base', 'theme'];
			expect(cssRule.nameList).toEqual(['base', 'theme']);
		});

		it('Returns a frozen list', () => {
			const cssRule = new CSSLayerStatementRule(
				PropertySymbol.illegalConstructor,
				window,
				cssParser
			);
			cssRule[PropertySymbol.nameList] = ['base'];
			expect(Object.isFrozen(cssRule.nameList)).toBe(true);
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text', () => {
			const cssRule = new CSSLayerStatementRule(
				PropertySymbol.illegalConstructor,
				window,
				cssParser
			);
			cssRule[PropertySymbol.nameList] = ['base', 'theme'];
			expect(cssRule.cssText).toBe('@layer base, theme;');
		});
	});
});
