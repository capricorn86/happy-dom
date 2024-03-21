import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLMetaElement from '../../../src/nodes/html-meta-element/HTMLMetaElement.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLMetaElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLMetaElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLMetaElement>document.createElement('meta');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLMetaElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLMetaElement]');
		});
	});

	describe('get content()', () => {
		it('Returns attribute value.', () => {
			expect(element.content).toBe('');
			element.setAttribute('content', 'value');
			expect(element.content).toBe('value');
		});
	});

	describe('set content()', () => {
		it('Sets attribute value.', () => {
			element.content = 'value';
			expect(element.getAttribute('content')).toBe('value');
		});
	});

	describe('get httpEquiv()', () => {
		it('Returns attribute value.', () => {
			expect(element.httpEquiv).toBe('');
			element.setAttribute('http-equiv', 'value');
			expect(element.httpEquiv).toBe('value');
		});
	});

	describe('set httpEquiv()', () => {
		it('Sets attribute value.', () => {
			element.httpEquiv = 'value';
			expect(element.getAttribute('http-equiv')).toBe('value');
		});
	});

	describe('get name()', () => {
		it('Returns attribute value.', () => {
			expect(element.name).toBe('');
			element.setAttribute('name', 'value');
			expect(element.name).toBe('value');
		});
	});

	describe('set name()', () => {
		it('Sets attribute value.', () => {
			element.name = 'value';
			expect(element.getAttribute('name')).toBe('value');
		});
	});

	describe('get scheme()', () => {
		it('Returns attribute value.', () => {
			expect(element.scheme).toBe('');
			element.setAttribute('scheme', 'value');
			expect(element.scheme).toBe('value');
		});
	});

	describe('set scheme()', () => {
		it('Sets attribute value.', () => {
			element.scheme = 'value';
			expect(element.getAttribute('scheme')).toBe('value');
		});
	});
});
