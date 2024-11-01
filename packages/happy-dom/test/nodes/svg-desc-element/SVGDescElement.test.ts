import SVGDescElement from '../../../src/nodes/svg-desc-element/SVGDescElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';

describe('SVGDescElement', () => {
	let window: Window;
	let document: Document;
	let element: SVGDescElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGDescElement', () => {
			expect(element instanceof SVGDescElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});
});
