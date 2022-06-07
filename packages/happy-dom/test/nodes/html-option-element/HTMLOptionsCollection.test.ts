import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement';
import HTMLOptionElement from '../../../src/nodes/html-option-element/HTMLOptionElement';
import { DOMException } from '../../../src';

describe('HTMLOptionsCollection', () => {
	let window: Window;
	let document: Document;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe.skip('item()', () => {
		it('Returns node at index.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);
		});
	});

	describe('add()', () => {
		it('Adds item to the collection.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);

			const option2 = <HTMLOptionElement>document.createElement('option');
			select.options.add(option2);
			expect(select.options.item(1) === option2).toBe(true);
		});

		it('Throws error when before element doesnt exist.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);

			const option2 = <HTMLOptionElement>document.createElement('option');
			const optionThatDoesntExist = <HTMLOptionElement>document.createElement('option');
			expect(() => select.options.add(option2, optionThatDoesntExist)).toThrowError(DOMException);
		});

		it('Adds item to defined index.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			expect(select.options.item(0) === option).toBe(true);

			const option2 = <HTMLOptionElement>document.createElement('option');
			select.options.add(option2, 0);
			expect(select.options.item(0) === option2).toBe(true);
		});
	});

	describe('remove()', () => {
		it('Removes item from collection.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			select.appendChild(option);
			document.body.appendChild(select);
			select.options.remove(0);
			expect(select.options).toHaveLength(0);
		});

		it('Changes selectedIndex when element removed from collection.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option = document.createElement('option');
			const option2 = document.createElement('option');
			select.appendChild(option);
			select.appendChild(option2);
			document.body.appendChild(select);
			expect(select.selectedIndex).toBe(-1);

			select.options.selectedIndex = 1;
			expect(select.selectedIndex).toBe(1);

			select.options.remove(1);
			expect(select.options.selectedIndex).toBe(0);

			select.options.remove(0);
			expect(select.options.selectedIndex).toBe(-1);
		});
	});
});
