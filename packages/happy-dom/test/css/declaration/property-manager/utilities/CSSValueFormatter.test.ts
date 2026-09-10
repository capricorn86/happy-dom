import { describe, it, expect } from 'vitest';
import CSSValueFormatter from '../../../../../src/css/declaration/property-manager/utilities/CSSValueFormatter.js';
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

describe('CSSValueFormatter', () => {
	describe('getColor()', () => {
		it('Selects named colors from Webref correctly.', () => {
			expect(NAMED_COLORS).toContain('red');
			expect(NAMED_COLORS).toContain('green');
			expect(NAMED_COLORS).toContain('blue');
		});

		for (const namedColor of NAMED_COLORS) {
			it(`Parses "${namedColor}" correctly.`, () => {
				const parsedColor = CSSValueFormatter.getColor(namedColor);
				expect(parsedColor).toStrictEqual(namedColor);
			});
		}

		it('Converts hexadecimal colors to rgb().', () => {
			expect(CSSValueFormatter.getColor('#000')).toBe('rgb(0, 0, 0)');
			expect(CSSValueFormatter.getColor('#abc')).toBe('rgb(170, 187, 204)');
			expect(CSSValueFormatter.getColor('#ffffff')).toBe('rgb(255, 255, 255)');
			expect(CSSValueFormatter.getColor('#ffa015')).toBe('rgb(255, 160, 21)');
			expect(CSSValueFormatter.getColor('#32a1ce')).toBe('rgb(50, 161, 206)');
		});

		it('Converts uppercase hexadecimal colors to rgb().', () => {
			expect(CSSValueFormatter.getColor('#ABCDEF')).toBe('rgb(171, 205, 239)');
		});

		it('Converts hexadecimal colors with an alpha channel to rgba().', () => {
			expect(CSSValueFormatter.getColor('#0000')).toBe('rgba(0, 0, 0, 0)');
			expect(CSSValueFormatter.getColor('#0f08')).toBe('rgba(0, 255, 0, 0.533)');
			expect(CSSValueFormatter.getColor('#abcd')).toBe('rgba(170, 187, 204, 0.867)');
			expect(CSSValueFormatter.getColor('#00000080')).toBe('rgba(0, 0, 0, 0.5)');
			expect(CSSValueFormatter.getColor('#12345678')).toBe('rgba(18, 52, 86, 0.47)');
		});

		it('Drops a fully opaque alpha channel and serializes as rgb().', () => {
			expect(CSSValueFormatter.getColor('#0f0f')).toBe('rgb(0, 255, 0)');
			expect(CSSValueFormatter.getColor('#000000ff')).toBe('rgb(0, 0, 0)');
		});

		it('Normalizes whitespace in rgb()/rgba()/hsl()/hsla() colors.', () => {
			expect(CSSValueFormatter.getColor('rgb(135,200,150)')).toBe('rgb(135, 200, 150)');
			expect(CSSValueFormatter.getColor('rgba(135,200,150,0.5)')).toBe('rgba(135, 200, 150, 0.5)');
			expect(CSSValueFormatter.getColor('hsla(240,100%,50%,0.8)')).toBe(
				'hsla(240, 100%, 50%, 0.8)'
			);
		});

		it('Returns null for invalid colors.', () => {
			expect(CSSValueFormatter.getColor('#12345')).toBe(null);
			expect(CSSValueFormatter.getColor('not-a-color')).toBe(null);
		});
	});

	describe('getGradient()', () => {
		it('Parses linear-gradient with rgba() colors', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%)');
		});

		it('Parses linear-gradient with hex colors', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(180deg, #00000000 0%, #000000b3 100%)'
			);
			expect(result).toBe('linear-gradient(180deg, #00000000 0%, #000000b3 100%)');
		});

		it('Parses linear-gradient with mixed color formats', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(to right, rgba(255, 0, 0, 0.5), #00ff00, hsla(240, 100%, 50%, 0.8))'
			);
			expect(result).toBe(
				'linear-gradient(to right, rgba(255, 0, 0, 0.5), #00ff00, hsla(240, 100%, 50%, 0.8))'
			);
		});

		it('Parses radial-gradient with rgba() colors', () => {
			const result = CSSValueFormatter.getGradient(
				'radial-gradient(circle, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))'
			);
			expect(result).toBe('radial-gradient(circle, rgba(255, 255, 255, 0), rgba(0, 0, 0, 1))');
		});

		it('Parses conic-gradient with rgba() colors', () => {
			const result = CSSValueFormatter.getGradient(
				'conic-gradient(from 45deg, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 1))'
			);
			expect(result).toBe('conic-gradient(from 45deg, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 1))');
		});

		it('Returns null for invalid gradients', () => {
			expect(CSSValueFormatter.getGradient('not-a-gradient')).toBe(null);
			expect(CSSValueFormatter.getGradient('linear-gradient(')).toBe(null);
		});

		it('Normalizes whitespace in gradient arguments', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(0deg,rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%)'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)');
		});

		it('Parses repeating-linear-gradient with rgba() colors', () => {
			const result = CSSValueFormatter.getGradient(
				'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.5) 0px, rgba(255, 255, 255, 0.5) 10px)'
			);
			expect(result).toBe(
				'repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.5) 0px, rgba(255, 255, 255, 0.5) 10px)'
			);
		});

		it('Parses repeating-radial-gradient with rgba() colors', () => {
			const result = CSSValueFormatter.getGradient(
				'repeating-radial-gradient(circle, rgba(255, 0, 0, 0.3), rgba(0, 0, 255, 0.3) 20px)'
			);
			expect(result).toBe(
				'repeating-radial-gradient(circle, rgba(255, 0, 0, 0.3), rgba(0, 0, 255, 0.3) 20px)'
			);
		});

		it('Parses repeating-conic-gradient with rgba() colors', () => {
			const result = CSSValueFormatter.getGradient(
				'repeating-conic-gradient(from 0deg, rgba(255, 0, 0, 0.5) 0deg, rgba(0, 0, 255, 0.5) 30deg)'
			);
			expect(result).toBe(
				'repeating-conic-gradient(from 0deg, rgba(255, 0, 0, 0.5) 0deg, rgba(0, 0, 255, 0.5) 30deg)'
			);
		});

		it('Parses gradient with rgb() (no alpha)', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(to bottom, rgb(255, 0, 0), rgb(0, 0, 255))'
			);
			expect(result).toBe('linear-gradient(to bottom, rgb(255, 0, 0), rgb(0, 0, 255))');
		});

		it('Parses gradient with hsl() and hsla()', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(90deg, hsl(0, 100%, 50%), hsla(240, 100%, 50%, 0.5))'
			);
			expect(result).toBe('linear-gradient(90deg, hsl(0, 100%, 50%), hsla(240, 100%, 50%, 0.5))');
		});

		it('Parses gradient with many color stops', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(to right, rgba(255, 0, 0, 1) 0%, rgba(255, 255, 0, 1) 25%, rgba(0, 255, 0, 1) 50%, rgba(0, 255, 255, 1) 75%, rgba(0, 0, 255, 1) 100%)'
			);
			expect(result).toBe(
				'linear-gradient(to right, rgba(255, 0, 0, 1) 0%, rgba(255, 255, 0, 1) 25%, rgba(0, 255, 0, 1) 50%, rgba(0, 255, 255, 1) 75%, rgba(0, 0, 255, 1) 100%)'
			);
		});

		it('Parses gradient with negative and decimal values in rgba()', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(0deg, rgba(0, 0, 0, 0.123), rgba(255, 128, 64, 0.999))'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0, 0, 0, 0.123), rgba(255, 128, 64, 0.999))');
		});

		it('Handles excessive whitespace correctly', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(  to right  ,  rgba( 255 , 0 , 0 , 0.5 )  ,  rgba( 0 , 0 , 255 , 1 )  )'
			);
			expect(result).toBe(
				'linear-gradient(to right, rgba( 255 , 0 , 0 , 0.5 ), rgba( 0 , 0 , 255 , 1 ))'
			);
		});

		it('Returns null for unbalanced parentheses', () => {
			// Missing closing parenthesis for gradient
			expect(CSSValueFormatter.getGradient('linear-gradient(rgba(0,0,0,0), red')).toBe(null);
			// Missing closing parenthesis for rgba
			expect(CSSValueFormatter.getGradient('linear-gradient(rgba(0,0,0,0, red)')).toBe(null);
			// Extra closing parenthesis
			expect(CSSValueFormatter.getGradient('linear-gradient(rgba(0,0,0,0), red))')).toBe(null);
		});

		it('Returns null for invalid gradient type', () => {
			expect(CSSValueFormatter.getGradient('invalid-gradient(rgba(0,0,0,0), red)')).toBe(null);
		});

		it('Parses gradient with nested calc() inside rgba()', () => {
			const result = CSSValueFormatter.getGradient(
				'linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))'
			);
			expect(result).toBe('linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))');
		});
	});
});
