import Window from '../../../src/window/Window.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLBaseElement from '../../../src/nodes/html-base-element/HTMLBaseElement.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('HTMLBaseElement', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('get target()', () => {
		it('Returns the "target" attribute.', () => {
			const element = <HTMLBaseElement>document.createElement('base');
			element.setAttribute('target', 'test');
			expect(element.target).toBe('test');
		});
	});

	describe('set target()', () => {
		it('Sets the attribute "target".', () => {
			const element = <HTMLBaseElement>document.createElement('base');
			element.target = 'test';
			expect(element.getAttribute('target')).toBe('test');
		});
	});

	describe('get href()', () => {
		it('Returns the "href" attribute.', () => {
			const element = <HTMLBaseElement>document.createElement('base');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('test');
		});

		it('Returns location.href if not set.', () => {
			const element = <HTMLBaseElement>document.createElement('base');
			document.location.href = 'https://localhost:8080/base/path/to/script/?key=value=1#test';
			expect(element.href).toBe('https://localhost:8080/base/path/to/script/?key=value=1#test');
		});
	});

	describe('set href()', () => {
		it('Sets the attribute "href".', () => {
			const element = <HTMLBaseElement>document.createElement('base');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});
	});
});
