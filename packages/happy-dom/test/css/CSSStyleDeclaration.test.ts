import CSSStyleDeclaration from '../../src/css/CSSStyleDeclaration';
import CSSStyleDeclarationStyleProperties from './data/CSSStyleDeclarationStyleProperties';
import Attr from '../../src/attribute/Attr';

function CAMEL_TO_KEBAB_CASE(string): string {
	return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

describe('CSSStyleDeclaration', () => {
	let attributes: { [k: string]: Attr } = null;
	let cssStyleDeclaration: CSSStyleDeclaration = null;

	beforeEach(() => {
		attributes = { style: new Attr() };
		cssStyleDeclaration = new CSSStyleDeclaration(attributes);
	});

	for (const property of CSSStyleDeclarationStyleProperties) {
		describe(`get ${property}()`, () => {
			it('Returns style property.', () => {
				attributes.style.value = `${CAMEL_TO_KEBAB_CASE(property)}: test;`;
				expect(cssStyleDeclaration[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets style property.', () => {
				cssStyleDeclaration[property] = 'test';
				expect(attributes.style.value).toBe(`${CAMEL_TO_KEBAB_CASE(property)}: test;`);
			});
		});
	}

	describe('item()', () => {
		it('Returns an item by index.', () => {
			cssStyleDeclaration.setProperty('background-color', 'green');
			expect(cssStyleDeclaration.item(0)).toBe('background-color');
		});
	});

	describe('setProperty()', () => {
		it('Sets a style property.', () => {
			cssStyleDeclaration.setProperty('background-color', 'green');
			expect(attributes.style.value).toBe('background-color: green;');
			expect(cssStyleDeclaration.backgroundColor).toBe('green');
			expect(cssStyleDeclaration.length).toBe(1);
			expect(cssStyleDeclaration[0]).toBe('background-color');
		});
	});

	describe('removeProperty()', () => {
		it('Removes a style property.', () => {
			cssStyleDeclaration.setProperty('background-color', 'green');
			cssStyleDeclaration.removeProperty('background-color');
			expect(attributes.style).toBe(undefined);
			expect(cssStyleDeclaration.backgroundColor).toBe('');
			expect(cssStyleDeclaration.length).toBe(0);
		});
	});

	describe('getPropertyValue()', () => {
		it('Returns a style property.', () => {
			cssStyleDeclaration.setProperty('background-color', 'green');
			expect(cssStyleDeclaration.getPropertyValue('background-color')).toBe('green');
		});
	});
});
