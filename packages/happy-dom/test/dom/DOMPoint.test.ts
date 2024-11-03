import { describe, it, expect, vi } from 'vitest';
import DOMPoint from '../../src/dom/DOMPoint.js';

describe('DOMPoint', () => {
	describe('constructor()', () => {
		it('Sets properties.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			expect(point.x).toBe(1);
			expect(point.y).toBe(2);
			expect(point.z).toBe(3);
			expect(point.w).toBe(4);

			const point2 = new DOMPoint(null, null, null, 4);
			expect(point2.x).toBe(0);
			expect(point2.y).toBe(0);
			expect(point2.z).toBe(0);
			expect(point2.w).toBe(4);

			const point3 = new DOMPoint();
			expect(point3.x).toBe(0);
			expect(point3.y).toBe(0);
			expect(point3.z).toBe(0);
			expect(point3.w).toBe(1);

			const point4 = new DOMPoint(
				<number>(<unknown>'nan'),
				<number>(<unknown>'nan'),
				<number>(<unknown>'nan'),
				<number>(<unknown>'nan')
			);
			expect(isNaN(point4.x)).toBe(true);
			expect(isNaN(point4.y)).toBe(true);
			expect(isNaN(point4.z)).toBe(true);
			expect(isNaN(point4.w)).toBe(true);
		});
	});

	describe('get x()', () => {
		it('Returns x property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			expect(point.x).toBe(1);
		});
	});

	describe('set x()', () => {
		it('Sets x property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			point.x = 10;
			expect(point.x).toBe(10);
		});
	});

	describe('get y()', () => {
		it('Returns y property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			expect(point.y).toBe(2);
		});
	});

	describe('set y()', () => {
		it('Sets y property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			point.y = 10;
			expect(point.y).toBe(10);
		});
	});

	describe('get z()', () => {
		it('Returns z property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			expect(point.z).toBe(3);
		});
	});

	describe('set z()', () => {
		it('Sets z property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			point.z = 10;
			expect(point.z).toBe(10);
		});
	});

	describe('get w()', () => {
		it('Returns w property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			expect(point.w).toBe(4);
		});
	});

	describe('set w()', () => {
		it('Sets w property.', () => {
			const point = new DOMPoint(1, 2, 3, 4);
			point.w = 10;
			expect(point.w).toBe(10);
		});
	});
});
