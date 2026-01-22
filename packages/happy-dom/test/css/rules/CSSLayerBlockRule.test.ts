import { describe, it, expect, beforeEach } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';
import Window from '../../../src/window/Window.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSLayerBlockRule from '../../../src/css/rules/CSSLayerBlockRule.js';

describe('CSSLayerBlockRule', () => {
	let styleSheet: CSSStyleSheet;

	beforeEach(() => {
		styleSheet = new new Window().CSSStyleSheet();
	});

	it('Parses named @layer block rule with nested rules', () => {
		styleSheet.insertRule('@layer utilities { .test { color: red; } }');

		const rule = <CSSLayerBlockRule>styleSheet.cssRules[0];
		expect(rule).toBeInstanceOf(CSSLayerBlockRule);
		expect(rule.type).toBe(CSSRuleTypeEnum.layerBlockRule);
		expect(rule.name).toBe('utilities');
		expect(rule.cssRules.length).toBe(1);
		expect(rule.cssText).toBe('@layer utilities {\n  .test { color: red; }\n}');
	});

	it('Parses anonymous @layer block rule', () => {
		styleSheet.insertRule('@layer { .test { color: red; } }');

		const rule = <CSSLayerBlockRule>styleSheet.cssRules[0];
		expect(rule.name).toBe('');
		expect(rule.cssText).toBe('@layer {\n  .test { color: red; }\n}');
	});

	it('Supports insertRule() for nested rules', () => {
		styleSheet.insertRule('@layer utilities {}');
		const rule = <CSSLayerBlockRule>styleSheet.cssRules[0];

		rule.insertRule('.foo { color: blue; }');
		expect(rule.cssRules.length).toBe(1);
	});
});
