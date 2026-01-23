import { describe, it, expect } from 'vitest';
import DOMRectList from '../../src/dom/DOMRectList.js';
import * as PropertySymbol from '../../src/PropertySymbol.js';
import DOMRect from '../../src/dom/DOMRect.js';

describe('DOMRectList', () => {
	describe('constructor()', () => {
		it('Returns an instance of DOMRectList.', () => {
			const list = new DOMRectList(PropertySymbol.illegalConstructor);
			expect(list).toBeInstanceOf(DOMRectList);
		});

		it('Returns an instance of Array.', () => {
			const list = new DOMRectList(PropertySymbol.illegalConstructor);
			expect(list).toBeInstanceOf(Array);
		});

		it('Throws an error if the constructor is called without the illegalConstructorSymbol.', () => {
			expect(() => {
				new DOMRectList();
			}).toThrow(new TypeError('Illegal constructor'));
		});
	});

	describe('item()', () => {
		it('Returns item by index.', () => {
			const list = new DOMRectList(PropertySymbol.illegalConstructor);
			const rect1 = new DOMRect();
			const rect2 = new DOMRect();
			list.push(rect1);
			list.push(rect2);
			expect(list.item(0)).toBe(rect1);
			expect(list.item(1)).toBe(rect2);
		});

		it('Returns null if the index is out of bounds.', () => {
			const list = new DOMRectList(PropertySymbol.illegalConstructor);
			expect(list.item(0)).toBe(null);
		});
	});
});
