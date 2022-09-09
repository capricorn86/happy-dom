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
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border: inherit');

			expect(declaration.border).toBe('inherit');
			expect(declaration.borderTop).toBe('inherit');
			expect(declaration.borderRight).toBe('inherit');
			expect(declaration.borderBottom).toBe('inherit');
			expect(declaration.borderLeft).toBe('inherit');
			expect(declaration.borderTopColor).toBe('inherit');
			expect(declaration.borderRightColor).toBe('inherit');
			expect(declaration.borderBottomColor).toBe('inherit');
			expect(declaration.borderLeftColor).toBe('inherit');
			expect(declaration.borderTopWidth).toBe('inherit');
			expect(declaration.borderRightWidth).toBe('inherit');
			expect(declaration.borderBottomWidth).toBe('inherit');
			expect(declaration.borderLeftWidth).toBe('inherit');
			expect(declaration.borderTopStyle).toBe('inherit');
			expect(declaration.borderRightStyle).toBe('inherit');
			expect(declaration.borderBottomStyle).toBe('inherit');
			expect(declaration.borderLeftStyle).toBe('inherit');
			expect(declaration.borderImage).toBe('inherit');
			expect(declaration.borderImageOutset).toBe('inherit');
			expect(declaration.borderImageRepeat).toBe('inherit');
			expect(declaration.borderImageSlice).toBe('inherit');
			expect(declaration.borderImageSource).toBe('inherit');
			expect(declaration.borderImageWidth).toBe('inherit');

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

			expect(declaration.borderImage).toBe('initial');
			expect(declaration.borderImageOutset).toBe('initial');
			expect(declaration.borderImageRepeat).toBe('initial');
			expect(declaration.borderImageSlice).toBe('initial');
			expect(declaration.borderImageSource).toBe('initial');
			expect(declaration.borderImageWidth).toBe('initial');

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

			element.setAttribute('style', 'border: green solid');

			expect(declaration.border).toBe('solid green');
		});
	});

	describe('get borderTop()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-top: inherit');

			expect(declaration.borderTop).toBe('inherit');
			expect(declaration.borderTopColor).toBe('inherit');
			expect(declaration.borderTopWidth).toBe('inherit');
			expect(declaration.borderTopStyle).toBe('inherit');

			element.setAttribute('style', 'border-top: green 2px solid');

			expect(declaration.border).toBe('');

			expect(declaration.borderTop).toBe('2px solid green');
			expect(declaration.borderRight).toBe('');
			expect(declaration.borderBottom).toBe('');
			expect(declaration.borderLeft).toBe('');
			expect(declaration.borderTopColor).toBe('green');
			expect(declaration.borderTopWidth).toBe('2px');
			expect(declaration.borderTopStyle).toBe('solid');
			expect(declaration.borderImage).toBe('');
		});
	});

	describe('get borderRight()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-right: inherit');

			expect(declaration.borderRight).toBe('inherit');
			expect(declaration.borderRightColor).toBe('inherit');
			expect(declaration.borderRightWidth).toBe('inherit');
			expect(declaration.borderRightStyle).toBe('inherit');

			element.setAttribute('style', 'border-right: green solid 2px');

			expect(declaration.border).toBe('');

			expect(declaration.borderTop).toBe('');
			expect(declaration.borderRight).toBe('2px solid green');
			expect(declaration.borderBottom).toBe('');
			expect(declaration.borderLeft).toBe('');
			expect(declaration.borderRightColor).toBe('green');
			expect(declaration.borderRightWidth).toBe('2px');
			expect(declaration.borderRightStyle).toBe('solid');
			expect(declaration.borderImage).toBe('');
		});
	});

	describe('get borderBottom()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-bottom: inherit');

			expect(declaration.borderBottom).toBe('inherit');
			expect(declaration.borderBottomColor).toBe('inherit');
			expect(declaration.borderBottomWidth).toBe('inherit');
			expect(declaration.borderBottomStyle).toBe('inherit');

			element.setAttribute('style', 'border-bottom: green solid 2px');

			expect(declaration.border).toBe('');

			expect(declaration.borderTop).toBe('');
			expect(declaration.borderRight).toBe('');
			expect(declaration.borderBottom).toBe('2px solid green');
			expect(declaration.borderLeft).toBe('');
			expect(declaration.borderBottomColor).toBe('green');
			expect(declaration.borderBottomWidth).toBe('2px');
			expect(declaration.borderBottomStyle).toBe('solid');
			expect(declaration.borderImage).toBe('');
		});
	});

	describe('get borderLeft()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-left: inherit');

			expect(declaration.borderLeft).toBe('inherit');
			expect(declaration.borderLeftColor).toBe('inherit');
			expect(declaration.borderLeftWidth).toBe('inherit');
			expect(declaration.borderLeftStyle).toBe('inherit');

			element.setAttribute('style', 'border-left: green solid 2px');

			expect(declaration.border).toBe('');

			expect(declaration.borderTop).toBe('');
			expect(declaration.borderRight).toBe('');
			expect(declaration.borderBottom).toBe('');
			expect(declaration.borderLeft).toBe('2px solid green');
			expect(declaration.borderLeftColor).toBe('green');
			expect(declaration.borderLeftWidth).toBe('2px');
			expect(declaration.borderLeftStyle).toBe('solid');
			expect(declaration.borderImage).toBe('');
		});
	});

	describe('get borderWidth()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-width: inherit');

			expect(declaration.borderTopWidth).toBe('inherit');
			expect(declaration.borderRightWidth).toBe('inherit');
			expect(declaration.borderBottomWidth).toBe('inherit');
			expect(declaration.borderLeftWidth).toBe('inherit');

			element.setAttribute('style', 'border-width: 1px 2px 3px 4px');

			expect(declaration.borderTopWidth).toBe('1px');
			expect(declaration.borderRightWidth).toBe('2px');
			expect(declaration.borderBottomWidth).toBe('3px');
			expect(declaration.borderLeftWidth).toBe('4px');

			element.setAttribute('style', 'border-width: 2px');

			expect(declaration.borderTopWidth).toBe('2px');
			expect(declaration.borderRightWidth).toBe('2px');
			expect(declaration.borderBottomWidth).toBe('2px');
			expect(declaration.borderLeftWidth).toBe('2px');
		});
	});

	describe('get borderStyle()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-style: inherit');

			expect(declaration.borderTopStyle).toBe('inherit');
			expect(declaration.borderRightStyle).toBe('inherit');
			expect(declaration.borderBottomStyle).toBe('inherit');
			expect(declaration.borderLeftStyle).toBe('inherit');

			element.setAttribute('style', 'border-style: none hidden dotted dashed');

			expect(declaration.borderTopStyle).toBe('none');
			expect(declaration.borderRightStyle).toBe('hidden');
			expect(declaration.borderBottomStyle).toBe('dotted');
			expect(declaration.borderLeftStyle).toBe('dashed');

			element.setAttribute('style', 'border-style: hidden');

			expect(declaration.borderTopStyle).toBe('hidden');
			expect(declaration.borderRightStyle).toBe('hidden');
			expect(declaration.borderBottomStyle).toBe('hidden');
			expect(declaration.borderLeftStyle).toBe('hidden');
		});
	});

	describe('get borderColor()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-color: inherit');

			expect(declaration.borderTopColor).toBe('inherit');
			expect(declaration.borderRightColor).toBe('inherit');
			expect(declaration.borderBottomColor).toBe('inherit');
			expect(declaration.borderLeftColor).toBe('inherit');

			element.setAttribute('style', 'border-color: #000 #ffffff rgba(135,200,150,0.5) blue');

			expect(declaration.borderTopColor).toBe('#000');
			expect(declaration.borderRightColor).toBe('#ffffff');
			expect(declaration.borderBottomColor).toBe('rgba(135,200,150,0.5)');
			expect(declaration.borderLeftColor).toBe('blue');

			element.setAttribute('style', 'border-color: rgb(135,200,150)');

			expect(declaration.borderTopColor).toBe('rgb(135,200,150)');
			expect(declaration.borderRightColor).toBe('rgb(135,200,150)');
			expect(declaration.borderBottomColor).toBe('rgb(135,200,150)');
			expect(declaration.borderLeftColor).toBe('rgb(135,200,150)');
		});
	});

	describe('get borderImage()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-image: inherit');
			expect(declaration.borderImage).toBe('inherit');
			expect(declaration.borderImageSource).toBe('inherit');
			expect(declaration.borderImageOutset).toBe('inherit');
			expect(declaration.borderImageRepeat).toBe('inherit');
			expect(declaration.borderImageSlice).toBe('inherit');
			expect(declaration.borderImageWidth).toBe('inherit');

			element.setAttribute(
				'style',
				'border-image: repeating-linear-gradient(30deg, #4d9f0c, #9198e5, #4d9f0c 20px) 60'
			);

			expect(declaration.borderImage).toBe(
				'repeating-linear-gradient(30deg, #4d9f0c, #9198e5, #4d9f0c 20px) 60 / 1 / 0 stretch'
			);

			element.setAttribute('style', `border-image: url('/media/examples/border-diamonds.png') 30`);

			expect(declaration.borderImage).toBe(
				`url('/media/examples/border-diamonds.png') 30 / 1 / 0 stretch`
			);

			element.setAttribute(
				'style',
				`border-image: url('/media/examples/border-diamonds.png') 30 / 19px round`
			);

			expect(declaration.borderImage).toBe(
				`url('/media/examples/border-diamonds.png') 30 / 19px / 0 round`
			);

			element.setAttribute(
				'style',
				`border-image: url('/media/examples/border-diamonds.png') 10 fill / 20px / 30px space`
			);

			expect(declaration.borderImage).toBe(
				`url('/media/examples/border-diamonds.png') 10 fill / 20px / 30px space`
			);
			expect(declaration.borderImageSource).toBe(`url('/media/examples/border-diamonds.png')`);
			expect(declaration.borderImageOutset).toBe('30px');
			expect(declaration.borderImageRepeat).toBe('space');
			expect(declaration.borderImageSlice).toBe('10 fill');
			expect(declaration.borderImageWidth).toBe('20px');

			element.setAttribute('style', `border-image: linear-gradient(#f6b73c, #4d9f0c) 30;`);

			expect(declaration.borderImage).toBe(`linear-gradient(#f6b73c, #4d9f0c) 30 / 1 / 0 stretch`);
		});
	});

	describe('get borderImageSource()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', `border-image-source: inherit`);

			expect(declaration.borderImageSource).toBe('inherit');

			element.setAttribute(
				'style',
				`border-image-source: url('/media/examples/border-diamonds.png')`
			);

			expect(declaration.borderImageSource).toBe(`url('/media/examples/border-diamonds.png')`);

			element.setAttribute('style', `border-image-source: NONE`);

			expect(declaration.borderImageSource).toBe(`none`);

			element.setAttribute(
				'style',
				`border-image-source: repeating-linear-gradient(30deg, #4d9f0c, #9198e5, #4d9f0c 20px)`
			);

			expect(declaration.borderImageSource).toBe(
				`repeating-linear-gradient(30deg, #4d9f0c, #9198e5, #4d9f0c 20px)`
			);
		});
	});

	describe('get borderImageSlice()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-image-slice: inherit');

			expect(declaration.borderImageSlice).toBe('inherit');

			element.setAttribute('style', 'border-image-slice: 30');

			expect(declaration.borderImageSlice).toBe('30');

			element.setAttribute('style', 'border-image-slice: 30 fill');

			expect(declaration.borderImageSlice).toBe('30 fill');

			element.setAttribute(
				'style',
				'border-image-slice: calc(50 / 184 * 100%) calc(80 / 284 * 100%) fill'
			);

			expect(declaration.borderImageSlice).toBe('calc(50 / 184 * 100%) calc(80 / 284 * 100%) fill');
		});
	});

	describe('get borderImageWidth()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-image-width: inherit');

			expect(declaration.borderImageWidth).toBe('inherit');

			element.setAttribute('style', 'border-image-width: auto');

			expect(declaration.borderImageWidth).toBe('auto');

			element.setAttribute('style', 'border-image-width: 25%');

			expect(declaration.borderImageWidth).toBe('25%');

			element.setAttribute('style', 'border-image-width: 5% 2em 10% auto');

			expect(declaration.borderImageWidth).toBe('5% 2em 10% auto');
		});
	});

	describe('get borderImageOutset()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-image-outset: inherit');

			expect(declaration.borderImageOutset).toBe('inherit');

			element.setAttribute('style', 'border-image-outset: 1rem');

			expect(declaration.borderImageOutset).toBe('1rem');

			element.setAttribute('style', 'border-image-outset: 1 1.2');

			expect(declaration.borderImageOutset).toBe('1 1.2');

			element.setAttribute('style', 'border-image-outset: 7px 12em 14cm 5px');

			expect(declaration.borderImageOutset).toBe('7px 12em 14cm 5px');
		});
	});

	describe('get borderImageRepeat()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-image-repeat: inherit');

			expect(declaration.borderImageRepeat).toBe('inherit');

			element.setAttribute('style', 'border-image-repeat: stretch');

			expect(declaration.borderImageRepeat).toBe('stretch');

			element.setAttribute('style', 'border-image-repeat: repeat');

			expect(declaration.borderImageRepeat).toBe('repeat');

			element.setAttribute('style', 'border-image-repeat: round stretch');

			expect(declaration.borderImageRepeat).toBe('round stretch');
		});
	});

	describe('get borderTopWidth()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-top-width: inherit');

			expect(declaration.borderTopWidth).toBe('inherit');

			element.setAttribute('style', 'border-top-width: thick');

			expect(declaration.borderTopWidth).toBe('thick');

			element.setAttribute('style', 'border-top-width: 2em');

			expect(declaration.borderTopWidth).toBe('2em');
		});
	});

	describe('get borderRightWidth()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-right-width: inherit');

			expect(declaration.borderRightWidth).toBe('inherit');

			element.setAttribute('style', 'border-right-width: thick');

			expect(declaration.borderRightWidth).toBe('thick');

			element.setAttribute('style', 'border-right-width: 2em');

			expect(declaration.borderRightWidth).toBe('2em');
		});
	});

	describe('get borderBottomWidth()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-bottom-width: inherit');

			expect(declaration.borderBottomWidth).toBe('inherit');

			element.setAttribute('style', 'border-bottom-width: thick');

			expect(declaration.borderBottomWidth).toBe('thick');

			element.setAttribute('style', 'border-bottom-width: 2em');

			expect(declaration.borderBottomWidth).toBe('2em');
		});
	});

	describe('get borderLeftWidth()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-left-width: inherit');

			expect(declaration.borderLeftWidth).toBe('inherit');

			element.setAttribute('style', 'border-left-width: thick');

			expect(declaration.borderLeftWidth).toBe('thick');

			element.setAttribute('style', 'border-left-width: 2em');

			expect(declaration.borderLeftWidth).toBe('2em');
		});
	});

	describe('get borderTopColor()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-top-color: inherit');

			expect(declaration.borderTopColor).toBe('inherit');

			element.setAttribute('style', 'border-top-color: red');

			expect(declaration.borderTopColor).toBe('red');

			element.setAttribute('style', 'border-top-color: rgba(100, 100, 100, 0.5)');

			expect(declaration.borderTopColor).toBe('rgba(100, 100, 100, 0.5)');
		});
	});

	describe('get borderRightColor()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-right-color: inherit');

			expect(declaration.borderRightColor).toBe('inherit');

			element.setAttribute('style', 'border-right-color: red');

			expect(declaration.borderRightColor).toBe('red');

			element.setAttribute('style', 'border-right-color: rgba(100, 100, 100, 0.5)');

			expect(declaration.borderRightColor).toBe('rgba(100, 100, 100, 0.5)');
		});
	});

	describe('get borderBottomColor()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-bottom-color: inherit');

			expect(declaration.borderBottomColor).toBe('inherit');

			element.setAttribute('style', 'border-bottom-color: red');

			expect(declaration.borderBottomColor).toBe('red');

			element.setAttribute('style', 'border-bottom-color: rgba(100, 100, 100, 0.5)');

			expect(declaration.borderBottomColor).toBe('rgba(100, 100, 100, 0.5)');
		});
	});

	describe('get borderLeftColor()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-left-color: inherit');

			expect(declaration.borderLeftColor).toBe('inherit');

			element.setAttribute('style', 'border-left-color: red');

			expect(declaration.borderLeftColor).toBe('red');

			element.setAttribute('style', 'border-left-color: rgba(100, 100, 100, 0.5)');

			expect(declaration.borderLeftColor).toBe('rgba(100, 100, 100, 0.5)');
		});
	});

	describe('get borderTopStyle()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-top-style: inherit');

			expect(declaration.borderTopStyle).toBe('inherit');

			element.setAttribute('style', 'border-top-style: dotted');

			expect(declaration.borderTopStyle).toBe('dotted');

			element.setAttribute('style', 'border-top-style: solid');

			expect(declaration.borderTopStyle).toBe('solid');
		});
	});

	describe('get borderRightStyle()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-right-style: inherit');

			expect(declaration.borderRightStyle).toBe('inherit');

			element.setAttribute('style', 'border-right-style: dotted');

			expect(declaration.borderRightStyle).toBe('dotted');

			element.setAttribute('style', 'border-right-style: solid');

			expect(declaration.borderRightStyle).toBe('solid');
		});
	});

	describe('get borderBottomStyle()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-bottom-style: inherit');

			expect(declaration.borderBottomStyle).toBe('inherit');

			element.setAttribute('style', 'border-bottom-style: dotted');

			expect(declaration.borderBottomStyle).toBe('dotted');

			element.setAttribute('style', 'border-bottom-style: solid');

			expect(declaration.borderBottomStyle).toBe('solid');
		});
	});

	describe('get borderLeftStyle()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-left-style: inherit');

			expect(declaration.borderLeftStyle).toBe('inherit');

			element.setAttribute('style', 'border-left-style: dotted');

			expect(declaration.borderLeftStyle).toBe('dotted');

			element.setAttribute('style', 'border-left-style: solid');

			expect(declaration.borderLeftStyle).toBe('solid');
		});
	});

	describe('get borderRadius()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-radius: inherit');

			expect(declaration.borderRadius).toBe('inherit');
			expect(declaration.borderTopLeftRadius).toBe('inherit');
			expect(declaration.borderTopRightRadius).toBe('inherit');
			expect(declaration.borderBottomRightRadius).toBe('inherit');
			expect(declaration.borderBottomLeftRadius).toBe('inherit');

			element.setAttribute('style', 'border-radius: 1px     2px 3px 4px');

			expect(declaration.borderRadius).toBe('1px 2px 3px 4px');
			expect(declaration.borderTopLeftRadius).toBe('1px');
			expect(declaration.borderTopRightRadius).toBe('2px');
			expect(declaration.borderBottomRightRadius).toBe('3px');
			expect(declaration.borderBottomLeftRadius).toBe('4px');

			element.setAttribute('style', 'border-radius: 1px 2px 3px');

			expect(declaration.borderRadius).toBe('1px 2px 3px');

			element.setAttribute('style', 'border-radius: 1px 2px');

			expect(declaration.borderRadius).toBe('1px 2px');

			element.setAttribute('style', 'border-radius: 1px');

			expect(declaration.borderRadius).toBe('1px');
		});
	});

	describe('get borderTopLeftRadius()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-top-left-radius: inherit');

			expect(declaration.borderTopLeftRadius).toBe('inherit');

			element.setAttribute('style', 'border-top-left-radius: 1rem');

			expect(declaration.borderTopLeftRadius).toBe('1rem');
		});
	});

	describe('get borderTopRightRadius()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-top-right-radius: inherit');

			expect(declaration.borderTopRightRadius).toBe('inherit');

			element.setAttribute('style', 'border-top-right-radius: 1rem');

			expect(declaration.borderTopRightRadius).toBe('1rem');
		});
	});

	describe('get borderBottomRightRadius()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-bottom-right-radius: inherit');

			expect(declaration.borderBottomRightRadius).toBe('inherit');

			element.setAttribute('style', 'border-bottom-right-radius: 1rem');

			expect(declaration.borderBottomRightRadius).toBe('1rem');
		});
	});

	describe('get borderBottomLeftRadius()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'border-bottom-left-radius: inherit');

			expect(declaration.borderBottomLeftRadius).toBe('inherit');

			element.setAttribute('style', 'border-bottom-left-radius: 1rem');

			expect(declaration.borderBottomLeftRadius).toBe('1rem');
		});
	});

	describe('get borderCollapse()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			for (const value of ['collapse', 'separate', 'inherit']) {
				element.setAttribute('style', `border-collapse: ${value}`);

				expect(declaration.borderCollapse).toBe(value);
			}
		});
	});

	describe('get clear()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			for (const value of ['inherit', 'none', 'left', 'right', 'both']) {
				element.setAttribute('style', `clear: ${value}`);

				expect(declaration.clear).toBe(value);
			}
		});
	});

	describe('get clip()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'clip: inherit');

			expect(declaration.clip).toBe('inherit');

			element.setAttribute('style', 'clip: auto');

			expect(declaration.clip).toBe('auto');

			element.setAttribute('style', 'clip: rect(1px, 10em, 3rem, 2ch)');

			expect(declaration.clip).toBe('rect(1px, 10em, 3rem, 2ch)');
		});
	});

	describe('get cssFloat()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			for (const value of ['inherit', 'none', 'left', 'right', 'inline-start', 'inline-end']) {
				element.setAttribute('style', `css-float: ${value}`);

				expect(declaration.cssFloat).toBe(value);
			}
		});
	});

	describe('get float()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			for (const value of ['inherit', 'none', 'left', 'right', 'inline-start', 'inline-end']) {
				element.setAttribute('style', `float: ${value}`);

				expect(declaration.float).toBe(value);
			}
		});
	});

	describe('get display()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			for (const value of [
				'inherit',
				'initial',
				'revert',
				'unset',
				'block',
				'inline',
				'inline-block',
				'flex',
				'inline-flex',
				'grid',
				'inline-grid',
				'flow-root',
				'none',
				'contents',
				'block flow',
				'inline flow',
				'inline flow-root',
				'block flex',
				'inline flex',
				'block grid',
				'inline grid',
				'block flow-root',
				'table',
				'table-row',
				'list-item'
			]) {
				element.setAttribute('style', `display: ${value}`);

				expect(declaration.display).toBe(value);
			}
		});
	});

	describe('get direction()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			for (const value of ['inherit', 'initial', 'revert', 'unset', 'ltr', 'rtl']) {
				element.setAttribute('style', `direction: ${value}`);

				expect(declaration.direction).toBe(value);
			}
		});
	});

	describe('get flex()', () => {
		it('Returns style property.', () => {
			const declaration = new CSSStyleDeclaration(element);

			element.setAttribute('style', 'flex: inherit');

			expect(declaration.flex).toBe('inherit');
			expect(declaration.flexGrow).toBe('inherit');
			expect(declaration.flexShrink).toBe('inherit');
			expect(declaration.flexBasis).toBe('inherit');

			element.setAttribute('style', 'flex: none');

			expect(declaration.flex).toBe('0 0 auto');
			expect(declaration.flexGrow).toBe('0');
			expect(declaration.flexShrink).toBe('0');
			expect(declaration.flexBasis).toBe('auto');

			element.setAttribute('style', 'flex: auto');

			expect(declaration.flex).toBe('1 1 auto');
			expect(declaration.flexGrow).toBe('1');
			expect(declaration.flexShrink).toBe('1');
			expect(declaration.flexBasis).toBe('auto');

			element.setAttribute('style', 'flex: fit-content(10px)');

			expect(declaration.flex).toBe('1 1 fit-content(10px)');
			expect(declaration.flexGrow).toBe('1');
			expect(declaration.flexShrink).toBe('1');
			expect(declaration.flexBasis).toBe('fit-content(10px)');

			element.setAttribute('style', 'flex: 3');

			expect(declaration.flex).toBe('3 1 0%');
			expect(declaration.flexGrow).toBe('3');
			expect(declaration.flexShrink).toBe('1');
			expect(declaration.flexBasis).toBe('0%');

			element.setAttribute('style', 'flex: 3 2');

			expect(declaration.flex).toBe('3 2 0%');
			expect(declaration.flexGrow).toBe('3');
			expect(declaration.flexShrink).toBe('2');
			expect(declaration.flexBasis).toBe('0%');

			element.setAttribute('style', 'flex: 3 2 min-content');

			expect(declaration.flex).toBe('3 2 min-content');
			expect(declaration.flexGrow).toBe('3');
			expect(declaration.flexShrink).toBe('2');
			expect(declaration.flexBasis).toBe('min-content');

			element.setAttribute('style', 'flex: 3 2 50rem');

			expect(declaration.flex).toBe('3 2 50rem');
			expect(declaration.flexGrow).toBe('3');
			expect(declaration.flexShrink).toBe('2');
			expect(declaration.flexBasis).toBe('50rem');
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
