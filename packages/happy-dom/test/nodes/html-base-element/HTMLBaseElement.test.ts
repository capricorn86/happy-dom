import Window from '../../../src/window/Window.js';
import IWindow from '../../../src/window/IWindow.js';
import IDocument from '../../../src/nodes/document/IDocument.js';
import IHTMLBaseElement from '../../../src/nodes/html-base-element/IHTMLBaseElement.js';
import { beforeEach, afterEach, describe, it, expect } from 'vitest';

describe('HTMLBaseElement', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	describe('get target()', () => {
		it('Returns the "target" attribute.', () => {
			const element = <IHTMLBaseElement>document.createElement('base');
			element.setAttribute('target', 'test');
			expect(element.target).toBe('test');
		});
	});

	describe('set target()', () => {
		it('Sets the attribute "target".', () => {
			const element = <IHTMLBaseElement>document.createElement('base');
			element.target = 'test';
			expect(element.getAttribute('target')).toBe('test');
		});
	});

	describe('get href()', () => {
		it('Returns the "href" attribute.', () => {
			const element = <IHTMLBaseElement>document.createElement('base');
			element.setAttribute('href', 'test');
			expect(element.href).toBe('test');
		});

		it('Returns location.href if not set.', () => {
			const element = <IHTMLBaseElement>document.createElement('base');
			document.location.href = 'https://localhost:8080/base/path/to/script/?key=value=1#test';
			expect(element.href).toBe('https://localhost:8080/base/path/to/script/?key=value=1#test');
		});
	});

	describe('set href()', () => {
		it('Sets the attribute "href".', () => {
			const element = <IHTMLBaseElement>document.createElement('base');
			element.href = 'test';
			expect(element.getAttribute('href')).toBe('test');
		});
	});
});
