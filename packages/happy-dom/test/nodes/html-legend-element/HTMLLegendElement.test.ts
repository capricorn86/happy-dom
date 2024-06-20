import HTMLLegendElement from '../../../src/nodes/html-legend-element/HTMLLegendElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLLegendElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLLegendElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('legend');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLLegendElement', () => {
			expect(element instanceof HTMLLegendElement).toBe(true);
		});
	});
});
