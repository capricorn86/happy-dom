import Window from '../../../src/window/Window.js';
import type Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import * as PropertySymbol from '../../../src/PropertySymbol.js';

const IMAGE_DATA_URL =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9UjLhXQAAAAASUVORK5CYII=';

describe('HTMLImageElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window({
			settings: {
				enableImageFileLoading: true,
				fetch: {
					virtualServers: [
						{
							url: 'https://example.com/images',
							directory: './test/nodes/html-image-element/data'
						}
					]
				}
			}
		});
		document = window.document;
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLImageElement]`', () => {
			const element = document.createElement('img');
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLImageElement]');
		});
	});

	for (const property of <Array<'alt' | 'referrerPolicy' | 'sizes' | 'srcset' | 'useMap'>>[
		'alt',
		'referrerPolicy',
		'sizes',
		'srcset',
		'useMap'
	]) {
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

	describe('get width()', () => {
		it('Returns "0" if the "width" attribute is not set.', () => {
			const element = document.createElement('img');
			expect(element.width).toBe(0);
		});

		it('Returns the "width" attribute.', () => {
			const element = document.createElement('img');
			element.setAttribute('width', '100');
			expect(element.width).toBe(100);
		});

		it('Returns natural width of the image if the "width" attribute is not set.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			expect(element.width).toBe(1);
		});

		it('Returns natural width of the image if the "width" attribute is invalid.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			element.setAttribute('width', 'invalid');
			expect(element.width).toBe(1);
		});

		it('Returns 0 if the "width" attribute is invalid and natural width is 0.', () => {
			const element = document.createElement('img');
			element.setAttribute('width', 'invalid');
			expect(element.width).toBe(0);
		});
	});

	describe('set width()', () => {
		it('Sets the attribute "width".', () => {
			const element = document.createElement('img');
			element.width = 100;
			expect(element.getAttribute('width')).toBe('100');
		});

		it('Sets the attribute "width" even if the value is invalid.', () => {
			const element = document.createElement('img');
			element.width = -100;
			expect(element.getAttribute('width')).toBe('-100');
		});
	});

	describe('get height()', () => {
		it('Returns "0" if the "height" attribute is not set.', () => {
			const element = document.createElement('img');
			expect(element.height).toBe(0);
		});

		it('Returns the "height" attribute.', () => {
			const element = document.createElement('img');
			element.setAttribute('height', '100');
			expect(element.height).toBe(100);
		});

		it('Returns natural height of the image if the "height" attribute is not set.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			expect(element.height).toBe(1);
		});

		it('Returns natural height of the image if the "height" attribute is invalid.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			element.setAttribute('height', 'invalid');
			expect(element.height).toBe(1);
		});

		it('Returns 0 if the "width" attribute is invalid and natural height is 0.', () => {
			const element = document.createElement('img');
			element.setAttribute('height', 'invalid');
			expect(element.height).toBe(0);
		});
	});

	describe('set height()', () => {
		it('Sets the attribute "height".', () => {
			const element = document.createElement('img');
			element.height = 100;
			expect(element.getAttribute('height')).toBe('100');
		});

		it('Sets the attribute "height" even if the value is invalid.', () => {
			const element = document.createElement('img');
			element.height = -100;
			expect(element.getAttribute('height')).toBe('-100');
		});
	});

	describe(`get isMap()`, () => {
		it(`Returns "true" if the "isMap" attribute is defined.`, () => {
			const element = document.createElement('img');
			element.setAttribute('isMap', '');
			expect(element.isMap).toBe(true);
		});
	});

	describe(`set isMap()`, () => {
		it(`Sets the "isMap" attribute to an empty string if set to "true".`, () => {
			const element = document.createElement('img');
			element.isMap = true;
			expect(element.getAttribute('isMap')).toBe('');
		});
	});

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			const element = document.createElement('img');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', async () => {
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

		it('Loads image from file when "src" is set.', async () => {
			window.happyDOM.setURL('https://example.com');
			const element = document.createElement('img');
			element.src = 'images/test.gif';
			expect(element.complete).toBe(false);
			await new Promise((resolve) => element.addEventListener('load', resolve));
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(240);
			expect(element.naturalHeight).toBe(183);
			expect(element[PropertySymbol.buffer]!.length).toBe(7455);
		});

		it('Loads image data URL when "src" is set.', async () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(1);
			expect(element.naturalHeight).toBe(1);
			expect(element[PropertySymbol.buffer]!.length).toBe(68);
		});

		it('Triggers "error" event if image fails to load.', async () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			const element = document.createElement('img');
			element.src = 'test';
			expect(element.src).toBe('https://localhost:8080/test/path/test');
			expect(element.complete).toBe(false);
			await new Promise((resolve) => element.addEventListener('error', resolve));
			expect(element.complete).toBe(true);
		});

		it('Doesn\'t load image if "enableImageFileLoading" setting is disabled.', async () => {
			window = new Window({
				settings: {
					enableImageFileLoading: false,
					fetch: {
						virtualServers: [
							{
								url: 'https://example.com',
								directory: './test/nodes/html-image-element/data'
							}
						]
					}
				}
			});
			document = window.document;

			const element = document.createElement('img');
			element.src = 'https://example.com/images/test.gif';
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(0);
			expect(element.naturalHeight).toBe(0);
			expect(element[PropertySymbol.buffer]).toBeNull();
		});
	});

	describe('get complete()', () => {
		it('Returns "false".', () => {
			const element = document.createElement('img');
			expect(element.complete).toBe(true);
		});

		it('Returns "true" if the image is loaded.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			expect(element.complete).toBe(true);
		});

		it('Returns "false" if the image is not loaded.', async () => {
			const element = document.createElement('img');
			element.src = 'https://example.com/images/test.gif';
			expect(element.complete).toBe(false);
			await new Promise((resolve) => element.addEventListener('load', resolve));
			expect(element.complete).toBe(true);
		});
	});

	describe('get naturalHeight()', () => {
		it('Returns "0".', () => {
			const element = document.createElement('img');
			expect(element.naturalHeight).toBe(0);
		});

		it('Returns natural height of the image.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			expect(element.naturalHeight).toBe(1);
		});
	});

	describe('get naturalWidth()', () => {
		it('Returns "0".', () => {
			const element = document.createElement('img');
			expect(element.naturalWidth).toBe(0);
		});

		it('Returns natural width of the image.', () => {
			const element = document.createElement('img');
			element.src = IMAGE_DATA_URL;
			expect(element.naturalWidth).toBe(1);
		});
	});

	describe('get crossOrigin()', () => {
		it('Returns "null".', () => {
			const element = document.createElement('img');
			expect(element.crossOrigin).toBe(null);
		});
	});

	describe('get decoding()', () => {
		it('Returns "auto".', () => {
			const element = document.createElement('img');
			expect(element.decoding).toBe('auto');
		});
	});

	describe('get loading()', () => {
		it('Returns "auto" by default.', () => {
			const element = document.createElement('img');
			expect(element.loading).toBe('auto');
		});

		it('Returns "eager" if the attribute is set to "eager".', () => {
			const element = document.createElement('img');
			element.setAttribute('loading', 'eager');
			expect(element.loading).toBe('eager');
		});

		it('Returns "lazy" if the attribute is set to "lazy".', () => {
			const element = document.createElement('img');
			element.setAttribute('loading', 'lazy');
			expect(element.loading).toBe('lazy');
		});

		it('Returns "auto" if value is invalid.', () => {
			const element = document.createElement('img');
			element.setAttribute('loading', 'invalid');
			expect(element.loading).toBe('auto');
		});
	});

	describe('set loading()', () => {
		it('Sets the "loading" attribute.', () => {
			const element = document.createElement('img');
			element.loading = 'anyValueIsAllowed';
			expect(element.getAttribute('loading')).toBe('anyValueIsAllowed');
		});
	});

	describe('get x()', () => {
		it('Returns "0".', () => {
			const element = document.createElement('img');
			expect(element.x).toBe(0);
		});
	});

	describe('get y()', () => {
		it('Returns "0".', () => {
			const element = document.createElement('img');
			expect(element.y).toBe(0);
		});
	});

	describe('decode()', () => {
		it('Executes a promise.', async () => {
			const element = document.createElement('img');
			await element.decode();
		});
	});

	describe('setAttribute()', () => {
		it('Loads image from file when "src" attribute is set.', async () => {
			window.happyDOM.setURL('https://example.com');
			const element = document.createElement('img');
			element.setAttribute('src', 'images/test.gif');
			expect(element.complete).toBe(false);
			await new Promise((resolve) => element.addEventListener('load', resolve));
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(240);
			expect(element.naturalHeight).toBe(183);
			expect(element[PropertySymbol.buffer]!.length).toBe(7455);
		});

		it('Loads image data URL when "src" attribute is set.', async () => {
			const element = document.createElement('img');
			element.setAttribute('src', IMAGE_DATA_URL);
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(1);
			expect(element.naturalHeight).toBe(1);
			expect(element[PropertySymbol.buffer]!.length).toBe(68);
		});

		it('Triggers "error" event when "src" attribute is set to an image that fails to load.', async () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			const element = document.createElement('img');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
			expect(element.complete).toBe(false);
			await new Promise((resolve) => element.addEventListener('error', resolve));
			expect(element.complete).toBe(true);
		});

		it('Doesn\'t load image if "enableImageFileLoading" setting is disabled.', async () => {
			window = new Window({
				settings: {
					enableImageFileLoading: false,
					fetch: {
						virtualServers: [
							{
								url: 'https://example.com',
								directory: './test/nodes/html-image-element/data'
							}
						]
					}
				}
			});
			document = window.document;

			const element = document.createElement('img');
			element.setAttribute('src', 'https://example.com/images/test.gif');
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(0);
			expect(element.naturalHeight).toBe(0);
			expect(element[PropertySymbol.buffer]).toBeNull();
		});
	});

	describe('removeAttribute()', () => {
		it('Removes the "src" attribute and resets image properties.', async () => {
			window.happyDOM.setURL('https://example.com');
			const element = document.createElement('img');
			element.src = 'images/test.gif';
			expect(element.complete).toBe(false);
			await new Promise((resolve) => element.addEventListener('load', resolve));
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(240);
			expect(element.naturalHeight).toBe(183);
			expect(element[PropertySymbol.buffer]!.length).toBe(7455);

			element.removeAttribute('src');
			expect(element.getAttribute('src')).toBeNull();
			expect(element.complete).toBe(true);
			expect(element.naturalWidth).toBe(0);
			expect(element.naturalHeight).toBe(0);
			expect(element[PropertySymbol.buffer]).toBeNull();
		});
	});
});
