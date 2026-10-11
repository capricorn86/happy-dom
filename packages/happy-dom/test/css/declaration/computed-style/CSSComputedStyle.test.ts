import Window from '../../../../src/window/Window.js';
import type Document from '../../../../src/nodes/document/Document.js';
import type HTMLElement from '../../../../src/nodes/html-element/HTMLElement.js';
import CSSComputedStyle from '../../../../src/css/declaration/computed-style/CSSComputedStyle.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('CSSComputedStyle', () => {
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

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager).toBe(computedStyle.getComputedStyle());
			element.setAttribute('style', `border: 2px solid green;`);

			expect(computedStyle.getComputedStyle()).not.toBe(propertyManager);
		});

		it('Parses variables correctly.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--bg-color: rgb(0 128 0 / 1); background-color: var(--bg-color);`
			);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('background-color')?.value).toBe('rgb(0 128 0 / 1)');
		});

		it('Parses nested variables correctly.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--bg-color-alpha: 1; background-color: rgb(0 128 0 / var(--bg-color-alpha, 1));`
			);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('background-color')?.value).toBe('rgb(0 128 0 / 1)');
		});

		it('Preserves var() with fallback value in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `width: var(--x, 10px);`);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('width')?.value).toBe('10px');
		});

		it('Preserves var() with nested fallback value (e.g. rgb()) in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `color: var(--primary, rgb(255, 0, 0));`);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('color')?.value).toBe('rgb(255, 0, 0)');
		});

		it('Uses fallback value for var() with for list of RGB colors in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `background-color: rgb(var(--my-background, 255, 255, 255));`);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('background-color')?.value).toBe('rgb(255, 255, 255)');
		});

		it('Uses variable when there is a fallback value for var() with for list of RGB colors in a CSS property.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--my-background: 255, 219, 0; background-color: rgb(var(--my-background, 255, 255, 255));`
			);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('background-color')?.value).toBe('rgb(255, 219, 0)');
		});

		it('Resolves every var() in a value, not only the first one.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				`--box: 20px; --gap: 2px; width: calc(5 * var(--box) + 6 * var(--gap)); height: calc(var(--gap) + var(--gap));`
			);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('width')?.value).toBe('calc(5 * 20px + 6 * 2px)');
			expect(propertyManager.get('height')?.value).toBe('calc(2px + 2px)');
		});

		it('Resolves var() with fallback after an earlier var() in a shorthand value.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `--x: 16px; margin: var(--x) var(--x, 4px) var(--y, 8px);`);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('margin-top')?.value).toBe('16px');
			expect(propertyManager.get('margin-right')?.value).toBe('16px');
			expect(propertyManager.get('margin-bottom')?.value).toBe('8px');
		});

		it('Ignores invalid CSS variable fallback value.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `width: var(--my-width, invalid);`);

			const computedStyle = new CSSComputedStyle(element);
			const propertyManager = computedStyle.getComputedStyle();

			expect(propertyManager.get('width')).toBe(null);
		});

		it('Resolves a var() chain whose links are declared on different elements.', () => {
			document.documentElement.style.setProperty('--font-sans', 'Inter');
			document.body.innerHTML = `
				<div style="--snap: var(--font-sans)">
					<div id="inner" style="--font-sans: var(--snap); font-family: var(--font-sans)">text</div>
				</div>`;

			const inner = <HTMLElement>document.getElementById('inner');
			const computedStyle = window.getComputedStyle(inner);

			expect(computedStyle.fontFamily).toBe('Inter');
			expect(computedStyle.getPropertyValue('--font-sans')).toBe('Inter');
		});

		it('Substitutes var() in a custom property on the element that declares it.', () => {
			document.documentElement.setAttribute('style', '--size: 1px; --width: var(--size);');
			document.body.appendChild(element);
			element.setAttribute('style', '--size: 2px; width: var(--width); height: var(--size);');

			const computedStyle = window.getComputedStyle(element);

			// --width is computed on <html>, where --size is 1px, and inherited as "1px".
			expect(computedStyle.width).toBe('1px');
			expect(computedStyle.height).toBe('2px');
		});

		it('Resolves custom properties declared later on the same element.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				'--a: var(--b) solid; --b: 3px; border: var(--a) var(--c, red); --c: green;'
			);

			const computedStyle = window.getComputedStyle(element);

			expect(computedStyle.getPropertyValue('--a')).toBe('3px solid');
			expect(computedStyle.border).toBe('3px solid green');
		});

		it('Lets an important custom property win over a later declaration.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', '--x: 1px !important; --x: 2px; width: var(--x);');

			const computedStyle = window.getComputedStyle(element);

			expect(computedStyle.getPropertyValue('--x')).toBe('1px');
			expect(computedStyle.width).toBe('1px');
		});

		it('Treats custom properties in a reference cycle as invalid.', () => {
			document.body.appendChild(element);
			element.setAttribute(
				'style',
				'--a: var(--b); --b: var(--a); --c: var(--a, 4px); --d: var(--c); width: var(--a, 5px); height: var(--d);'
			);

			const computedStyle = window.getComputedStyle(element);

			expect(computedStyle.getPropertyValue('--a')).toBe('');
			expect(computedStyle.getPropertyValue('--b')).toBe('');
			expect(computedStyle.getPropertyValue('--c')).toBe('4px');
			expect(computedStyle.width).toBe('5px');
			expect(computedStyle.height).toBe('4px');
		});
	});
});
