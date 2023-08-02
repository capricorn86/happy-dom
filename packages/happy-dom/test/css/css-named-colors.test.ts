import { test, expect } from 'vitest';
import parser from '../../src/css/declaration/property-manager/CSSStyleDeclarationValueParser';
import { values } from '@webref/css/css-color.json';

function isString(value: string | undefined): value is string {
	return typeof value === 'string';
}

const namedColorsFromWebref = values
	.filter((value) => value.name === '<color>')
	.flatMap((value) => value.values)
	.map((color) => color?.name)
	.filter(isString);

test('named colors from webref are correctly selected', () => {
	expect(namedColorsFromWebref).toContain('red');
	expect(namedColorsFromWebref).toContain('green');
	expect(namedColorsFromWebref).toContain('blue');
});

test.each(namedColorsFromWebref)('"%s" css named color must be defined', (expectedNamedColor) => {
	const parsedColor = parser.getColor(expectedNamedColor);
	expect(parsedColor).toStrictEqual(expectedNamedColor);
});
