import HTMLModElement from '../../../src/nodes/html-mod-element/HTMLModElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';

describe('HTMLModElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLModElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('ins');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLModElement for tag name "ins".', () => {
			expect(document.createElement('ins') instanceof HTMLModElement).toBe(true);
		});

		it('Should be an instanceof HTMLModElement for tag name "del".', () => {
			expect(document.createElement('del') instanceof HTMLModElement).toBe(true);
		});
	});

	describe('get cite()', () => {
		it('Returns the "cite" attribute.', () => {
			element.setAttribute('cite', 'test');
			expect(element.cite).toBe('test');
		});

		it('Returns URL relative to window location.', () => {
			window.happyDOM.setURL('https://localhost:8080/test/path/');
			element.setAttribute('cite', 'test');
			expect(element.cite).toBe('https://localhost:8080/test/path/test');
		});
	});

	describe('set cite()', () => {
		it('Sets the attribute "cite".', () => {
			element.cite = 'test';
			expect(element.getAttribute('cite')).toBe('test');
		});
	});

	describe('get dateTime()', () => {
		it(`Returns the attribute "datetime".`, () => {
			element.setAttribute('datetime', 'VALUE');
			expect(element.dateTime).toBe('VALUE');
		});
	});

	describe('set dateTime()', () => {
		it(`Sets the attribute "datetime".`, () => {
			element.dateTime = 'VALUE';
			expect(element.getAttribute('datetime')).toBe('VALUE');
		});
	});
});
