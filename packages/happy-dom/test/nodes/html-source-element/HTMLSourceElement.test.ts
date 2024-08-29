import HTMLSourceElement from '../../../src/nodes/html-source-element/HTMLSourceElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLSourceElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLSourceElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('source');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLSourceElement', () => {
			expect(element instanceof HTMLSourceElement).toBe(true);
		});
	});

	describe('get height()', () => {
		it('Should return height', () => {
			element.setAttribute('height', '100');
			expect(element.height).toBe(100);
		});

		it('Should return 0 if height is not set', () => {
			expect(element.height).toBe(0);
		});

		it('Should return 0 if height is not a number', () => {
			element.setAttribute('height', 'test');
			expect(element.height).toBe(0);
		});

		it('Should return 0 if height is negative', () => {
			element.setAttribute('height', '-100');
			expect(element.height).toBe(0);
		});
	});

	describe('set height()', () => {
		it('Should set height', () => {
			element.height = 100;
			expect(element.getAttribute('height')).toBe('100');
		});

		it('Should set 0 if value is not a number', () => {
			element.height = <number>(<unknown>'test');
			expect(element.getAttribute('height')).toBe('0');
		});

		it('Should set 0 if value is negative', () => {
			element.height = -100;
			expect(element.getAttribute('height')).toBe('0');
		});
	});

	describe('get width()', () => {
		it('Should return width', () => {
			element.setAttribute('width', '100');
			expect(element.width).toBe(100);
		});

		it('Should return 0 if width is not set', () => {
			expect(element.width).toBe(0);
		});

		it('Should return 0 if width is not a number', () => {
			element.setAttribute('width', 'test');
			expect(element.width).toBe(0);
		});

		it('Should return 0 if width is negative', () => {
			element.setAttribute('width', '-100');
			expect(element.width).toBe(0);
		});
	});

	describe('set width()', () => {
		it('Should set width', () => {
			element.width = 100;
			expect(element.getAttribute('width')).toBe('100');
		});

		it('Should set 0 if value is not a number', () => {
			element.width = <number>(<unknown>'test');
			expect(element.getAttribute('width')).toBe('0');
		});

		it('Should set 0 if value is negative', () => {
			element.width = -100;
			expect(element.getAttribute('width')).toBe('0');
		});
	});

	describe('get media()', () => {
		it('Should return media', () => {
			element.setAttribute('media', 'test');
			expect(element.media).toBe('test');
		});

		it('Should return an empty string if media is not set', () => {
			expect(element.media).toBe('');
		});
	});

	describe('set media()', () => {
		it('Should set media', () => {
			element.media = 'test';
			expect(element.getAttribute('media')).toBe('test');
		});
	});

	describe('get sizes()', () => {
		it('Should return sizes', () => {
			element.setAttribute('sizes', 'test');
			expect(element.sizes).toBe('test');
		});

		it('Should return an empty string if sizes is not set', () => {
			expect(element.sizes).toBe('');
		});
	});

	describe('set sizes()', () => {
		it('Should set sizes', () => {
			element.sizes = 'test';
			expect(element.getAttribute('sizes')).toBe('test');
		});
	});

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});
	});

	describe('get srcset()', () => {
		it('Should return srcset', () => {
			element.setAttribute('srcset', 'test');
			expect(element.srcset).toBe('test');
		});

		it('Should return an empty string if srcset is not set', () => {
			expect(element.srcset).toBe('');
		});
	});

	describe('set srcset()', () => {
		it('Should set srcset', () => {
			element.srcset = 'test';
			expect(element.getAttribute('srcset')).toBe('test');
		});
	});

	describe('get type()', () => {
		it('Should return type', () => {
			element.setAttribute('type', 'test');
			expect(element.type).toBe('test');
		});

		it('Should return an empty string if type is not set', () => {
			expect(element.type).toBe('');
		});
	});

	describe('set type()', () => {
		it('Should set type', () => {
			element.type = 'test';
			expect(element.getAttribute('type')).toBe('test');
		});
	});
});
