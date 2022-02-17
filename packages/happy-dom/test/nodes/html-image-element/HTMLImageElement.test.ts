import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLImageElement from '../../../src/nodes/html-image-element/HTMLImageElement';

describe('HTMLImageElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	for (const property of ['alt', 'referrerPolicy', 'sizes', 'src', 'srcset', 'useMap']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('img');
				element.setAttribute(property, 'test');
				expect(element[property]).toBe('test');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('img');
				element[property] = 'test';
				expect(element.getAttribute(property)).toBe('test');
			});
		});
	}

	for (const property of ['height', 'width']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				const element = document.createElement('img');
				element.setAttribute(property, '100');
				expect(element[property]).toBe(100);
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				const element = document.createElement('img');
				element[property] = 100;
				expect(element.getAttribute(property)).toBe('100');
			});
		});
	}

	for (const property of ['isMap']) {
		describe(`get ${property}()`, () => {
			it(`Returns "true" if the "${property}" attribute is defined.`, () => {
				const element = document.createElement('img');
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the "${property}" attribute to an empty string if set to "true".`, () => {
				const element = document.createElement('img');
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});
		});
	}

	describe('get complete()', () => {
		it('Returns "false".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.complete).toBe(false);
		});
	});

	describe('get naturalHeight()', () => {
		it('Returns "0".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.naturalHeight).toBe(0);
		});
	});

	describe('get naturalWidth()', () => {
		it('Returns "0".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.naturalWidth).toBe(0);
		});
	});

	describe('get crossOrigin()', () => {
		it('Returns "null".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.crossOrigin).toBe(null);
		});
	});

	describe('get decoding()', () => {
		it('Returns "auto".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.decoding).toBe('auto');
		});
	});

	describe('get loading()', () => {
		it('Returns "auto".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.loading).toBe('auto');
		});
	});

	describe('get x()', () => {
		it('Returns "0".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.x).toBe(0);
		});
	});

	describe('get y()', () => {
		it('Returns "0".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.y).toBe(0);
		});
	});

	describe('decode()', () => {
		it('Executes a promise.', async () => {
			const element = <HTMLImageElement>document.createElement('img');
			await element.decode();
		});
	});
});
