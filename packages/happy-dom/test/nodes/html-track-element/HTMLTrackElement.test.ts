import HTMLTrackElement from '../../../src/nodes/html-track-element/HTMLTrackElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLTrackElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTrackElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('track');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTrackElement', () => {
			expect(element instanceof HTMLTrackElement).toBe(true);
		});
	});
});
