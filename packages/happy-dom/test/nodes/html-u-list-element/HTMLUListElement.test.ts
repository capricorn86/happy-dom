import HTMLUListElement from '../../../src/nodes/html-u-list-element/HTMLUListElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLUListElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLUListElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('ul');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLUListElement', () => {
			expect(element instanceof HTMLUListElement).toBe(true);
		});
	});
});
