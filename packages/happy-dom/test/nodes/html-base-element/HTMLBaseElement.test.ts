import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLBaseElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window({ url: 'https://www.somesite.com/test.html' });
		document = window.document;
	});

	describe('get target()', () => {
		it('Returns the "target" attribute.', () => {
			const element = document.createElement('base');
			element.setAttribute('target', 'test');
			expect(element.target).toBe('test');
		});
	});

	describe('set target()', () => {
		it('Sets the attribute "target".', () => {
			const element = document.createElement('base');
			element.target = 'test';
			expect(element.getAttribute('target')).toBe('test');
		});
	});

	describe('get href()', () => {
		it('Returns the "href" attribute.', () => {
			const element = document.createElement('base');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('https://www.somesite.com/test');
		});

		it('Returns the "href" attribute when scheme is http.', () => {
			const element = document.createElement('base');
			element.setAttribute('href', 'http://www.example.com');
			expect(element.href).toBe('http://www.example.com/');
		});

		it('Returns the "href" attribute when scheme is tel.', () => {
			const element = document.createElement('base');
			element.setAttribute('href', 'tel:+123456789');
			expect(element.href).toBe('tel:+123456789');
		});

		it('Returns the "href" attribute when scheme-relative', () => {
			const element = document.createElement('base');
			element.setAttribute('href', '//example.com');
			expect(element.href).toBe('https://example.com/');
		});

		it('Returns window location if "href" attribute is empty.', () => {
			const element = document.createElement('base');
			expect(element.href).toBe('https://www.somesite.com/test.html');
		});
	});

	describe('set href()', () => {
		it('Sets the attribute "href".', () => {
			const element = document.createElement('base');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});
	});
});
