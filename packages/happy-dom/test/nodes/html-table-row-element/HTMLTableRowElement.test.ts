import HTMLTableRowElement from '../../../src/nodes/html-table-row-element/HTMLTableRowElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';

describe('HTMLTableRowElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableRowElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('tr');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableRowElement', () => {
			expect(element instanceof HTMLTableRowElement).toBe(true);
		});
	});

	describe('get rows()', () => {
		it('Returns an HTMLCollection of <th> and <td> elements', () => {
			expect(element.cells).instanceOf(HTMLCollection);
			expect(element.cells.length).toBe(0);
			element.innerHTML = '<div><th></th><td></td><th></th></div>';
			expect(element.innerHTML).toBe('<div></div><th></th><td></td><th></th>');
			expect(element.cells.length).toBe(3);
			expect(element.cells[0]).toBe(element.children[1]);
			expect(element.cells[1]).toBe(element.children[2]);
			expect(element.cells[2]).toBe(element.children[3]);
		});
	});

	describe('get rowIndex()', () => {
		it('Should return -1 by default', () => {
			expect(element.rowIndex).toBe(-1);
		});

		it('Should return the index', () => {
			const table = document.createElement('table');
			const tr1 = document.createElement('tr');
			const tr2 = document.createElement('tr');
			table.appendChild(tr1);
			table.appendChild(tr2);
			expect(tr1.rowIndex).toBe(0);
			expect(tr2.rowIndex).toBe(1);
		});
	});

	describe('get sectionRowIndex()', () => {
		it('Should return -1 by default', () => {
			expect(element.sectionRowIndex).toBe(-1);
		});

		it('Should return the index', () => {
			const tbody = document.createElement('tbody');
			const tr1 = document.createElement('tr');
			const tr2 = document.createElement('tr');
			tbody.appendChild(tr1);
			tbody.appendChild(tr2);
			expect(tr1.sectionRowIndex).toBe(0);
			expect(tr2.sectionRowIndex).toBe(1);
		});
	});

	describe('insertCell()', () => {
		it('Inserts a new cell at the end', () => {
			const cell = element.insertCell();
			expect(element.childNodes[0]).toBe(cell);
			expect(element.innerHTML).toBe('<td></td>');

			element.innerHTML = '<div><td>test</td></div>';
			expect(element.innerHTML).toBe('<div></div><td>test</td>');
			const cell2 = element.insertCell();
			expect(element.childNodes[2]).toBe(cell2);
			expect(element.innerHTML).toBe('<div></div><td>test</td><td></td>');

			element.innerHTML = '<th>test</th>';
			expect(element.innerHTML).toBe('<th>test</th>');
			const cell3 = element.insertCell();
			expect(element.childNodes[1]).toBe(cell3);
			expect(element.innerHTML).toBe('<th>test</th><td></td>');
		});

		it('Inserts a new cell at the given index', () => {
			element.innerHTML = '<div><td>test</td><td>test</td></div>';
			const cell = element.insertCell(1);
			expect(element.childNodes[2]).toBe(cell);
			expect(element.innerHTML).toBe('<div></div><td>test</td><td></td><td>test</td>');
		});

		it('Inserts a new cell at the end if the index is -1', () => {
			element.innerHTML = '<td>test</td><td>test</td>';
			const cell = element.insertCell(-1);
			expect(element.childNodes[2]).toBe(cell);
		});

		it('Inserts a new cell at the end if the index is not a number', () => {
			element.innerHTML = '<td>test</td><td>test</td>';
			const cell = element.insertCell(<number>(<unknown>'test'));
			expect(element.childNodes[2]).toBe(cell);
		});

		it('Inserts a new cell at the end if the index is equal to the length of cells', () => {
			element.innerHTML = '<td>test</td><td>test</td>';
			const cell = element.insertCell(2);
			expect(element.childNodes[2]).toBe(cell);
		});

		it('Throws an error if the index is less than -1', () => {
			expect(() => {
				element.insertCell(-2);
			}).toThrow(
				"Failed to execute 'insertCell' on 'HTMLTableRowElement': The index provided (-2) is less than -1."
			);
		});

		it('Throws an error if the index is greater than the number of cells', () => {
			element.innerHTML = '<td>test</td><td>test</td>';
			expect(() => {
				element.insertCell(3);
			}).toThrow(
				"Failed to execute 'insertCell' on 'HTMLTableRowElement': The index provided (3) is greater than the number of cells (2)."
			);
		});
	});

	describe('deleteCell()', () => {
		it('Removes the cell at the given index', () => {
			element.innerHTML = '<td>Row 1</td><td>Row 2</td><td>Row 3</td>';
			element.deleteCell(1);
			expect(element.childNodes.length).toBe(2);
			expect(element.innerHTML).toBe('<td>Row 1</td><td>Row 3</td>');
		});

		it('Removes the last cell if the index is -1', () => {
			element.innerHTML = '<td>Row 1</td><td>Row 2</td><td>Row 3</td>';
			element.deleteCell(-1);
			expect(element.childNodes.length).toBe(2);
			expect(element.innerHTML).toBe('<td>Row 1</td><td>Row 2</td>');
		});

		it('Removes the last cell if the index is not a number', () => {
			element.innerHTML = '<td>Row 1</td><td>Row 2</td><td>Row 3</td>';
			element.deleteCell(<number>(<unknown>'test'));
			expect(element.childNodes.length).toBe(2);
			expect(element.innerHTML).toBe('<td>Row 1</td><td>Row 2</td>');
		});

		it('Throws an error if the index is less than -1', () => {
			expect(() => {
				element.deleteCell(-2);
			}).toThrow(
				"Failed to execute 'deleteCell' on 'HTMLTableRowElement': The index provided (-2) is less than -1."
			);
		});

		it('Throws an error if the index is greater than the number of cells', () => {
			element.innerHTML = '<td>test</td><td>test</td>';
			expect(() => {
				element.deleteCell(2);
			}).toThrow(
				"Failed to execute 'deleteCell' on 'HTMLTableRowElement': The index provided (2) is greater than the number of cells in the row (2)."
			);
		});
	});
});
