import Window from '../../../../src/window/Window.js';
import Document from '../../../../src/nodes/document/Document.js';
import HTMLElement from '../../../../src/nodes/html-element/HTMLElement.js';
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
	});
});
