import { describe, it, expect, beforeEach } from 'vitest';
import Window from '../../../src/window/Window.js';
import CSSStyleSheet from '../../../src/css/CSSStyleSheet.js';
import CSSRuleTypeEnum from '../../../src/css/CSSRuleTypeEnum.js';
import CSSLayerStatementRule from '../../../src/css/rules/CSSLayerStatementRule.js';

describe('CSSLayerStatementRule', () => {
	let styleSheet: CSSStyleSheet;

	beforeEach(() => {
		styleSheet = new new Window().CSSStyleSheet();
	});

	it('Parses @layer statement with multiple layers', () => {
		styleSheet.insertRule('@layer theme, utilities, components;');

		const rule = <CSSLayerStatementRule>styleSheet.cssRules[0];
		expect(rule).toBeInstanceOf(CSSLayerStatementRule);
		expect(rule.type).toBe(CSSRuleTypeEnum.layerStatementRule);
		expect(rule.nameList).toEqual(['theme', 'utilities', 'components']);
		expect(rule.cssText).toBe('@layer theme, utilities, components;');
	});

	it('Parses @layer statement with single layer', () => {
		styleSheet.insertRule('@layer base;');

		const rule = <CSSLayerStatementRule>styleSheet.cssRules[0];
		expect(rule.nameList).toEqual(['base']);
		expect(rule.cssText).toBe('@layer base;');
	});
});
