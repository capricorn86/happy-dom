import { beforeEach, describe, it, expect } from 'vitest';
import SVGLength from '../../src/svg/SVGLength.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGLengthTypeEnum from '../../src/svg/SVGLengthTypeEnum.js';
import SVGLengthList from '../../src/svg/SVGLengthList.js';

describe('SVGLengthList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const length = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(length).toBeInstanceOf(SVGLengthList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGLengthList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get [index]()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {}
			});

			expect(list[0]).toBeInstanceOf(SVGLength);
			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1]).toBeInstanceOf(SVGLength);
			expect(list[1].valueInSpecifiedUnits).toBe(10);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list[2]).toBeInstanceOf(SVGLength);
			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list[3]).toBeInstanceOf(SVGLength);
			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.in);

			expect(list[4]).toBeInstanceOf(SVGLength);
			expect(list[4].valueInSpecifiedUnits).toBe(10);
			expect(list[4].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list[5]).toBeInstanceOf(SVGLength);
			expect(list[5].valueInSpecifiedUnits).toBe(10);
			expect(list[5].unitType).toBe(SVGLengthTypeEnum.pc);

			expect(list[6]).toBeUndefined();
		});

		it('Handles comma and line break as separator', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => `10px,10cm,10mm,10in,10pt	
                10pc`,
				setAttribute: () => {}
			});

			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1].valueInSpecifiedUnits).toBe(10);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.in);

			expect(list[4].valueInSpecifiedUnits).toBe(10);
			expect(list[4].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list[5].valueInSpecifiedUnits).toBe(10);
			expect(list[5].unitType).toBe(SVGLengthTypeEnum.pc);

			expect(list[6]).toBeUndefined();
		});
	});

	describe('get length()', () => {
		it('Returns length', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {}
			});

			expect(list.length).toBe(6);
		});
	});

	describe('numberOfItems', () => {
		it('Returns length', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {}
			});

			expect(list.numberOfItems).toBe(6);
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('Returns iterator', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {}
			});

			const items: SVGLength[] = [];

			for (const item of list) {
				items.push(item);
			}

			expect(items.length).toBe(6);

			expect(items[0]).toBeInstanceOf(SVGLength);
			expect(items[0].valueInSpecifiedUnits).toBe(10);
			expect(items[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(items[1]).toBeInstanceOf(SVGLength);
			expect(items[1].valueInSpecifiedUnits).toBe(10);
			expect(items[1].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(items[2]).toBeInstanceOf(SVGLength);
			expect(items[2].valueInSpecifiedUnits).toBe(10);
			expect(items[2].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(items[3]).toBeInstanceOf(SVGLength);
			expect(items[3].valueInSpecifiedUnits).toBe(10);
			expect(items[3].unitType).toBe(SVGLengthTypeEnum.in);

			expect(items[4]).toBeInstanceOf(SVGLength);
			expect(items[4].valueInSpecifiedUnits).toBe(10);
			expect(items[4].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(items[5]).toBeInstanceOf(SVGLength);
			expect(items[5].valueInSpecifiedUnits).toBe(10);
			expect(items[5].unitType).toBe(SVGLengthTypeEnum.pc);
		});
	});

	describe('clear()', () => {
		it('Clears all items', () => {
			let attribute = '10px 10cm 10mm 10in 10pt 10pc';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});
			const item1 = list[0];

			list.clear();

			expect(list.length).toBe(0);
			expect(attribute).toBe('');

			// Make sure that the items are disconnected from the list.
			expect(item1.value).toBe(10);
			item1.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 100);

			expect(item1.value).toBe(100);

			expect(list.length).toBe(0);
			expect(attribute).toBe('');
		});
	});

	describe('initialize()', () => {
		it('Initializes item', () => {
			let attribute = '10px 10cm 10mm 10in 10pt 10pc';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);

			item.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 100);

			expect(list.initialize(item)).toBe(item);

			expect(list.length).toBe(1);
			expect(list[0].value).toBe((100 / 2.54) * 96);

			expect(attribute).toBe('100cm');

			item.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 10);

			expect(list[0].value).toBe(10);
			expect(attribute).toBe('10px');

			const item2 = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			item2.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 20);
			list.appendItem(item2);

			item.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 30);

			expect(attribute).toBe('30px 20cm');

			list.appendItem(new window.SVGLength(PropertySymbol.illegalConstructor, window));

			expect(attribute).toBe('30px 20cm 0');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);

			expect(() => list.initialize(item)).toThrow(
				new TypeError("Failed to execute 'initialize' on 'SVGLengthList': The object is read-only.")
			);
		});
	});

	describe('getItem()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {}
			});

			expect(list.getItem(0)).toBeInstanceOf(SVGLength);
			expect(list.getItem(0).valueInSpecifiedUnits).toBe(10);
			expect(list.getItem(0).unitType).toBe(SVGLengthTypeEnum.px);

			expect(list.getItem(1)).toBeInstanceOf(SVGLength);
			expect(list.getItem(1).valueInSpecifiedUnits).toBe(10);
			expect(list.getItem(1).unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list.getItem(2)).toBeInstanceOf(SVGLength);
			expect(list.getItem(2).valueInSpecifiedUnits).toBe(10);
			expect(list.getItem(2).unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list.getItem(3)).toBeInstanceOf(SVGLength);
			expect(list.getItem(3).valueInSpecifiedUnits).toBe(10);
			expect(list.getItem(3).unitType).toBe(SVGLengthTypeEnum.in);

			expect(list.getItem(4)).toBeInstanceOf(SVGLength);
			expect(list.getItem(4).valueInSpecifiedUnits).toBe(10);
			expect(list.getItem(4).unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list.getItem('5')).toBeInstanceOf(SVGLength);
			expect(list.getItem('5').valueInSpecifiedUnits).toBe(10);
			expect(list.getItem('5').unitType).toBe(SVGLengthTypeEnum.pc);

			expect(list.getItem(6)).toBeNull();
		});
	});

	describe('insertItemBefore()', () => {
		it('Inserts item before index', () => {
			let attribute = '10px 10cm 10mm';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			item.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 100);

			expect(list.insertItemBefore(item, 1)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1]).toBe(item);
			expect(list[1].valueInSpecifiedUnits).toBe(100);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(attribute).toBe('10px 100cm 10cm 10mm');

			item.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 20);

			expect(attribute).toBe('10px 20px 10cm 10mm');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);

			expect(() => list.insertItemBefore(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'insertItemBefore' on 'SVGLengthList': The object is read-only."
				)
			);
		});

		it('Handles indices out of bound', () => {
			let attribute = '10px 10cm 10mm';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			const item2 = new window.SVGLength(PropertySymbol.illegalConstructor, window);

			list.insertItemBefore(item, -1);
			list.insertItemBefore(item2, 10);

			expect(list.length).toBe(5);
			expect(list[0]).toBe(item);
			expect(list[4]).toBe(item2);
		});
	});

	describe('replaceItem()', () => {
		it('Replaces item at index', () => {
			let attribute = '10px 10cm 10mm 10in 10pt 10pc';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			item.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 100);

			const replacedItem = list[1];

			expect(list.replaceItem(item, 1)).toBe(replacedItem);

			expect(list.length).toBe(6);

			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1]).toBe(item);
			expect(list[1].valueInSpecifiedUnits).toBe(100);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.in);

			expect(list[4].valueInSpecifiedUnits).toBe(10);
			expect(list[4].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list[5].valueInSpecifiedUnits).toBe(10);
			expect(list[5].unitType).toBe(SVGLengthTypeEnum.pc);

			expect(attribute).toBe('10px 100cm 10mm 10in 10pt 10pc');

			item.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 20);

			expect(attribute).toBe('10px 20px 10mm 10in 10pt 10pc');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);

			expect(() => list.replaceItem(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'replaceItem' on 'SVGLengthList': The object is read-only."
				)
			);
		});
	});

	describe('removeItem()', () => {
		it('Removes item at index', () => {
			let attribute = '10px 10cm 10mm 10in 10pt 10pc';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = list.removeItem(1);

			expect(item).toBeInstanceOf(SVGLength);
			expect(item.valueInSpecifiedUnits).toBe(10);
			expect(item.unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list.length).toBe(5);

			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1].valueInSpecifiedUnits).toBe(10);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.in);

			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list[4].valueInSpecifiedUnits).toBe(10);
			expect(list[4].unitType).toBe(SVGLengthTypeEnum.pc);

			expect(attribute).toBe('10px 10mm 10in 10pt 10pc');

			const item2 = list.removeItem(1);

			expect(item2.valueInSpecifiedUnits).toBe(10);
			expect(item2.unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list.length).toBe(4);

			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1].valueInSpecifiedUnits).toBe(10);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.in);

			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.pc);
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {},
				readOnly: true
			});

			expect(() => list.removeItem(1)).toThrow(
				new TypeError("Failed to execute 'removeItem' on 'SVGLengthList': The object is read-only.")
			);
		});
	});

	describe('appendItem()', () => {
		it('Appends item', () => {
			let attribute = '10px 10cm 10mm 10in 10pt 10pc';
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);
			item.newValueSpecifiedUnits(SVGLengthTypeEnum.cm, 100);

			expect(list.appendItem(item)).toBe(item);

			expect(list.length).toBe(7);

			expect(list[0].valueInSpecifiedUnits).toBe(10);
			expect(list[0].unitType).toBe(SVGLengthTypeEnum.px);

			expect(list[1].valueInSpecifiedUnits).toBe(10);
			expect(list[1].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(list[2].valueInSpecifiedUnits).toBe(10);
			expect(list[2].unitType).toBe(SVGLengthTypeEnum.mm);

			expect(list[3].valueInSpecifiedUnits).toBe(10);
			expect(list[3].unitType).toBe(SVGLengthTypeEnum.in);

			expect(list[4].valueInSpecifiedUnits).toBe(10);
			expect(list[4].unitType).toBe(SVGLengthTypeEnum.pt);

			expect(list[5].valueInSpecifiedUnits).toBe(10);
			expect(list[5].unitType).toBe(SVGLengthTypeEnum.pc);

			expect(list[6]).toBe(item);
			expect(list[6].valueInSpecifiedUnits).toBe(100);
			expect(list[6].unitType).toBe(SVGLengthTypeEnum.cm);

			expect(attribute).toBe('10px 10cm 10mm 10in 10pt 10pc 100cm');

			item.newValueSpecifiedUnits(SVGLengthTypeEnum.px, 20);

			expect(attribute).toBe('10px 10cm 10mm 10in 10pt 10pc 20px');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGLengthList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '10px 10cm 10mm 10in 10pt 10pc',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGLength(PropertySymbol.illegalConstructor, window);

			expect(() => list.appendItem(item)).toThrow(
				new TypeError("Failed to execute 'appendItem' on 'SVGLengthList': The object is read-only.")
			);
		});
	});
});
