import Window from '../../../src/window/Window';
import Document from '../../../src/nodes/document/Document';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement';
import HTMLOptionElement from 'src/nodes/html-option-element/HTMLOptionElement';

describe('HTMLSelectElement', () => {
	let window: Window;
	let document: Document;
	let element: HTMLSelectElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <HTMLSelectElement>document.createElement('select');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLSelectElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLSelectElement]');
		});
	});

	describe('get options()', () => {
		it('Reflects changes as options elements are added and removed from the DOM.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			element.appendChild(option1);

			expect(element.options.length).toBe(1);
			expect((<HTMLOptionElement>element.options[0]).value).toBe('option1');

			element.removeChild(option1);

			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');
			option2.value = 'option2';
			option3.value = 'option3';
			element.appendChild(option2);
			element.appendChild(option3);

			expect(element.options.length).toBe(2);
			expect((<HTMLOptionElement>element.options[0]).value).toBe('option2');
			expect((<HTMLOptionElement>element.options[1]).value).toBe('option3');
		});
	});

	describe('get value()', () => {
		it('Returns the value of the first option element in the list of options in tree order that has its selectedness set to true.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			option1.selected = true;
			option1.value = 'option1';
			option2.value = 'option2';
			element.appendChild(option1);
			element.appendChild(option2);

			expect(element.value).toBe('option1');
		});

		it('Returns empty string if there are no options.', () => {
			expect(element.value).toBe('');
		});

		it('Returns empty string if no option is selected.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			option2.value = 'option2';
			element.appendChild(option1);
			element.appendChild(option2);

			expect(element.value).toBe('');
		});
	});

	describe('set value()', () => {
		it('Sets options.selectedIndex.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			option2.value = 'option2';
			element.appendChild(option1);
			element.appendChild(option2);

			element.value = 'option1';

			expect(element.options.selectedIndex).toBe(0);
		});

		it('Trims and removes new lines.', () => {});
	});

	for (const property of ['disabled', 'autofocus', 'required', 'multiple']) {
		describe(`get ${property}()`, () => {
			it('Returns attribute value.', () => {
				expect(element[property]).toBe(false);
				element.setAttribute(property, '');
				expect(element[property]).toBe(true);
			});
		});

		describe(`set ${property}()`, () => {
			it('Sets attribute value.', () => {
				element[property] = true;
				expect(element.getAttribute(property)).toBe('');
			});
		});
	}

	describe(`get name()`, () => {
		it('Returns attribute value.', () => {
			expect(element.name).toBe('');
			element.setAttribute('name', 'value');
			expect(element.name).toBe('value');
		});
	});

	describe(`set name()`, () => {
		it('Sets attribute value.', () => {
			element.name = 'value';
			expect(element.getAttribute('name')).toBe('value');
		});
	});

	describe(`get selectedIndex()`, () => {
		it('Defaults to -1.', () => {
			expect(element.selectedIndex).toBe(-1);
		});

		it('Returns options selectedIndex.', () => {
			element.appendChild(document.createElement('option'));
			element.appendChild(document.createElement('option'));

			element.options.selectedIndex = 1;
			expect(element.selectedIndex).toBe(1);
		});
	});

	describe(`set selectedIndex()`, () => {
		it('Allows -1', () => {
			element.selectedIndex = -1;
		});

		it('Sets options selectedIndex.', () => {
			element.appendChild(document.createElement('option'));
			element.appendChild(document.createElement('option'));

			element.selectedIndex = 1;
			expect(element.options.selectedIndex).toBe(1);
		});
	});
});
