import CSSUnitValue from '../../src/css/CSSUnitValue.js';
import { describe, it, expect } from 'vitest';

describe('CSSUnitValue', () => {
	describe('constructor()', () => {
		it('Creates an instance of CSSUnitValue.', () => {
			const cssUnitValue = new CSSUnitValue(5, 'cm');
			expect(cssUnitValue.unit).toBe('cm');
			expect(cssUnitValue.value).toBe(5);
		});

		it('Throws exception when invalid unit.', () => {
			expect(() => new CSSUnitValue(5, 'invalid')).toThrowError(
				new TypeError('Invalid unit: invalid')
			);
		});
	});
});
