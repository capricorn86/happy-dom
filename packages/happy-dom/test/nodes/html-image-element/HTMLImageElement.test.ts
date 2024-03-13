import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLImageElement from '../../../src/nodes/html-image-element/HTMLImageElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLImageElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLImageElement]`', () => {
			const element = document.createElement('img');
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLImageElement]');
		});
	});

	for (const property of ['alt', 'referrerPolicy', 'sizes', 'srcset', 'useMap']) {
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

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			const element = document.createElement('img');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			const element = document.createElement('img');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			const element = document.createElement('img');
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});
	});

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
		it('Returns "auto" by default.', () => {
			const element = <HTMLImageElement>document.createElement('img');
			expect(element.loading).toBe('auto');
		});

		it('Returns "eager" if the attribute is set to "eager".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			element.setAttribute('loading', 'eager');
			expect(element.loading).toBe('eager');
		});

		it('Returns "lazy" if the attribute is set to "lazy".', () => {
			const element = <HTMLImageElement>document.createElement('img');
			element.setAttribute('loading', 'lazy');
			expect(element.loading).toBe('lazy');
		});

		it('Returns "auto" if value is invalid.', () => {
			const element = <HTMLImageElement>document.createElement('img');
			element.setAttribute('loading', 'invalid');
			expect(element.loading).toBe('auto');
		});
	});

	describe('set loading()', () => {
		it('Sets the "loading" attribute.', () => {
			const element = <HTMLImageElement>document.createElement('img');
			element.loading = 'anyValueIsAllowed';
			expect(element.getAttribute('loading')).toBe('anyValueIsAllowed');
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
