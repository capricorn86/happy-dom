import HTMLEmbedElement from '../../../src/nodes/html-embed-element/HTMLEmbedElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLEmbedElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLEmbedElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('embed');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLEmbedElement', () => {
			expect(element instanceof HTMLEmbedElement).toBe(true);
		});
	});
});
