import SVGTextElement from '../../../src/nodes/svg-text-element/SVGTextElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import SVGTextPositioningElement from '../../../src/nodes/svg-text-positioning-element/SVGTextPositioningElement.js';

describe('SVGTextElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGTextElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGTextElement', () => {
			expect(element instanceof SVGTextElement).toBe(true);
		});

		it('Should be an instanceof SVGTextPositioningElement', () => {
			expect(element instanceof SVGTextPositioningElement).toBe(true);
		});
	});
});
