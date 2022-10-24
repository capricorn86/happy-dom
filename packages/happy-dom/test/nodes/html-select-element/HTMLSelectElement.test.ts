import Window from '../../../src/window/Window';
import IWindow from '../../../src/window/IWindow';
import IDocument from '../../../src/nodes/document/IDocument';
import IHTMLSelectElement from '../../../src/nodes/html-select-element/IHTMLSelectElement';
import IHTMLOptionElement from '../../../src/nodes/html-option-element/IHTMLOptionElement';

describe('HTMLSelectElement', () => {
	let window: IWindow;
	let document: IDocument;
	let element: IHTMLSelectElement;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = <IHTMLSelectElement>document.createElement('select');
	});

	describe('Object.prototype.toString', () => {
		it('Returns `[object HTMLSelectElement]`', () => {
			expect(Object.prototype.toString.call(element)).toBe('[object HTMLSelectElement]');
		});
	});

	describe('get options()', () => {
		it('Reflects changes as options elements are added and removed from the DOM.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			element.appendChild(option1);

			expect(element.options.length).toBe(1);
			expect((<IHTMLOptionElement>element.options[0]).value).toBe('option1');

			element.removeChild(option1);

			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');
			option2.value = 'option2';
			option3.value = 'option3';
			element.appendChild(option2);
			element.appendChild(option3);

			expect(element.options.length).toBe(2);
			expect((<IHTMLOptionElement>element.options[0]).value).toBe('option2');
			expect((<IHTMLOptionElement>element.options[1]).value).toBe('option3');
		});
	});

	describe('get value()', () => {
		it('Returns the value of the first option element in the list of options in tree order that has its selectedness set to true.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
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
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			option2.value = 'option2';
			element.appendChild(option1);
			element.appendChild(option2);

			expect(element.value).toBe('option1');

			element.selectedIndex = -1;

			expect(element.value).toBe('');
		});
	});

	describe('set value()', () => {
		it('Sets options.selectedIndex.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			option2.value = 'option2';
			element.appendChild(option1);
			element.appendChild(option2);

			element.value = 'option1';

			expect(element.options.selectedIndex).toBe(0);
		});
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

		it('Ignores invalid values gracefully.', () => {
			element.appendChild(document.createElement('option'));
			element.appendChild(document.createElement('option'));

			expect(element.options.selectedIndex).toBe(0);

			element.selectedIndex = undefined;
			expect(element.options.selectedIndex).toBe(0);

			element.selectedIndex = 1000;
			expect(element.options.selectedIndex).toBe(-1);
		});
	});

	describe(`add()`, () => {
		it('Appends options.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);

			expect(element.length).toBe(2);
			expect(element.children.length).toBe(2);
			expect(element.options.length).toBe(2);
			expect(element[0]).toBe(option1);
			expect(element[1]).toBe(option2);
			expect(element.children[0]).toBe(option1);
			expect(element.children[1]).toBe(option2);
			expect(element.options[0]).toBe(option1);
			expect(element.options[1]).toBe(option2);
		});

		it('Appends an option before an index.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);
			element.add(option3, 1);

			expect(element.length).toBe(3);
			expect(element.children.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element[0]).toBe(option1);
			expect(element[1]).toBe(option3);
			expect(element[2]).toBe(option2);
			expect(element.children[0]).toBe(option1);
			expect(element.children[1]).toBe(option3);
			expect(element.children[2]).toBe(option2);
			expect(element.options[0]).toBe(option1);
			expect(element.options[1]).toBe(option3);
			expect(element.options[2]).toBe(option2);
		});

		it('Appends an option before an option element.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);
			element.add(option3, option2);

			expect(element.length).toBe(3);
			expect(element.children.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element[0]).toBe(option1);
			expect(element[1]).toBe(option3);
			expect(element[2]).toBe(option2);
			expect(element.children[0]).toBe(option1);
			expect(element.children[1]).toBe(option3);
			expect(element.children[2]).toBe(option2);
			expect(element.options[0]).toBe(option1);
			expect(element.options[1]).toBe(option3);
			expect(element.options[2]).toBe(option2);
		});
	});

	describe(`item()`, () => {
		it('Returns an option element on a specified index.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);
			element.add(option3);

			expect(element.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element.item(0)).toBe(option1);
			expect(element.item(1)).toBe(option2);
			expect(element.item(2)).toBe(option3);
			expect(element.options.item(0)).toBe(option1);
			expect(element.options.item(1)).toBe(option2);
			expect(element.options.item(2)).toBe(option3);
		});
	});

	describe(`appendChild()`, () => {
		it('Adds appended option or option group elements to the HTMLOptionsCollection.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);
			element.appendChild(option3);

			expect(element.length).toBe(3);
			expect(element.children.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element[0] === option1).toBe(true);
			expect(element[1] === option2).toBe(true);
			expect(element[2] === option3).toBe(true);
			expect(element.children[0] === option1).toBe(true);
			expect(element.children[1] === option2).toBe(true);
			expect(element.children[2] === option3).toBe(true);
			expect(element.options[0] === option1).toBe(true);
			expect(element.options[1] === option2).toBe(true);
			expect(element.options[2] === option3).toBe(true);
			expect(element.item(0) === option1).toBe(true);
			expect(element.item(1) === option2).toBe(true);
			expect(element.item(2) === option3).toBe(true);
		});

		it('Does not include other types of elements in the HTMLOptionsCollection.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');
			const div = <IHTMLOptionElement>document.createElement('div');

			element.appendChild(option1);
			element.appendChild(option2);
			element.appendChild(div);
			element.appendChild(option3);

			expect(element.length).toBe(3);
			expect(element.children.length).toBe(4);
			expect(element.options.length).toBe(3);
			expect(element[0] === option1).toBe(true);
			expect(element[1] === option2).toBe(true);
			expect(element[2] === option3).toBe(true);
			expect(element.children[0] === option1).toBe(true);
			expect(element.children[1] === option2).toBe(true);
			expect(element.children[2] === div).toBe(true);
			expect(element.children[3] === option3).toBe(true);
			expect(element.options[0] === option1).toBe(true);
			expect(element.options[1] === option2).toBe(true);
			expect(element.options[2] === option3).toBe(true);
			expect(element.item(0) === option1).toBe(true);
			expect(element.item(1) === option2).toBe(true);
			expect(element.item(2) === option3).toBe(true);
		});
	});

	describe(`insertBefore()`, () => {
		it('Adds inserted option or option group elements to the HTMLOptionsCollection at correct index.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);
			element.insertBefore(option3, option2);

			expect(element.length).toBe(3);
			expect(element.children.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element[0] === option1).toBe(true);
			expect(element[1] === option3).toBe(true);
			expect(element[2] === option2).toBe(true);
			expect(element.children[0] === option1).toBe(true);
			expect(element.children[1] === option3).toBe(true);
			expect(element.children[2] === option2).toBe(true);
			expect(element.options[0] === option1).toBe(true);
			expect(element.options[1] === option3).toBe(true);
			expect(element.options[2] === option2).toBe(true);
			expect(element.item(0) === option1).toBe(true);
			expect(element.item(1) === option3).toBe(true);
			expect(element.item(2) === option2).toBe(true);
		});

		it('Appends inserted option or option group elements to the HTMLOptionsCollection if referenceNode is null.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);
			element.insertBefore(option3, null);

			expect(element.length).toBe(3);
			expect(element.children.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element[0] === option1).toBe(true);
			expect(element[1] === option2).toBe(true);
			expect(element[2] === option3).toBe(true);
			expect(element.children[0] === option1).toBe(true);
			expect(element.children[1] === option2).toBe(true);
			expect(element.children[2] === option3).toBe(true);
			expect(element.options[0] === option1).toBe(true);
			expect(element.options[1] === option2).toBe(true);
			expect(element.options[2] === option3).toBe(true);
			expect(element.item(0) === option1).toBe(true);
			expect(element.item(1) === option2).toBe(true);
			expect(element.item(2) === option3).toBe(true);
		});
	});

	describe(`removeChild()`, () => {
		it('Removes an option or option group elements from the HTMLOptionsCollection.', () => {
			const option1 = <IHTMLOptionElement>document.createElement('option');
			const option2 = <IHTMLOptionElement>document.createElement('option');
			const option3 = <IHTMLOptionElement>document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);
			element.appendChild(option3);

			element.removeChild(option2);

			expect(element.length).toBe(2);
			expect(element.children.length).toBe(2);
			expect(element.options.length).toBe(2);
			expect(element[0] === option1).toBe(true);
			expect(element[1] === option3).toBe(true);
			expect(element.children[0] === option1).toBe(true);
			expect(element.children[1] === option3).toBe(true);
			expect(element.options[0] === option1).toBe(true);
			expect(element.options[1] === option3).toBe(true);
			expect(element.item(0) === option1).toBe(true);
			expect(element.item(1) === option3).toBe(true);
		});
	});
});
