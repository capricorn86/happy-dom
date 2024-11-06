import { afterEach, describe, it, expect, vi } from 'vitest';
import DOMRect from '../../src/dom/DOMRect.js';

describe('DOMRect', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('constructor()', () => {
		it('Sets properties.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.x).toBe(1);
			expect(rect.y).toBe(2);
			expect(rect.width).toBe(3);
			expect(rect.height).toBe(4);

			const rect2 = new DOMRect(null, null, null, 4);
			expect(rect2.x).toBe(0);
			expect(rect2.y).toBe(0);
			expect(rect2.width).toBe(0);
			expect(rect2.height).toBe(4);

			const rect3 = new DOMRect();
			expect(rect3.x).toBe(0);
			expect(rect3.y).toBe(0);
			expect(rect3.width).toBe(0);
			expect(rect3.height).toBe(0);

			const rect4 = new DOMRect(
				<number>(<unknown>'nan'),
				<number>(<unknown>'nan'),
				<number>(<unknown>'nan'),
				<number>(<unknown>'nan')
			);
			expect(isNaN(rect4.x)).toBe(true);
			expect(isNaN(rect4.y)).toBe(true);
			expect(isNaN(rect4.width)).toBe(true);
			expect(isNaN(rect4.height)).toBe(true);
		});
	});

	describe('set x()', () => {
		it('Sets rect x property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			rect.x = 2;
			expect(rect.x).toBe(2);
		});
	});

	describe('get x()', () => {
		it('Returns rect x property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.x).toBe(1);
		});
	});

	describe('set y()', () => {
		it('Sets rect y property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			rect.y = 3;
			expect(rect.y).toBe(3);
		});
	});

	describe('get y()', () => {
		it('Returns rect y property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.y).toBe(2);
		});
	});

	describe('set width()', () => {
		it('Sets rect y property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			rect.width = 4;
			expect(rect.width).toBe(4);
		});
	});

	describe('get width()', () => {
		it('Returns rect y property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.width).toBe(3);
		});
	});

	describe('set height()', () => {
		it('Sets rect height property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			rect.height = 5;
			expect(rect.height).toBe(5);
		});
	});

	describe('get height()', () => {
		it('Returns rect height property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.height).toBe(4);
		});
	});

	describe('get top()', () => {
		it('Returns rect top property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.top).toBe(2);
		});
	});

	describe('get right()', () => {
		it('Returns rect right property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.right).toBe(4);
		});
	});

	describe('get bottom()', () => {
		it('Returns rect bottom property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.bottom).toBe(6);
		});
	});

	describe('get left()', () => {
		it('Returns rect left property.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.left).toBe(1);
		});
	});

	describe('fromRect()', () => {
		it('Creates DOMRect instance', () => {
			const rect = DOMRect.fromRect({ x: 1, y: 2, width: 3, height: 4 });
			expect(rect instanceof DOMRect).toBe(true);
			expect(rect.x).toBe(1);
			expect(rect.y).toBe(2);
			expect(rect.width).toBe(3);
			expect(rect.height).toBe(4);
		});
	});

	describe('toJSON()', () => {
		it('Returns rect as JSON.', () => {
			const rect = new DOMRect(1, 2, 3, 4);
			expect(rect.toJSON()).toEqual({
				x: 1,
				y: 2,
				width: 3,
				height: 4,
				top: 2,
				right: 4,
				bottom: 6,
				left: 1
			});
		});
	});
});
