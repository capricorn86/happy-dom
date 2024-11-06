import SVGMetadataElement from '../../../src/nodes/svg-metadata-element/SVGMetadataElement.js';
import BrowserWindow from '../../../src/window/BrowserWindow.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import SVGElement from '../../../src/nodes/svg-element/SVGElement.js';
import Window from '../../../src/window/Window.js';

describe('SVGMetadataElement', () => {
	let window: BrowserWindow;
	let document: Document;
	let element: SVGMetadataElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElementNS('http://www.w3.org/2000/svg', 'metadata');
	});

	describe('constructor()', () => {
		it('Should be an instanceof SVGMetadataElement', () => {
			expect(element instanceof SVGMetadataElement).toBe(true);
		});

		it('Should be an instanceof SVGElement', () => {
			expect(element instanceof SVGElement).toBe(true);
		});
	});
});
