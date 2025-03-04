import Window from '../../../src/window/Window.js';
import Document from '../../../src/nodes/document/Document.js';
import HTMLSelectElement from '../../../src/nodes/html-select-element/HTMLSelectElement.js';
import HTMLOptionElement from '../../../src/nodes/html-option-element/HTMLOptionElement.js';
import ValidityState from '../../../src/validity-state/ValidityState.js';
import Event from '../../../src/event/Event.js';
import { beforeEach, describe, it, expect } from 'vitest';
import HTMLCollection from '../../../src/nodes/element/HTMLCollection.js';
import EventTarget from '../../../src/event/EventTarget.js';

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

	describe('constructor()', () => {
		it('Matches snapshot.', () => {
			element.innerHTML = '<option>Option 1</option><option>Option 2</option>';
			expect(element).toMatchSnapshot();
		});
	});

	for (const event of ['change', 'input']) {
		describe(`get on${event}()`, () => {
			it('Returns the event listener.', () => {
				const element = document.createElement('script');
				element.setAttribute(`on${event}`, 'window.test = 1');
				expect(element[`on${event}`]).toBeTypeOf('function');
				element[`on${event}`](new Event(event));
				expect(window['test']).toBe(1);
			});
		});

		describe(`set on${event}()`, () => {
			it('Sets the event listener.', () => {
				const element = document.createElement('script');
				element[`on${event}`] = () => {
					window['test'] = 1;
				};
				element.dispatchEvent(new Event(event));
				expect(element.getAttribute(`on${event}`)).toBe(null);
				expect(window['test']).toBe(1);
			});
		});
	}

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

			expect(element.value).toBe('option1');

			element.selectedIndex = -1;

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

		it('Should not dispatch "change" event', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			option1.value = 'option1';
			option2.value = 'option2';
			element.appendChild(option1);
			element.appendChild(option2);

			let dispatchedEvent: Event | null = null;
			element.addEventListener('change', (event: Event) => (dispatchedEvent = event));

			element.value = 'option1';

			expect(dispatchedEvent).toBeNull();
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

		it('Returns option with "selected" attribute is defined.', () => {
			const option1 = document.createElement('option');
			const option2 = document.createElement('option');

			option2.setAttribute('selected', '');

			element.appendChild(option1);
			element.appendChild(option2);

			expect(element.selectedIndex).toBe(1);

			option1.setAttribute('selected', '');

			expect(element.selectedIndex).toBe(0);

			option2.removeAttribute('selected');

			expect(element.selectedIndex).toBe(0);
		});
	});

	describe(`get selectedOptions()`, () => {
		it('Defaults to an empty HTMLCollection.', () => {
			expect(element.selectedOptions).toBeInstanceOf(HTMLCollection);
			expect(element.selectedOptions.length).toBe(0);
		});

		it('Returns selected options when "selected" attribute is defined.', () => {
			const option1 = document.createElement('option');
			const option2 = document.createElement('option');

			option2.setAttribute('selected', '');

			element.appendChild(option1);
			element.appendChild(option2);

			expect(element.selectedOptions.length).toBe(1);
			expect(element.selectedOptions[0]).toBe(option2);

			option1.setAttribute('selected', '');

			expect(element.selectedOptions.length).toBe(1);
			expect(element.selectedOptions[0]).toBe(option1);

			option2.removeAttribute('selected');

			expect(element.selectedOptions.length).toBe(1);
			expect(element.selectedOptions[0]).toBe(option1);
		});

		it('Returns selected options when "selected" attribute is defined for multiple options.', () => {
			element.setAttribute('multiple', '');
			const option1 = document.createElement('option');
			const option2 = document.createElement('option');

			option2.setAttribute('selected', '');

			element.appendChild(option1);
			element.appendChild(option2);

			expect(element.selectedOptions.length).toBe(1);
			expect(element.selectedOptions[0] === option2).toBe(true);

			option1.setAttribute('selected', '');

			expect(element.selectedOptions.length).toBe(2);
			expect(element.selectedOptions[0] === option1).toBe(true);
			expect(element.selectedOptions[1] === option2).toBe(true);

			option2.removeAttribute('selected');

			expect(element.selectedOptions.length).toBe(1);
			expect(element.selectedOptions[0] === option1).toBe(true);
		});
	});

	describe('get symbol()', () => {
		it('returns existing symbol properties', () => {
			const symbol = Symbol('test');
			element[symbol] = 'test';
			expect(element[symbol]).toBe('test');
		});

		it('ignores missing symbol properties', () => {
			const symbol = Symbol('other-test');

			expect(element[symbol]).toBe(undefined);

			// https://github.com/capricorn86/happy-dom/issues/1526
			expect(symbol in element).toBe(false);
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

			element.selectedIndex = <number>(<unknown>undefined);
			expect(element.options.selectedIndex).toBe(0);

			element.selectedIndex = 1000;
			expect(element.options.selectedIndex).toBe(-1);
		});

		it('Should not dispatch "change" event', () => {
			const option1 = document.createElement('option');
			const option2 = document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);

			let dispatchedEvent: Event | null = null;
			element.addEventListener('change', (event: Event) => (dispatchedEvent = event));

			element.selectedIndex = 1;

			expect(dispatchedEvent).toBeNull();
		});
	});

	describe(`get labels()`, () => {
		it('Returns associated labels', () => {
			const label1 = document.createElement('label');
			const label2 = document.createElement('label');
			const parentLabel = document.createElement('label');

			label1.setAttribute('for', 'select1');
			label2.setAttribute('for', 'select1');

			element.id = 'select1';

			parentLabel.appendChild(element);
			document.body.appendChild(label1);
			document.body.appendChild(label2);
			document.body.appendChild(parentLabel);

			const labels = element.labels;

			expect(labels.length).toBe(3);
			expect(labels[0] === label1).toBe(true);
			expect(labels[1] === label2).toBe(true);
			expect(labels[2] === parentLabel).toBe(true);
		});
	});

	describe('get validity()', () => {
		it('Returns an instance of ValidityState.', () => {
			expect(element.validity).toBeInstanceOf(ValidityState);
		});
	});

	describe('get validationMessage()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
		});
	});

	describe('get tabIndex()', () => {
		it('Returns "0" by default.', () => {
			const element = document.createElement('select');
			expect(element.tabIndex).toBe(0);
		});

		it('Returns the attribute "tabindex" as a number.', () => {
			const element = document.createElement('select');
			element.setAttribute('tabindex', '5');
			expect(element.tabIndex).toBe(5);
		});

		it('Returns "0" for NaN numbers.', () => {
			const element = document.createElement('select');
			element.setAttribute('tabindex', 'invalid');
			expect(element.tabIndex).toBe(0);
		});
	});

	describe('set tabIndex()', () => {
		it('Sets the attribute "tabindex".', () => {
			const element = document.createElement('select');
			element.tabIndex = 5;
			expect(element.getAttribute('tabindex')).toBe('5');
			element.tabIndex = -1;
			expect(element.getAttribute('tabindex')).toBe('-1');
			element.tabIndex = <number>(<unknown>'invalid');
			expect(element.getAttribute('tabindex')).toBe('0');
		});
	});

	describe(`add()`, () => {
		it('Appends options.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);

			expect(element.length).toBe(2);
			expect(element.children.length).toBe(2);
			expect(element.options.length).toBe(2);
			expect(element[0] === option1).toBe(true);
			expect(element[1] === option2).toBe(true);
			expect(element.children[0] === option1).toBe(true);
			expect(element.children[1] === option2).toBe(true);
			expect(element.options[0] === option1).toBe(true);
			expect(element.options[1] === option2).toBe(true);
		});

		it('Appends an option before an index.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);
			element.add(option3, 1);

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
		});

		it('Appends an option before an option element.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);
			element.add(option3, option2);

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
		});
	});

	describe(`item()`, () => {
		it('Returns an option element on a specified index.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

			element.add(option1);
			element.add(option2);
			element.add(option3);

			expect(element.length).toBe(3);
			expect(element.options.length).toBe(3);
			expect(element.item(0) === option1).toBe(true);
			expect(element.item(1) === option2).toBe(true);
			expect(element.item(2) === option3).toBe(true);
			expect(element.options.item(0) === option1).toBe(true);
			expect(element.options.item(1) === option2).toBe(true);
			expect(element.options.item(2) === option3).toBe(true);
		});
	});

	describe(`appendChild()`, () => {
		it('Adds appended option or option group elements to the HTMLOptionsCollection.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

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
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');
			const div = <HTMLOptionElement>document.createElement('div');

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

		it('Should not dispatch "change" event', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

			let dispatchedEvent: Event | null = null;

			element.addEventListener('change', (event: Event) => (dispatchedEvent = event));

			element.appendChild(option1);
			element.appendChild(option2);
			element.appendChild(option3);

			expect(dispatchedEvent).toBeNull();
		});

		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);
			element.appendChild(option3);

			expect(option1.parentNode).toBe(element);
			expect(option2.parentNode).toBe(element);
			expect(option3.parentNode).toBe(element);

			expect(option1.parentElement).toBe(element);
			expect(option2.parentElement).toBe(element);
			expect(option3.parentElement).toBe(element);
		});
	});

	describe(`insertBefore()`, () => {
		it('Adds inserted option or option group elements to the HTMLOptionsCollection at correct index.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

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
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

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

		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

			element.appendChild(option1);
			element.appendChild(option2);
			element.insertBefore(option3, option2);

			expect(option1.parentNode).toBe(element);
			expect(option2.parentNode).toBe(element);
			expect(option3.parentNode).toBe(element);

			expect(option1.parentElement).toBe(element);
			expect(option2.parentElement).toBe(element);
			expect(option3.parentElement).toBe(element);
		});
	});

	describe(`removeChild()`, () => {
		it('Removes an option or option group elements from the HTMLOptionsCollection.', () => {
			const option1 = <HTMLOptionElement>document.createElement('option');
			const option2 = <HTMLOptionElement>document.createElement('option');
			const option3 = <HTMLOptionElement>document.createElement('option');

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

	describe('remove()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');

			select.remove();

			expect(document.body.children[0].children.length).toBe(0);
		});
	});

	describe('replaceWith()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');

			select.replaceWith(document.createElement('div'));

			expect(document.body.children[0].children[0].tagName).toBe('DIV');
		});
	});

	describe('before()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');

			select.before(document.createElement('div'));

			expect(document.body.children[0].children[0].tagName).toBe('DIV');
		});
	});

	describe('after()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');

			select.after(document.createElement('div'));

			expect(document.body.children[0].children[1].tagName).toBe('DIV');
		});
	});

	describe('append()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');
			const newOption = document.createElement('option');

			select.append(newOption);

			expect(select.children[1]).toBe(newOption);
		});
	});

	describe('prepend()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');
			const newOption = document.createElement('option');

			select.prepend(newOption);

			expect(select.children[0]).toBe(newOption);
		});
	});

	describe('replaceChildren()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');
			const newOption = document.createElement('option');

			select.replaceChildren(newOption);

			expect(select.children[0]).toBe(newOption);
		});
	});

	describe('insertAdjacentElement()', () => {
		it('Sets "parentNode" of child elements to the proxy and not the original element.', () => {
			document.body.innerHTML = '<section><select><option>Option 1</option></select></section>';

			const select = <HTMLSelectElement>document.querySelector('select');

			select.insertAdjacentElement('beforebegin', document.createElement('div'));

			expect(document.body.children[0].children[0].tagName).toBe('DIV');
		});
	});

	describe('setCustomValidity()', () => {
		it('Returns validation message.', () => {
			element.setCustomValidity('Error message');
			expect(element.validationMessage).toBe('Error message');
			element.setCustomValidity(<string>(<unknown>null));
			expect(element.validationMessage).toBe('null');
			element.setCustomValidity('');
			expect(element.validationMessage).toBe('');
		});
	});

	describe('focus()', () => {
		it('Should set Document.activeElement to the proxy.', () => {
			document.body.appendChild(element);
			element.focus();
			expect(document.activeElement).toBe(element);
			element.blur();
			expect(document.activeElement).toBe(document.body);
		});
	});

	for (const method of ['checkValidity', 'reportValidity']) {
		describe(`${method}()`, () => {
			it('Returns "true" if the field is "disabled".', () => {
				const option1 = <HTMLOptionElement>document.createElement('option');
				option1.value = '';
				element.appendChild(option1);

				element.required = true;
				element.disabled = true;

				expect(element[method]()).toBe(true);
			});

			it('Returns "false" if invalid.', () => {
				const option1 = <HTMLOptionElement>document.createElement('option');
				option1.value = '';
				element.appendChild(option1);

				element.required = true;

				expect(element[method]()).toBe(false);
			});

			it('Triggers an "invalid" event when invalid.', () => {
				const option1 = <HTMLOptionElement>document.createElement('option');
				option1.value = '';
				element.appendChild(option1);

				element.required = true;

				let dispatchedEvent: Event | null = null;
				element.addEventListener('invalid', (event: Event) => (dispatchedEvent = event));

				element[method]();

				expect((<Event>(<unknown>dispatchedEvent)).type).toBe('invalid');
			});
		});
	}

	describe('dispatchEvent()', () => {
		it('Dispatches events using the proxy as the target.', () => {
			const event = new Event('test');
			let target: EventTarget | null = null;
			let currentTarget: EventTarget | null = null;

			element.addEventListener('test', (event: Event) => {
				target = event.target;
				currentTarget = event.currentTarget;
			});

			element.dispatchEvent(event);

			expect(target).toBe(element);
			expect(currentTarget).toBe(element);
		});
	});
});
