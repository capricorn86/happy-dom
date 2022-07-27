import CSSStyleDeclaration from '../../../src/css/declaration/CSSStyleDeclaration';
import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import IElement from '../../../src/nodes/element/IElement';
import CSSStyleDeclarationDefaultValues from '../../../src/css/computed-style/config/CSSStyleDeclarationDefaultValues';

function KEBAB_TO_CAMEL_CASE(text: string): string {
	const parts = text.split('-');
	for (let i = 0, max = parts.length; i < max; i++) {
		parts[i] = i > 0 ? parts[i].charAt(0).toUpperCase() + parts[i].slice(1) : parts[i];
	}
	return parts.join('');
}

describe('CSSStyleDeclaration', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	describe(`get {number}()`, () => {
		it('Returns name of property when style is set on element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			expect(declaration[0]).toBe('border');
			expect(declaration[1]).toBe('border-radius');
			expect(declaration[2]).toBe('font-size');
			expect(declaration[3]).toBe(undefined);
		});

		it('Returns name of property without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.border = '2px solid green';
			declaration.borderRadius = '2px';
			declaration.fontSize = '12px';

			expect(declaration[0]).toBe('border');
			expect(declaration[1]).toBe('border-radius');
			expect(declaration[2]).toBe('font-size');
			expect(declaration[3]).toBe(undefined);
		});
	});

	for (const property of Object.keys(CSSStyleDeclarationDefaultValues)) {
		const camelCaseProperty = KEBAB_TO_CAMEL_CASE(property);
		describe(`get ${camelCaseProperty}()`, () => {
			it('Returns style property on element.', () => {
				const declaration = new CSSStyleDeclaration(element);
				element.setAttribute(
					'style',
					`${property}: ${CSSStyleDeclarationDefaultValues[property]};`
				);
				expect(declaration[camelCaseProperty]).toBe(CSSStyleDeclarationDefaultValues[property]);
			});

			it('Returns style property without element.', () => {
				const declaration = new CSSStyleDeclaration();
				declaration[camelCaseProperty] = CSSStyleDeclarationDefaultValues[property];
				expect(declaration[camelCaseProperty]).toBe(CSSStyleDeclarationDefaultValues[property]);
			});
		});

		describe(`set ${camelCaseProperty}()`, () => {
			it('Sets style property on element.', () => {
				const declaration = new CSSStyleDeclaration(element);
				declaration[camelCaseProperty] = CSSStyleDeclarationDefaultValues[property];
				expect(element.getAttribute('style')).toBe(
					`${property}: ${CSSStyleDeclarationDefaultValues[property]};`
				);
			});

			it('Sets style property without element.', () => {
				const declaration = new CSSStyleDeclaration();
				declaration[camelCaseProperty] = CSSStyleDeclarationDefaultValues[property];
				expect(declaration[camelCaseProperty]).toBe(CSSStyleDeclarationDefaultValues[property]);
			});
		});
	}

	describe('get length()', () => {
		it('Returns length when of styles on element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			expect(declaration.length).toBe(3);
		});

		it('Returns length without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.border = '2px solid green';
			declaration.borderRadius = '2px';
			declaration.fontSize = '12px';

			expect(declaration.length).toBe(3);
		});
	});

	describe('get cssText()', () => {
		it('Returns CSS text when using element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute(
				'style',
				`border: 2px solid green;     border-radius:   2px;font-size:   12px;`
			);

			expect(declaration.cssText).toBe(
				'border: 2px solid green; border-radius: 2px; font-size: 12px;'
			);
		});

		it('Returns CSS without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.border = '2px solid green';
			declaration.borderRadius = '2px';
			declaration.fontSize = '12px';

			expect(declaration.cssText).toBe(
				'border: 2px solid green; border-radius: 2px; font-size: 12px;'
			);
		});
	});

	describe('set cssText()', () => {
		it('Sets CSS text when using element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			declaration.cssText = 'border: 2px solid green;     border-radius:   2px;font-size:   12px;';

			expect(element.getAttribute('style')).toBe(
				'border: 2px solid green; border-radius: 2px; font-size: 12px;'
			);
		});

		it('Sets CSS text without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.cssText = 'border: 2px solid green;     border-radius:   2px;font-size:   12px;';

			expect(declaration.border).toBe('2px solid green');
			expect(declaration.borderRadius).toBe('2px');
			expect(declaration.fontSize).toBe('12px');
		});

		it('Removes style property on element if empty value is sent.', () => {
			const declaration = new CSSStyleDeclaration(element);

			declaration.cssText = '';

			expect(element.getAttribute('style')).toBe(null);
		});
	});

	describe('item()', () => {
		it('Returns an item by index when using element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			expect(declaration.item(0)).toBe('border');
			expect(declaration.item(1)).toBe('border-radius');
			expect(declaration.item(2)).toBe('font-size');
			expect(declaration.item(3)).toBe('');
		});

		it('Returns an item by index without element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			declaration.cssText = 'border: 2px solid green;border-radius: 2px;font-size: 12px;';

			expect(declaration.item(0)).toBe('border');
			expect(declaration.item(1)).toBe('border-radius');
			expect(declaration.item(2)).toBe('font-size');
			expect(declaration.item(3)).toBe('');
		});
	});

	describe('setProperty()', () => {
		it('Sets a CSS property when using element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			declaration.setProperty('background-color', 'green');
			declaration.setProperty('border-radius', '4px', 'important');

			expect(element.getAttribute('style')).toBe(
				'border: 2px solid green; border-radius: 4px !important; font-size: 12px; background-color: green;'
			);
		});

		it('Sets a CSS property without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.cssText = `border: 2px solid green;border-radius: 2px;font-size: 12px;`;
			declaration.setProperty('background-color', 'green');

			expect(declaration.cssText).toBe(
				'border: 2px solid green; border-radius: 2px; font-size: 12px; background-color: green;'
			);
		});

		it('Removes style attribute on element if empty value is sent', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;`);

			declaration.setProperty('border', '');

			expect(element.getAttribute('style')).toBe(null);
		});
	});

	describe('removeProperty()', () => {
		it('Removes a CSS property when using element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);
			declaration.removeProperty('border-radius');

			expect(element.getAttribute('style')).toBe('border: 2px solid green; font-size: 12px;');
		});

		it('Removes a CSS property without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.cssText = `border: 2px solid green;border-radius: 2px;font-size: 12px;`;
			declaration.removeProperty('border-radius');

			expect(declaration.cssText).toBe('border: 2px solid green; font-size: 12px;');
		});

		it('Removes style attribute on element if there are no CSS properties left.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;`);

			declaration.removeProperty('border');
			declaration.removeProperty('border-radius');

			expect(element.getAttribute('style')).toBe(null);
		});
	});

	describe('getPropertyValue()', () => {
		it('Returns a CSS property value when using element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			expect(declaration.getPropertyValue('border')).toBe('2px solid green');
			expect(declaration.getPropertyValue('border-radius')).toBe('2px');
			expect(declaration.getPropertyValue('font-size')).toBe('12px');
			expect(declaration.getPropertyValue('background')).toBe('');
		});

		it('Returns a CSS property without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.cssText = `border: 2px solid green;border-radius: 2px;font-size: 12px;`;

			expect(declaration.getPropertyValue('border')).toBe('2px solid green');
			expect(declaration.getPropertyValue('border-radius')).toBe('2px');
			expect(declaration.getPropertyValue('font-size')).toBe('12px');
			expect(declaration.getPropertyValue('background')).toBe('');
		});
	});
});
