import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGScriptElement from '../../../src/nodes/svg-script-element/SVGScriptElement.js';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';

describe('SVGScriptElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGScriptElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'script');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGScriptElement', () => {
			expect(element instanceof SVGScriptElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});

	describe('get href()', () => {
		it('Should return an instance of SVGAnimatedString', () => {
			const href = element.href;
			expect(href).toBeInstanceOf(window.SVGAnimatedString);
			expect(element.href).toBe(href);
		});

		it('Returns empty string by default', () => {
			expect(element.href.baseVal).toBe('');
			expect(element.href.animVal).toBe('');
		});

		it('Reflects the "href" attribute', () => {
			element.setAttribute('href', 'https://example.com/image.jpg');

			expect(element.href.baseVal).toBe('https://example.com/image.jpg');
			expect(element.href.animVal).toBe('https://example.com/image.jpg');

			element.href.baseVal = 'https://example.com/image2.jpg';

			expect(element.getAttribute('href')).toBe('https://example.com/image2.jpg');

			// Does nothing
			element.href.animVal = 'https://example.com/image3.jpg';

			expect(element.getAttribute('href')).toBe('https://example.com/image2.jpg');
		});
	});

	describe('get type()', () => {
		it('Returns the "type" attribute value', () => {
			element.setAttribute('type', 'application/javascript');
			expect(element.type).toBe('application/javascript');
		});
	});

	describe('set type()', () => {
		it('Sets the "type" attribute value', () => {
			element.type = 'application/javascript';
			expect(element.getAttribute('type')).toBe('application/javascript');
		});
	});
});
