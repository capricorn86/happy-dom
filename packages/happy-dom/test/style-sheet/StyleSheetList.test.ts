import Window from '../../src/window/Window.js';
import type Document from '../../src/nodes/document/Document.js';
import type HTMLStyleElement from '../../src/nodes/html-style-element/HTMLStyleElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('StyleSheetList', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('item()', () => {
		it('Returns CSSStyleSheet or null at index.', () => {
			const element = <HTMLStyleElement>document.createElement('style');
			document.head.appendChild(element);
			expect(document.styleSheets.item(0)).toBe(element.sheet);
			expect(document.styleSheets.item(1)).toBeNull();
		});
	});
});
