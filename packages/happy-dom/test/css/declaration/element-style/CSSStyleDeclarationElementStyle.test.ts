import Window from '../../../../src/window/Window.js';
import Document from '../../../../src/nodes/document/Document.js';
import HTMLElement from '../../../../src/nodes/html-element/HTMLElement.js';
import CSSStyleDeclarationElementStyle from '../../../../src/css/declaration/element-style/CSSStyleDeclarationElementStyle.js';
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

	describe('getElementStyle()', () => {
		it('Is using a cache.', () => {
			document.body.appendChild(element);
			element.setAttribute('style', `border: 2px solid green;border-radius: 2px;font-size: 12px;`);

			const elementStyleDeclaration = new CSSStyleDeclarationElementStyle(element, false);
			const elementStyle = elementStyleDeclaration.getElementStyle();
			expect(elementStyle).toBe(elementStyleDeclaration.getElementStyle());

			const computedElementStyleDeclaration = new CSSStyleDeclarationElementStyle(element, true);
			const computedElementStyle = computedElementStyleDeclaration.getElementStyle();
			expect(computedElementStyle).toBe(computedElementStyleDeclaration.getElementStyle());

			element.setAttribute('style', `border: 2px solid green;`);

			expect(computedElementStyleDeclaration.getElementStyle()).not.toBe(elementStyle);
			expect(computedElementStyleDeclaration.getElementStyle()).not.toBe(computedElementStyle);
		});
	});
});
