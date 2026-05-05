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

	describe('getGradient()', () => {
		it('Parses linear-gradient with rgba() colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)');
		});

		it('Parses linear-gradient with hex colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(180deg, #00000000 0%, #000000b3 100%)'
			);
			expect(result).toBe('linear-gradient(180deg, #00000000 0%, #000000b3 100%)');
		});

		it('Parses linear-gradient with mixed color formats', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(to right, rgba(255, 0, 0, 0.5), #00ff00, hsla(240, 100%, 50%, 0.8))'
			);
			expect(result).toBe(
				'linear-gradient(to right, rgba(255, 0, 0, 0.5), #00ff00, hsla(240, 100%, 50%, 0.8))'
			);
		});

		it('Parses radial-gradient with rgba() colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'radial-gradient(circle, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))'
			);
			expect(result).toBe('radial-gradient(circle, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))');
		});

		it('Parses conic-gradient with rgba() colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'conic-gradient(from 45deg, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 1))'
			);
			expect(result).toBe('conic-gradient(from 45deg, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 1))');
		});

		it('Returns null for invalid gradients', () => {
			expect(CSSStyleDeclarationValueParser.getGradient('not-a-gradient')).toBe(null);
			expect(CSSStyleDeclarationValueParser.getGradient('linear-gradient(')).toBe(null);
		});

		it('Normalizes whitespace in gradient arguments', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(0deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%)'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)');
		});

		it('Parses repeating-linear-gradient with rgba() colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.5) 0px, rgba(255, 255, 255, 0.5) 10px)'
			);
			expect(result).toBe(
				'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.5) 0px, rgba(255, 255, 255, 0.5) 10px)'
			);
		});

		it('Parses repeating-radial-gradient with rgba() colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'repeating-radial-gradient(circle, rgba(255, 0, 0, 0.3), rgba(0, 0, 255, 0.3) 20px)'
			);
			expect(result).toBe(
				'repeating-radial-gradient(circle, rgba(255, 0, 0, 0.3), rgba(0, 0, 255, 0.3) 20px)'
			);
		});

		it('Parses repeating-conic-gradient with rgba() colors', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'repeating-conic-gradient(from 0deg, rgba(255, 0, 0, 0.5) 0deg, rgba(0, 0, 255, 0.5) 30deg)'
			);
			expect(result).toBe(
				'repeating-conic-gradient(from 0deg, rgba(255, 0, 0, 0.5) 0deg, rgba(0, 0, 255, 0.5) 30deg)'
			);
		});

		it('Parses gradient with rgb() (no alpha)', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(to bottom, rgb(255, 0, 0), rgb(0, 0, 255))'
			);
			expect(result).toBe('linear-gradient(to bottom, rgb(255, 0, 0), rgb(0, 0, 255))');
		});

		it('Parses gradient with hsl() and hsla()', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(90deg, hsl(0, 100%, 50%), hsla(240, 100%, 50%, 0.5))'
			);
			expect(result).toBe('linear-gradient(90deg, hsl(0, 100%, 50%), hsla(240, 100%, 50%, 0.5))');
		});

		it('Parses gradient with many color stops', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(to right, rgba(255, 0, 0, 1) 0%, rgba(255, 255, 0, 1) 25%, rgba(0, 255, 0, 1) 50%, rgba(0, 255, 255, 1) 75%, rgba(0, 0, 255, 1) 100%)'
			);
			expect(result).toBe(
				'linear-gradient(to right, rgba(255, 0, 0, 1) 0%, rgba(255, 255, 0, 1) 25%, rgba(0, 255, 0, 1) 50%, rgba(0, 255, 255, 1) 75%, rgba(0, 0, 255, 1) 100%)'
			);
		});

		it('Parses gradient with negative and decimal values in rgba()', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(0deg, rgba(0, 0, 0, 0.123), rgba(255, 128, 64, 0.999))'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0, 0, 0, 0.123), rgba(255, 128, 64, 0.999))');
		});

		it('Handles excessive whitespace correctly', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(  to right  ,  rgba( 255 , 0 , 0 , 0.5 )  ,  rgba( 0 , 0 , 255 , 1 )  )'
			);
			expect(result).toBe(
				'linear-gradient(to right, rgba( 255 , 0 , 0 , 0.5 ), rgba( 0 , 0 , 255 , 1 ))'
			);
		});

		it('Returns null for unbalanced parentheses', () => {
			// Missing closing parenthesis for gradient
			expect(CSSStyleDeclarationValueParser.getGradient('linear-gradient(rgba(0,0,0,0), red')).toBe(
				null
			);
			// Missing closing parenthesis for rgba
			expect(CSSStyleDeclarationValueParser.getGradient('linear-gradient(rgba(0,0,0,0, red)')).toBe(
				null
			);
			// Extra closing parenthesis
			expect(
				CSSStyleDeclarationValueParser.getGradient('linear-gradient(rgba(0,0,0,0), red))')
			).toBe(null);
		});

		it('Returns null for invalid gradient type', () => {
			expect(
				CSSStyleDeclarationValueParser.getGradient('invalid-gradient(rgba(0,0,0,0), red)')
			).toBe(null);
		});

		it('Parses gradient with nested calc() inside rgba()', () => {
			const result = CSSStyleDeclarationValueParser.getGradient(
				'linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))');
		});
	});
});
