import HTMLPreElement from '../../../src/nodes/html-pre-element/HTMLPreElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLPreElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLPreElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('pre');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLPreElement', () => {
			expect(element instanceof HTMLPreElement).toBe(true);
		});
	});
});
