import HTMLSourceElement from '../../../src/nodes/html-source-element/HTMLSourceElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLSourceElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLSourceElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('source');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLSourceElement', () => {
			expect(element instanceof HTMLSourceElement).toBe(true);
		});
	});
});
