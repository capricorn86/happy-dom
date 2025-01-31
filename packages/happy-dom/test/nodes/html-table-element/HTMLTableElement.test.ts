import HTMLTableElement from '../../../src/nodes/html-table-element/HTMLTableElement.js';
import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLTableCaptionElement from '../../../src/nodes/html-table-caption-element/HTMLTableCaptionElement.js';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';

describe('HTMLTableElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLTableElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('table');
	});

	describe('constructor()', () => {
		it('Should be an instanceof HTMLTableElement', () => {
			expect(element instanceof HTMLTableElement).toBe(true);
		});
	});

	describe('get caption()', () => {
		it('Should return null by default', () => {
			expect(element.caption).toBe(null);
		});

		it('Returns the first <caption> element', () => {
			const div = document.createElement('div');
			const caption = document.createElement('caption');
			div.appendChild(caption);
			element.appendChild(div);
			expect(element.caption).toBe(caption);
		});
	});

	describe('set caption()', () => {
		it('Sets the caption', () => {
			const caption = document.createElement('caption');
			element.caption = caption;
			expect(element.caption).toBe(caption);
			expect(element.childNodes[0]).toBe(caption);
		});

		it('Inserts the caption before the first element', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const caption = document.createElement('caption');
			element.caption = caption;
			expect(element.caption).toBe(caption);
			expect(element.childNodes[0]).toBe(caption);
		});

		it('Removes the previous caption', () => {
			const caption1 = document.createElement('caption');
			const caption2 = document.createElement('caption');
			const div = document.createElement('div');

			div.appendChild(caption1);
			element.appendChild(div);

			element.caption = caption2;

			expect(element.caption).toBe(caption2);
			expect(element.childNodes[0]).toBe(caption2);
			expect(element.innerHTML).toBe('<caption></caption><div></div>');
		});

		it('Removes the previous caption when setting to null', () => {
			const caption = document.createElement('caption');
			element.caption = caption;
			element.caption = null;
			expect(element.caption).toBe(null);
			expect(element.innerHTML).toBe('');
		});

		it('Throws an error if caption is not a HTMLTableCaptionElement', () => {
			expect(() => {
				element.caption = document.createElement('div');
			}).toThrow(
				"Failed to set the 'caption' property on 'HTMLTableElement': Failed to convert value to 'HTMLTableCaptionElement'."
			);

			expect(() => {
				element.caption = <HTMLTableCaptionElement>(<unknown>'test');
			}).toThrow(
				"Failed to set the 'caption' property on 'HTMLTableElement': Failed to convert value to 'HTMLTableCaptionElement'."
			);
		});
	});

	describe('get tHead()', () => {
		it('Should return null by default', () => {
			expect(element.tHead).toBe(null);
		});

		it('Returns the <thead> element', () => {
			const div = document.createElement('div');
			const thead = document.createElement('thead');
			div.appendChild(thead);
			element.appendChild(div);
			expect(element.tHead).toBe(thead);
		});
	});

	describe('set tHead()', () => {
		it('Sets the thead', () => {
			const thead = document.createElement('thead');
			element.tHead = thead;
			expect(element.tHead).toBe(thead);
			expect(element.childNodes[0]).toBe(thead);
		});

		it('Inserts the thead before the first element', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const thead = document.createElement('thead');
			element.tHead = thead;
			expect(element.tHead).toBe(thead);
			expect(element.childNodes[0]).toBe(thead);
		});

		it('Inserts the thead before the first element that is neither a <caption>, nor a <colgroup>', () => {
			element.innerHTML = '<caption></caption><colgroup></colgroup><tr><td>test</td></tr>';
			const thead = document.createElement('thead');
			element.tHead = thead;
			expect(element.tHead).toBe(thead);
			expect(element.childNodes[2]).toBe(thead);
		});

		it('Removes the previous thead', () => {
			const thead1 = document.createElement('thead');
			const thead2 = document.createElement('thead');
			const div = document.createElement('div');

			div.appendChild(thead1);
			element.appendChild(div);

			element.tHead = thead2;

			expect(element.tHead).toBe(thead2);
			expect(element.childNodes[0]).toBe(thead2);
			expect(element.innerHTML).toBe('<thead></thead><div></div>');
		});

		it('Throws an error if thead is not a HTMLTableSectionElement', () => {
			expect(() => {
				element.tHead = document.createElement('div');
			}).toThrow(
				"Failed to set the 'tHead' property on 'HTMLTableElement': Failed to convert value to 'HTMLTableSectionElement'."
			);

			expect(() => {
				element.tHead = <HTMLTableCaptionElement>(<unknown>'test');
			}).toThrow(
				"Failed to set the 'tHead' property on 'HTMLTableElement': Failed to convert value to 'HTMLTableSectionElement'."
			);
		});
	});

	describe('get tFoot()', () => {
		it('Should return null by default', () => {
			expect(element.tFoot).toBe(null);
		});

		it('Returns the <tfoot> element', () => {
			const div = document.createElement('div');
			const tfoot = document.createElement('tfoot');
			div.appendChild(tfoot);
			element.appendChild(div);
			expect(element.tFoot).toBe(tfoot);
		});
	});

	describe('set tFoot()', () => {
		it('Sets the tfoot', () => {
			const tfoot = document.createElement('tfoot');
			element.tFoot = tfoot;
			expect(element.tFoot).toBe(tfoot);
			expect(element.childNodes[0]).toBe(tfoot);
		});

		it('Inserts the tfoot before the first element', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const tfoot = document.createElement('tfoot');
			element.tFoot = tfoot;
			expect(element.tFoot).toBe(tfoot);
			expect(element.childNodes[0]).toBe(tfoot);
		});

		it('Inserts the tfoot before the first element that is neither a <caption>, <colgroup> nor a <thead>', () => {
			element.innerHTML =
				'<caption></caption><colgroup></colgroup><thead></thead><tr><td>test</td></tr>';
			const tfoot = document.createElement('tfoot');
			element.tFoot = tfoot;
			expect(element.tFoot).toBe(tfoot);
			expect(element.childNodes[3]).toBe(tfoot);
		});

		it('Removes the previous tfoot', () => {
			const tfoot1 = document.createElement('tfoot');
			const tfoot2 = document.createElement('tfoot');
			const div = document.createElement('div');

			div.appendChild(tfoot1);
			element.appendChild(div);

			element.tFoot = tfoot2;

			expect(element.tFoot).toBe(tfoot2);
			expect(element.childNodes[0]).toBe(tfoot2);
			expect(element.innerHTML).toBe('<tfoot></tfoot><div></div>');
		});

		it('Throws an error if tfoot is not a HTMLTableSectionElement', () => {
			expect(() => {
				element.tFoot = document.createElement('div');
			}).toThrow(
				"Failed to set the 'tFoot' property on 'HTMLTableElement': Failed to convert value to 'HTMLTableSectionElement'."
			);

			expect(() => {
				element.tFoot = <HTMLTableCaptionElement>(<unknown>'test');
			}).toThrow(
				"Failed to set the 'tFoot' property on 'HTMLTableElement': Failed to convert value to 'HTMLTableSectionElement'."
			);
		});
	});

	describe('get rows()', () => {
		it('Returns an HTMLCollection of <tr> elements', () => {
			expect(element.rows).instanceOf(HTMLCollection);
			expect(element.rows.length).toBe(0);
			element.innerHTML =
				'<tbody><tr><td>test</td></tr><tr><td>test</td></tr></tbody><tbody><tr><td>test</td></tr><tr><td>test</td></tr></tbody>';
			expect(element.rows.length).toBe(4);
			expect(element.rows[0]).toBe(element.children[0].children[0]);
			expect(element.rows[1]).toBe(element.children[0].children[1]);
			expect(element.rows[2]).toBe(element.children[1].children[0]);
			expect(element.rows[3]).toBe(element.children[1].children[1]);
		});
	});

	describe('get tBodies()', () => {
		it('Returns an HTMLCollection of <tbody> elements', () => {
			expect(element.tBodies).instanceOf(HTMLCollection);
			expect(element.tBodies.length).toBe(0);
			element.innerHTML =
				'<tbody><tr><td>test</td></tr></tbody><tbody><tr><td>test</td></tr></tbody>';
			expect(element.tBodies.length).toBe(2);
			expect(element.tBodies[0]).toBe(element.children[0]);
			expect(element.tBodies[1]).toBe(element.children[1]);
		});
	});

	describe('createTHead()', () => {
		it('Returns existing <thead>', () => {
			const thead = document.createElement('thead');
			element.appendChild(thead);
			expect(element.createTHead()).toBe(thead);
		});

		it('Inserts a new thead before the first element', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const thead = element.createTHead();
			expect(element.childNodes[0]).toBe(thead);
		});

		it('Inserts a new thead before the first element that is neither a <caption>, nor a <colgroup>', () => {
			element.innerHTML = '<caption></caption><colgroup></colgroup><tr><td>test</td></tr>';
			const thead = element.createTHead();
			expect(element.childNodes[2]).toBe(thead);
		});
	});

	describe('deleteTHead()', () => {
		it('Removes the <thead> element', () => {
			const thead = document.createElement('thead');
			element.appendChild(thead);
			element.deleteTHead();
			expect(element.childNodes.length).toBe(0);
		});
	});

	describe('createTFoot()', () => {
		it('Returns existing <tfoot>', () => {
			const tfoot = document.createElement('tfoot');
			element.appendChild(tfoot);
			expect(element.createTFoot()).toBe(tfoot);
		});

		it('Inserts a new tfoot before the first element', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const tfoot = element.createTFoot();
			expect(element.childNodes[0]).toBe(tfoot);
		});

		it('Inserts a new tfoot before the first element that is neither a <caption>, <colgroup> nor a <thead>', () => {
			element.innerHTML =
				'<caption></caption><colgroup></colgroup><thead></thead><tr><td>test</td></tr>';
			const tfoot = element.createTFoot();
			expect(element.childNodes[3]).toBe(tfoot);
		});
	});

	describe('deleteTFoot()', () => {
		it('Removes the <tfoot> element', () => {
			const tfoot = document.createElement('tfoot');
			element.appendChild(tfoot);
			element.deleteTFoot();
			expect(element.childNodes.length).toBe(0);
		});
	});

	describe('createTBody()', () => {
		it('Returns a new <tbody>', () => {
			const tbody = element.createTBody();
			expect(element.childNodes[0]).toBe(tbody);
		});

		it('Inserts the tbody after the last <tbody>', () => {
			element.innerHTML =
				'<div><tbody><tr><td>test</td></tr></tbody><tbody><tr><td>test</td></tr></tbody></div>';
			const tbody = element.createTBody();
			expect(element.children[3]).toBe(tbody);
			expect(element.innerHTML).toBe(
				'<div></div><tbody><tr><td>test</td></tr></tbody><tbody><tr><td>test</td></tr></tbody><tbody></tbody>'
			);
		});

		it('Inserts the tbody as the last child if there are no <tbody>', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const tbody = element.createTBody();
			expect(element.childNodes[1]).toBe(tbody);
		});
	});

	describe('createCaption()', () => {
		it('Returns existing <caption>', () => {
			const caption = document.createElement('caption');
			element.appendChild(caption);
			expect(element.createCaption()).toBe(caption);
		});

		it('Inserts a new caption before the first element', () => {
			element.innerHTML = '<tr><td>test</td></tr>';
			const caption = element.createCaption();
			expect(element.childNodes[0]).toBe(caption);
		});
	});

	describe('deleteCaption()', () => {
		it('Removes the <caption> element', () => {
			const caption = document.createElement('caption');
			element.appendChild(caption);
			element.deleteCaption();
			expect(element.childNodes.length).toBe(0);
		});
	});

	describe('insertRow()', () => {
		it('Inserts a new row at the end', () => {
			const row = element.insertRow();
			expect(element.children[0].children[0]).toBe(row);
			expect(element.innerHTML).toBe('<tbody><tr></tr></tbody>');
			const row2 = element.insertRow();
			expect(element.children[0].children[1]).toBe(row2);
			expect(element.innerHTML).toBe('<tbody><tr></tr><tr></tr></tbody>');
		});

		it('Inserts a new row at the given index', () => {
			element.innerHTML = '<div><tr><td>test</td></tr><tr><td>test</td></tr></div>';
			const row = element.insertRow(1);
			expect(element.children[1].children[1]).toBe(row);
			expect(element.innerHTML).toBe(
				'<div></div><tbody><tr><td>test</td></tr><tr></tr><tr><td>test</td></tr></tbody>'
			);
		});

		it('Inserts a new row at the end if the index is -1', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			const row = element.insertRow(-1);
			expect(element.children[0].children[2]).toBe(row);
			expect(element.innerHTML).toBe(
				'<tbody><tr><td>test</td></tr><tr><td>test</td></tr><tr></tr></tbody>'
			);
		});

		it('Inserts a new row at the end if the index is not a number', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			const row = element.insertRow(<number>(<unknown>'test'));
			expect(element.children[0].children[2]).toBe(row);
			expect(element.innerHTML).toBe(
				'<tbody><tr><td>test</td></tr><tr><td>test</td></tr><tr></tr></tbody>'
			);
		});

		it('Inserts a new row at the end if the index is equal to the length of rows', () => {
			element.innerHTML = '<tbody><tr><td>test</td></tr><tr><td>test</td></tr></tbody>';
			const row = element.insertRow(2);
			expect(element.children[0].children[2]).toBe(row);
			expect(element.innerHTML).toBe(
				'<tbody><tr><td>test</td></tr><tr><td>test</td></tr><tr></tr></tbody>'
			);
		});

		it('Throws an error if the index is less than -1', () => {
			expect(() => {
				element.insertRow(-2);
			}).toThrow(
				"Failed to execute 'insertRow' on 'HTMLTableElement': The index provided (-2) is less than -1."
			);
		});

		it('Throws an error if the index is greater than the number of rows', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			expect(() => {
				element.insertRow(3);
			}).toThrow(
				"Failed to execute 'insertRow' on 'HTMLTableElement': The index provided (3) is greater than the number of rows (2)."
			);
		});
	});

	describe('deleteRow()', () => {
		it('Removes the row at the given index', () => {
			element.innerHTML = '<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr>';
			element.deleteRow(1);
			expect(element.children[0].children.length).toBe(2);
			expect(element.innerHTML).toBe(
				'<tbody><tr><td>Row 1</td></tr><tr><td>Row 3</td></tr></tbody>'
			);
		});

		it('Removes the last row if the index is -1', () => {
			element.innerHTML = '<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr>';
			element.deleteRow(-1);
			expect(element.children[0].children.length).toBe(2);
			expect(element.innerHTML).toBe(
				'<tbody><tr><td>Row 1</td></tr><tr><td>Row 2</td></tr></tbody>'
			);
		});

		it('Removes the last row if the index is not a number', () => {
			element.innerHTML = '<tr><td>Row 1</td></tr><tr><td>Row 2</td></tr><tr><td>Row 3</td></tr>';
			element.deleteRow(<number>(<unknown>'test'));
			expect(element.children[0].children.length).toBe(2);
			expect(element.innerHTML).toBe(
				'<tbody><tr><td>Row 1</td></tr><tr><td>Row 2</td></tr></tbody>'
			);
		});

		it('Throws an error if there are no arguments', () => {
			expect(() => {
				// @ts-expect-error -- We are intentionally calling this in an unsupported way (no arguments) for this test
				element.deleteRow();
			}).toThrow(
				"Failed to execute 'deleteRow' on 'HTMLTableElement': 1 argument required, but only 0 present."
			);
		});

		it('Throws an error if the index is less than -1', () => {
			expect(() => {
				element.deleteRow(-2);
			}).toThrow(
				"Failed to execute 'deleteRow' on 'HTMLTableElement': The index provided (-2) is less than -1."
			);
		});

		it('Throws an error if the index is greater than the number of rows', () => {
			element.innerHTML = '<tr><td>test</td></tr><tr><td>test</td></tr>';
			expect(() => {
				element.deleteRow(2);
			}).toThrow(
				"Failed to execute 'deleteRow' on 'HTMLTableElement': The index provided (2) is greater than the number of rows in the table (2)."
			);
		});
	});
});
