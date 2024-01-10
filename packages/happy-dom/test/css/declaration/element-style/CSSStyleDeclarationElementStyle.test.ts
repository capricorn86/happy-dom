import Window from '../../../../src/window/Window.js';
import IWindow from '../../../../src/window/IWindow.js';
import IDocument from '../../../../src/nodes/document/IDocument.js';
import IHTMLElement from '../../../../src/nodes/html-element/IHTMLElement.js';
import CSSStyleDeclarationElementStyle from '../../../../src/css/declaration/element-style/CSSStyleDeclarationElementStyle.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('CSSStyleDeclarationElementStyle', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLElement>document.createElement('div');
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
