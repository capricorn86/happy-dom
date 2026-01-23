import CSS from '../../src/css/CSS.js';
import CSSUnits from '../../src/css/CSSUnits.js';
import CSSUnitValue from '../../src/css/CSSUnitValue.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('CSS', () => {
	let css: CSS;

	beforeEach(() => {
		css = new CSS();
	});

	for (const property of CSSUnits) {
		describe(`${property}()`, () => {
			it('Returns an instance of CSSUnitValue.', () => {
				const cssUnitValue: CSSUnitValue = css[property](100);
				expect(cssUnitValue.unit).toBe(property);
				expect(cssUnitValue.value).toBe(100);
			});
		});
	}

	describe('supports()', () => {
		it('Always returns "true".', () => {
			expect(css.supports('condition')).toBe(true);
			expect(css.supports('property', 'value')).toBe(true);
		});
	});

	describe('escape()', () => {
		it('Escapes a value.', () => {
			expect(css.escape('.foo#bar')).toBe('\\.foo\\#bar');
			expect(css.escape('()[]{}')).toBe('\\(\\)\\[\\]\\{\\}');
			expect(css.escape('--a')).toBe('--a');
			expect(css.escape('0')).toBe('\\30 ');
			expect(css.escape('\0')).toBe('\ufffd');
		});
	});
});
