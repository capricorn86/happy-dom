import { describe, it, expect } from 'vitest';
import CSSStyleDeclarationValueParser from '../../../src/css/declaration/property-manager/CSSStyleDeclarationValueParser.js';
import CSSColor from '@webref/css/css-color.json';

const NAMED_COLORS: string[] = [];

for (const value of CSSColor.values) {
	if (value.name === '<color>' && value.values) {
		for (const color of value.values) {
			if (typeof color?.name === 'string') {
				NAMED_COLORS.push(color.name);
			}
		}
		break;
	}
}

describe('CSSStyleDeclarationValueParser', () => {
	describe('getColor()', () => {
		it('Selects named colors from Webref correctly.', () => {
			expect(NAMED_COLORS).toContain('red');
			expect(NAMED_COLORS).toContain('green');
			expect(NAMED_COLORS).toContain('blue');
		});

		for (const namedColor of NAMED_COLORS) {
			it(`Parses "${namedColor}" correctly.`, () => {
				const parsedColor = CSSStyleDeclarationValueParser.getColor(namedColor);
				expect(parsedColor).toStrictEqual(namedColor);
			});
		}
	});
});
