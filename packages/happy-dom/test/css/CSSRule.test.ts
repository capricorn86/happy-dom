import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import CSSParser from '../../src/css/utilities/CSSParser.js';
import CSSStyleSheet from '../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../src/css/CSSRuleTypeEnum.js';
import CSSStyleRule from '../../src/css/rules/CSSStyleRule.js';
import CSSRule from '../../src/css/CSSRule.js';

describe('CSSRule', () => {
	let window: BrowserWindow;
	let styleSheet: CSSStyleSheet;
	let cssParser: CSSParser;

	beforeEach(() => {
		window = new Window();
		styleSheet = new window.CSSStyleSheet();
		cssParser = new CSSParser(styleSheet);
	});

	for (const property of [
		['CONTAINER_RULE', CSSRuleTypeEnum.containerRule],
		['STYLE_RULE', CSSRuleTypeEnum.styleRule],
		['IMPORT_RULE', CSSRuleTypeEnum.importRule],
		['MEDIA_RULE', CSSRuleTypeEnum.mediaRule],
		['FONT_FACE_RULE', CSSRuleTypeEnum.fontFaceRule],
		['PAGE_RULE', CSSRuleTypeEnum.pageRule],
		['KEYFRAMES_RULE', CSSRuleTypeEnum.keyframesRule],
		['KEYFRAME_RULE', CSSRuleTypeEnum.keyframeRule],
		['NAMESPACE_RULE', CSSRuleTypeEnum.namespaceRule],
		['COUNTER_STYLE_RULE', CSSRuleTypeEnum.counterStyleRule],
		['SUPPORTS_RULE', CSSRuleTypeEnum.supportsRule],
		['DOCUMENT_RULE', CSSRuleTypeEnum.documentRule],
		['FONT_FEATURE_VALUES_RULE', CSSRuleTypeEnum.fontFeatureValuesRule],
		['REGION_STYLE_RULE', CSSRuleTypeEnum.regionStyleRule]
	]) {
		describe(`static get ${property}()`, () => {
			it(`Should have property ${property}`, () => {
				expect(CSSRule[property[0]]).toBe(property[1]);
			});
		});
	}

	describe('get parentRule()', () => {
		it('Returns parent rule', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.parentRule).toBe(null);
			const parentRule = <CSSRule>{};
			cssRule[PropertySymbol.parentRule] = parentRule;
			expect(cssRule.parentRule).toBe(parentRule);
		});
	});

	describe('get parentStyleSheet()', () => {
		it('Returns parent style sheet', () => {
			const cssRule = new CSSStyleRule(PropertySymbol.illegalConstructor, window, cssParser);
			expect(cssRule.parentStyleSheet).toBe(null);
			cssRule[PropertySymbol.parentStyleSheet] = styleSheet;
			expect(cssRule.parentStyleSheet).toBe(styleSheet);
		});
	});
});
