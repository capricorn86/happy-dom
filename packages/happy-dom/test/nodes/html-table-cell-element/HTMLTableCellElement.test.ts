import HTMLTableCellElement from '../../../src/nodes/html-table-cell-element/HTMLTableCellElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import DOMTokenList from '../../../src/dom/DOMTokenList.js';

describe('HTMLTableCellElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableCellElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('td');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableCellElement', () => {
			expect(document.createElement('th') instanceof HTMLTableCellElement).toBe(true);
			expect(document.createElement('td') instanceof HTMLTableCellElement).toBe(true);
		});
	});

	describe('get abbr()', () => {
		it('Should return an empty string by default', () => {
			expect(element.abbr).toBe('');
		});

		it('Should return the value', () => {
			element.setAttribute('abbr', 'test');
			expect(element.abbr).toBe('test');
		});
	});

	describe('set abbr()', () => {
		it('Should set the value', () => {
			element.abbr = 'test';
			expect(element.getAttribute('abbr')).toBe('test');
		});
	});

	describe('get cellIndex()', () => {
		it('Should return -1 by default', () => {
			expect(element.cellIndex).toBe(-1);
		});

		it('Should return the index', () => {
			const tr = document.createElement('tr');
			const td1 = document.createElement('td');
			const td2 = document.createElement('td');
			tr.appendChild(td1);
			tr.appendChild(td2);
			expect(td1.cellIndex).toBe(0);
			expect(td2.cellIndex).toBe(1);
		});
	});

	describe('get colSpan()', () => {
		it('Should return 1 by default', () => {
			expect(element.colSpan).toBe(1);
		});

		it('Should return the value', () => {
			element.setAttribute('colspan', '2');
			expect(element.colSpan).toBe(2);
		});

		it('Should return 1 if the value is invalid', () => {
			element.setAttribute('colspan', 'test');
			expect(element.colSpan).toBe(1);
		});

		it('Should return 1 if the value is less than 1', () => {
			element.setAttribute('colspan', '0');
			expect(element.colSpan).toBe(1);
		});
	});

	describe('set colSpan()', () => {
		it('Should set the value', () => {
			element.colSpan = 2;
			expect(element.getAttribute('colspan')).toBe('2');
		});

		it('Should set the value to 1 if the value is invalid', () => {
			element.colSpan = <number>(<unknown>'test');
			expect(element.getAttribute('colspan')).toBe('1');
		});

		it('Should set the value to 1 if the value is less than 1', () => {
			element.colSpan = 0;
			expect(element.getAttribute('colspan')).toBe('1');
		});
	});

	describe('get headers()', () => {
		it('Should return an empty string by default', () => {
			expect(element.headers).toBe('');
		});

		it('Should return the attribute value', () => {
			element.setAttribute('headers', 'header1 header2');
			expect(element.headers).toBe('header1 header2');
		});
	});

	describe('set headers()', () => {
		it('Should set the attribute value', () => {
			element.headers = 'header1 header2';
			expect(element.getAttribute('headers')).toBe('header1 header2');
		});

		it('Should stringify the value', () => {
			element.headers = <string>(<unknown>1);
			expect(element.getAttribute('headers')).toBe('1');
			element.headers = <string>(<unknown>null);
			expect(element.getAttribute('headers')).toBe('null');
		});
	});

	describe('get rowSpan()', () => {
		it('Should return 1 by default', () => {
			expect(element.rowSpan).toBe(1);
		});

		it('Should return the value', () => {
			element.setAttribute('rowspan', '2');
			expect(element.rowSpan).toBe(2);
		});

		it('Should return 1 if the value is invalid', () => {
			element.setAttribute('rowspan', 'test');
			expect(element.rowSpan).toBe(1);
		});

		it('Should return 1 if the value is less than 1', () => {
			element.setAttribute('rowspan', '0');
			expect(element.rowSpan).toBe(1);
		});
	});

	describe('set rowSpan()', () => {
		it('Should set the value', () => {
			element.rowSpan = 2;
			expect(element.getAttribute('rowspan')).toBe('2');
		});

		it('Should set the value to 1 if the value is invalid', () => {
			element.rowSpan = <number>(<unknown>'test');
			expect(element.getAttribute('rowspan')).toBe('1');
		});

		it('Should set the value to 1 if the value is less than 1', () => {
			element.rowSpan = 0;
			expect(element.getAttribute('rowspan')).toBe('1');
		});
	});

	describe('get scope()', () => {
		it('Should return an empty string by default', () => {
			expect(element.scope).toBe('');
		});

		it('Should return the value', () => {
			element.setAttribute('scope', 'test');
			expect(element.scope).toBe('test');
		});
	});

	describe('set scope()', () => {
		it('Should set the value', () => {
			element.scope = 'test';
			expect(element.getAttribute('scope')).toBe('test');
		});
	});
});
