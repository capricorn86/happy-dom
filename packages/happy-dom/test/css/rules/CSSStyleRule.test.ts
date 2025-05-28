import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSStyleRule from '../../../src/css/rules/CSSStyleRule.js';

describe('CSSStyleRule', () => {
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
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.type).toBe(1);
			expect(cssRule.type).toBe(CSSRuleTypeEnum.styleRule);
		});
	});

	describe('get styleMap()', () => {
		it('Returns style map', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.styleMap).toBe(cssRule.styleMap);

			cssRule[PropertySymbol.selectorText] = 'div';
			cssRule.styleMap.set('color', 'red');
			cssRule.styleMap.set('border', '1px solid black');
			cssRule.styleMap.set('border-top', '2px solid red');

			expect(cssRule.cssText).toBe(
				'div { color: red; border-width: 2px 1px 1px; border-style: solid; border-color: red black black; border-image: initial; }'
			);
		});
	});

	describe('get selectorText()', () => {
		it('Returns selector text', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.selectorText).toBe('');

			cssRule[PropertySymbol.selectorText] = 'div';

			expect(cssRule.selectorText).toBe('div');
		});
	});

	describe('get cssText()', () => {
		it('Returns css text', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.cssText).toBe(' {  }');

			cssRule[PropertySymbol.selectorText] = '.selectorText';
			cssRule.styleMap.set('color', 'red');
			cssRule.styleMap.set('border', '1px solid black');

			expect(cssRule.cssText).toBe('.selectorText { color: red; border: 1px solid black; }');
		});
	});

	describe('get style()', () => {
		it('Returns style', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);

			cssRule.style.setProperty('color', 'red');
			cssRule.style.setProperty('border', '1px solid black');

			expect(cssRule.style.cssText).toBe('color: red; border: 1px solid black;');
		});
	});
});
