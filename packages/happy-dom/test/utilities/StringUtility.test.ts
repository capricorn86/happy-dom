import { describe, it, expect, vi } from 'vitest';
import StringUtility from '../../src/utilities/StringUtility';

describe('StringUtility', () => {
	describe('asciiLowerCase()', () => {
		it('converts uppercase ASCII characters to lowercase.', () => {
			expect(StringUtility.asciiLowerCase('HELLO')).toBe('hello');
		});

		it('returns the same string if it is already lowercase.', () => {
			expect(StringUtility.asciiLowerCase('hello')).toBe('hello');
		});

		it('converts mixed case ASCII characters to lowercase.', () => {
			expect(StringUtility.asciiLowerCase('HeLlO')).toBe('hello');
		});

		it('leaves non-ASCII characters unchanged.', () => {
			expect(StringUtility.asciiLowerCase('HéLLÖ')).toBe('héllÖ');
		});

		it('handles empty strings.', () => {
			expect(StringUtility.asciiLowerCase('')).toBe('');
		});

		it('leaves numbers and symbols unchanged.', () => {
			expect(StringUtility.asciiLowerCase('H3LL0!@#')).toBe('h3ll0!@#');
		});
	});

	describe('asciiUpperCase()', () => {
		it('converts lowercase ASCII characters to uppercase.', () => {
			expect(StringUtility.asciiUpperCase('hello')).toBe('HELLO');
		});

		it('returns the same string if it is already uppercase.', () => {
			expect(StringUtility.asciiUpperCase('HELLO')).toBe('HELLO');
		});

		it('converts mixed case ASCII characters to uppercase.', () => {
			expect(StringUtility.asciiUpperCase('HeLlO')).toBe('HELLO');
		});

		it('leaves non-ASCII characters unchanged.', () => {
			expect(StringUtility.asciiUpperCase('hélLö')).toBe('HéLLö');
		});

		it('handles empty strings.', () => {
			expect(StringUtility.asciiUpperCase('')).toBe('');
		});

		it('leaves numbers and symbols unchanged.', () => {
			expect(StringUtility.asciiUpperCase('h3ll0!@#')).toBe('H3LL0!@#');
		});
	});
});
