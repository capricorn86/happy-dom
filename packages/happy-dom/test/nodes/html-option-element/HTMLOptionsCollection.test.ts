import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement';
import HTMLOptionElement from '../../../src/nodes/html-option-element/HTMLOptionElement';
import { DOMException } from '../../../src';

describe('HTMLOptionsCollection', () => {
	let window: IWindow;
	let document: IDocument;

	beforeEach(() => {
		window = new Window();
		document = window.document;
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('get selectedindex()', () => {
		it('Returns the index of the first option element in the list of options in tree order that has its selectedness set to true.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			option1.selected = true;
			option1.value = 'option1';
			option2.value = 'option2';
			select.appendChild(option1);
			select.appendChild(option2);

			expect(select.options.selectedIndex).toBe(0);
		});

		it('Returns -1 if there are no options.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			expect(select.options.selectedIndex).toBe(-1);
		});

		it('Returns -1 if no option is selected.', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			option2.value = 'option2';
			select.appendChild(option1);
			select.appendChild(option2);

			expect(select.options.selectedIndex).toBe(-1);
		});
	});

	describe('set selectedindex()', () => {
		it('Updates option.selected', () => {
			const select = <HTMLSelectElement>document.createElement('select');
			select.appendChild(document.createElement('option'));
			select.appendChild(document.createElement('option'));
			document.body.appendChild(select);

			expect((<HTMLOptionElement>select.options[0]).selected).toBe(false);
			expect((<HTMLOptionElement>select.options[1]).selected).toBe(false);

			select.options.selectedIndex = 1;

			expect((<HTMLOptionElement>select.options[0]).selected).toBe(false);
			expect((<HTMLOptionElement>select.options[1]).selected).toBe(true);

			select.options.selectedIndex = -1;

			expect((<HTMLOptionElement>select.options[0]).selected).toBe(false);
			expect((<HTMLOptionElement>select.options[1]).selected).toBe(false);
		});
	});

	describe('item()', () => {
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
			expect(select.options.selectedIndex).toBe(-1);

			select.options.selectedIndex = 1;
			expect(select.options.selectedIndex).toBe(1);

			// No option is selected after removing the selected option
			select.options.remove(1);
			expect(select.options.selectedIndex).toBe(-1);
		});
	});
});
