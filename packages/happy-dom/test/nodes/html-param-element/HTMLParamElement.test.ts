import HTMLParamElement from '../../../src/nodes/html-param-element/HTMLParamElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLParamElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLParamElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('param');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLParamElement', () => {
			expect(element instanceof HTMLParamElement).toBe(true);
		});
	});
});
