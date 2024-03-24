import HTMLPictureElement from '../../../src/nodes/html-picture-element/HTMLPictureElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLPictureElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLPictureElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('picture');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLPictureElement', () => {
			expect(element instanceof HTMLPictureElement).toBe(true);
		});
	});
});
