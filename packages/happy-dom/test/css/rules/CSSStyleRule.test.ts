import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser.js';
import type CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
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

	describe('set selectorText()', () => {
		it('Sets selector text', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.selectorText] = 'div';
			cssRule.style.setProperty('color', 'red');

			expect(cssRule.selectorText).toBe('div');
			expect(cssRule.cssText).toBe('div { color: red; }');

			cssRule.selectorText = '.scoped div';

			expect(cssRule.selectorText).toBe('.scoped div');
			expect(cssRule.cssText).toBe('.scoped div { color: red; }');
		});

		it('Allows scoping selectors via CSSOM as described in issue #1913', () => {
			const document = window.document;
			const styleElement = document.createElement('style');
			styleElement.textContent = `
				#document h1, #document h2 {
					background: red;
				}
				h3 {
					color: white;
				}
			`;
			document.body.appendChild(styleElement);

			const sheet = styleElement.sheet;
			expect(sheet).toBeTruthy();
			expect(sheet!.cssRules.length).toBe(2);

			const rule1 = <CSSStyleRule>sheet!.cssRules[0];
			const rule2 = <CSSStyleRule>sheet!.cssRules[1];

			// Scope the selectors
			rule1.selectorText = rule1.selectorText
				.split(',')
				.map((selector) => `.scope ${selector.trim()}`)
				.join(', ');

			rule2.selectorText = `.scope ${rule2.selectorText}`;

			expect(rule1.selectorText).toBe('.scope #document h1, .scope #document h2');
			expect(rule2.selectorText).toBe('.scope h3');
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
