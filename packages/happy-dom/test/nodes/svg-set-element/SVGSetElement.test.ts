import SVGSetElement from '../../../src/nodes/svg-set-element/SVGSetElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGAnimationElement from '../../../src/nodes/svg-animation-element/SVGAnimationElement.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';

describe('SVGSetElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGSetElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'set');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGSetElement', () => {
			expect(element instanceof SVGSetElement).toBe(true);
		});

		it('Should be an instanceof SVGAnimationElement', () => {
			expect(element instanceof SVGAnimationElement).toBe(true);
		});
	});
});
