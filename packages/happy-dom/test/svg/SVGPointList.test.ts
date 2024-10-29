import { beforeEach, describe, it, expect } from 'vitest';
import SVGPoint from '../../src/svg/SVGPoint.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGPointList from '../../src/svg/SVGPointList.js';

describe('SVGPointList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(list).toBeInstanceOf(SVGPointList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGPointList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get [index]()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {}
			});

			expect(list[0]).toBeInstanceOf(SVGPoint);
			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);

			expect(list[1]).toBeInstanceOf(SVGPoint);
			expect(list[1].x).toBe(3);
			expect(list[1].y).toBe(4);

			expect(list[2]).toBeInstanceOf(SVGPoint);
			expect(list[2].x).toBe(5);
			expect(list[2].y).toBe(6);

			expect(list[3]).toBeUndefined();
		});

		it('Handles comma and line break as separator', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => `1,2.2 3,4	5	
                6`,
				setAttribute: () => {}
			});

			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);

			expect(list[1].x).toBe(3);
			expect(list[1].y).toBe(4);

			expect(list[2].x).toBe(5);
			expect(list[2].y).toBe(6);

			expect(list[3]).toBeUndefined();
		});
	});

	describe('get length()', () => {
		it('Returns length', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {}
			});

			expect(list.length).toBe(3);
		});
	});

	describe('numberOfItems', () => {
		it('Returns length', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {}
			});

			expect(list.numberOfItems).toBe(3);
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('Returns iterator', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {}
			});

			const items: SVGPoint[] = [];

			for (const item of list) {
				items.push(item);
			}

			expect(items.length).toBe(3);

			expect(items[0]).toBeInstanceOf(SVGPoint);
			expect(items[0].x).toBe(1);
			expect(items[0].y).toBe(2.2);

			expect(items[1]).toBeInstanceOf(SVGPoint);
			expect(items[1].x).toBe(3);
			expect(items[1].y).toBe(4);

			expect(items[2]).toBeInstanceOf(SVGPoint);
			expect(items[2].x).toBe(5);
			expect(items[2].y).toBe(6);
		});
	});

	describe('clear()', () => {
		it('Clears all items', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});
			const item1 = list[0];

			list.clear();

			expect(list.length).toBe(0);
			expect(attribute).toBe('');

			// Make sure that the item is disconnected from the list.
			expect(item1.x).toBe(1);
			expect(item1.y).toBe(2.2);
			item1.x = 10;
			item1.y = 20;

			expect(item1.x).toBe(10);
			expect(item1.y).toBe(20);
			expect(list.length).toBe(0);
			expect(attribute).toBe('');
		});
	});

	describe('initialize()', () => {
		it('Initializes item', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);

			item.x = 10.1;
			item.y = 20.2;

			expect(list.initialize(item)).toBe(item);

			expect(list.length).toBe(1);
			expect(list[0].x).toBe(10.1);
			expect(list[0].y).toBe(20.2);

			expect(attribute).toBe('10.1 20.2');

			item.x = 20;
			item.y = 30;

			expect(list[0].x).toBe(20);
			expect(list[0].y).toBe(30);
			expect(attribute).toBe('20 30');

			const item2 = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			item2.x = 40;
			item2.y = 50;
			list.appendItem(item2);

			item2.x = 60;
			item2.y = 70;

			expect(attribute).toBe('20 30 60 70');

			list.appendItem(new window.SVGPoint(PropertySymbol.illegalConstructor, window));

			expect(attribute).toBe('20 30 60 70 0 0');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);

			expect(() => list.initialize(item)).toThrow(
				new TypeError("Failed to execute 'initialize' on 'SVGPointList': The object is read-only.")
			);
		});
	});

	describe('getItem()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {}
			});

			expect(list.getItem(0)).toBeInstanceOf(SVGPoint);
			expect(list.getItem(0).x).toBe(1);
			expect(list.getItem(0).y).toBe(2.2);

			expect(list.getItem(1)).toBeInstanceOf(SVGPoint);
			expect(list.getItem(1).x).toBe(3);
			expect(list.getItem(1).y).toBe(4);

			expect(list.getItem('2')).toBeInstanceOf(SVGPoint);
			expect(list.getItem('2').x).toBe(5);
			expect(list.getItem('2').y).toBe(6);

			expect(list.getItem(3)).toBeNull();
		});
	});

	describe('insertItemBefore()', () => {
		it('Inserts item before index', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			item.x = 10.1;
			item.y = 20.2;

			expect(list.insertItemBefore(item, 1)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);

			expect(list[1].x).toBe(10.1);
			expect(list[1].y).toBe(20.2);

			expect(list[2].x).toBe(3);
			expect(list[2].y).toBe(4);

			expect(list[3].x).toBe(5);
			expect(list[3].y).toBe(6);

			expect(attribute).toBe('1 2.2 10.1 20.2 3 4 5 6');

			item.x = 20;
			item.y = 30;

			expect(attribute).toBe('1 2.2 20 30 3 4 5 6');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);

			expect(() => list.insertItemBefore(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'insertItemBefore' on 'SVGPointList': The object is read-only."
				)
			);
		});

		it('Handles indices out of bound', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			const item2 = new window.SVGPoint(PropertySymbol.illegalConstructor, window);

			list.insertItemBefore(item, -1);
			list.insertItemBefore(item2, 10);

			expect(list.length).toBe(5);
			expect(list[0]).toBe(item);
			expect(list[4]).toBe(item2);
		});
	});

	describe('replaceItem()', () => {
		it('Replaces item at index', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			item.x = 10.1;
			item.y = 20.2;

			const replacedItem = list[1];

			expect(list.replaceItem(item, 1)).toBe(replacedItem);

			expect(list.length).toBe(3);

			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);

			expect(list[1].x).toBe(10.1);
			expect(list[1].y).toBe(20.2);

			expect(list[2].x).toBe(5);
			expect(list[2].y).toBe(6);

			expect(attribute).toBe('1 2.2 10.1 20.2 5 6');

			item.x = 20;
			item.y = 30;

			expect(attribute).toBe('1 2.2 20 30 5 6');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);

			expect(() => list.replaceItem(item, 1)).toThrow(
				new TypeError("Failed to execute 'replaceItem' on 'SVGPointList': The object is read-only.")
			);
		});
	});

	describe('removeItem()', () => {
		it('Removes item at index', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = list.removeItem(1);

			expect(item).toBeInstanceOf(SVGPoint);
			expect(item.x).toBe(3);
			expect(item.y).toBe(4);

			expect(list.length).toBe(2);

			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);

			expect(list[1].x).toBe(5);
			expect(list[1].y).toBe(6);

			expect(attribute).toBe('1 2.2 5 6');

			const item2 = list.removeItem(1);

			expect(item2.x).toBe(5);
			expect(item2.y).toBe(6);

			expect(list.length).toBe(1);

			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {},
				readOnly: true
			});

			expect(() => list.removeItem(1)).toThrow(
				new TypeError("Failed to execute 'removeItem' on 'SVGPointList': The object is read-only.")
			);
		});
	});

	describe('appendItem()', () => {
		it('Appends item', () => {
			let attribute = '1 2.2 3 4 5 6';
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);
			item.x = 10.1;
			item.y = 20.2;

			expect(list.appendItem(item)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].x).toBe(1);
			expect(list[0].y).toBe(2.2);

			expect(list[1].x).toBe(3);
			expect(list[1].y).toBe(4);

			expect(list[2].x).toBe(5);
			expect(list[2].y).toBe(6);

			expect(list[3].x).toBe(10.1);
			expect(list[3].y).toBe(20.2);

			expect(attribute).toBe('1 2.2 3 4 5 6 10.1 20.2');

			item.x = 20;
			item.y = 30;

			expect(attribute).toBe('1 2.2 3 4 5 6 20 30');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGPointList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '1 2.2 3 4 5 6',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGPoint(PropertySymbol.illegalConstructor, window);

			expect(() => list.appendItem(item)).toThrow(
				new TypeError("Failed to execute 'appendItem' on 'SVGPointList': The object is read-only.")
			);
		});
	});
});
