import HTMLHeadingElement from '../../../src/nodes/html-heading-element/HTMLHeadingElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLHeadingElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLHeadingElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('h6');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLHeadingElement', () => {
			expect(element instanceof HTMLHeadingElement).toBe(true);
		});
	});
});
