import SVGGElement from '../../../src/nodes/svg-g-element/SVGGElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGGraphicsElement from '../../../src/nodes/svg-graphics-element/SVGGraphicsElement.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';

describe('SVGGElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGGElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGGElement', () => {
			expect(element instanceof SVGGElement).toBe(true);
		});

		it('Should be an instanceof SVGGraphicsElement', () => {
			expect(element instanceof SVGGraphicsElement).toBe(true);
		});
	});
});
