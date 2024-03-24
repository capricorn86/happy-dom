import HTMLHeadElement from '../../../src/nodes/html-head-element/HTMLHeadElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLHeadElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLHeadElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('head');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLHeadElement', () => {
			expect(element instanceof HTMLHeadElement).toBe(true);
		});
	});
});
