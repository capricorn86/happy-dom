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
		it('parses variables correctly.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--bg-color: rgb(0 128 0 / 1); background-color: var(--bg-color);`
			);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();
			expect(computedElementStyle.get('background-color').value).toBe('rgb(0 128 0 / 1)');
		});
		it('parses nested variables correctly.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--bg-color-alpha: 1; background-color: rgb(0 128 0 / var(--bg-color-alpha, 1));`
			);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();
			expect(computedElementStyle.get('background-color').value).toBe('rgb(0 128 0 / 1)');
		});
		it('Does not hang on cyclic CSS variable references.', () => {
			document.documentElement.style.setProperty('--a', 'var(--b)');
			document.documentElement.style.setProperty('--b', 'var(--a)');

			const computedStyle = window.getComputedStyle(document.documentElement);

			expect(computedStyle.getPropertyValue('--a')).toBe('');
		});
		it('Does not hang on cyclic CSS variable references with fallback values.', () => {
			document.documentElement.style.setProperty('--a', 'var(--b, red)');
			document.documentElement.style.setProperty('--b', 'var(--a, blue)');

			const computedStyle = window.getComputedStyle(document.documentElement);

			expect(computedStyle.getPropertyValue('--a')).toBe('');
		});
		it('Parses a CSS variable used multiple times in the value of another CSS variable.', () => {
			document.documentElement.style.setProperty('--zero', '0px');
			document.documentElement.style.setProperty(
				'--position',
				'var(--zero) var(--zero) var(--zero) var(--zero)'
			);

			const computedStyle = window.getComputedStyle(document.documentElement);

			expect(computedStyle.getPropertyValue('--position')).toBe('0px 0px 0px 0px');
		});
		it('Parses CSS variables referencing the same CSS variable.', () => {
			document.documentElement.style.setProperty('--zero', '0px');
			document.documentElement.style.setProperty('--top', 'var(--zero)');
			document.documentElement.style.setProperty('--left', 'var(--zero)');
			document.documentElement.style.setProperty('--position', 'var(--top) var(--left)');

			const computedStyle = window.getComputedStyle(document.documentElement);

			expect(computedStyle.getPropertyValue('--position')).toBe('0px 0px');
		});
		it('Parses a CSS variable used multiple times in a property value.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--color: 128; background-color: rgb(var(--color) var(--color) var(--color) / 1);`
			);

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element);
			const computedElementStyle = computedElementStyleDeclaration.getComputedStyle();
			expect(computedElementStyle.get('background-color')?.value).toBe('rgb(128 128 128 / 1)');
		});
	});
});
