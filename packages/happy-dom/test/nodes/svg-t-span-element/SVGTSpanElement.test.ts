import SVGTSpanElement from '../../../src/nodes/svg-t-span-element/SVGTSpanElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import SVGTextPositioningElement from '../../../src/nodes/svg-text-positioning-element/SVGTextPositioningElement.js';

describe('SVGTSpanElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGTSpanElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGTSpanElement', () => {
			expect(element instanceof SVGTSpanElement).toBe(true);
		});

		it('Should be an instanceof SVGTextPositioningElement', () => {
			expect(element instanceof SVGTextPositioningElement).toBe(true);
		});
	});
});
