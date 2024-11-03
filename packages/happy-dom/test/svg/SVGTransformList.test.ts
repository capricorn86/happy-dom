import { beforeEach, describe, it, expect } from 'vitest';
import SVGTransform from '../../src/svg/SVGTransform.js';
import BrowserWindow from '../../src/window/BrowserWindow.js';
import Window from '../../src/window/Window.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import SVGTransformList from '../../src/svg/SVGTransformList.js';
import SVGTransformTypeEnum from '../../src/svg/SVGTransformTypeEnum.js';

describe('SVGTransformList', () => {
	let window: BrowserWindow;

	beforeEach(() => {
		window = new Window();
	});

	describe('constructor()', () => {
		it('Returns a new instance', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => '',
				setAttribute: () => {}
			});
			expect(list).toBeInstanceOf(SVGTransformList);
		});

		it('Throws an error if constructed without "illegalConstructor" symbol', () => {
			expect(
				() =>
					new window.SVGTransformList(Symbol(''), window, {
						getAttribute: () => '',
						setAttribute: () => {}
					})
			).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('get [index]()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () =>
					'matrix(1 2 3 4 5 6) translate(10 20) rotate(90) rotate(90 10 20) scale(10 20) skewX(10) skewY(10)',
				setAttribute: () => {}
			});

			expect(list[0]).toBeInstanceOf(SVGTransform);
			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(2);
			expect(list[0].matrix.c).toBe(3);
			expect(list[0].matrix.d).toBe(4);
			expect(list[0].matrix.e).toBe(5);
			expect(list[0].matrix.f).toBe(6);

			expect(list[1]).toBeInstanceOf(SVGTransform);
			expect(list[1].matrix.a).toBe(1);
			expect(list[1].matrix.b).toBe(0);
			expect(list[1].matrix.c).toBe(0);
			expect(list[1].matrix.d).toBe(1);
			expect(list[1].matrix.e).toBe(10);
			expect(list[1].matrix.f).toBe(20);

			expect(list[2]).toBeInstanceOf(SVGTransform);
			expect(list[2].matrix.a).toBe(6.123233995736766e-17);
			expect(list[2].matrix.b).toBe(1);
			expect(list[2].matrix.c).toBe(-1);
			expect(list[2].matrix.d).toBe(6.123233995736766e-17);
			expect(list[2].matrix.e).toBe(0);
			expect(list[2].matrix.f).toBe(0);

			expect(list[3]).toBeInstanceOf(SVGTransform);
			expect(list[3].matrix.a).toBe(6.123233995736766e-17);
			expect(list[3].matrix.b).toBe(1);
			expect(list[3].matrix.c).toBe(-1);
			expect(list[3].matrix.d).toBe(6.123233995736766e-17);
			expect(list[3].matrix.e).toBe(30);
			expect(list[3].matrix.f).toBe(9.999999999999998);

			expect(list[4]).toBeInstanceOf(SVGTransform);
			expect(list[4].matrix.a).toBe(10);
			expect(list[4].matrix.b).toBe(0);
			expect(list[4].matrix.c).toBe(0);
			expect(list[4].matrix.d).toBe(20);
			expect(list[4].matrix.e).toBe(0);
			expect(list[4].matrix.f).toBe(0);

			expect(list[5]).toBeInstanceOf(SVGTransform);
			expect(list[5].matrix.a).toBe(1);
			expect(list[5].matrix.b).toBe(0);
			expect(list[5].matrix.c).toBe(0.17632698070846498);
			expect(list[5].matrix.d).toBe(1);
			expect(list[5].matrix.e).toBe(0);
			expect(list[5].matrix.f).toBe(0);

			expect(list[6]).toBeInstanceOf(SVGTransform);
			expect(list[6].matrix.a).toBe(1);
			expect(list[6].matrix.b).toBe(0.17632698070846498);
			expect(list[6].matrix.c).toBe(0);
			expect(list[6].matrix.d).toBe(1);
			expect(list[6].matrix.e).toBe(0);
			expect(list[6].matrix.f).toBe(0);

			expect(list[7]).toBeUndefined();
		});
	});

	describe('get length()', () => {
		it('Returns length', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () =>
					'matrix(1 2 3 4 5 6) translate(10 20) rotate(90) scale(10 20) skewX(10) skewY(10)',
				setAttribute: () => {}
			});

			expect(list.length).toBe(6);
		});
	});

	describe('numberOfItems', () => {
		it('Returns length', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () =>
					'matrix(1 2 3 4 5 6) translate(10 20) rotate(90) scale(10 20) skewX(10) skewY(10)',
				setAttribute: () => {}
			});

			expect(list.numberOfItems).toBe(6);
		});
	});

	describe('[Symbol.iterator]()', () => {
		it('Returns iterator', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () =>
					'matrix(1 2 3 4 5 6) translate(10 20) rotate(90) scale(10 20) skewX(10) skewY(10)',
				setAttribute: () => {}
			});

			const items: SVGTransform[] = [];

			for (const item of list) {
				items.push(item);
			}

			expect(items.length).toBe(6);

			expect(items[0]).toBe(list[0]);
			expect(items[1]).toBe(list[1]);
			expect(items[2]).toBe(list[2]);
			expect(items[3]).toBe(list[3]);
			expect(items[4]).toBe(list[4]);
			expect(items[5]).toBe(list[5]);
		});
	});

	describe('clear()', () => {
		it('Clears all items', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});
			const item1 = list[0];

			list.clear();

			expect(list.length).toBe(0);
			expect(attribute).toBe('');

			// Make sure that the item is disconnected from the list.
			expect(item1.matrix.a).toBe(1);
			expect(item1.matrix.b).toBe(2);
			expect(item1.matrix.c).toBe(3);
			expect(item1.matrix.d).toBe(4);
			expect(item1.matrix.e).toBe(5);
			expect(item1.matrix.f).toBe(6);

			const svgMatrix = new window.SVGMatrix(PropertySymbol.illegalConstructor, window);

			svgMatrix.a = 10;
			svgMatrix.b = 20;
			svgMatrix.c = 30;
			svgMatrix.d = 40;
			svgMatrix.e = 50;
			svgMatrix.f = 60;

			item1.setMatrix(svgMatrix);

			expect(item1.matrix.a).toBe(10);
			expect(item1.matrix.b).toBe(20);
			expect(item1.matrix.c).toBe(30);
			expect(item1.matrix.d).toBe(40);
			expect(item1.matrix.e).toBe(50);
			expect(item1.matrix.f).toBe(60);

			expect(list.length).toBe(0);
			expect(attribute).toBe('');
		});
	});

	describe('initialize()', () => {
		it('Initializes item', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			item.matrix.a = 10;
			item.matrix.b = 20;
			item.matrix.c = 30;
			item.matrix.d = 40;
			item.matrix.e = 50;
			item.matrix.f = 60;

			expect(list.initialize(item)).toBe(item);

			expect(list.length).toBe(1);
			expect(list[0].matrix.a).toBe(10);
			expect(list[0].matrix.b).toBe(20);
			expect(list[0].matrix.c).toBe(30);
			expect(list[0].matrix.d).toBe(40);
			expect(list[0].matrix.e).toBe(50);
			expect(list[0].matrix.f).toBe(60);

			expect(attribute).toBe('matrix(10 20 30 40 50 60)');

			item.matrix.a = 100;
			item.matrix.b = 200;
			item.matrix.c = 300;
			item.matrix.d = 400;
			item.matrix.e = 500;
			item.matrix.f = 600;

			expect(list[0].matrix.a).toBe(100);
			expect(list[0].matrix.b).toBe(200);
			expect(list[0].matrix.c).toBe(300);
			expect(list[0].matrix.d).toBe(400);
			expect(list[0].matrix.e).toBe(500);
			expect(list[0].matrix.f).toBe(600);
			expect(attribute).toBe('matrix(100 200 300 400 500 600)');

			const item2 = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			item2.matrix.a = 1;
			item2.matrix.b = 2;
			item2.matrix.c = 3;
			item2.matrix.d = 4;
			item2.matrix.e = 5;
			item2.matrix.f = 6;

			list.appendItem(item2);

			item2.matrix.a = 10;
			item2.matrix.b = 20;
			item2.matrix.c = 30;
			item2.matrix.d = 40;
			item2.matrix.e = 50;
			item2.matrix.f = 60;

			expect(attribute).toBe('matrix(100 200 300 400 500 600) matrix(10 20 30 40 50 60)');

			list.appendItem(new window.SVGTransform(PropertySymbol.illegalConstructor, window));

			expect(attribute).toBe(
				'matrix(100 200 300 400 500 600) matrix(10 20 30 40 50 60) matrix(1 0 0 1 0 0)'
			);
		});

		it('Handles items set to an attribute using setTranslate(), setRotate(), setScale(), setSkewX() or setSkewY()', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});
			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			item.setTranslate(10, 20);

			expect(list.initialize(item)).toBe(item);

			expect(list.length).toBe(1);

			expect(list[0].type).toBe(SVGTransformTypeEnum.translate);

			expect(attribute).toBe('translate(10 20)');

			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(0);
			expect(list[0].matrix.c).toBe(0);
			expect(list[0].matrix.d).toBe(1);
			expect(list[0].matrix.e).toBe(10);
			expect(list[0].matrix.f).toBe(20);
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			expect(() => list.initialize(item)).toThrow(
				new TypeError(
					"Failed to execute 'initialize' on 'SVGTransformList': The object is read-only."
				)
			);
		});
	});

	describe('getItem()', () => {
		it('Returns item at index', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)',
				setAttribute: () => {}
			});

			expect(list.getItem(0)).toBe(list[0]);
			expect(list.getItem(1)).toBe(list[1]);
			expect(list.getItem('2')).toBe(list[2]);

			expect(list.getItem(3)).toBeNull();
		});
	});

	describe('insertItemBefore()', () => {
		it('Inserts item before index', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			item.matrix.a = 10;
			item.matrix.b = 20;
			item.matrix.c = 30;
			item.matrix.d = 40;
			item.matrix.e = 50;
			item.matrix.f = 60;

			expect(list.insertItemBefore(item, 1)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(2);
			expect(list[0].matrix.c).toBe(3);
			expect(list[0].matrix.d).toBe(4);
			expect(list[0].matrix.e).toBe(5);
			expect(list[0].matrix.f).toBe(6);

			expect(list[1].matrix.a).toBe(10);
			expect(list[1].matrix.b).toBe(20);
			expect(list[1].matrix.c).toBe(30);
			expect(list[1].matrix.d).toBe(40);
			expect(list[1].matrix.e).toBe(50);
			expect(list[1].matrix.f).toBe(60);

			expect(list[2].matrix.a).toBe(1);
			expect(list[2].matrix.b).toBe(0);
			expect(list[2].matrix.c).toBe(0);
			expect(list[2].matrix.d).toBe(1);
			expect(list[2].matrix.e).toBe(10);
			expect(list[2].matrix.f).toBe(20);

			expect(list[3].matrix.a).toBe(6.123233995736766e-17);
			expect(list[3].matrix.b).toBe(1);
			expect(list[3].matrix.c).toBe(-1);
			expect(list[3].matrix.d).toBe(6.123233995736766e-17);
			expect(list[3].matrix.e).toBe(0);
			expect(list[3].matrix.f).toBe(0);

			expect(attribute).toBe(
				'matrix(1 2 3 4 5 6) matrix(10 20 30 40 50 60) translate(10 20) rotate(90)'
			);

			item.matrix.a = 100;
			item.matrix.b = 200;
			item.matrix.c = 300;
			item.matrix.d = 400;
			item.matrix.e = 500;
			item.matrix.f = 600;

			expect(attribute).toBe(
				'matrix(1 2 3 4 5 6) matrix(100 200 300 400 500 600) translate(10 20) rotate(90)'
			);
		});

		it('Handles items set to an attribute using setTranslate(), setRotate(), setScale(), setSkewX() or setSkewY()', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});
			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			item.setTranslate(100, 200);

			expect(list.insertItemBefore(item, 1)).toBe(item);

			expect(list.length).toBe(4);

			expect(attribute).toBe('matrix(1 2 3 4 5 6) translate(100 200) translate(10 20) rotate(90)');

			item.setRotate(90, 1, 1);

			expect(attribute).toBe('matrix(1 2 3 4 5 6) rotate(90 1 1) translate(10 20) rotate(90)');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			expect(() => list.insertItemBefore(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'insertItemBefore' on 'SVGTransformList': The object is read-only."
				)
			);
		});

		it('Handles indices out of bound', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			const item2 = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			list.insertItemBefore(item, -1);
			list.insertItemBefore(item2, 10);

			expect(list.length).toBe(5);
			expect(list[0]).toBe(item);
			expect(list[4]).toBe(item2);
		});
	});

	describe('replaceItem()', () => {
		it('Replaces item at index', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			item.matrix.a = 10;
			item.matrix.b = 20;
			item.matrix.c = 30;
			item.matrix.d = 40;
			item.matrix.e = 50;
			item.matrix.f = 60;

			const replacedItem = list[1];

			expect(list.replaceItem(item, 1)).toBe(replacedItem);

			expect(list.length).toBe(3);

			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(2);
			expect(list[0].matrix.c).toBe(3);
			expect(list[0].matrix.d).toBe(4);
			expect(list[0].matrix.e).toBe(5);
			expect(list[0].matrix.f).toBe(6);

			expect(list[1].matrix.a).toBe(10);
			expect(list[1].matrix.b).toBe(20);
			expect(list[1].matrix.c).toBe(30);
			expect(list[1].matrix.d).toBe(40);
			expect(list[1].matrix.e).toBe(50);
			expect(list[1].matrix.f).toBe(60);

			expect(list[2].matrix.a).toBe(6.123233995736766e-17);
			expect(list[2].matrix.b).toBe(1);
			expect(list[2].matrix.c).toBe(-1);
			expect(list[2].matrix.d).toBe(6.123233995736766e-17);
			expect(list[2].matrix.e).toBe(0);
			expect(list[2].matrix.f).toBe(0);

			expect(attribute).toBe('matrix(1 2 3 4 5 6) matrix(10 20 30 40 50 60) rotate(90)');

			item.matrix.a = 100;
			item.matrix.b = 200;
			item.matrix.c = 300;
			item.matrix.d = 400;
			item.matrix.e = 500;
			item.matrix.f = 600;

			expect(attribute).toBe('matrix(1 2 3 4 5 6) matrix(100 200 300 400 500 600) rotate(90)');
		});

		it('Handles items set to an attribute using setTranslate(), setRotate(), setScale(), setSkewX() or setSkewY()', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			item.setScale(100, 200);

			list.replaceItem(item, 1);

			expect(attribute).toBe('matrix(1 2 3 4 5 6) scale(100 200) rotate(90)');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			expect(() => list.replaceItem(item, 1)).toThrow(
				new TypeError(
					"Failed to execute 'replaceItem' on 'SVGTransformList': The object is read-only."
				)
			);
		});
	});

	describe('removeItem()', () => {
		it('Removes item at index', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = list.removeItem(1);

			expect(item).toBeInstanceOf(SVGTransform);
			expect(item.matrix.a).toBe(1);
			expect(item.matrix.b).toBe(0);
			expect(item.matrix.c).toBe(0);
			expect(item.matrix.d).toBe(1);
			expect(item.matrix.e).toBe(10);
			expect(item.matrix.f).toBe(20);

			expect(list.length).toBe(2);

			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(2);
			expect(list[0].matrix.c).toBe(3);
			expect(list[0].matrix.d).toBe(4);
			expect(list[0].matrix.e).toBe(5);
			expect(list[0].matrix.f).toBe(6);

			expect(list[1].matrix.a).toBe(6.123233995736766e-17);
			expect(list[1].matrix.b).toBe(1);
			expect(list[1].matrix.c).toBe(-1);
			expect(list[1].matrix.d).toBe(6.123233995736766e-17);
			expect(list[1].matrix.e).toBe(0);
			expect(list[1].matrix.f).toBe(0);

			expect(attribute).toBe('matrix(1 2 3 4 5 6) rotate(90)');

			const item2 = list.removeItem(1);

			expect(item2.matrix.a).toBe(6.123233995736766e-17);
			expect(item2.matrix.b).toBe(1);
			expect(item2.matrix.c).toBe(-1);
			expect(item2.matrix.d).toBe(6.123233995736766e-17);
			expect(item2.matrix.e).toBe(0);
			expect(item2.matrix.f).toBe(0);

			expect(list.length).toBe(1);

			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(2);
			expect(list[0].matrix.c).toBe(3);
			expect(list[0].matrix.d).toBe(4);
			expect(list[0].matrix.e).toBe(5);
			expect(list[0].matrix.f).toBe(6);
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)',
				setAttribute: () => {},
				readOnly: true
			});

			expect(() => list.removeItem(1)).toThrow(
				new TypeError(
					"Failed to execute 'removeItem' on 'SVGTransformList': The object is read-only."
				)
			);
		});
	});

	describe('appendItem()', () => {
		it('Appends item', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			item.matrix.a = 10;
			item.matrix.b = 20;
			item.matrix.c = 30;
			item.matrix.d = 40;
			item.matrix.e = 50;
			item.matrix.f = 60;

			expect(list.appendItem(item)).toBe(item);

			expect(list.length).toBe(4);

			expect(list[0].matrix.a).toBe(1);
			expect(list[0].matrix.b).toBe(2);
			expect(list[0].matrix.c).toBe(3);
			expect(list[0].matrix.d).toBe(4);
			expect(list[0].matrix.e).toBe(5);
			expect(list[0].matrix.f).toBe(6);

			expect(list[1].matrix.a).toBe(1);
			expect(list[1].matrix.b).toBe(0);
			expect(list[1].matrix.c).toBe(0);
			expect(list[1].matrix.d).toBe(1);
			expect(list[1].matrix.e).toBe(10);
			expect(list[1].matrix.f).toBe(20);

			expect(list[2].matrix.a).toBe(6.123233995736766e-17);
			expect(list[2].matrix.b).toBe(1);
			expect(list[2].matrix.c).toBe(-1);
			expect(list[2].matrix.d).toBe(6.123233995736766e-17);
			expect(list[2].matrix.e).toBe(0);
			expect(list[2].matrix.f).toBe(0);

			expect(list[3].matrix.a).toBe(10);
			expect(list[3].matrix.b).toBe(20);
			expect(list[3].matrix.c).toBe(30);
			expect(list[3].matrix.d).toBe(40);
			expect(list[3].matrix.e).toBe(50);
			expect(list[3].matrix.f).toBe(60);

			expect(attribute).toBe(
				'matrix(1 2 3 4 5 6) translate(10 20) rotate(90) matrix(10 20 30 40 50 60)'
			);

			item.matrix.a = 100;
			item.matrix.b = 200;
			item.matrix.c = 300;
			item.matrix.d = 400;
			item.matrix.e = 500;
			item.matrix.f = 600;

			expect(attribute).toBe(
				'matrix(1 2 3 4 5 6) translate(10 20) rotate(90) matrix(100 200 300 400 500 600)'
			);
		});

		it('Handles items set to an attribute using setTranslate(), setRotate(), setScale(), setSkewX() or setSkewY()', () => {
			let attribute = 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)';
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => attribute,
				setAttribute: (value) => (attribute = value)
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);
			item.setTranslate(100, 200);

			expect(list.appendItem(item)).toBe(item);

			expect(list.length).toBe(4);

			expect(attribute).toBe('matrix(1 2 3 4 5 6) translate(10 20) rotate(90) translate(100 200)');
		});

		it('Throws an error if the object is read-only', () => {
			const list = new window.SVGTransformList(PropertySymbol.illegalConstructor, window, {
				getAttribute: () => 'matrix(1 2 3 4 5 6) translate(10 20) rotate(90)',
				setAttribute: () => {},
				readOnly: true
			});

			const item = new window.SVGTransform(PropertySymbol.illegalConstructor, window);

			expect(() => list.appendItem(item)).toThrow(
				new TypeError(
					"Failed to execute 'appendItem' on 'SVGTransformList': The object is read-only."
				)
			);
		});
	});
});
