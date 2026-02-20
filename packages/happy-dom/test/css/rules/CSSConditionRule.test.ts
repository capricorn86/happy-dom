import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import type BrowserWindow from '../../../src/window/BrowserWindow.js';
import Window from '../../../src/window/Window.js';
import CSSParser from '../../../src/css/utilities/CSSParser';
import type CSSStyleSheet from '../../../src/css/CSSStyleSheet';
import CSSSupportsRule from '../../../src/css/rules/CSSSupportsRule';

describe('CSSConditionRule', () => {
	let window: BrowserWindow;
	let styleSheet: CSSStyleSheet;
	let cssParser: CSSParser;

	beforeEach(() => {
		window = new Window();
		styleSheet = new window.CSSStyleSheet();
		cssParser = new CSSParser(styleSheet);
	});

	describe('get conditionText()', () => {
		it('Returns condition text', () => {
			const cssRule = new CSSSupportsRule(PropertySymbol.illegalConstructor, window, cssParser);
			cssRule[PropertySymbol.conditionText] = 'screen and (min-width: 900px)';
			expect(cssRule.conditionText).toBe('screen and (min-width: 900px)');
		});
	});
});
