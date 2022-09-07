import CSSStyleDeclaration from '../../../src/css/declaration/CSSStyleDeclaration';
import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import IElement from '../../../src/nodes/element/IElement';

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

			expect(declaration[0]).toBe('border-top-width');
			expect(declaration[1]).toBe('border-right-width');
			expect(declaration[2]).toBe('border-bottom-width');
			expect(declaration[3]).toBe('border-left-width');
			expect(declaration[4]).toBe('border-top-style');
			expect(declaration[5]).toBe('border-right-style');
			expect(declaration[6]).toBe('border-bottom-style');
			expect(declaration[7]).toBe('border-left-style');
			expect(declaration[8]).toBe('border-top-color');
			expect(declaration[9]).toBe('border-right-color');
			expect(declaration[10]).toBe('border-bottom-color');
			expect(declaration[11]).toBe('border-left-color');
			expect(declaration[12]).toBe('border-image-source');
			expect(declaration[13]).toBe('border-image-slice');
			expect(declaration[14]).toBe('border-image-width');
			expect(declaration[15]).toBe('border-image-outset');
			expect(declaration[16]).toBe('border-image-repeat');
			expect(declaration[17]).toBe('border-top-left-radius');
			expect(declaration[18]).toBe('border-top-right-radius');
			expect(declaration[19]).toBe('border-bottom-right-radius');
			expect(declaration[20]).toBe('border-bottom-left-radius');
			expect(declaration[21]).toBe('font-size');
			expect(declaration[22]).toBe(undefined);
		});

		it('Returns name of property without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.border = '2px solid green';
			declaration.borderRadius = '2px';
			declaration.fontSize = '12px';

			expect(declaration[0]).toBe('border-top-width');
			expect(declaration[1]).toBe('border-right-width');
			expect(declaration[2]).toBe('border-bottom-width');
			expect(declaration[3]).toBe('border-left-width');
			expect(declaration[4]).toBe('border-top-style');
			expect(declaration[5]).toBe('border-right-style');
			expect(declaration[6]).toBe('border-bottom-style');
			expect(declaration[7]).toBe('border-left-style');
			expect(declaration[8]).toBe('border-top-color');
			expect(declaration[9]).toBe('border-right-color');
			expect(declaration[10]).toBe('border-bottom-color');
			expect(declaration[11]).toBe('border-left-color');
			expect(declaration[12]).toBe('border-image-source');
			expect(declaration[13]).toBe('border-image-slice');
			expect(declaration[14]).toBe('border-image-width');
			expect(declaration[15]).toBe('border-image-outset');
			expect(declaration[16]).toBe('border-image-repeat');
			expect(declaration[17]).toBe('border-top-left-radius');
			expect(declaration[18]).toBe('border-top-right-radius');
			expect(declaration[19]).toBe('border-bottom-right-radius');
			expect(declaration[20]).toBe('border-bottom-left-radius');
			expect(declaration[21]).toBe('font-size');
			expect(declaration[22]).toBe(undefined);
		});
	});

	describe('get border()', () => {
		it('Returns style property on element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border: 2px solid green');

			expect(declaration.border).toBe('2px solid green');

			expect(declaration.borderTop).toBe('2px solid green');
			expect(declaration.borderRight).toBe('2px solid green');
			expect(declaration.borderBottom).toBe('2px solid green');
			expect(declaration.borderLeft).toBe('2px solid green');

			expect(declaration.borderTopColor).toBe('green');
			expect(declaration.borderTopWidth).toBe('2px');
			expect(declaration.borderTopStyle).toBe('solid');

			expect(declaration.borderRightColor).toBe('green');
			expect(declaration.borderRightWidth).toBe('2px');
			expect(declaration.borderRightStyle).toBe('solid');

			expect(declaration.borderBottomColor).toBe('green');
			expect(declaration.borderBottomWidth).toBe('2px');
			expect(declaration.borderBottomStyle).toBe('solid');

			expect(declaration.borderLeftColor).toBe('green');
			expect(declaration.borderLeftWidth).toBe('2px');
			expect(declaration.borderLeftStyle).toBe('solid');

			declaration.borderRight = '1px dotted red';

			expect(element.getAttribute('style')).toBe(
				'border-width: 2px 1px 2px 2px; border-style: solid dotted solid solid; border-color: green red green green; border-image: initial;'
			);

			declaration.borderRight = '2px solid green';

			expect(declaration.border).toBe('2px solid green');

			declaration.borderColor = 'red';
			declaration.borderStyle = 'dotted';
			declaration.borderWidth = '1px';

			expect(declaration.border).toBe('1px dotted red');
		});
	});

	describe('get length()', () => {
		it('Returns length when of styles on element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			expect(declaration.length).toBe(22);
		});

		it('Returns length without element.', () => {
			const declaration = new CSSStyleDeclaration();

			declaration.border = '2px solid green';
			declaration.borderRadius = '2px';
			declaration.fontSize = '12px';

			expect(declaration.length).toBe(22);
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

			expect(declaration.item(0)).toBe('border-top-width');
			expect(declaration.item(1)).toBe('border-right-width');
			expect(declaration.item(2)).toBe('border-bottom-width');
			expect(declaration.item(3)).toBe('border-left-width');
			expect(declaration.item(4)).toBe('border-top-style');
			expect(declaration.item(5)).toBe('border-right-style');
			expect(declaration.item(6)).toBe('border-bottom-style');
			expect(declaration.item(7)).toBe('border-left-style');
			expect(declaration.item(8)).toBe('border-top-color');
			expect(declaration.item(9)).toBe('border-right-color');
			expect(declaration.item(10)).toBe('border-bottom-color');
			expect(declaration.item(11)).toBe('border-left-color');
			expect(declaration.item(12)).toBe('border-image-source');
			expect(declaration.item(13)).toBe('border-image-slice');
			expect(declaration.item(14)).toBe('border-image-width');
			expect(declaration.item(15)).toBe('border-image-outset');
			expect(declaration.item(16)).toBe('border-image-repeat');
			expect(declaration.item(17)).toBe('border-top-left-radius');
			expect(declaration.item(18)).toBe('border-top-right-radius');
			expect(declaration.item(19)).toBe('border-bottom-right-radius');
			expect(declaration.item(20)).toBe('border-bottom-left-radius');
			expect(declaration.item(21)).toBe('font-size');
			expect(declaration.item(22)).toBe('');
		});

		it('Returns an item by index without element.', () => {
			const declaration = new CSSStyleDeclaration(element);

			declaration.cssText = 'border: 2px solid green;border-radius: 2px;font-size: 12px;';

			expect(declaration.item(0)).toBe('border-top-width');
			expect(declaration.item(1)).toBe('border-right-width');
			expect(declaration.item(2)).toBe('border-bottom-width');
			expect(declaration.item(3)).toBe('border-left-width');
			expect(declaration.item(4)).toBe('border-top-style');
			expect(declaration.item(5)).toBe('border-right-style');
			expect(declaration.item(6)).toBe('border-bottom-style');
			expect(declaration.item(7)).toBe('border-left-style');
			expect(declaration.item(8)).toBe('border-top-color');
			expect(declaration.item(9)).toBe('border-right-color');
			expect(declaration.item(10)).toBe('border-bottom-color');
			expect(declaration.item(11)).toBe('border-left-color');
			expect(declaration.item(12)).toBe('border-image-source');
			expect(declaration.item(13)).toBe('border-image-slice');
			expect(declaration.item(14)).toBe('border-image-width');
			expect(declaration.item(15)).toBe('border-image-outset');
			expect(declaration.item(16)).toBe('border-image-repeat');
			expect(declaration.item(17)).toBe('border-top-left-radius');
			expect(declaration.item(18)).toBe('border-top-right-radius');
			expect(declaration.item(19)).toBe('border-bottom-right-radius');
			expect(declaration.item(20)).toBe('border-bottom-left-radius');
			expect(declaration.item(21)).toBe('font-size');
			expect(declaration.item(22)).toBe('');
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
