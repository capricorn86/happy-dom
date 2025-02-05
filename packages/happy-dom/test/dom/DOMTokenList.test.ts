import Window from '../../src/window/Window.js';
import Document from '../../src/nodes/document/Document.js';
import Element from '../../src/nodes/element/Element.js';
import { beforeEach, describe, it, expect } from 'vitest';
import DOMTokenList from '../../src/dom/DOMTokenList.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';

describe('DOMTokenList', () => {
	let window: Window;
	let document: Document;
	let element: Element;
	let classList: DOMTokenList;

	beforeEach(() => {
		window = new Window();
		document = window.document;
		element = document.createElement('div');
		classList = element.classList;
	});

	describe('add()', () => {
		it('Adds a class to the list.', () => {
			classList.add('class1');

			expect(element.className).toBe('class1');

			classList.add('class2');
			classList.add('class3');

			expect(element.className).toBe('class1 class2 class3');

			classList.add('class2');
			classList.add('class3');

			expect(element.className).toBe('class1 class2 class3');
		});

		it('Adds multiple classes to the list.', () => {
			classList.add('class1', 'class2', 'class3');
			expect(element.className).toBe('class1 class2 class3');
		});
	});

	describe('get length()', () => {
		it('Is an integer representing the number of objects stored in the object.', () => {
			expect(classList.length).toBe(0);

			classList.add('class1');

			expect(classList.length).toBe(1);
			expect(classList[0]).toBe('class1');

			classList.add('class2');

			expect(classList.length).toBe(2);
			expect(classList[0]).toBe('class1');
			expect(classList[1]).toBe('class2');

			classList.value = 'otherClass';

			expect(classList.length).toBe(1);
			expect(classList[0]).toBe('otherClass');
			expect(classList[1]).toBe(undefined);

			classList.value = '';

			expect(classList.length).toBe(0);
			expect(classList[0]).toBe(undefined);
		});
	});

	describe('get value()', () => {
		it('Returns the attribute value.', () => {
			classList.add('class1');
			classList.add('class2');
			classList.add('class3');
			expect(classList.value).toBe('class1 class2 class3');

			classList.add('class1');
			classList.add('class2');
			expect(classList.value).toBe('class1 class2 class3');
		});
	});

	describe('set value()', () => {
		it('Sets the attribute value.', () => {
			classList.value = 'class1 class2 class3';
			expect(element.className).toBe('class1 class2 class3');
			expect(classList[2]).toBe('class3');
		});
	});

	describe('item()', () => {
		it('Returns an item in the list.', () => {
			classList.add('class1');
			expect(classList.item(0)).toBe('class1');
			expect(classList.item('0')).toBe('class1');
			expect(classList.item('a')).toBe('class1');
		});
	});

	describe('replace()', () => {
		it('Replaces the token with another one.', () => {
			classList.add('class1');
			classList.add('class2');
			classList.add('class3');
			expect(classList.replace('class1', 'class4')).toBe(true);
			expect(element.className).toBe('class4 class2 class3');
		});
	});

	describe('remove()', () => {
		it('Removes a class from the list.', () => {
			classList.add('class1');
			classList.remove('class1');
			expect(element.className).toBe('');
		});
	});

	describe('contains()', () => {
		it('Returns "true" if the list contains a class.', () => {
			classList.add('class1');
			expect(classList.contains('class1')).toBe(true);
			classList.add('class2');
			expect(classList.contains('class1')).toBe(true);
			expect(classList.contains('class2')).toBe(true);
		});
	});

	describe('toggle()', () => {
		it('Adds a class from the list when not existing.', () => {
			expect(classList.toggle('class1')).toBe(true);
			expect(element.className).toBe('class1');
		});

		it('Adds a class from the list when force is set.', () => {
			classList.add('class1');
			expect(classList.toggle('class1', true)).toBe(true);
			expect(classList.toggle('class2', true)).toBe(true);
			expect(element.className).toBe('class1 class2');
		});

		it('Removes a class from the list when existing.', () => {
			classList.add('class1');
			expect(classList.toggle('class1')).toBe(false);
			expect(element.className).toBe('');
		});

		it('Adds a class from the list when force is set.', () => {
			classList.add('class1');
			expect(classList.toggle('class1', false)).toBe(false);
			expect(classList.toggle('class2', false)).toBe(false);
			expect(element.className).toBe('');
		});
	});

	describe('values()', () => {
		it('A stringifier property that returns the value of the list as a string.', () => {
			element.className = 'class1 class2 class3';
			expect(typeof classList.values()[Symbol.iterator]).toEqual('function');
			expect(Array.from(classList.values())).toEqual(['class1', 'class2', 'class3']);
		});
	});

	describe('Iterator', () => {
		it('A stringifier property that returns the value of the list as a string.', () => {
			element.className = 'class1 class2 class3';
			expect(typeof classList[Symbol.iterator]).toEqual('function');
			expect(Array.from(classList)).toEqual(['class1', 'class2', 'class3']);
		});
	});

	describe('entries()', () => {
		it('Returns an iterator, allowing you to go through all key/value pairs contained in this object.', () => {
			element.className = 'class1 class2 class3';
			expect(Array.from(classList.entries())).toEqual([
				[0, 'class1'],
				[1, 'class2'],
				[2, 'class3']
			]);
		});
	});

	describe('forEach()', () => {
		it('Executes a provided callback function once for each DOMTokenList element.', () => {
			const items: Array<{ token: string; index: number }> = [];

			element.className = 'class1 class2 class3';

			classList.forEach((token: string, index: number) => {
				items.push({ token, index });
			});

			expect(items).toEqual([
				{
					index: 0,
					token: 'class1'
				},
				{
					index: 1,
					token: 'class2'
				},
				{
					index: 2,
					token: 'class3'
				}
			]);
		});
	});

	describe('keys()', () => {
		it('Returns an iterator, allowing you to go through all keys of the key/value pairs contained in this object.', () => {
			element.className = 'class1 class2 class3';
			expect(Array.from(classList.keys())).toEqual([0, 1, 2]);
		});
	});

	describe('toString()', () => {
		it('Returns list value as string', () => {
			element.className = 'class1 class2  class3';
			expect(element.classList.toString()).toEqual('class1 class2  class3');
		});
	});

	describe('supports()', () => {
		it('Returns true if the token is in the list', () => {
			const domTokenList = new DOMTokenList(PropertySymbol.illegalConstructor, element, 'rel', [
				'stylesheet',
				'modulepreload'
			]);
			expect(domTokenList.supports('stylesheet')).toBe(true);
			expect(domTokenList.supports('modulepreload')).toBe(true);
			expect(domTokenList.supports('unsupported')).toBe(false);
		});
	});

	describe('whitespace handling', () => {
		it('Normalizes whitespace to a single space', () => {
			element.className = ' class1  class2\nclass3 ';
			expect(Array.from(element.classList.values())).toEqual(['class1', 'class2', 'class3']);
			expect(element.classList.toString()).toEqual(' class1  class2\nclass3 ');
		});
	});
});
