import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGAnimationElement from '../../../src/nodes/svg-animation-element/SVGAnimationElement.js';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGAnimationElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGAnimationElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGAnimationElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});

	describe('get requiredExtensions()', () => {
		it('Should return an instance of SVGStringList', () => {
			const requiredExtensions = element.requiredExtensions;
			expect(requiredExtensions).toBeInstanceOf(window.SVGStringList);
			expect(element.requiredExtensions).toBe(requiredExtensions);
		});

		it('Reflects the "requiredExtensions" attribute', () => {
			element.setAttribute('requiredExtensions', 'key1 key2');

			expect(element.requiredExtensions.length).toBe(2);
			expect(element.requiredExtensions[0]).toBe('key1');
			expect(element.requiredExtensions[1]).toBe('key2');

			element.setAttribute('requiredExtensions', 'key3 key4');

			expect(element.requiredExtensions.length).toBe(2);
			expect(element.requiredExtensions[0]).toBe('key3');
			expect(element.requiredExtensions[1]).toBe('key4');

			element.requiredExtensions.appendItem('key5');

			expect(element.getAttribute('requiredExtensions')).toBe('key3 key4 key5');

			element.requiredExtensions.removeItem(1);

			expect(element.getAttribute('requiredExtensions')).toBe('key3 key5');

			element.requiredExtensions.clear();

			expect(element.getAttribute('requiredExtensions')).toBe(null);
		});
	});

	describe('get systemLanguage()', () => {
		it('Should return an instance of SVGStringList', () => {
			const systemLanguage = element.systemLanguage;
			expect(systemLanguage).toBeInstanceOf(window.SVGStringList);
			expect(element.systemLanguage).toBe(systemLanguage);
		});

		it('Reflects the "systemLanguage" attribute', () => {
			element.setAttribute('systemLanguage', 'key1 key2');

			expect(element.systemLanguage.length).toBe(2);
			expect(element.systemLanguage[0]).toBe('key1');
			expect(element.systemLanguage[1]).toBe('key2');

			element.setAttribute('systemLanguage', 'key3 key4');

			expect(element.systemLanguage.length).toBe(2);
			expect(element.systemLanguage[0]).toBe('key3');
			expect(element.systemLanguage[1]).toBe('key4');

			element.systemLanguage.appendItem('key5');

			expect(element.getAttribute('systemLanguage')).toBe('key3 key4 key5');

			element.systemLanguage.removeItem(1);

			expect(element.getAttribute('systemLanguage')).toBe('key3 key5');

			element.systemLanguage.clear();

			expect(element.getAttribute('systemLanguage')).toBe(null);
		});
	});
});
