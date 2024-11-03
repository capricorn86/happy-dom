import { beforeEach, describe, it, expect } from 'vitest';
import SVGNumber from '../../src/svg/SVGNumber.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGNumberList from '../../src/svg/SVGNumberList.js';

describe('SVGNumberList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(list).toBeInstanceOf(SVGNumberList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGNumberList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get [index]()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {}
			});

			expect(list[0]).toBeInstanceOf(SVGNumber);
			expect(list[0].value).toBe(1);

			expect(list[1]).toBeInstanceOf(SVGNumber);
			expect(list[1].value).toBe(2.2);

			expect(list[2]).toBeInstanceOf(SVGNumber);
			expect(list[2].value).toBe(3);

			expect(list[3]).toBeUndefined();
		});

		it('Handles comma and line break as separator', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => `1,2.2	
                3`,
				setAttribute: () => {}
			});

			expect(list[0].value).toBe(1);
			expect(list[1].value).toBe(2.2);
			expect(list[2].value).toBe(3);

			expect(list[3]).toBeUndefined();
		});
	});

	describe('get length()', () => {
		it('Returns length', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {}
			});

			expect(list.length).toBe(3);
		});
	});

	describe('numberOfItems', () => {
		it('Returns length', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {}
			});

			expect(list.numberOfItems).toBe(3);
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('Returns iterator', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {}
			});

			const items: SVGNumber[] = [];

			for (const item of list) {
				items.push(item);
			}

			expect(items.length).toBe(3);

			expect(items[0]).toBeInstanceOf(SVGNumber);
			expect(items[0].value).toBe(1);

			expect(items[1]).toBeInstanceOf(SVGNumber);
			expect(items[1].value).toBe(2.2);

			expect(items[2]).toBeInstanceOf(SVGNumber);
			expect(items[2].value).toBe(3);
		});
	});

	describe('clear()', () => {
		it('Clears all items', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});
			const item1 = list[0];

			list.clear();

			expect(list.length).toBe(0);
			expect(attribute).toBe('');

			// Make sure that the item is disconnected from the list.
			expect(item1.value).toBe(1);
			item1.value = 10;

			expect(item1.value).toBe(10);
			expect(list.length).toBe(0);
			expect(attribute).toBe('');
		});
	});

	describe('initialize()', () => {
		it('Initializes item', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);

			item.value = 10.5;

			expect(list.initialize(item)).toBe(item);

			expect(list.length).toBe(1);
			expect(list[0].value).toBe(10.5);

			expect(attribute).toBe('10.5');

			item.value = 20;

			expect(list[0].value).toBe(20);
			expect(attribute).toBe('20');

			const item2 = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			item2.value = 30;
			list.appendItem(item2);

			item2.value = 40;

			expect(attribute).toBe('20 40');

			list.appendItem(new window.SVGNumber(PropertySymbol.illegalConstructor, window));

			expect(attribute).toBe('20 40 0');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);

			expect(() => list.initialize(item)).toThrow(
				new TypeError("Failed to execute 'initialize' on 'SVGNumberList': The object is read-only.")
			);
		});
	});

	describe('getItem()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {}
			});

			expect(list.getItem(0)).toBeInstanceOf(SVGNumber);
			expect(list.getItem(0).value).toBe(1);

			expect(list.getItem(1)).toBeInstanceOf(SVGNumber);
			expect(list.getItem(1).value).toBe(2.2);

			expect(list.getItem('2')).toBeInstanceOf(SVGNumber);
			expect(list.getItem('2').value).toBe(3);

			expect(list.getItem(3)).toBeNull();
		});
	});

	describe('insertItemBefore()', () => {
		it('Inserts item before index', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			item.value = 10.5;

			expect(list.insertItemBefore(item, 1)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].value).toBe(1);
			expect(list[1].value).toBe(10.5);
			expect(list[2].value).toBe(2.2);
			expect(list[3].value).toBe(3);

			expect(attribute).toBe('1 10.5 2.2 3');

			item.value = 20;

			expect(attribute).toBe('1 20 2.2 3');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);

			expect(() => list.insertItemBefore(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'insertItemBefore' on 'SVGNumberList': The object is read-only."
				)
			);
		});

		it('Handles indices out of bound', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			const item2 = new window.SVGNumber(PropertySymbol.illegalConstructor, window);

			list.insertItemBefore(item, -1);
			list.insertItemBefore(item2, 10);

			expect(list.length).toBe(5);
			expect(list[0]).toBe(item);
			expect(list[4]).toBe(item2);
		});
	});

	describe('replaceItem()', () => {
		it('Replaces item at index', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			item.value = 10.5;

			const replacedItem = list[1];

			expect(list.replaceItem(item, 1)).toBe(replacedItem);

			expect(list.length).toBe(3);

			expect(list[0].value).toBe(1);
			expect(list[1].value).toBe(10.5);
			expect(list[2].value).toBe(3);

			expect(attribute).toBe('1 10.5 3');

			item.value = 20;

			expect(attribute).toBe('1 20 3');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);

			expect(() => list.replaceItem(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'replaceItem' on 'SVGNumberList': The object is read-only."
				)
			);
		});
	});

	describe('removeItem()', () => {
		it('Removes item at index', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = list.removeItem(1);

			expect(item).toBeInstanceOf(SVGNumber);
			expect(item.value).toBe(2.2);

			expect(list.length).toBe(2);

			expect(list[0].value).toBe(1);
			expect(list[1].value).toBe(3);

			expect(attribute).toBe('1 3');

			const item2 = list.removeItem(1);

			expect(item2.value).toBe(3);

			expect(list.length).toBe(1);

			expect(list[0].value).toBe(1);
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {},
				readOnly: true
			});

			expect(() => list.removeItem(1)).toThrow(
				new TypeError("Failed to execute 'removeItem' on 'SVGNumberList': The object is read-only.")
			);
		});
	});

	describe('appendItem()', () => {
		it('Appends item', () => {
			let attribute = '1 2.2 3';
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);
			item.value = 10.5;

			expect(list.appendItem(item)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].value).toBe(1);
			expect(list[1].value).toBe(2.2);
			expect(list[2].value).toBe(3);
			expect(list[3].value).toBe(10.5);

			expect(attribute).toBe('1 2.2 3 10.5');

			item.value = 20;

			expect(attribute).toBe('1 2.2 3 20');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGNumberList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGNumber(PropertySymbol.illegalConstructor, window);

			expect(() => list.appendItem(item)).toThrow(
				new TypeError("Failed to execute 'appendItem' on 'SVGNumberList': The object is read-only.")
			);
		});
	});
});
