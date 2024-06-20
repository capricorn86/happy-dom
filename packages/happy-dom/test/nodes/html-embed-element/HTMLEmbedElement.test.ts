import HTMLEmbedElement from '../../../src/nodes/html-embed-element/HTMLEmbedElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLEmbedElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLEmbedElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('embed');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLEmbedElement', () => {
			expect(element instanceof HTMLEmbedElement).toBe(true);
		});
	});

	for (const property of ['height', 'width', 'type']) {
		describe(`get ${property}()`, () => {
			it(`Returns the "${property}" attribute.`, () => {
				element.setAttribute(property, 'value');
				expect(element[property]).toBe('value');
			});
		});

		describe(`set ${property}()`, () => {
			it(`Sets the attribute "${property}".`, () => {
				element[property] = 'value';
				expect(element.getAttribute(property)).toBe('value');
			});
		});
	}

	describe('get src()', () => {
		it('Returns the "src" attribute.', () => {
			element.setAttribute('src', 'test');
			expect(element.src).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('src', 'test');
			expect(element.src).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set src()', () => {
		it('Sets the attribute "src".', () => {
			element.src = 'test';
			expect(element.getAttribute('src')).toBe('test');
		});
	});
});
