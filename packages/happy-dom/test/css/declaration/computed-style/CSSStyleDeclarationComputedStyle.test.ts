import Window from '../../../../src/window/Window.js';
import type Document from '../../../../src/nodes/document/Document.js';
import type HTMLElement from '../../../../src/nodes/html-element/HTMLElement.js';
import CSSStyleDeclarationElementStyle from '../../../../src/css/declaration/computed-style/CSSStyleDeclarationComputedStyle.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('CSSStyleDeclarationElementStyle', () => {
	let window: Window;
	let document: Document;
	let element: HTMLElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	describe('getComputedStyle()', () => {
		it('Is using a cache.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();
			expect(computedElementStyle).toBe(computedElementStyleDeclaration.getComputedStyle());

			element.setAttribute('style', `border: 2px solid green;`);

			expect(computedElementStyleDeclaration.getComputedStyle()).not.toBe(computedElementStyle);
		});

		it('Parses variables correctly.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--bg-color: rgb(0 128 0 / 1); background-color: var(--bg-color);`
			);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();
			expect(computedElementStyle.get('background-color')?.value).toBe('rgb(0 128 0 / 1)');
		});

		it('Parses nested variables correctly.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--bg-color-alpha: 1; background-color: rgb(0 128 0 / var(--bg-color-alpha, 1));`
			);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();

			expect(computedElementStyle.get('background-color')?.value).toBe('rgb(0 128 0 / 1)');
		});

		it('Preserves var() with fallback value in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `width: var(--x, 10px);`);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();

			expect(computedElementStyle.get('width')?.value).toBe('10px');
		});

		it('Preserves var() with nested fallback value (e.g. rgb()) in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `color: var(--primary, rgb(255, 0, 0));`);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();

			expect(computedElementStyle.get('color')?.value).toBe('rgb(255, 0, 0)');
		});

		it('Uses fallback value for var() with for list of RGB colors in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `background-color: rgb(var(--my-background, 255, 255, 255));`);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();

			expect(computedElementStyle.get('background-color')?.value).toBe('rgb(255, 255, 255)');
		});

		it('Uses variable when there is a fallback value for var() with for list of RGB colors in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--my-background: 255, 219, 0; background-color: rgb(var(--my-background, 255, 255, 255));`
			);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();

			expect(computedElementStyle.get('background-color')?.value).toBe('rgb(255, 219, 0)');
		});
	});
});
