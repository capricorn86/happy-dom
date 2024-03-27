import HTMLDivElement from '../../../src/nodes/html-div-element/HTMLDivElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLDivElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLDivElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLDivElement', () => {
			expect(element instanceof HTMLDivElement).toBe(true);
		});
	});
});
